'use strict';

const { jsx: emotion } = require('@emotion/react');
const React = require('react');
const transformStyles = require('./transformStyles');

const jsx = (type, props, ...children) => {
  const { css, ...rest } = props || {};

  if (!css) {
    return React.createElement(type, rest, ...children);
  }

  return emotion(type, { css: transformStyles(css), ...rest }, ...children);
};

module.exports = jsx;
