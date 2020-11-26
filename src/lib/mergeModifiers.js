'use strict';

const get = require('./get.js');
const isDevelopment = require('./isDevelopment.js');
const merge = require('./merge.js');

const mergeModifiers = (values, modifiers, modifiersOverride) => {
  const allModifiers = merge(modifiers, modifiersOverride);

  return merge(
    modifiers.default,
    merge(
      ...Object.keys(values).map((value) => {
        const style = get(modifiers, value);
        if (!style && isDevelopment) {
          throw new Error(
            `useModifiers: '${value}' not found in modifiers object!`
          );
        }
        return style[values[value]];
      }),
      allModifiers
    )
  );
};

module.exports = mergeModifiers;
