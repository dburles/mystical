'use strict';

const React = require('react');
const MysticalCSSProp = require('./MysticalCSSProp.js');

const cloneElement = (element, props, ...children) => {
  // If there's css prop has been given to cloneElement and it's not already wrapped with a MysticalCSSProp
  if (props?.css && element.type !== MysticalCSSProp) {
    // Wrap the element in MysticalCSSProp so the css prop is handled correctly
    return React.createElement(
      MysticalCSSProp,
      { css: props.css, key: props.key },
      element
    );
  }

  return React.cloneElement(element, props, ...children);
};

module.exports = cloneElement;
