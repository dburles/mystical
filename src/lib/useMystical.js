'use strict';

const { ThemeContext } = require('@emotion/react');
const React = require('react');

const useMystical = () => {
  return React.useContext(ThemeContext);
};

module.exports = useMystical;
