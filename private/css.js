"use strict";

const facepaint = require("./facepaint.js");
const isObject = require("./isObject.js");
const merge = require("./merge.js");
const negativeTransform = require("./negativeTransform.js");
const shorthandProperties = require("./shorthandProperties.js");
const themeTokens = require("./themeTokens.js");
const transformColors = require("./transformColors.js");

function transformStyle(key, value, theme) {
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

function css(rootStyles) {
  let mergedStyles = Array.isArray(rootStyles)
    ? merge(...rootStyles)
    : rootStyles;

  return (context) => {
    let transformedStyles = {};

    function transformStyles(styles) {
      for (const property in styles) {
        const value = styles[property];
        if (isObject(value)) {
          transformedStyles[property] = css(value)(context);
        } else {
          transformedStyles = {
            ...transformedStyles,
            ...transformStyle(property, value, context.theme),
          };
        }
      }
    }

    if (Array.isArray(context.theme.breakpoints)) {
      const mq = facepaint(
        context.theme.breakpoints.map((bp) => {
          return `@media (min-width: ${bp})`;
        })
      );

      for (const styles of mq(mergedStyles)) {
        transformStyles(styles);
      }
    } else {
      transformStyles(mergedStyles);
    }

    return transformedStyles;
  };
}

module.exports = css;
