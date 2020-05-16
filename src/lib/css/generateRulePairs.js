'use strict';

const camelDash = require('./camelDash');
const prefix = require('./prefix.js');

const formatValue = (value) => {
  return value === '' ? "''" : value;
};

const generateRulePairs = (key, value) => {
  const dashedKey = camelDash(key);
  const atom = `${dashedKey}:${formatValue(value)};`;
  return prefix(atom, dashedKey.length).split(';').slice(0, -1);
};

module.exports = generateRulePairs;
