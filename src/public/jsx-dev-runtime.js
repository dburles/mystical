'use strict';

const { jsxDEV } = require('@emotion/react/jsx-dev-runtime');
const createJsxFn = require('./createJsxFn');

const jsx = createJsxFn(jsxDEV);

module.exports = jsx;
