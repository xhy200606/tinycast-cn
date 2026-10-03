#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const options = {};
for (let index = 2; index < process.argv.length; index += 2) {
  const flag = process.argv[index];
  const value = process.argv[index + 1];
  if (!/^--(?:version|arm64|universal|output)$/.test(flag) || !value || options[flag]) {
    throw new Error("Usage: generate-homebrew-cask.js --version VERSION --arm64 DMG --universal DMG --output CASK");
  }
  options[flag] = value;
}
const version = options["--version"];
if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) throw new Error("A numeric release version is required.");
if (!options["--output"]) throw new Error("An output cask path is required.");
function digest(architecture) {
  const file = options["--" + architecture];
  if (!file || path.basename(file) !== `Tinycast-${architecture}-${version}.dmg`) {
    throw new Error(`Expected the published ${architecture} DMG for ${version}.`);
  }
  const bytes = fs.readFileSync(file);
  if (!bytes.length) throw new Error("Empty installation package.");
  return crypto.createHash("sha256").update(bytes).digest("hex");
}
const arm64 = digest("arm64");
const universal = digest("universal");
const variants = [
  { token: "tinycast-cn", architecture: null, label: "" },
  { token: "tinycast-cn-arm64", architecture: "arm64", label: "ARM64" },
  { token: "tinycast-cn-universal", architecture: "universal", label: "Universal" },
];
fs.mkdirSync(path.dirname(options["--output"]), { recursive: true });
for (const { token, architecture, label } of variants) {
  const fields = architecture
    ? `  version "${version}"\n  sha256 "${architecture === "arm64" ? arm64 : universal}"`
    : `  arch arm: "arm64", intel: "universal"\n\n  version "${version}"\n  sha256 arm:   "${arm64}",\n         intel: "${universal}"`;
  const conflicts = variants.filter(item => item.token !== token)
    .map(item => JSON.stringify("xhy200606/tinycast-cn/" + item.token)).join(", ");
  const cask = `cask "${token}" do
${fields}

  url "https://github.com/xhy200606/tinycast-cn/releases/download/cn-v#{version}/Tinycast-${architecture ?? "#{arch}"}-#{version}.dmg"
  name "Tinycast 简体中文版${label ? " (" + label + ")" : ""}"
  desc "Native macOS launcher with a Simplified Chinese interface"
  homepage "https://github.com/xhy200606/tinycast-cn"

  livecheck do
    url :url
    regex(/^cn-v(\\d+(?:\\.\\d+)+)$/i)
  end

  depends_on macos: :tahoe
${architecture === "arm64" ? "  depends_on arch: :arm64\n" : ""}  conflicts_with cask: [${conflicts}]

  app "Tinycast.app"
end
`;
  const output = architecture
    ? path.join(path.dirname(options["--output"]), token + ".rb") : options["--output"];
  fs.writeFileSync(output, cask);
  console.log(`Generated ${output} with verified package SHA-256 values.`);
}
