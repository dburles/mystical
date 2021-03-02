'use strict';

const get = require('../private/get');

const transformColors = (colors, key, value) => {
  if (get(colors, value)) {
    return { [key]: `var(--colors-${value.replace(/\./gu, '-')})` };
  }
  return { [key]: value };
};

module.exports = transformColors;
