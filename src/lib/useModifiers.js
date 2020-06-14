'use strict';

const React = require('react');
const get = require('./get.js');
const isDevelopment = require('./isDevelopment.js');
const merge = require('./merge.js');

const useModifiers = (values, modifiers, modifiersOverride = {}) => {
  const stringifiedValues = JSON.stringify(values);
  const stringifiedModifiers = React.useMemo(() => {
    return JSON.stringify(modifiers);
  }, [modifiers]);
  const stringifiedModifiersOverride = React.useMemo(() => {
    return JSON.stringify(modifiersOverride);
  }, [modifiersOverride]);

  return React.useMemo(() => {
    if (values) {
      const allModifiers = merge(modifiers, modifiersOverride);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedValues, stringifiedModifiers, stringifiedModifiersOverride]);
};

module.exports = useModifiers;
