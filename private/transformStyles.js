"use strict";

const facepaint = require("./facepaint.js");
const isObject = require("./isObject.js");
const merge = require("./merge.js");
const negativeTransform = require("./negativeTransform.js");
const shorthandProperties = require("./shorthandProperties.js");
const themeTokens = require("./themeTokens.js");
const transformColors = require("./transformColors.js");

function transformStyle(key, value, { theme }) {
  const themeKey = themeTokens[key];

  if (shorthandProperties[key]) {
    return shorthandProperties[key](theme, String(value));
  } else if (themeKey) {
    let currentThemeProperties = theme[themeKey];
    if (themeKey === "colors") {
      return transformColors(theme.colors, key, value);
    }
    const transformNegatives = negativeTransform(key);
    return { [key]: transformNegatives(currentThemeProperties, value, value) };
  }
  return { [key]: value };
}

function transformStyles(initialStyles) {
  return (context) => {
    let transformedStyles = {};

    const mq = facepaint(
      context.theme.breakpoints.map((bp) => {
        return `@media (min-width: ${bp})`;
      })
    );

    mq(
      Array.isArray(initialStyles) ? merge(...initialStyles) : initialStyles
    ).forEach((styles) => {
      Object.keys(styles).forEach((key) => {
        const value = styles[key];
        if (isObject(value)) {
          transformedStyles[key] = transformStyles(value)(context);
        } else {
          transformedStyles = {
            ...transformedStyles,
            ...transformStyle(key, value, context),
          };
        }
      });
    });

    return transformedStyles;
  };
}

module.exports = transformStyles;
