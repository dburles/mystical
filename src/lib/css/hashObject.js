'use strict';

const murmur2 = require('./murmur2.js');

const hashObject = (object) => {
  return murmur2(JSON.stringify(object));
};

module.exports = hashObject;
