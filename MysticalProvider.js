"use strict";

const { ThemeProvider, ThemeContext } = require("@emotion/react");
const PropTypes = require("prop-types");
const { useContext } = require("react");
const React = require("react");
const Global = require("./Global.js");
const customProperties = require("./private/customProperties.js");

function MysticalGlobalStyles() {
  const theme = useContext(ThemeContext);

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

function MysticalProvider({ theme, children }) {
  return React.createElement(
    ThemeProvider,
    { theme },
    React.createElement(MysticalGlobalStyles),
    children
  );
}

MysticalProvider.propTypes = {
  theme: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  children: PropTypes.node.isRequired,
};

module.exports = MysticalProvider;
