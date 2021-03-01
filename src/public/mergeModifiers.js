'use strict';

const get = require('./get.js');
const isDevelopment = require('./isDevelopment.js');
const merge = require('./merge.js');

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
