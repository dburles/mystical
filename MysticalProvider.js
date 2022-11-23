"use strict";

const { ThemeProvider } = require("@emotion/react");
const PropTypes = require("prop-types");
const React = require("react");
const Global = require("./Global.js");
const customProperties = require("./private/customProperties.js");

function MysticalProvider({ theme = {}, children }) {
  return React.createElement(
    ThemeProvider,
    { theme },
    React.createElement(Global, {
      styles: {
        ":root": customProperties(theme.colors, "colors"),
        ["*, *::before,*::after"]: {
          boxSizing: "border-box",
        },
        ...theme.global,
      },
    }),
    children
  );
}

MysticalProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

module.exports = MysticalProvider;
