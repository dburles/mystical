/* eslint-disable react-hooks/rules-of-hooks */
import TestDirector from "test-director/TestDirector.mjs";
import customProperties from "./customProperties.test.mjs";
import mergeModifiers from "./mergeModifiers.test.mjs";
import transformStyles from "./transformStyles.test.mjs";
import useTheme from "./useTheme.test.mjs";

const tests = new TestDirector();
transformStyles(tests);
mergeModifiers(tests);
customProperties(tests);
useTheme(tests);
tests.run();
