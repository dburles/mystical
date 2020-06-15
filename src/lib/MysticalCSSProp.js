/* eslint-disable react/prop-types */
'use strict';

const { jsx: emotion } = require('@emotion/react');
const React = require('react');
const useTransformStyles = require('./useTransformStyles.js');

// eslint-disable-next-line react/display-name
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

module.exports = MysticalCSSProp;
