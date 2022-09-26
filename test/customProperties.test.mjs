import assert from "assert";
import customProperties from "../private/customProperties.js";

export default function (tests) {
  tests.add("customProperties: self referencing", async () => {
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
    assert.strictEqual(result["--colors-brand-primary"], colors.emerald["500"]);
  });

  tests.add("customProperties: self referencing (array)", async () => {
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

    assert.strictEqual(
      result["--colors-brand-primary-0"],
      colors.emerald["500"]
    );
    assert.strictEqual(
      result["--colors-brand-primary-1"],
      colors.emerald["100"]
    );
  });
}
