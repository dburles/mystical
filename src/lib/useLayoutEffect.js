'use strict';

const { isBrowser } = require('@emotion/react');
const React = require('react');

const useLayoutEffect = isBrowser ? React.useLayoutEffect : React.useEffect;

module.exports = useLayoutEffect;
