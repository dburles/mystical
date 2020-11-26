'use strict';

const assert = require('assert');
const mergeModifiers = require('./mergeModifiers.js');

const modifiers = {
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

const customModifiers = {
  title: {
    fontSize: 4,
  },
};

module.exports = (tests) => {
  tests.add('mergeModifiers', async () => {
    const modifierStyles = mergeModifiers({ size: 'small' }, modifiers);

    assert.strictEqual(modifierStyles.title.fontSize, 3);
  });

  tests.add('mergeModifiers: customModifiers', async () => {
    const modifierStyles = mergeModifiers(
      { size: 'small' },
      modifiers,
      customModifiers
    );

    assert.strictEqual(modifierStyles.title.fontSize, 4);
  });
};
