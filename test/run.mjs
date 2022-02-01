import TestDirector from "test-director";
import mergeModifiers from "./mergeModifiers.test.mjs";
import transformStyles from "./transformStyles.test.mjs";

const tests = new TestDirector();
transformStyles(tests);
mergeModifiers(tests);
tests.run();
