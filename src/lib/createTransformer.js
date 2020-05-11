'use strict';

const get = require('./css/get.js');
const negativeTransform = require('./negativeTransform.js');
const shorthandProperties = require('./shorthandProperties.js');
const themeTokens = require('./themeTokens.js');

const createTransformer = ({ mystical, theme }) => {
  return (key, value) => {
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
      return [[key, transformNegatives(currentKey, value, value)]];
    }

    return [[key, value]];
  };
};

module.exports = createTransformer;
