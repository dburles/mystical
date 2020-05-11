'use strict';

const get = require('./css/get.js');
const positiveOrNegative = require('./positiveOrNegative.js');
const themeTokens = require('./themeTokens.js');

const defaultValueTransformer = (themeScales, value) => {
  return get(themeScales, value, value);
};

const transform = (
  property,
  keys,
  valueTransformer = defaultValueTransformer
) => {
  return (theme, value) => {
    const parts = value.split(/\s+/).slice(0, keys.length);
    const generateRules = (positions) => {
      return positions.map((pos, index) => {
        // `pos` represents the value to pick out for the current `index` in the keys array
        return [
          keys[index],
          valueTransformer(theme[themeTokens[property]], parts[pos]),
        ];
      });
    };

    const map = {
      1: [0, 0, 0, 0],
      2: [0, 1, 0, 1],
      3: [0, 1, 2, 1],
      4: [0, 1, 2, 3],
    };

    return generateRules(map[parts.length]);
  };
};

const shorthandProperties = {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#Margin_and_Padding_Properties
  margin: transform(
    'margin',
    ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'],
    // We require a custom value transform function here so that
    // negative margin values are transformed correctly.
    (themeScales, value) => {
      return positiveOrNegative(
        themeScales,
        // Multiple values are always strings. If we find a negative number,
        // make it a Number so that this function won't simply pass it through.
        value.startsWith('-') ? Number(value) : value
      );
    }
  ),
  padding: transform('padding', [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
  ]),
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#Border_Properties
  borderWidth: transform('borderWidth', [
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
  ]),
  borderRadius: transform('borderRadius', [
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomRightRadius',
    'borderBottomLeftRadius',
  ]),
  borderStyle: transform('borderStyle', [
    'borderTopStyle',
    'borderRightStyle',
    'borderBottomStyle',
    'borderLeftStyle',
  ]),
};

module.exports = shorthandProperties;
