'use strict';

const facepaint = require('facepaint').default;
const get = require('./get.js');
const isObject = require('./isObject.js');
const negativeTransform = require('./negativeTransform.js');
const shorthandProperties = require('./shorthandProperties.js');
const themeTokens = require('./themeTokens.js');

const transformStyle = (key, value, { mystical, theme }) => {
  const themeKey = themeTokens[key];

  if (shorthandProperties[key]) {
    return shorthandProperties[key](theme, String(value));
  } else if (themeKey) {
    let currentKey = theme[themeKey];
    if (mystical.colorMode !== 'default' && themeKey === 'colors') {
      const modes = theme[themeKey]['modes'][mystical.colorMode];
      // Only pick from colors that exist in this mode
      if (modes && get(modes, value)) {
        currentKey = modes;
      }
    }
    const transformNegatives = negativeTransform(key);
    return { [key]: transformNegatives(currentKey, value, value) };
  }

  return { [key]: value };
};

const transformStyles = (initialStyles) => {
  return (context) => {
    let transformedStyles = {};

    const mq = facepaint(
      context.theme.breakpoints.map((bp) => {
        return `@media (min-width: ${bp})`;
      })
    );

    (Array.isArray(initialStyles) ? initialStyles : [initialStyles]).forEach(
      (styleGroup) => {
        mq(styleGroup).forEach((styles) => {
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
      }
    );

    return transformedStyles;
  };
};

module.exports = transformStyles;
