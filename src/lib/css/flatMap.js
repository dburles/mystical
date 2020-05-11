'use strict';

const flatMap = (
  array,
  fn = (x) => {
    return x;
  },
  newArray = []
) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    const result = fn(element, i);
    if (Array.isArray(result)) {
      flatMap(result, fn, newArray);
    } else {
      newArray.push(result);
    }
  }
  return newArray;
};

module.exports = flatMap;
