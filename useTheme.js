"use strict";

const get = require("./private/get.js");
const useMystical = require("./useMystical.js");

function useTheme(key, value) {
  const { theme } = useMystical();
  // Find the exact value on the theme,
  // or fall back to the value itself if there's no match.
  const translated = get(theme[key], value, value);
  // Try to find the translated value on the theme for self-referencing values,
  // or fall back to the translated value if there's no match.
  return get(theme[key], translated, translated);
}

module.exports = useTheme;
