'use strict';

const { TestDirector } = require('test-director');
const mergeModifiers = require('./mergeModifiers.test.js');
const transformStyles = require('./transformStyles.test.js');

const tests = new TestDirector();
transformStyles(tests);
mergeModifiers(tests);
tests.run();
