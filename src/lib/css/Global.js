'use strict';

const React = require('react');
const MysticalCSSContext = require('./MysticalCSSContext.js');
const flatMap = require('./flatMap.js');
const hashObject = require('./hashObject.js');
const isServer = require('./isServer.js');
const transformCSS = require('./transformCSS.js');
const useLayoutEffect = require('./useLayoutEffect.js');

const Global = ({ styles }) => {
  const json = JSON.stringify(styles); // This is used purely as a means of equality checking
  const { cache, options } = React.useContext(MysticalCSSContext);
  const elementRef = React.useRef();

  const transformedCSSArray = React.useMemo(() => {
    return flatMap(
      Object.keys(styles).map((selector) => {
        const properties = styles[selector];
        return transformCSS(properties, options, selector);
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json, options]);

  const hash = React.useMemo(() => {
    return hashObject(transformedCSSArray);
  }, [transformedCSSArray]);

  const insertGlobalStyles = React.useCallback(
    () => {
      cache.addGlobalTransformedCSSArray(
        transformedCSSArray,
        hash,
        elementRef.current
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hash]
  );

  if (isServer) {
    insertGlobalStyles();
  }

  useLayoutEffect(() => {
    if (!cache.identifiers[hash]) {
      elementRef.current = document.createElement('style');
      const globalStyleElement = elementRef.current;
      document.head.appendChild(globalStyleElement);

      insertGlobalStyles();

      return () => {
        delete cache.identifiers[hash];
        globalStyleElement.remove();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json, options]);

  return null;
};

module.exports = Global;
