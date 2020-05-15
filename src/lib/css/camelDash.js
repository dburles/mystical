'use strict';

const camelDash = (string) => {
  return string.replace(/([A-Z])/g, (g) => {
    return `-${g[0].toLowerCase()}`;
  });
};

module.exports = camelDash;
