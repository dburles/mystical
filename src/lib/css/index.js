import deepmerge, { all as deepmergeArray } from 'deepmerge';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useMemo } from 'react';
import { createCache } from './cache';
import murmur2 from './hash';
import { getClassNames, transformCSS, transformKeyframes } from './transform';
import { get, isDevelopment, isServer, useLayoutEffect } from './utils';

export const merge = (...cssArray) => {
  return deepmergeArray(cssArray.filter(Boolean), {
    arrayMerge(destinationArray, sourceArray) {
      return sourceArray;
    },
  });
};

export const useModifiers = (values, modifiers, modifiersOverride = {}) => {
  if (values) {
    const allModifiers = deepmerge(modifiers, modifiersOverride);

    const modifierStyle = Object.keys(values).reduce((acc, curr) => {
      const style = get(allModifiers, curr);
      if (!style && isDevelopment) {
        throw new Error(
          `useModifiers: '${curr}' not found in modifiers object!`
        );
      }
      acc = merge(acc, style[values[curr]]);
      return acc;
    }, {});

    return modifierStyle;
  }
  return {};
};

export const defaultBreakpoints = ['640px', '768px', '1024px', '1280px'];

const defaultOptions = {
  breakpoints: defaultBreakpoints,
};

// Default client side cache as the server will always be provided its own
export const defaultCache = createCache();

export const MysticalCSSContext = createContext();
export const MysticalCSSProvider = ({
  options: userOptions = defaultOptions,
  cache = defaultCache,
  children,
}) => {
  const options = useMemo(() => {
    return {
      ...defaultOptions,
      ...userOptions,
    };
  }, [userOptions]);

  const providerValue = useMemo(() => {
    return {
      cache,
      options,
    };
  }, [cache, options]);

  return (
    <MysticalCSSContext.Provider value={providerValue}>
      {children}
    </MysticalCSSContext.Provider>
  );
};

MysticalCSSProvider.propTypes = {
  cache: PropTypes.object,
  options: PropTypes.shape({
    breakpoints: PropTypes.arrayOf(PropTypes.string),
    transformer: PropTypes.func,
  }),
  children: PropTypes.node.isRequired,
};

export const useCSS = (css, overrideClassNames) => {
  const json = JSON.stringify(css); // This is used purely as a means of equality checking
  const { cache, options } = useContext(MysticalCSSContext);

  const transformedCSSArray = useMemo(() => {
    return transformCSS(Array.isArray(css) ? merge(...css) : css, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json, options]);

  return useMemo(() => {
    return getClassNames(transformedCSSArray, overrideClassNames, cache);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformedCSSArray, overrideClassNames]);
};

export const useKeyframes = (css) => {
  const { cache } = useContext(MysticalCSSContext);
  const json = JSON.stringify(css);
  const hash = useMemo(() => {
    return murmur2(json);
  }, [json]);

  const insertKeyframes = () => {
    cache.addKeyframes(hash, transformKeyframes(css, hash));
  };

  if (isServer) {
    insertKeyframes();
  }

  useLayoutEffect(() => {
    insertKeyframes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json]);

  return 'm' + hash;
};

const MysticalCSSProp = ({ css, children: element }) => {
  const classNames = useCSS(css, element?.props?.className);

  return React.cloneElement(element, {
    className: classNames,
  });
};

export const cloneElement = (element, props, ...children) => {
  // If there's css prop has been given to cloneElement and it's not already wrapped with a MysticalCSSProp
  if (props?.css && element.type !== MysticalCSSProp) {
    // Wrap the element in MysticalCSSProp so the css prop is handled correctly
    return React.createElement(
      MysticalCSSProp,
      { css: props.css, key: props.key },
      element
    );
  }

  return React.cloneElement(element, props, ...children);
};

export const jsx = (type, props, ...children) => {
  const { css, ...rest } = props || {};

  const element = React.createElement(type, rest, ...children);

  return css
    ? React.createElement(MysticalCSSProp, { css, key: rest.key }, element)
    : element;
};

export { createCache } from './cache';
export { get, isDevelopment, isServer } from './utils';
export { default as Global } from './components/Global';
