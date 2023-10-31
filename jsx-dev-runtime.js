"use strict";

const { jsxDEV: emotionJsxDev } = require("@emotion/react/jsx-dev-runtime");
const wrapCreateElement = require("./private/wrapCreateElement.js");

const jsxDEV = wrapCreateElement(emotionJsxDev);

module.exports = { jsxDEV };
