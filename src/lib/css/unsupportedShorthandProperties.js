'use strict';

const unsupportedShorthandProperties = new Set([
  'animation',
  'background',
  'border',
  'borderBottom',
  'borderColor',
  'borderLeft',
  'borderRight',
  'borderTop',
  'columnRule',
  'columns',
  'flex',
  'flexFlow',
  'font',
  'grid',
  'gridArea',
  'gridColumn',
  'gridRow',
  'gridTemplate',
  'listStyle',
  'offset',
  'outline',
  'overflow',
  'placeContent',
  'placeItems',
  'placeSelf',
  'textDecoration',
  'transition',
]);

module.exports = unsupportedShorthandProperties;
