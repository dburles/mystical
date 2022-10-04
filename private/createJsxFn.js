"use strict";

const merge = require("./merge.js");
const transformStyles = require("./transformStyles.js");

function createJsxFn(jsxFn) {
  return (type, props, ...rest) => {
    const { css, cssDark, ...restProps } = props || {};

    return jsxFn(
      type,
      css
        ? {
            css: cssDark
              ? (context) => {
                  return transformStyles(
                    context.mystical.colorSchemeBoundary
                      ? css
                      : merge(css, { '[data-color-mode="dark"] &': cssDark })
                  );
                }
              : transformStyles(css),
            ...restProps,
          }
        : props,
      ...rest
    );
  };
}

module.exports = createJsxFn;
