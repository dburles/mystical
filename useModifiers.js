"use strict";

const React = require("react");
const mergeModifiers = require("./private/mergeModifiers.js");

function useModifiers(values, modifiers, modifiersOverride = {}) {
  const stringifiedValues = JSON.stringify(values);
  const stringifiedModifiers = React.useMemo(() => {
    return JSON.stringify(modifiers);
  }, [modifiers]);
  const stringifiedModifiersOverride = React.useMemo(() => {
    return JSON.stringify(modifiersOverride);
  }, [modifiersOverride]);

  return React.useMemo(() => {
    if (values) {
      return mergeModifiers(values, modifiers, modifiersOverride);
    }

    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedValues, stringifiedModifiers, stringifiedModifiersOverride]);
}

module.exports = useModifiers;
