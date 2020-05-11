'use strict';

const React = require('react');
const isServer = require('./isServer.js');

const useLayoutEffect = isServer ? React.useEffect : React.useLayoutEffect;

module.exports = useLayoutEffect;
