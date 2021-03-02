'use strict';

const { TestDirector } = require('test-director');
const mergeModifiers = require('./mergeModifiers.test');
const transformStyles = require('./transformStyles.test');

const tests = new TestDirector();
transformStyles(tests);
mergeModifiers(tests);
tests.run();
