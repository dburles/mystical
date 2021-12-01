import transformStyles from "./transformStyles.mjs";

export default function createJsxFn(jsxFn) {
  return (type, props, ...children) => {
    const { css, ...rest } = props || {};

    return jsxFn(
      type,
      css ? { css: transformStyles(css), ...rest } : props,
      ...children
    );
  };
}
