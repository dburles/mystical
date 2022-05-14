"use strict";

const mergeModifiers = require("./private/mergeModifiers.js");

function useModifiers(values, modifiers, modifiersOverride = {}) {
  return values ? mergeModifiers(values, modifiers, modifiersOverride) : {};
}

module.exports = useModifiers;
