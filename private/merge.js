"use strict";

const deepmerge = require("./deepmerge.js");

function merge(...cssArray) {
  return deepmerge.all(cssArray.filter(Boolean), {
    arrayMerge(destinationArray, sourceArray) {
      return sourceArray;
    },
  });
}

module.exports = merge;
