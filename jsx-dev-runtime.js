"use strict";

const {
  jsx: emotionJsx,
  jsxs: emotionJsxs,
} = require("@emotion/react/jsx-runtime");
const createJsxFn = require("./private/createJsxFn.js");

const jsx = createJsxFn(emotionJsx);

const jsxs = createJsxFn(emotionJsxs);

module.exports = {
  // https://github.com/facebook/react/blob/master/packages/react/src/jsx/ReactJSX.js#L16-L19
  jsx,
  jsxs,
};
