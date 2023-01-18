import darkColorMode from "../darkColorMode.js";
import facepaint from "./facepaint.js";
import forceDarkModeAttribute from "./forceDarkModeAttribute.js";
import isObject from "./isObject.js";
import merge from "./merge.js";
import negativeTransform from "./negativeTransform.js";
import shorthandProperties from "./shorthandProperties.js";
import themeTokens from "./themeTokens.js";
import transformColors from "./transformColors.js";

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
          if (property === darkColorMode) {
            const transformed = css(value)(context);
            if (!context.options?.darkModeOff) {
              transformedStyles["@media (prefers-color-scheme: dark)"] =
                transformed;
            }
            if (context.options?.darkModeForcedBoundary) {
              transformedStyles[`[${forceDarkModeAttribute}] &`] = transformed;
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

export default css;
