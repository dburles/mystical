"use strict";

const transformStyles = require("./transformStyles.js");

function createJsxFn(jsxFn) {
  return (type, props, ...rest) => {
    const { css, ...restProps } = props || {};

    return jsxFn(
      type,
      css ? { css: transformStyles(css), ...restProps } : props,
      ...rest
    );
  };
}

module.exports = createJsxFn;
