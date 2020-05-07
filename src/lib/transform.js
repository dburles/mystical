import { get } from './css';
import { shorthandProperties } from './shorthand-properties';
import { themeTokens } from './tokens';
import { negativeTransform } from './utils';

export const createTransformer = ({ mystical, theme }) => {
  return (key, value) => {
    const themeKey = themeTokens[key];

    if (shorthandProperties[key]) {
      return shorthandProperties[key](theme, String(value));
    } else if (themeKey) {
      let currentKey = theme[themeKey];

      if (mystical.colorMode !== 'default' && themeKey === 'colors') {
        const modes = theme[themeKey]['modes'][mystical.colorMode];
        // Only pick from colors that exist in this mode
        if (modes && get(modes, value)) {
          currentKey = modes;
        }
      }
      const transformNegatives = negativeTransform(key);
      return [[key, transformNegatives(currentKey, value, value)]];
    }

    return [[key, value]];
  };
};
