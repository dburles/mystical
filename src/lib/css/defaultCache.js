'use strict';

const createCache = require('./createCache.js');

// Default client side cache as the server will always be provided its own
const defaultCache = createCache();

module.exports = defaultCache;
