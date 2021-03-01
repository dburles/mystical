'use strict';

const jsx = require('./jsx.js');

const cloneElement = (element, props, ...children) => {
  return jsx(
    element.type,
    {
      key: element.key,
      ref: element.ref,
      ...element.props,
      ...props,
    },
    ...children
  );
};

module.exports = cloneElement;
