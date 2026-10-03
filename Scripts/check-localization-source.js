#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { signature, localizedLiterals } = require("./localization-source.js");
const root = path.resolve(__dirname, "..");
const table = JSON.parse(execFileSync("plutil", [
  "-convert", "json", "-o", "-", path.join(root, "Tinycast/zh-Hans.lproj/Localizable.strings"),
], { encoding: "utf8" }));
const known = new Set(Object.keys(table).map(signature));
const problems = [];
let checked = 0;
function visit(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) { visit(file); continue; }
    if (!file.endsWith(".swift") || file.endsWith(".generated.swift")) continue;
    const source = fs.readFileSync(file, "utf8");
    if (/String\(\s*localized:\s*String\(\s*localized:/.test(source)) {
      problems.push(`${path.relative(root, file)}: nested String(localized:) uses an already localized value.`);
    }
    for (const literal of localizedLiterals(source)) {
      if (!/[A-Za-z]/.test(literal.value)) continue;
      checked++;
      if (known.has(signature(literal.value))) continue;
      const line = source.slice(0, literal.start).split("\n").length;
      problems.push(`${path.relative(root, file)}:${line}: missing ${JSON.stringify(literal.value)}`);
    }
  }
}
visit(path.join(root, "Tinycast"));
const project = fs.readFileSync(path.join(root, "Tinycast.xcodeproj/project.pbxproj"), "utf8");
for (const marker of [
  "Localization.swift in Sources", "Localizable.strings in Resources", "InfoPlist.strings in Resources", '"zh-Hans"',
]) {
  if (!project.includes(marker)) problems.push(`Xcode project missing ${marker}; run xcodegen generate.`);
}
const info = JSON.parse(execFileSync("plutil", [
  "-convert", "json", "-o", "-", path.join(root, "Tinycast/Info.plist"),
], { encoding: "utf8" }));
const localizedInfo = JSON.parse(execFileSync("plutil", [
  "-convert", "json", "-o", "-", path.join(root, "Tinycast/zh-Hans.lproj/InfoPlist.strings"),
], { encoding: "utf8" }));
for (const key of Object.keys(info).filter((key) => key.endsWith("UsageDescription"))) {
  if (!localizedInfo[key]) problems.push(`Chinese permission description missing ${key}.`);
}
if (problems.length) {
  console.error(problems.map((problem) => "FAIL: " + problem).join("\n"));
  process.exit(1);
}
console.log(`Source localization checks passed: ${checked} literal UI strings (without compiling).`);
