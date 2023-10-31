/* eslint-disable react-hooks/rules-of-hooks */
import assert from "node:assert/strict";
import useTheme from "./useTheme.js";
import { act, create } from "react-test-renderer";
import { createElement } from "react";
import ReactHookTest from "./test-utils/ReactHookTest.mjs";
import theme from "./test-utils/theme.mjs";
import MysticalProvider from "./MysticalProvider.js";
import test from "node:test";

test("useTheme", async (t) => {
  await t.test("reads values", () => {
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

    assert.equal(hookResults[0], theme.colors.emerald["500"]);
  });

  await t.test("retains values that aren't found", () => {
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

    assert.equal(hookResults[0], "emerald.1000");
  });

  await t.test("self referencing values are transformed", () => {
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

    assert.equal(hookResults[0], theme.colors.emerald["500"]);
  });
});
