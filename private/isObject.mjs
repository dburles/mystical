export default function isObject(value) {
  return typeof value === "object" && value.constructor === Object;
}
