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
const cask = `cask "tinycast-cn" do
  arch arm: "arm64", intel: "universal"

  version "${version}"
  sha256 arm:   "${arm64}",
         intel: "${universal}"

  url "https://github.com/xhy200606/tinycast-cn/releases/download/cn-v#{version}/Tinycast-#{arch}-#{version}.dmg"
  name "Tinycast 简体中文版"
  desc "Native macOS launcher with a Simplified Chinese interface"
  homepage "https://github.com/xhy200606/tinycast-cn"

  livecheck do
    url :url
    regex(/^cn-v(\\d+(?:\\.\\d+)+)$/i)
  end

  depends_on macos: :tahoe

  app "Tinycast.app"
end
`;
fs.mkdirSync(path.dirname(options["--output"]), { recursive: true });
fs.writeFileSync(options["--output"], cask);
console.log(`Generated ${options["--output"]} with verified package SHA-256 values.`);
