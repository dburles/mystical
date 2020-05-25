'use strict';

const PropTypes = require('prop-types');
const React = require('react');
const MysticalCSSContext = require('./MysticalCSSContext.js');
const defaultBreakpoints = require('./defaultBreakpoints.js');
const defaultCache = require('./defaultCache.js');
const isServer = require('./isServer.js');
const useLayoutEffect = require('./useLayoutEffect.js');

const defaultOptions = {
  breakpoints: defaultBreakpoints,
  pseudoOrder: [
    'responsive',
    'group-hover',
    'group-focus',
    'focus-within',
    'first',
    'last',
    'odd',
    'even',
    'hover',
    'focus',
    'active',
    'visited',
    'disabled',
  ],
};

const MysticalCSSProvider = ({
  options: userOptions = defaultOptions,
  cache = defaultCache,
  children,
}) => {
  const options = React.useMemo(() => {
    return {
      ...defaultOptions,
      ...userOptions,
    };
  }, [userOptions]);

  const providerValue = React.useMemo(() => {
    return {
      cache,
      options,
    };
  }, [cache, options]);

  if (isServer) {
    cache.initialise(options);
  }

  useLayoutEffect(() => {
    cache.initialise(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

module.exports = MysticalCSSProvider;
