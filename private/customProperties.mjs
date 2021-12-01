export default function customProperties(theme, prefix) {
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
          customProperties[`--${newKey}-${i}`] = item;
        });
      } else if (Object(value) === value) {
        generateProperties(value, newKey);
      } else {
        customProperties[`--${newKey}`] = value;
      }
    });
  }

  generateProperties(theme);

  return customProperties;
}
