"use strict";

const { jsx: emotionJsx } = require("@emotion/react");
const wrapCreateElement = require("./private/wrapCreateElement.js");

const jsx = wrapCreateElement(emotionJsx);

module.exports = jsx;
