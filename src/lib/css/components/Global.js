import { useCallback, useContext, useMemo, useRef } from 'react';
import { MysticalCSSContext } from '../index';
import { transformCSS } from '../transform';
import { flatMap, hashObject, isServer, useLayoutEffect } from '../utils';

const Global = ({ styles }) => {
  const json = JSON.stringify(styles); // This is used purely as a means of equality checking
  const { cache, options } = useContext(MysticalCSSContext);
  const elementRef = useRef();

  const transformedCSSArray = useMemo(() => {
    return flatMap(
      Object.keys(styles).map((selector) => {
        const properties = styles[selector];
        return transformCSS(properties, options, selector);
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json, options]);

  const hash = useMemo(() => {
    return hashObject(transformedCSSArray);
  }, [transformedCSSArray]);

  const insertGlobalStyles = useCallback(
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

export default Global;
