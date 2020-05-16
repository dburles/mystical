'use strict';

const PropTypes = require('prop-types');
const React = require('react');
const MysticalCSSContext = require('./MysticalCSSContext.js');
const defaultCache = require('./defaultCache.js');

const MysticalCSSProvider = ({
  options = {},
  cache = defaultCache,
  children,
}) => {
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
    transformer: PropTypes.func,
  }),
  children: PropTypes.node.isRequired,
};

module.exports = MysticalCSSProvider;
