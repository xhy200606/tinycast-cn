"use strict";

function signature(value) {
  return value.replace(/%%/g, "%").replace(
    /%(?:\d+\$)?[-+#0 ]*\d*(?:\.\d+)?(?:lld|llu|ld|lu|zd|zu|lf|@|d|u|f|g|s)/g, "{}",
  );
}

function swiftStrings(source) {
  const result = [];
  let index = 0;
  function comment() {
    if (source.startsWith("//", index)) {
      const end = source.indexOf("\n", index);
      index = end < 0 ? source.length : end + 1;
      return true;
    }
    if (!source.startsWith("/*", index)) return false;
    let depth = 1;
    index += 2;
    while (index < source.length && depth) {
      if (source.startsWith("/*", index)) { depth++; index += 2; }
      else if (source.startsWith("*/", index)) { depth--; index += 2; }
      else index++;
    }
    return true;
  }
  function expression() {
    let depth = 1;
    while (index < source.length && depth) {
      if (comment()) continue;
      if (string(false)) continue;
      if (source[index] === "(") depth++;
      if (source[index] === ")") depth--;
      index++;
    }
  }
  function string(record) {
    const opening = /^(#*)("""|")/.exec(source.slice(index));
    if (!opening) return false;
    const start = index;
    const hashes = opening[1];
    const quote = opening[2];
    const close = quote + hashes;
    const escape = "\\" + hashes;
    index += opening[0].length;
    let value = "";
    let interpolated = false;
    while (index < source.length && !source.startsWith(close, index)) {
      if (source.startsWith(escape + "(", index)) {
        index += escape.length + 1;
        expression();
        value += "{}";
        interpolated = true;
      } else if (source.startsWith(escape, index)) {
        index += escape.length;
        const unicode = /^u\{([0-9a-fA-F]+)\}/.exec(source.slice(index));
        if (unicode) { value += String.fromCodePoint(parseInt(unicode[1], 16)); index += unicode[0].length; }
        else if (source[index] === "\n") { value += "\u0001\n"; index++; }
        else { value += ({ n: "\n", t: "\t", r: "\r", "0": "\0" })[source[index]] ?? source[index] ?? ""; index++; }
      } else value += source[index++];
    }
    index += close.length;
    if (quote.length === 3) {
      const lines = value.split("\n");
      const indentation = /^\s*/.exec(lines.at(-1))[0].length;
      value = lines.slice(1, -1).map((line) => line.slice(indentation)).join("\n").replace(/\u0001\n/g, "");
    }
    if (record) result.push({ start, end: index, value, interpolated });
    return true;
  }
  while (index < source.length) {
    if (comment() || string(true)) continue;
    if (source.startsWith("#/", index)) {
      const end = source.indexOf("/#", index + 2);
      index = end < 0 ? source.length : end + 2;
    } else index++;
  }
  return result;
}

function customUILiterals(source, strings) {
  const fields = {
    SettingsRow: ["title", "subtitle"],
    SettingsFeatureToggleLabel: ["title", "subtitle"],
    SettingsEditorHeader: ["title", "subtitle"],
    SettingsEditorField: ["title"],
    SettingsFilterField: ["prompt"],
    FeatureSwitchSection: ["enableTitle", "enableSubtitle"],
    HeaderMenuButton: ["title", "help"],
    PopoverMenuItem: ["title", "detail"],
  };
  const byStart = new Map(strings.map((literal) => [literal.start, literal]));
  const stack = [];
  const found = new Set();
  for (let index = 0; index < source.length; index++) {
    if (source.startsWith("//", index)) {
      const end = source.indexOf("\n", index);
      index = end < 0 ? source.length : end;
      continue;
    }
    if (source.startsWith("/*", index)) {
      let depth = 1;
      index += 2;
      while (index < source.length && depth) {
        if (source.startsWith("/*", index)) { depth++; index += 2; }
        else if (source.startsWith("*/", index)) { depth--; index += 2; }
        else index++;
      }
      index--;
      continue;
    }
    const literal = byStart.get(index);
    if (literal) {
      const frame = stack.at(-1);
      if (frame?.delimiter === "(") {
        const argument = source.slice(frame.argumentStart, index).trim();
        const field = /^(\w+):\s*$/.exec(argument)?.[1];
        if (fields[frame.name]?.includes(field)
          || (frame.name === "SettingsRowTitle" && frame.argumentIndex === 1 && !argument)) {
          found.add(index);
        }
      }
      index = literal.end - 1;
      continue;
    }
    const character = source[index];
    if ("([{".includes(character)) {
      stack.push({ delimiter: character,
        name: /(\w+)\s*$/.exec(source.slice(Math.max(0, index - 150), index))?.[1],
        argumentStart: index + 1, argumentIndex: 0 });
    } else if (")]}".includes(character)) {
      stack.pop();
    } else if (character === "," && stack.length) {
      stack.at(-1).argumentStart = index + 1;
      stack.at(-1).argumentIndex++;
    }
  }
  return found;
}

function localizedLiterals(source) {
  const strings = swiftStrings(source);
  const customUI = customUILiterals(source, strings);
  const joined = [];
  for (let i = 0; i < strings.length; i++) {
    const literal = { ...strings[i] };
    while (i + 1 < strings.length && /^\s*\+\s*$/.test(source.slice(literal.end, strings[i + 1].start))) {
      if (/^\s*\.localizedUI\b/.test(source.slice(strings[i + 1].end))) break;
      const next = strings[++i];
      literal.value += next.value;
      literal.end = next.end;
      literal.interpolated ||= next.interpolated;
    }
    joined.push(literal);
  }
  return joined.filter((literal) => {
    const prefix = source.slice(Math.max(0, literal.start - 150), literal.start);
    const suffix = source.slice(literal.end, literal.end + 40);
    return customUI.has(literal.start)
      || /String\(\s*localized:\s*$/.test(prefix)
      || /\b(?:Text|Button|Label|Toggle|Section|Picker|TextField|GroupBox|LabeledContent)\(\s*$/.test(prefix)
      || /\.(?:help|accessibilityLabel|accessibilityValue|navigationTitle)\(\s*$/.test(prefix)
      || /(?:\b(?:Text|Button|Label|Toggle|Picker)|\.(?:help|accessibilityLabel|accessibilityValue))\([^;{},]*\?(?:[^;{},]*:)?\s*$/.test(prefix)
      || /^\s*\)?\.localizedUI\b/.test(suffix);
  });
}

module.exports = { signature, swiftStrings, localizedLiterals };
