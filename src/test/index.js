'use strict';

const { TestDirector } = require('test-director');
const transformStyles = require('../lib/transformStyles.test.js');

const tests = new TestDirector();

transformStyles(tests);

tests.run();
