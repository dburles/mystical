'use strict';

const isEqualAtom = (transformedCSS1, transformedCSS2) => {
  return (
    transformedCSS1.property === transformedCSS2.property &&
    transformedCSS1.pseudo === transformedCSS2.pseudo &&
    transformedCSS1.breakpoint === transformedCSS2.breakpoint &&
    transformedCSS1.at === transformedCSS2.at
  );
};

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
      return isEqualAtom(transformedCSS1, transformedCSS2);
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
    const expandedProperties = {};
    const expandedPropertiesOverride = {};

    transformedCSSArray.forEach((transformedCSS) => {
      if (transformedCSS.expanded) {
        expandedProperties[transformedCSS.property] = transformedCSS;
      } else if (expandedProperties[transformedCSS.property]) {
        expandedPropertiesOverride[transformedCSS.property] = transformedCSS;
      }
    });

    // Ensures that expanded atoms from 1-to-4 properties
    // are replaced by their directly specified counterparts.
    const dedupedTransformedCSSArray = transformedCSSArray.filter(
      (transformedCSS) => {
        if (
          transformedCSS.expanded &&
          expandedProperties[transformedCSS.property] &&
          expandedPropertiesOverride[transformedCSS.property]
        ) {
          return !isEqualAtom(
            expandedProperties[transformedCSS.property],
            expandedPropertiesOverride[transformedCSS.property]
          );
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
