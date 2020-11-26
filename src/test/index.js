'use strict';

const { TestDirector } = require('test-director');
const mergeModifiers = require('../lib/mergeModifiers.test.js');
const transformStyles = require('../lib/transformStyles.test.js');

const tests = new TestDirector();
transformStyles(tests);
mergeModifiers(tests);
tests.run();
