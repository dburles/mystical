import { transformedCSSToClass } from './transform';
import { isDevelopment, isServer } from './utils';

export const createCache = () => {
  const hydrateElement = isServer
    ? undefined
    : document.getElementById('__mystical__');
  const styleElement =
    isServer || isDevelopment ? undefined : document.createElement('style');

  if (styleElement) {
    document.head.appendChild(styleElement);
  }

  const serverRenderedRules =
    !isServer && hydrateElement
      ? hydrateElement.getAttribute('data-identifiers').split(',')
      : [];

  // Key is the identifier, value is the transformedCSS,
  // except for keyframes where the value is undefined.
  const identifiers = {};
  let serverStyles = '';

  const getServerStyles = () => {
    return {
      css: serverStyles,
      identifiers: Object.keys(identifiers),
    };
  };

  const canCommit = (hash) => {
    return identifiers[hash].commit === false;
  };

  const commitRule = (hash, rule) => {
    if (canCommit(hash)) {
      if (isServer) {
        serverStyles += rule;
      } else {
        if (isDevelopment) {
          const atomStyleElement = document.createElement('style');
          document.head.appendChild(atomStyleElement);
          atomStyleElement.innerHTML = rule;
        } else {
          styleElement.sheet.insertRule(
            rule,
            styleElement.sheet.cssRules.length
          );
        }
      }
      identifiers[hash].commit = true;
    }
  };

  const add = (transformedCSS) => {
    const hash = transformedCSS.selector.slice(1);
    if (!identifiers[hash]) {
      identifiers[hash] = transformedCSS;
    }
  };

  const commit = (transformedCSS) => {
    const hash = transformedCSS.selector.slice(1);
    const rule = transformedCSSToClass(transformedCSS);
    commitRule(hash, rule);
  };

  const addKeyframes = (hash, rule) => {
    if (!identifiers[hash]) {
      identifiers[hash] = { commit: false };
    }
    commitRule(hash, rule);
  };

  const addGlobal = (transformedCSS, element) => {
    const rule = transformedCSSToClass(transformedCSS);
    if (isServer) {
      serverStyles += rule;
    } else {
      if (isDevelopment) {
        element.appendChild(document.createTextNode(rule));
      } else {
        element.sheet.insertRule(rule, element.sheet.cssRules.length);
      }
    }
  };

  const hydrate = () => {
    serverRenderedRules.forEach((identifier) => {
      identifiers[identifier].commit = true;
    });
  };

  return {
    add,
    commit,
    addGlobal,
    addKeyframes,
    getServerStyles,
    identifiers,
    hasServerStyles: !!hydrateElement,
    hydrate,
  };
};
