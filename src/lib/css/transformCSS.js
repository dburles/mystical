'use strict';

const flatMap = require('./flatMap.js');
const generateRulePairs = require('./generateRulePairs.js');
const hashObject = require('./hashObject.js');
const isDevelopment = require('./isDevelopment.js');
const isObject = require('./isObject.js');
const unsupportedShorthandProperties = require('./unsupportedShorthandProperties.js');

const validValue = (value) => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    Array.isArray(value) ||
    (value && isObject(value))
  );
};

const generateClassNameFromTransformedCSS = (transformedCSS) => {
  return `.m${hashObject(transformedCSS)}`;
};

const filterValidValues = (css) => {
  return (key) => {
    return validValue(css[key]);
  };
};

const transformCSS = (css, { transformer, breakpoints }, selector) => {
  // Data structure
  // {
  //   selector: .mabcdefg
  //   property: display // the main identifier for this particular property
  //   rules: [
  //     'display:flex',
  //     'display:-webkit-box',
  //     'display:-webkit-flex',
  //     'display:-ms-flexbox',
  //   ]
  //   pseudo
  //   breakpoint
  //   at // Nested @ rules
  //   commit // Denotes whether this rule been commit to the browser
  // }
  const makeTransformedObject = ({ atom, pseudo, breakpoint, at }) => {
    const [key, value] = atom;
    const transformed =
      typeof transformer === 'function'
        ? transformer(key, value)
        : [[key, value]];

    return transformed.map(([transformedKey, transformedValue]) => {
      const transformedObject = {
        selector,
        property: transformedKey,
        rules: generateRulePairs(transformedKey, transformedValue),
        pseudo,
        breakpoint,
        at,
        commit: false,
      };
      if (!selector) {
        transformedObject.selector = generateClassNameFromTransformedCSS(
          transformedObject
        );
      }
      return transformedObject;
    });
  };

  const transformResponsiveValues = (array, { key, pseudo }) => {
    return (
      array
        .map((value, i) => {
          if (validValue(value)) {
            return makeTransformedObject({
              atom: [key, value],
              pseudo,
              ...(i > 0 && { breakpoint: breakpoints[i - 1] }),
            });
          }
        })
        // Filter out skipped rules
        .filter((transformedObject) => {
          return transformedObject !== undefined;
        })
    );
  };

  return flatMap(
    Object.keys(css)
      .filter(filterValidValues(css))
      .map((identifier) => {
        return identifier.split(',').map((rawKey) => {
          const key = rawKey.trim();
          const value = css[identifier];

          if (isDevelopment) {
            if (key.startsWith('@media')) {
              throw new Error(
                'The @media CSS at-rule is not supported! Please use array syntax instead.'
              );
            }
            if (unsupportedShorthandProperties.has(key)) {
              throw new Error(
                `Shorthand property '${key}' was used. Only 1-to-4 shorthand properties are supported.\n` +
                  'See: https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties'
              );
            }
          }

          const isNestedAtRule = key.startsWith('@');
          // XXX: Do something smarter here?
          const isPseudoSelector = !isNestedAtRule && isObject(value);

          if (isNestedAtRule || isPseudoSelector) {
            return flatMap(
              Object.keys(value)
                .filter(filterValidValues(value))
                .map((innerKey) => {
                  const innerValue = value[innerKey];
                  // Responsive array values
                  if (isPseudoSelector && Array.isArray(innerValue)) {
                    return transformResponsiveValues(innerValue, {
                      key: innerKey,
                      pseudo: key,
                    });
                  }

                  return makeTransformedObject({
                    atom: [innerKey, innerValue],
                    ...(isNestedAtRule && { at: key }),
                    ...(isPseudoSelector && { pseudo: key }),
                  });
                })
            );
          }

          // Responsive array values
          if (Array.isArray(value)) {
            return transformResponsiveValues(value, { key });
          }

          // Regular values
          return makeTransformedObject({
            atom: [key, value],
          });
        });
      })
  );
};

module.exports = transformCSS;
