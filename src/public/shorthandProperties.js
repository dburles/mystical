'use strict';

const get = require('./get.js');
const positiveOrNegative = require('./positiveOrNegative.js');
const themeTokens = require('./themeTokens.js');
const transformColors = require('./transformColors.js');

const defaultValueTransformer = (themeScales, value) => {
  return get(themeScales, value, value);
};

const transform = (property, valueTransformer = defaultValueTransformer) => {
  return (theme, value) => {
    const parts = value.split(/\s+/);
    const transformedParts = parts
      .map((part) => {
        return valueTransformer(theme[themeTokens[property]], part);
      })
      .join(' ');

    return { [property]: transformedParts };
  };
};

const shorthandProperties = {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#Margin_and_Padding_Properties
  margin: transform(
    'margin',
    // We require a custom value transform function here so that
    // negative margin values are transformed correctly.
    (themeScales, currentValue) => {
      let value = currentValue;

      if (currentValue.startsWith('-')) {
        // Multiple values are always strings. If we find a negative number,
        // make it a Number so that this function won't simply pass it through.
        const number = Number(currentValue);
        if (!isNaN(number)) {
          value = number;
        }
      }

      return positiveOrNegative(themeScales, value);
    }
  ),
  padding: transform('padding'),
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#Border_Properties
  borderWidth: transform('borderWidth'),
  borderRadius: transform('borderRadius'),
  borderStyle: transform('borderStyle'),
  borderColor: transform('borderColor', (themeScales, currentValue) => {
    return transformColors(themeScales, 'borderColor', currentValue)
      .borderColor;
  }),
};

module.exports = shorthandProperties;
