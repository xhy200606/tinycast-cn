"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");
test("localization gate rejects missing keys and known rendering regressions", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "tinycast-localization-test-"));
  try {
    fs.mkdirSync(path.join(fixture, "Scripts"));
    fs.copyFileSync(path.join(root, "Scripts/check-localization.js"), path.join(fixture, "Scripts/check-localization.js"));
    for (const name of ["check-localization-source.js", "localization-source.js"]) {
      fs.copyFileSync(path.join(root, "Scripts", name), path.join(fixture, "Scripts", name));
    }
    fs.cpSync(path.join(root, "Tinycast.xcodeproj"), path.join(fixture, "Tinycast.xcodeproj"), { recursive: true });
    fs.cpSync(path.join(root, "Tinycast"), path.join(fixture, "Tinycast"), {
      recursive: true,
      filter: (file) => !file.endsWith(".generated.swift") && !file.includes("Assets.xcassets"),
    });
    const check = () => spawnSync(process.execPath, [path.join(fixture, "Scripts/check-localization.js")], {
      encoding: "utf8",
    });
    const expectFailure = (fragment) => {
      const result = check();
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.ok(result.stderr.includes(fragment), result.stderr);
    };
    assert.equal(check().status, 0);
    const sourceCheck = () => spawnSync(process.execPath, [path.join(fixture, "Scripts/check-localization-source.js")], {
      encoding: "utf8",
    });
    assert.equal(sourceCheck().status, 0);
    const newView = path.join(fixture, "Tinycast/SourceGateFixture.swift");
    fs.writeFileSync(newView, 'Text("NEW_UNTRANSLATED_UI_SENTENCE")');
    assert.equal(sourceCheck().status, 1);
    assert.ok(sourceCheck().stderr.includes("NEW_UNTRANSLATED_UI_SENTENCE"));
    fs.writeFileSync(newView, 'Text(String(localized: String(localized: "Cancel")))');
    assert.equal(sourceCheck().status, 1);
    assert.ok(sourceCheck().stderr.includes("nested String(localized:)"));
    fs.unlinkSync(newView);
    const projectPath = path.join(fixture, "Tinycast.xcodeproj/project.pbxproj");
    const project = fs.readFileSync(projectPath, "utf8");
    fs.writeFileSync(projectPath, project.replaceAll("Localization.swift in Sources", "Missing.swift in Sources"));
    assert.equal(sourceCheck().status, 1);
    assert.ok(sourceCheck().stderr.includes("Xcode project missing Localization.swift"));
    fs.writeFileSync(projectPath, project);
    const tablePath = path.join(fixture, "Tinycast/zh-Hans.lproj/Localizable.strings");
    const table = fs.readFileSync(tablePath, "utf8");
    for (const key of ["Navigate back or close window", "Larger"]) {
      const changed = table.replace(new RegExp(`^"${key}".*\\n`, "m"), "");
      assert.notEqual(changed, table, `Fixture has no ${key} key`);
      fs.writeFileSync(tablePath, changed);
      expectFailure(`missing “${key}”`);
    }
    fs.writeFileSync(tablePath, table + '\n"Snippets" = "重复";\n');
    expectFailure("Duplicate key: Snippets");
    fs.writeFileSync(tablePath, table + '\n"Regression %@" = "回归 %lld";\n');
    expectFailure("Format arguments differ");
    fs.writeFileSync(tablePath, table);
    const viewPath = path.join(fixture, "Tinycast/Features/WindowManagement/Settings/WindowLayoutsSection.swift");
    const view = fs.readFileSync(viewPath, "utf8");
    const changed = view.replace(
      'String(localized: "Save an arrangement, then restore it with one shortcut.")',
      '"Save an arrangement, then restore it with one shortcut."',
    );
    assert.notEqual(changed, view, "Fixture no longer models the original empty-state regression");
    fs.writeFileSync(viewPath, changed);
    expectFailure("Text(emptyMessage) receives untranslated literal");
    fs.writeFileSync(viewPath, view);
    assert.equal(check().status, 0);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
