'use strict';

const get = require('./get');
const positiveOrNegative = require('./positiveOrNegative');

const negativeTransform = (property) => {
  return get(
    [
      'margin',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
      'top',
      'bottom',
      'left',
      'right',
    ].reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: positiveOrNegative,
      };
    }, {}),
    property,
    get
  );
};

module.exports = negativeTransform;
