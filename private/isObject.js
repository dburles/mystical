"use strict";

function isObject(value) {
  return typeof value === "object" && value.constructor === Object;
}

module.exports = isObject;
