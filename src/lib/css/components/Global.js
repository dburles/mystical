import { useCallback, useContext, useRef } from 'react';
import { MysticalCSSContext } from '../index';
import { transformCSS } from '../transform';
import { isServer, useLayoutEffect } from '../utils';

const Global = ({ styles }) => {
  const json = JSON.stringify(styles); // This is used purely as a means of equality checking
  const { cache, options, ready } = useContext(MysticalCSSContext);
  const elementRef = useRef();

  useLayoutEffect(() => {
    if (ready()) {
      elementRef.current = document.createElement('style');
      const globalStyleElement = elementRef.current;
      document.head.appendChild(globalStyleElement);
      return () => {
        globalStyleElement.remove();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const insertGlobalStyles = useCallback(() => {
    const globalStyleElement = elementRef.current;
    Object.keys(styles).forEach((selector) => {
      const properties = styles[selector];
      transformCSS(properties, options, selector).forEach((transformedCSS) => {
        cache.addGlobal(transformedCSS, globalStyleElement);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json, options]);

  if (isServer) {
    insertGlobalStyles();
  }

  useLayoutEffect(() => {
    // If we have server rendered styles, we don't want to insert anything
    // until after the page has rendered.
    if (ready()) {
      insertGlobalStyles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json, options]);

  return null;
};

export default Global;
