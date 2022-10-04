"use strict";

const React = require("react");
const { ThemeProvider } = require("@emotion/react");
const useMystical = require("./useMystical.js");

function ColorSchemeBoundary(props) {
  const ctx = useMystical();
  return React.createElement(ThemeProvider, {
    theme: { ...ctx, mystical: { ...ctx.mystical, colorSchemeBoundary: true } },
    ...props,
  });
}

module.exports = ColorSchemeBoundary;
