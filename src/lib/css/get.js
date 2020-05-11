'use strict';

const get = (obj, key, def, p, undef) => {
  const path = key && typeof key === 'string' ? key.split('.') : [key];
  for (p = 0; p < path.length; p++) {
    obj = obj ? obj[path[p]] : undef;
  }
  return obj === undef ? def : obj;
};

module.exports = get;
