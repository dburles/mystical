/* eslint-disable react/prop-types */
'use strict';

const { jsx: emotion } = require('@emotion/react');
const React = require('react');
const isDevelopment = require('./isDevelopment.js');
const useTransformStyles = require('./useTransformStyles.js');

const MysticalCSSProp = React.forwardRef(
  ({ styles, children: element }, ref) => {
    const css = useTransformStyles(styles);

    return emotion(element.type, {
      css,
      ref,
      ...element.props,
    });
  }
);

if (isDevelopment) {
  MysticalCSSProp.displayName = 'MysticalCSSProp';
}

module.exports = MysticalCSSProp;
