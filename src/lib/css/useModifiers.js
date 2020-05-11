'use strict';

const deepmerge = require('deepmerge');
const get = require('./get.js');
const isDevelopment = require('./isDevelopment.js');
const merge = require('./merge.js');

const useModifiers = (values, modifiers, modifiersOverride = {}) => {
  if (values) {
    const allModifiers = deepmerge(modifiers, modifiersOverride);

    return merge(
      allModifiers.default,
      merge(
        ...Object.keys(values).map((value) => {
          const style = get(allModifiers, value);
          if (!style && isDevelopment) {
            throw new Error(
              `useModifiers: '${value}' not found in modifiers object!`
            );
          }
          return style[values[value]];
        })
      )
    );
  }

  return {};
};

module.exports = useModifiers;
