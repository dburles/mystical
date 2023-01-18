import css from "./css.js";

function wrapCreateElement(createElement) {
  return (type, props, ...rest) => {
    const { css: styles, ...restProps } = props || {};

    return createElement(
      type,
      styles ? { css: css(styles), ...restProps } : props,
      ...rest
    );
  };
}

export default wrapCreateElement;
