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
    },
    large: {
      fontSize: 5,
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

    assert.equal(Object.keys(modifierStyles).length, 2);
    assert.equal(modifierStyles.fontFamily, "heading");
    assert.equal(modifierStyles.fontSize, 3);
  });

  await t.test("basic with customModifiers", async () => {
    const modifierStyles = mergeModifiers({ size: "small" }, modifiers, {
      fontSize: 4,
    });

    assert.equal(Object.keys(modifierStyles).length, 2);
    assert.equal(modifierStyles.fontFamily, "heading");
    assert.equal(modifierStyles.fontSize, 4);
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
});
