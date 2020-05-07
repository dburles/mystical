import { TestDirector } from 'test-director';
import css from './css';
import general from './general';
import shorthandProperties from './shorthand-properties';

const tests = new TestDirector();

css(tests);
general(tests);
shorthandProperties(tests);

tests.run();
