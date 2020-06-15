'use strict';

const React = require('react');
const transformStyles = require('./transformStyles.js');

const useTransformStyles = (styles) => {
  const stringifiedStyles = JSON.stringify(styles);

  const transformedStyles = React.useMemo(() => {
    return transformStyles(styles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedStyles]);

  return transformedStyles;
};

module.exports = useTransformStyles;
