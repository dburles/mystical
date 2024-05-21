"use strict";

const { jsx: emotionJsx } = require("@emotion/react");
const createJsxFn = require("./private/createJsxFn.js");

const jsx = createJsxFn(emotionJsx);

module.exports = jsx;
