'use strict';

const get = require('./get');
const isDevelopment = require('./isDevelopment');
const merge = require('./merge');

const mergeModifiers = (values, initialModifiers, modifiersOverride) => {
  const { default: defaults, ...modifiers } = initialModifiers;

  return merge(
    defaults,
    merge(
      ...Object.keys(values).map((value) => {
        const style = get(modifiers, value);
        if (!style && isDevelopment) {
          throw new Error(
            `useModifiers: '${value}' not found in modifiers object!`
          );
        }
        return style[values[value]];
      })
    ),
    modifiersOverride
  );
};

module.exports = mergeModifiers;
