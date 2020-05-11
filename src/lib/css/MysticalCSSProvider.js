'use strict';

const PropTypes = require('prop-types');
const React = require('react');
const MysticalCSSContext = require('./MysticalCSSContext.js');
const defaultBreakpoints = require('./defaultBreakpoints.js');
const defaultCache = require('./defaultCache.js');

const defaultOptions = {
  breakpoints: defaultBreakpoints,
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
