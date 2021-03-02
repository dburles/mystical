'use strict';

const { jsx: emotionJsx } = require('@emotion/react');
const createJsxFn = require('./createJsxFn');

const jsx = createJsxFn(emotionJsx);

module.exports = jsx;
