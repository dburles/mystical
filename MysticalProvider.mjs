// @ts-check

import { ThemeProvider } from "@emotion/react";
import React from "react";
import Global from "./Global.mjs";
import customProperties from "./private/customProperties.mjs";
import useMystical from "./useMystical.mjs";

function MysticalGlobalStyles() {
  // @ts-ignore
  const { theme = {} } = useMystical();

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

/**
 * @param {{
 *   theme: object;
 *   options?: {
 *     darkModeOff?: boolean;
 *     darkModeForcedBoundary?: boolean;
 *   };
 *   children: React.ReactNode;
 * }} props
 */
// eslint-disable-next-line react/prop-types
function MysticalProvider({ theme, options = {}, children }) {
  return React.createElement(
    ThemeProvider,
    // @ts-ignore
    { theme: { theme, options } },
    React.createElement(MysticalGlobalStyles),
    children,
  );
}

export default MysticalProvider;
