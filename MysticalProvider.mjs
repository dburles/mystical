import { ThemeProvider } from "@emotion/react";
import PropTypes from "prop-types";
import React from "react";
import Global from "./Global.mjs";
import customProperties from "./private/customProperties.mjs";
import useMystical from "./useMystical.mjs";

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
  theme: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  options: PropTypes.shape({
    darkModeOff: PropTypes.bool,
    darkModeForcedBoundary: PropTypes.bool,
  }),
  children: PropTypes.node.isRequired,
};

export default MysticalProvider;
