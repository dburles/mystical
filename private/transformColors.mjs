import get from "./get.mjs";

export default function transformColors(colors, key, value) {
  if (get(colors, value)) {
    return { [key]: `var(--colors-${value.replace(/\./gu, "-")})` };
  }
  return { [key]: value };
}
