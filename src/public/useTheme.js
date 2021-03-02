'use strict';

const get = require('../private/get');
const useMystical = require('./useMystical');

const useTheme = (key, value) => {
  const { theme } = useMystical();
  return get(theme[key], value, value);
};

module.exports = useTheme;
