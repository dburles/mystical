import test from "node:test";
import assert from "node:assert/strict";
import customProperties from "./customProperties.js";

test("customProperties", async (t) => {
  await t.test("self referencing", () => {
    const colors = {
      brand: {
        primary: "emerald.500",
      },
      emerald: {
        50: "#ecfdf5",
        100: "#d1fae5",
        200: "#a7f3d0",
        300: "#6ee7b7",
        400: "#34d399",
        500: "#10b981",
        600: "#059669",
        700: "#047857",
        800: "#065f46",
        900: "#064e3b",
      },
    };

    const result = customProperties(colors, "colors");
    assert.equal(result["--colors-brand-primary"], colors.emerald["500"]);
  });

  await t.test("self referencing (array)", () => {
    const colors = {
      brand: {
        primary: ["emerald.500", "emerald.100"],
      },
      emerald: {
        50: "#ecfdf5",
        100: "#d1fae5",
        200: "#a7f3d0",
        300: "#6ee7b7",
        400: "#34d399",
        500: "#10b981",
        600: "#059669",
        700: "#047857",
        800: "#065f46",
        900: "#064e3b",
      },
    };

    const result = customProperties(colors, "colors");

    assert.equal(result["--colors-brand-primary-0"], colors.emerald["500"]);
    assert.equal(result["--colors-brand-primary-1"], colors.emerald["100"]);
  });
});
