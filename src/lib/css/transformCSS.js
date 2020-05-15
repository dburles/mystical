'use strict';

const { prefix } = require('stylis');
const camelDash = require('./camelDash.js');
const flatMap = require('./flatMap.js');
const hashObject = require('./hashObject.js');
const isObject = require('./isObject.js');

const validRule = (value) => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    Array.isArray(value) ||
    // Objects are what we consider to be pseudo selectors
    (value && isObject(value))
  );
};

const generateClassNameFromTransformedCSS = (transformedCSS) => {
  return `.m${hashObject(transformedCSS)}`;
};

const generateVendorPrefixes = (key, value) => {
  const dashedKey = camelDash(key);
  const atom = `${dashedKey}:${value === '' ? "''" : value};`;
  return prefix(atom, dashedKey.length).split(';').slice(0, -1);
};

const filterValidRules = (css) => {
  return (key) => {
    // Ignore the rule if it's falsey
    return validRule(css[key]);
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
        rules: generateVendorPrefixes(transformedKey, transformedValue),
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
          if (validRule(value)) {
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
      .filter(filterValidRules(css))
      .map((key) => {
        const value = css[key];

        const isNestedAtRule = key.startsWith('@');
        // XXX: Do something smarter here?
        const isPseudoSelector = !isNestedAtRule && isObject(value);

        if (isNestedAtRule || isPseudoSelector) {
          return flatMap(
            Object.keys(value)
              .filter(filterValidRules(value))
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
      })
  );
};

module.exports = transformCSS;
