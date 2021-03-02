'use strict';

const isDevelopment = require('../private/isDevelopment.js');
const useMystical = require('./useMystical.js');

const useColorMode = () => {
  const { theme, mystical } = useMystical();

  const setColorMode = (mode) => {
    if (
      mode === 'default' ||
      (theme.colors?.modes && theme.colors.modes[mode])
    ) {
      return mystical.setColorMode(mode);
    } else if (isDevelopment) {
      throw new Error(
        `Color mode '${mode}' not found, did you forget to set it in your theme?`
      );
    }
  };

  return [mystical.colorMode, setColorMode];
};

module.exports = useColorMode;
