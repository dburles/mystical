'use strict';

const unsupportedShorthandProperties = new Set([
  'animation',
  'background',
  'border',
  'border-bottom',
  'border-color',
  'border-left',
  'border-right',
  'border-top',
  'column-rule',
  'columns',
  'flex',
  'flex-flow',
  'font',
  'grid',
  'grid-area',
  'grid-column',
  'grid-row',
  'grid-template',
  'list-style',
  'offset',
  'outline',
  'overflow',
  'place-content',
  'place-items',
  'place-self',
  'text-decoration',
  'transition',
]);

module.exports = unsupportedShorthandProperties;
