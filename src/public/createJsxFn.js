'use strict';

const React = require('react');
const transformStyles = require('./transformStyles');

const createJsxFn = (jsxFn) => {
  return (type, props, ...children) => {
    const { css, ...rest } = props || {};

    if (!css) {
      return React.createElement(type, rest, ...children);
    }

    return jsxFn(type, { css: transformStyles(css), ...rest }, ...children);
  };
};

module.exports = createJsxFn;
