'use strict';

const assert = require('assert');
const mergeModifiers = require('../private/mergeModifiers');

const modifiers = {
  default: {
    fontFamily: 'heading',
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
    title: { fontFamily: 'heading' },
    subtitle: { fontFamily: 'body' },
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

module.exports = (tests) => {
  tests.add('mergeModifiers: basic', async () => {
    const modifierStyles = mergeModifiers({ size: 'small' }, modifiers);

    assert.strictEqual(Object.keys(modifierStyles).length, 2);
    assert.strictEqual(modifierStyles.fontFamily, 'heading');
    assert.strictEqual(modifierStyles.fontSize, 3);
  });

  tests.add('mergeModifiers: basic with customModifiers,', async () => {
    const modifierStyles = mergeModifiers({ size: 'small' }, modifiers, {
      fontSize: 4,
    });

    assert.strictEqual(Object.keys(modifierStyles).length, 2);
    assert.strictEqual(modifierStyles.fontFamily, 'heading');
    assert.strictEqual(modifierStyles.fontSize, 4);
  });

  tests.add('mergeModifiers: multiple elements', async () => {
    const modifierStyles = mergeModifiers({ size: 'small' }, modifiers2);

    assert.strictEqual(Object.keys(modifierStyles).length, 2);
    assert.strictEqual(modifierStyles.title.fontFamily, 'heading');
    assert.strictEqual(modifierStyles.subtitle.fontFamily, 'body');
    assert.strictEqual(modifierStyles.title.fontSize, 3);
    assert.strictEqual(modifierStyles.subtitle.fontSize, 0);
  });

  tests.add(
    'mergeModifiers: multiple elements with customModifiers,',
    async () => {
      const modifierStyles = mergeModifiers({ size: 'small' }, modifiers2, {
        title: {
          fontSize: 4,
        },
      });

      assert.strictEqual(modifierStyles.title.fontSize, 4);
    }
  );
};
