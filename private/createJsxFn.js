"use strict";

const css = require("./css.js");
const ForceColorModeContext = require("./ForceColorModeContext.js");
const React = require("react");

const typePropName = "__MYSTICAL_TYPE_PLEASE_DO_NOT_USE__";

function createJsxFn(jsxFn) {
  // eslint-disable-next-line react/prop-types
  function Mystical({ styles, [typePropName]: WrappedComponent, ...props }) {
    const forceColorModeContext = React.useContext(ForceColorModeContext);

    return jsxFn(WrappedComponent, {
      css: css(styles, forceColorModeContext),
      ...props,
    });
  }

  return (type, props, ...rest) => {
    const { css: styles, ...restProps } = props || {};

    return jsxFn(
      styles ? Mystical : type,
      styles ? { [typePropName]: type, styles, ...restProps } : props,
      ...rest
    );
  };
}

module.exports = createJsxFn;
