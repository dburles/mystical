'use strict';

const get = require('./get.js');
const useMystical = require('./useMystical.js');

const useTheme = (key, value) => {
  const { theme } = useMystical();
  return get(theme[key], value, value);
};

module.exports = useTheme;
