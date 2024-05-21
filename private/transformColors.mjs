import get from "./get.mjs";

function transformColors(colors, key, value) {
  if (get(colors, value)) {
    return { [key]: `var(--colors-${value.replace(/\./gu, "-")})` };
  }
  return { [key]: value };
}

export default transformColors;
