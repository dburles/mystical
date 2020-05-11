'use strict';

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

module.exports = getClassNames;
