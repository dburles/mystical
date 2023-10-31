"use strict";

const {
  jsx: emotionJsx,
  jsxs: emotionJsxs,
} = require("@emotion/react/jsx-runtime");
const wrapCreateElement = require("./private/wrapCreateElement.js");

const jsx = wrapCreateElement(emotionJsx);

const jsxs = wrapCreateElement(emotionJsxs);

module.exports = {
  // https://github.com/facebook/react/blob/master/packages/react/src/jsx/ReactJSX.js#L16-L19
  jsx,
  jsxs,
};
