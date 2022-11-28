"use strict";

const css = require("./css.js");

function createJsxFn(jsxFn) {
  return (type, props, ...rest) => {
    const { css: styles, ...restProps } = props || {};

    return jsxFn(
      type,
      styles ? { css: css(styles), ...restProps } : props,
      ...rest
    );
  };
}

module.exports = createJsxFn;
