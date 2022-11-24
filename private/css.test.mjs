import test from "node:test";
import css from "./css.js";
import theme from "../test-utils/theme.mjs";
import assert from "node:assert/strict";

test("css", async (t) => {
  await t.test("colors", () => {
    const styles = css({
      borderColor: "orange.500",
      color: "orange.500",
    })({ theme });

    assert.deepEqual(styles, {
      borderColor: "var(--colors-orange-500)",
      color: "var(--colors-orange-500)",
    });
  });

  await t.test("media query", () => {
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

  await t.test("no breakpoints defined", () => {
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

  await t.test("dark mode", async (tt) => {
    await tt.test("transform", () => {
      const styles = css({
        __dark_mode: {
          color: "red",
        },
      })({});

      assert.deepEqual(styles, {
        "@media (prefers-color-scheme: dark)": {
          color: "red",
        },
      });
    });

    await tt.test("transform with darkModeOff = true", () => {
      const styles = css({
        __dark_mode: {
          color: "red",
        },
      })({ options: { darkModeOff: true } });

      assert.deepEqual(styles, {});
    });

    await tt.test(
      "transform with options.darkModeForcedBoundary = true",
      () => {
        const styles = css({
          __dark_mode: {
            color: "red",
          },
        })({ options: { darkModeForcedBoundary: true } });

        assert.deepEqual(styles, {
          "@media (prefers-color-scheme: dark)": {
            color: "red",
          },
          '[data-color-mode="dark"] &': {
            color: "red",
          },
        });
      }
    );
  });
});
