import get from "./get.js";

function customProperties(theme, prefix) {
  const customProperties = {};

  function generateProperties(object, previousKey) {
    Object.entries(object).forEach(([key, value]) => {
      let formattedKey = key;

      if (prefix && !previousKey) {
        formattedKey = `${prefix}-${formattedKey}`;
      }

      const newKey = previousKey
        ? previousKey + "-" + formattedKey
        : formattedKey;

      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          customProperties[`--${newKey}-${i}`] = get(theme, item, item);
        });
      } else if (Object(value) === value) {
        generateProperties(value, newKey);
      } else {
        customProperties[`--${newKey}`] = get(theme, value, value);
      }
    });
  }

  generateProperties(theme);

  return customProperties;
}

export default customProperties;
