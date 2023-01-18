import get from "./get.js";

function transformColors(colors, key, value) {
  if (get(colors, value)) {
    return { [key]: `var(--colors-${value.replace(/\./gu, "-")})` };
  }
  return { [key]: value };
}

export default transformColors;
