'use strict';

const camelDash = require('./camelDash');

const transformKeyframes = (css, hash) => {
  let keyframes = `@keyframes m${hash} {`;

  Object.keys(css).forEach((key) => {
    const value = css[key];

    keyframes += `${key}{`;

    Object.keys(value).forEach((innerKey) => {
      keyframes += `${camelDash(innerKey)}:${value[innerKey]};`;
    });

    keyframes += `}`;
  });

  keyframes += `}`;

  return keyframes;
};

module.exports = transformKeyframes;
