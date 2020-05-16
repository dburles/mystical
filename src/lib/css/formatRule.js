'use strict';

const hyphenateStyleName = require('hyphenate-style-name');

const formatValue = (value) => {
  return value === '' ? '""' : value;
};

const formatRule = (key, value) => {
  return `${hyphenateStyleName(key)}:${formatValue(value)}`;
};

module.exports = formatRule;
