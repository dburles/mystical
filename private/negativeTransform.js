"use strict";

const get = require("./get.js");
const positiveOrNegative = require("./positiveOrNegative.js");

function negativeTransform(property) {
  return get(
    [
      "margin",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "top",
      "bottom",
      "left",
      "right",
    ].reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: positiveOrNegative,
      };
    }, {}),
    property,
    get
  );
}

module.exports = negativeTransform;
