import get from "./get.mjs";

function positiveOrNegative(scale, value) {
  if (typeof value !== "number" || value >= 0) {
    return get(scale, value, value);
  }
  const absolute = Math.abs(value);
  const n = get(scale, absolute, absolute);
  if (typeof n === "string") {
    return "-" + n;
  }
  return Number(n) * -1;
}

export default positiveOrNegative;
