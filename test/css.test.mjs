import TestDirector from "test-director/TestDirector.mjs";
import css from "../private/css.js";
import theme from "./lib/theme.mjs";
import assert from "node:assert/strict";

export default function (tests) {
  tests.add("css", async () => {
    const tests = new TestDirector();

    tests.add("colors", async () => {
      const styles = css({
        borderColor: "orange.500",
        color: "orange.500",
      })({ theme });

      assert.deepEqual(styles, {
        borderColor: "var(--colors-orange-500)",
        color: "var(--colors-orange-500)",
      });
    });

    tests.add("media query", async () => {
      const styles = css({
        color: ["orange.500", "blue.500", "red.500", "pink.500"],
      })({ theme });

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
      const styles = css({
        color: ["orange.500", "blue.500", "red.500", "pink.500"],
      })({ theme: themeWithoutBreakpoints });

      assert.deepEqual(styles, {
        color: ["orange.500", "blue.500", "red.500", "pink.500"],
      });
    });

    await tests.run(true);
  });
}
