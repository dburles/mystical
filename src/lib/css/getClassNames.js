'use strict';

const transformCSS = require('./transformCSS');
const transformedCSSToClass = require('./transformedCSSToClass');

const getClassNames = (transformedCSSArray, overrideClassNames, cache) => {
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
      // Always override responsive values
      if (!transformedCSS2.breakpoint && transformedCSS1.breakpoint) {
        return (
          transformedCSS1.property === transformedCSS2.property &&
          transformedCSS1.pseudo === transformedCSS2.pseudo &&
          transformedCSS1.at === transformedCSS2.at
        );
      }
      return (
        transformedCSS1.property === transformedCSS2.property &&
        transformedCSS1.pseudo === transformedCSS2.pseudo &&
        transformedCSS1.breakpoint === transformedCSS2.breakpoint &&
        transformedCSS1.at === transformedCSS2.at
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

    cache.preCommitTransformedCSSArray(dedupedTransformedCSSArray);

    return [
      ...overrideClassNamesArray,
      ...nonMysticalClassNamesArray,
      ...dedupedClassNamesArray,
    ].join(' ');
  } else {
    const expandedProperties = new Set();
    const expandedPropertiesOverride = new Set();

    transformedCSSArray.forEach((transformedCSS) => {
      if (transformedCSS.expanded) {
        expandedProperties.add(transformedCSS.property);
      } else if (expandedProperties.has(transformedCSS.property)) {
        expandedPropertiesOverride.add(transformedCSS.property);
      }
    });

    // Ensures that expanded atoms from 1-to-4 properties
    // are replaced by their directly specified counterparts.
    const dedupedTransformedCSSArray = transformedCSSArray.filter(
      (transformedCSS) => {
        if (
          transformedCSS.expanded &&
          expandedProperties.has(transformedCSS.property) &&
          expandedPropertiesOverride.has(transformedCSS.property)
        ) {
          return false;
        }
        return true;
      }
    );

    cache.preCommitTransformedCSSArray(dedupedTransformedCSSArray);

    return dedupedTransformedCSSArray
      .map((transformedCSS) => {
        return transformedCSS.selector.slice(1); // Removes the period from the beginning of the selector
      })
      .join(' ');
  }
};

module.exports = getClassNames;
