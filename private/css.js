"use strict";

const darkColorMode = require("../darkColorMode.js");
const facepaint = require("./facepaint.js");
const isObject = require("./isObject.js");
const merge = require("./merge.js");
const negativeTransform = require("./negativeTransform.js");
const shorthandProperties = require("./shorthandProperties.js");
const themeTokens = require("./themeTokens.js");
const transformColors = require("./transformColors.js");

function transformStyle(property, value, theme = {}) {
  const themeKey = themeTokens[property];

  if (shorthandProperties[property]) {
    return shorthandProperties[property](theme, String(value));
  } else if (themeKey) {
    let currentThemeProperties = theme[themeKey];
    if (themeKey === "colors") {
      return transformColors(theme.colors, property, value);
    }
    const transformNegatives = negativeTransform(property);
    return {
      [property]: transformNegatives(currentThemeProperties, value, value),
    };
  }
  return { [property]: value };
}

function css(rootStyles, forceColorModeContext = {}) {
  let mergedStyles = Array.isArray(rootStyles)
    ? merge(...rootStyles)
    : rootStyles;

  return (context) => {
    let transformedStyles = {};

    function transformStyles(styles) {
      for (const property in styles) {
        const value = styles[property];
        if (isObject(value)) {
          if (property === darkColorMode) {
            const transformed = css(value)(context);
            if (forceColorModeContext.mode === "dark") {
              // Flatten, thus overriding.
              transformedStyles = {
                ...transformedStyles,
                ...css(value)(context),
              };
            } else if (forceColorModeContext.mode === "light") {
              // Do nothing.
            } else {
              transformedStyles["@media (prefers-color-scheme: dark)"] =
                transformed;
            }
          } else {
            transformedStyles[property] = css(value)(context);
          }
        } else {
          transformedStyles = {
            ...transformedStyles,
            ...transformStyle(property, value, context.theme),
          };
        }
      }
    }

    if (Array.isArray(context.theme?.breakpoints)) {
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
