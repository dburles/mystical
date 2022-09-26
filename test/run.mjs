import TestDirector from "test-director";
import customProperties from "./customProperties.test.mjs";
import mergeModifiers from "./mergeModifiers.test.mjs";
import transformStyles from "./transformStyles.test.mjs";

const tests = new TestDirector();
transformStyles(tests);
mergeModifiers(tests);
customProperties(tests);
tests.run();
