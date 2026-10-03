"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { signature, swiftStrings, localizedLiterals } = require("../Scripts/localization-source.js");

test("Swift strings skip comments and preserve nested interpolation and raw escapes", () => {
  const source = '// Text("ignored")\n/* nested /* Text("ignored") */ */\n'
    + 'Text("Thought for \\(max(1, Int(duration.rounded())))s")\n'
    + 'Text(#"Path \\name, \\#(file.title)"#)\n'
    + 'Text("\\u{201C}Hello\\u{201D}")';
  assert.deepEqual(localizedLiterals(source).map((item) => item.value), [
    "Thought for {}s", "Path \\name, {}", "“Hello”",
  ]);
});

test("multiline Swift continuation drops indentation without inventing a newline", () => {
  const source = 'String(localized: """\n    First \\\n    second\n    """)';
  assert.equal(localizedLiterals(source)[0].value, "First second");
  assert.equal(swiftStrings('"""\n    First\n    second\n    """')[0].value, "First\nsecond");
});

test("UI string concatenation checks the combined lookup and separately localized operands", () => {
  const source = 'Text(("First " + "second").localizedUI)\n'
    + 'detail += " " + "Already translated".localizedUI\n'
    + 'Text("Hello")\nlet data = "protocol"';
  assert.deepEqual(localizedLiterals(source).map((item) => item.value), [
    "First second", "Already translated", "Hello",
  ]);
});

test("source signatures allow numeric type inference and positional reordering", () => {
  assert.equal(signature("%lld%% left"), "{}% left");
  assert.equal(signature("%2$@ of %1$lld"), "{} of {}");
  assert.equal(signature("%lf seconds"), "{} seconds");
});

test("conditional UI labels check both states without mistaking SF Symbols for text", () => {
  const source = 'Label(pinned ? "Unpin Chat" : "Pin Chat", systemImage: pinned ? "pin.slash" : "pin")\n'
    + '.help(\n  enabled ? "Enable" : "Disable")';
  assert.deepEqual(localizedLiterals(source).map((item) => item.value), [
    "Unpin Chat", "Pin Chat", "Enable", "Disable",
  ]);
});
