'use strict';

const transformStyles = require('./transformStyles');

const createJsxFn = (jsxFn) => {
  return (type, props, ...children) => {
    const { css, ...rest } = props || {};

    return jsxFn(
      type,
      css ? { css: transformStyles(css), ...rest } : props,
      ...children
    );
  };
};

module.exports = createJsxFn;
