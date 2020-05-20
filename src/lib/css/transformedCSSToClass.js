'use strict';

const transformedCSSToClass = ({ selector, rules, pseudo, breakpoint, at }) => {
  let fullSelector = selector;

  if (pseudo) {
    fullSelector = `${selector}${pseudo.startsWith(':') ? '' : ' '}${pseudo}`;
  }

  const selectorRule = `${fullSelector}{${rules.join(';')}}`;

  if (breakpoint) {
    return `@media(min-width:${breakpoint}){${selectorRule}}`;
  }

  if (at) {
    return `${at}{${selectorRule}}`;
  }

  return selectorRule;
};

module.exports = transformedCSSToClass;
