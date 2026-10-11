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
    throw new Error("Usage: generate-homebrew-cask.js --version VERSION --arm64 DMG [--universal DMG] --output CASK");
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
const universal = options["--universal"] ? digest("universal") : null;
let previousUniversal;
if (!universal) {
  const file = path.join(path.dirname(options["--output"]), "tinycast-cn-universal.rb");
  const source = fs.readFileSync(file, "utf8");
  previousUniversal = {
    version: /\bversion "(\d+\.\d+\.\d+)"/.exec(source)?.[1],
    sha256: /\bsha256 "([a-f0-9]{64})"/.exec(source)?.[1],
    url: /\burl "([^"]+)"/.exec(source)?.[1],
  };
  if (!previousUniversal.version || !previousUniversal.sha256
    || !previousUniversal.url?.startsWith("https://github.com/xhy200606/tinycast-cn/releases/download/")) {
    throw new Error("ARM-only publication requires the existing verified Universal cask.");
  }
}
const variants = [
  { token: "tinycast-cn", architecture: null, label: "" },
  { token: "tinycast-cn-arm64", architecture: "arm64", label: "ARM64" },
  { token: "tinycast-cn-universal", architecture: "universal", label: "Universal" },
];
fs.mkdirSync(path.dirname(options["--output"]), { recursive: true });
for (const { token, architecture, label } of variants) {
  if (architecture === "universal" && !universal) continue;
  const fields = architecture
    ? `  version "${version}"\n  sha256 "${architecture === "arm64" ? arm64 : universal}"`
    : universal
      ? `  arch arm: "arm64", intel: "universal"\n\n  version "${version}"\n  sha256 arm:   "${arm64}",\n         intel: "${universal}"`
      : `  on_arm do
    version "${version}"
    sha256 "${arm64}"
    url "https://github.com/xhy200606/tinycast-cn/releases/download/v#{version}/Tinycast-arm64-#{version}.dmg"
  end

  on_intel do
    version "${previousUniversal.version}"
    sha256 "${previousUniversal.sha256}"
    url "${previousUniversal.url}"
    livecheck do
      skip "A newer Universal package has not been published"
    end
  end`;
  const url = architecture || universal
    ? `  url "https://github.com/xhy200606/tinycast-cn/releases/download/v#{version}/Tinycast-${architecture ?? "#{arch}"}-#{version}.dmg"\n`
    : "";
  const conflicts = variants.filter(item => item.token !== token)
    .map(item => JSON.stringify("xhy200606/tinycast-cn/" + item.token)).join(", ");
  let livecheck = `  livecheck do
    url :url
    regex(/^v(\\d+(?:\\.\\d+)+)$/i)
  end`;
  if (!architecture && !universal) {
    livecheck = "  on_arm do\n" + livecheck.split("\n").map(line => "  " + line).join("\n") + "\n  end";
  }
  const cask = `cask "${token}" do
${fields}

${url}
  name "Tinycast 简体中文版${label ? " (" + label + ")" : ""}"
  desc "Native macOS launcher with a Simplified Chinese interface"
  homepage "https://github.com/xhy200606/tinycast-cn"

${livecheck}

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
