/* eslint-disable react-hooks/rules-of-hooks */
import assert from "node:assert/strict";
import MysticalProvider from "./MysticalProvider.mjs";
import test from "node:test";
import createElement from "./createElement.mjs";
import { render } from "@testing-library/react";
import "global-jsdom/register";

test("MysticalProvider", async (t) => {
  await t.test("theme object is optional", () => {
    const { getByText } = render(
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
          "Red text"
        )
      )
    );

    const element = getByText("Red text");

    assert.equal(element.className, "css-tokvmb");
  });
});
