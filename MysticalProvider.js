"use strict";

const { ThemeProvider } = require("@emotion/react");
const PropTypes = require("prop-types");
const React = require("react");
const Global = require("./Global.js");
const customProperties = require("./private/customProperties.js");
const useMystical = require("./useMystical.js");

function MysticalGlobalStyles() {
  const { theme } = useMystical();

  return React.createElement(Global, {
    styles: [
      {
        ["*, *::before,*::after"]: {
          boxSizing: "border-box",
        },
      },
      theme.colors && { ":root": customProperties(theme.colors, "colors") },
      theme.global,
    ],
  });
}

function MysticalProvider({ theme, options = {}, children }) {
  return React.createElement(
    ThemeProvider,
    { theme: { theme, options } },
    React.createElement(MysticalGlobalStyles),
    children
  );
}

MysticalProvider.propTypes = {
  theme: PropTypes.object,
  options: PropTypes.shape({
    darkModeOff: PropTypes.bool,
    darkModeForcedBoundary: PropTypes.bool,
  }),
  children: PropTypes.node.isRequired,
};

module.exports = MysticalProvider;
