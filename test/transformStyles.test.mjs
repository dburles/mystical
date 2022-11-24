import TestDirector from "test-director/TestDirector.mjs";
import transformStyles from "../private/transformStyles.js";
import theme from "./lib/theme.mjs";
import assert from "node:assert/strict";

export default function (tests) {
  tests.add("transformStyles", async () => {
    const tests = new TestDirector();

    tests.add("colors", async () => {
      const styles = transformStyles({
        borderColor: "orange.500",
        color: "orange.500",
      })(theme);

      assert.deepEqual(styles, {
        borderColor: "var(--colors-orange-500)",
        color: "var(--colors-orange-500)",
      });
    });

    tests.add("media query", async () => {
      const styles = transformStyles({
        color: ["orange.500", "blue.500", "red.500", "pink.500"],
      })(theme);

      assert.deepEqual(styles, {
        color: "var(--colors-orange-500)",
        "@media (min-width: 640px)": { color: "var(--colors-blue-500)" },
        "@media (min-width: 768px)": { color: "var(--colors-red-500)" },
        "@media (min-width: 1024px)": { color: "var(--colors-pink-500)" },
      });
    });

    tests.add("no breakpoints defined", async () => {
      // eslint-disable-next-line no-unused-vars
      const { breakpoints, ...themeWithoutBreakpoints } = theme;
      // Becomes a fallback: https://emotion.sh/docs/object-styles#fallbacks
      const styles = transformStyles({
        color: ["orange.500", "blue.500", "red.500", "pink.500"],
      })(themeWithoutBreakpoints);

      assert.deepEqual(styles, {
        color: ["orange.500", "blue.500", "red.500", "pink.500"],
      });
    });

    await tests.run(true);
  });
}
