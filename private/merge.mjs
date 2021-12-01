import deepmerge from "deepmerge";

export default function merge(...cssArray) {
  return deepmerge.all(cssArray.filter(Boolean), {
    arrayMerge(destinationArray, sourceArray) {
      return sourceArray;
    },
  });
}
