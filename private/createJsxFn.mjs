import transformStyles from "./transformStyles.mjs";

export default function createJsxFn(jsxFn) {
  return (type, props, ...rest) => {
    const { css, ...restProps } = props || {};

    return jsxFn(
      type,
      css ? { css: transformStyles(css), ...restProps } : props,
      ...rest
    );
  };
}
