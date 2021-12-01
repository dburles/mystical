import facepaint from "./facepaint.mjs";
import isObject from "./isObject.mjs";
import merge from "./merge.mjs";
import negativeTransform from "./negativeTransform.mjs";
import shorthandProperties from "./shorthandProperties.mjs";
import themeTokens from "./themeTokens.mjs";
import transformColors from "./transformColors.mjs";

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

export default function transformStyles(initialStyles) {
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
