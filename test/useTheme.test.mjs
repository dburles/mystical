import assert from "assert";
import useTheme from "../useTheme.js";
import { act, create } from "react-test-renderer";
import { createElement } from "react";
import ReactHookTest from "./lib/ReactHookTest.mjs";
import theme from "./lib/theme.mjs";
import MysticalProvider from "../MysticalProvider.js";

export default function (tests) {
  tests.add("useTheme: reads values", async () => {
    const hookResults = [];

    act(() => {
      create(
        createElement(
          MysticalProvider,
          { theme },
          createElement(ReactHookTest, {
            hook() {
              return useTheme("colors", "emerald.500");
            },
            results: hookResults,
          })
        )
      );
    });

    assert.strictEqual(hookResults[0], theme.colors.emerald["500"]);
  });

  tests.add("useTheme: retains values that aren't found", async () => {
    const hookResults = [];

    act(() => {
      create(
        createElement(
          MysticalProvider,
          { theme },
          createElement(ReactHookTest, {
            hook() {
              return useTheme("colors", "emerald.1000");
            },
            results: hookResults,
          })
        )
      );
    });

    assert.strictEqual(hookResults[0], "emerald.1000");
  });

  tests.add("useTheme: self referencing values are transformed", async () => {
    const hookResults = [];

    act(() => {
      create(
        createElement(
          MysticalProvider,
          { theme },
          createElement(ReactHookTest, {
            hook() {
              return useTheme("colors", "brand.primary");
            },
            results: hookResults,
          })
        )
      );
    });

    assert.strictEqual(hookResults[0], theme.colors.emerald["500"]);
  });
}
