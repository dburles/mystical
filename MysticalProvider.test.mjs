/* eslint-disable react-hooks/rules-of-hooks */
import assert from "node:assert/strict";
import { act, create } from "react-test-renderer";
import MysticalProvider from "./MysticalProvider.mjs";
import test from "node:test";
import createElement from "./createElement.mjs";

test("MysticalProvider", async (t) => {
  await t.test("theme object is optional", () => {
    let testRenderer;
    act(() => {
      testRenderer = create(
        createElement(
          MysticalProvider,
          {
            theme: () => {
              return {};
            },
          },
          createElement(
            "div",
            {
              css: { color: "red" },
            },
            "Red text",
          ),
        ),
      );
    });

    assert.ok(testRenderer);
    const json = testRenderer.toJSON();
    assert.equal(json[2].props.className, "css-tokvmb");
  });
});
