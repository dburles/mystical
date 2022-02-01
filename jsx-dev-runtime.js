"use strict";

const { jsxDEV: emotionJsxDev } = require("@emotion/react/jsx-dev-runtime");
const createJsxFn = require("./private/createJsxFn.js");

const jsxDEV = createJsxFn(emotionJsxDev);

module.exports = { jsxDEV };
