'use strict';

const React = require('react');
const MysticalContext = require('./MysticalContext.js');

const useMystical = () => {
  return React.useContext(MysticalContext);
};

module.exports = useMystical;
