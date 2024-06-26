import deepmerge from "./deepmerge.mjs";

function merge(...cssArray) {
  return deepmerge.all(cssArray.filter(Boolean), {
    arrayMerge(destinationArray, sourceArray) {
      return sourceArray;
    },
  });
}

export default merge;
