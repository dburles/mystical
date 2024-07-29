import assert from "node:assert/strict";
import mergeModifiers from "./mergeModifiers.mjs";
import test from "node:test";

const modifiers = {
  default: {
    fontFamily: "heading",
  },
  size: {
    small: {
      fontSize: 3,
      letterSpacing: 1,
    },
    large: {
      fontSize: 5,
      letterSpacing: 2,
    },
  },
};

const modifiers2 = {
  default: {
    title: { fontFamily: "heading" },
    subtitle: { fontFamily: "body" },
  },
  size: {
    small: {
      title: { fontSize: 3 },
      subtitle: { fontSize: 0 },
    },
    large: {
      title: { fontSize: 5 },
      subtitle: { fontSize: 2 },
    },
  },
};

test("mergeModifiers", async (t) => {
  await t.test("basic", async () => {
    const modifierStyles = mergeModifiers({ size: "small" }, modifiers);

    assert.equal(Object.keys(modifierStyles).length, 3);
    assert.equal(modifierStyles.fontFamily, "heading");
    assert.equal(modifierStyles.fontSize, 3);
    assert.equal(modifierStyles.letterSpacing, 1);
  });

  await t.test("basic with customModifiers", async () => {
    const modifierStyles = mergeModifiers({ size: "small" }, modifiers, {
      fontSize: 4,
    });

    assert.equal(Object.keys(modifierStyles).length, 3);
    assert.equal(modifierStyles.fontFamily, "heading");
    assert.equal(modifierStyles.fontSize, 4);
    assert.equal(modifierStyles.letterSpacing, 1);
  });

  await t.test("multiple elements", async () => {
    const modifierStyles = mergeModifiers({ size: "small" }, modifiers2);

    assert.equal(Object.keys(modifierStyles).length, 2);
    assert.equal(modifierStyles.title.fontFamily, "heading");
    assert.equal(modifierStyles.subtitle.fontFamily, "body");
    assert.equal(modifierStyles.title.fontSize, 3);
    assert.equal(modifierStyles.subtitle.fontSize, 0);
  });

  await t.test("multiple elements with customModifiers", async () => {
    const modifierStyles = mergeModifiers({ size: "small" }, modifiers2, {
      title: {
        fontSize: 4,
      },
    });

    assert.equal(modifierStyles.title.fontSize, 4);
  });

  await t.test("responsive modifiers", async (tt) => {
    await tt.test("works", async () => {
      const modifierStyles = mergeModifiers(
        { size: ["small", "large"] },
        modifiers,
        {},
        ["640px", "768px", "1024px", "1280px"],
      );

      assert.deepEqual(modifierStyles, {
        fontFamily: "heading",
        fontSize: 3,
        letterSpacing: 1,
        "@media (min-width: 768px)": {
          fontSize: 5,
          letterSpacing: 2,
        },
      });
    });

    await tt.test("skip breakpoints", async () => {
      const modifierStyles = mergeModifiers(
        // eslint-disable-next-line no-sparse-arrays
        { size: ["small", , "large"] },
        modifiers,
        {},
        ["640px", "768px", "1024px", "1280px"],
      );

      assert.deepEqual(modifierStyles, {
        fontFamily: "heading",
        fontSize: 3,
        letterSpacing: 1,
        "@media (min-width: 1024px)": {
          fontSize: 5,
          letterSpacing: 2,
        },
      });
    });

    await tt.test("skip extra breakpoints", async () => {
      const modifierStyles = mergeModifiers(
        // eslint-disable-next-line no-sparse-arrays
        { size: ["small", , , "large"] },
        modifiers,
        {},
        ["640px", "768px", "1024px", "1280px"],
      );

      assert.deepEqual(modifierStyles, {
        fontFamily: "heading",
        fontSize: 3,
        letterSpacing: 1,
        "@media (min-width: 1280px)": {
          fontSize: 5,
          letterSpacing: 2,
        },
      });
    });

    await tt.test("ignore extraneous extra breakpoint values", async () => {
      const modifierStyles = mergeModifiers(
        // eslint-disable-next-line no-sparse-arrays
        { size: ["small", , , , "large"] },
        modifiers,
        {},
        ["640px", "768px", "1024px", "1280px"],
      );

      assert.deepEqual(modifierStyles, {
        fontFamily: "heading",
        fontSize: 3,
        letterSpacing: 1,
      });
    });

    await tt.test("one value", async () => {
      const modifierStyles = mergeModifiers(
        // eslint-disable-next-line no-sparse-arrays
        { size: ["small"] },
        modifiers,
        {},
        ["640px", "768px", "1024px", "1280px"],
      );

      assert.deepEqual(modifierStyles, {
        fontFamily: "heading",
        fontSize: 3,
        letterSpacing: 1,
      });
    });

    await tt.test("throws if no breakpoints defined", async () => {
      assert.throws(
        () => {
          mergeModifiers({ size: ["small", "large"] }, modifiers);
        },
        {
          message:
            "useModifiers: 'size' is an array but no breakpoints are defined!",
        },
      );
    });
  });
});
