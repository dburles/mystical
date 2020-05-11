'use strict';

const { TestDirector } = require('test-director');
const css = require('./css.js');
const general = require('./general.js');
const shorthandProperties = require('./shorthandProperties.js');

const tests = new TestDirector();

css(tests);
general(tests);
shorthandProperties(tests);

tests.run();
