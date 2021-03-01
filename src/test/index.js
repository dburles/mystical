'use strict';

const { TestDirector } = require('test-director');
const mergeModifiers = require('../public/mergeModifiers.test.js');
const transformStyles = require('../public/transformStyles.test.js');

const tests = new TestDirector();
transformStyles(tests);
mergeModifiers(tests);
tests.run();
