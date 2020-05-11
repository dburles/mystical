'use strict';

const React = require('react');
const MysticalCSSContext = require('./MysticalCSSContext.js');
const getClassNames = require('./getClassNames.js');
const merge = require('./merge.js');
const transformCSS = require('./transformCSS.js');

const useCSS = (css, overrideClassNames) => {
  const json = JSON.stringify(css); // This is used purely as a means of equality checking
  const { cache, options } = React.useContext(MysticalCSSContext);

  const transformedCSSArray = React.useMemo(() => {
    return transformCSS(Array.isArray(css) ? merge(...css) : css, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json, options]);

  return React.useMemo(() => {
    return getClassNames(transformedCSSArray, overrideClassNames, cache);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformedCSSArray, overrideClassNames]);
};

module.exports = useCSS;
