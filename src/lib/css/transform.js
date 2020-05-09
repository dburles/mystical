import { prefix } from 'stylis';
import { camelDash, flatMap, hashObject, isObject, validRule } from './utils';

const generateClassNameFromTransformedCSS = (transformedCSS) => {
  return `.m${hashObject(transformedCSS)}`;
};

export const transformedCSSToClass = ({
  selector,
  rules,
  pseudo,
  breakpoint,
  at,
}) => {
  let fullSelector = selector;

  if (pseudo) {
    fullSelector = selector + pseudo;
  }

  const selectorRule = `${fullSelector}{${rules.join(';')}}`;

  if (breakpoint) {
    return `@media(min-width:${breakpoint}){${selectorRule}}`;
  }

  if (at) {
    return `${at}{${selectorRule}}`;
  }

  return selectorRule;
};

export const transformKeyframes = (css, hash) => {
  let keyframes = `@keyframes m${hash} {`;

  Object.keys(css).forEach((key) => {
    const value = css[key];

    keyframes += `${key}{`;

    Object.keys(value).forEach((innerKey) => {
      keyframes += `${innerKey}:${value[innerKey]};`;
    });

    keyframes += `}`;
  });

  keyframes += `}`;

  return keyframes;
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

export const transformCSS = (css, { transformer, breakpoints }, selector) => {
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

export const getClassNames = (
  transformedCSSArray,
  overrideClassNames,
  cache
) => {
  transformedCSSArray.forEach(cache.addTransformedCSS);

  if (overrideClassNames) {
    const overrideClassNamesArray = overrideClassNames.trim().split(' ');

    // User defined class names
    const nonMysticalClassNamesArray = overrideClassNamesArray.filter(
      (className) => {
        return !cache.identifiers[className];
      }
    );

    const overrideTransformedCSSArray = overrideClassNamesArray
      .map((className) => {
        return cache.identifiers[className];
      })
      .filter(Boolean);

    // Should 1 override 2
    const shouldOverride = (transformedCSS1, transformedCSS2) => {
      return (
        transformedCSS1.property === transformedCSS2.property &&
        transformedCSS1.pseudo === transformedCSS2.pseudo &&
        transformedCSS1.breakpoint === transformedCSS2.breakpoint &&
        transformedCSS1.mq === transformedCSS2.mq
      );
    };

    const dedupedTransformedCSSArray = transformedCSSArray.filter(
      (transformedCSS1) => {
        return !overrideTransformedCSSArray.find((transformedCSS2) => {
          return shouldOverride(transformedCSS1, transformedCSS2);
        });
      }
    );

    const dedupedClassNamesArray = dedupedTransformedCSSArray.map(
      (transformedCSS) => {
        return transformedCSS.selector.slice(1);
      }
    );

    cache.commitTransformedCSSArray(dedupedTransformedCSSArray);

    return [
      ...overrideClassNamesArray,
      ...nonMysticalClassNamesArray,
      ...dedupedClassNamesArray,
    ].join(' ');
  } else {
    cache.commitTransformedCSSArray(transformedCSSArray);

    return transformedCSSArray
      .map((transformedCSS) => {
        return transformedCSS.selector.slice(1); // Removes the period from the beginning of the selector
      })
      .join(' ');
  }
};
