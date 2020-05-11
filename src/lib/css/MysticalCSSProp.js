'use strict';

const React = require('react');
const useCSS = require('./useCSS.js');

const MysticalCSSProp = ({ css, children: element }) => {
  const classNames = useCSS(css, element?.props?.className);

  return React.cloneElement(element, {
    className: classNames,
  });
};

module.exports = MysticalCSSProp;
