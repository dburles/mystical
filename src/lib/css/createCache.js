'use strict';

const isDevelopment = require('./isDevelopment.js');
const isServer = require('./isServer.js');
const transformedCSSToClass = require('./transformedCSSToClass.js');

const createCache = () => {
  const hydrateElement = isServer
    ? undefined
    : document.getElementById('__mystical__');
  const styleElement =
    isServer || isDevelopment ? undefined : document.createElement('style');

  if (styleElement) {
    document.head.appendChild(styleElement);
  }

  // Key is the identifier, value is the transformedCSS or
  // an object containing only the commit value.
  const identifiers = {};
  let serverStyles = '';

  const hydrate = () => {
    const serverRenderedRules =
      !isServer && hydrateElement
        ? hydrateElement.getAttribute('data-identifiers').split(',')
        : [];

    serverRenderedRules.forEach((identifier) => {
      if (identifier && !identifiers[identifier]) {
        identifiers[identifier] = { commit: true };
      }
    });
  };

  if (hydrateElement) {
    hydrate();
  }

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
    if (isServer) {
      serverStyles += rule;
    } else {
      if (isDevelopment) {
        const atomStyleElement = document.createElement('style');
        document.head.appendChild(atomStyleElement);
        atomStyleElement.innerHTML = rule;
      } else {
        styleElement.sheet.insertRule(rule, styleElement.sheet.cssRules.length);
      }
    }
    identifiers[hash].commit = true;
  };

  const addTransformedCSS = (transformedCSS) => {
    const hash = transformedCSS.selector.slice(1);
    if (!identifiers[hash]) {
      identifiers[hash] = transformedCSS;
    }
  };

  const commitTransformedCSSArray = (transformedCSSArray) => {
    transformedCSSArray.forEach((transformedCSS) => {
      const hash = transformedCSS.selector.slice(1);
      if (canCommit(hash)) {
        const rule = transformedCSSToClass(transformedCSS);
        commitRule(hash, rule);
      }
    });
  };

  const addKeyframes = (hash, rule) => {
    if (!identifiers[hash]) {
      identifiers[hash] = { commit: false };
    }
    if (canCommit(hash)) {
      commitRule(hash, rule);
    }
  };

  const addGlobalTransformedCSSArray = (transformedCSSArray, hash, element) => {
    if (!identifiers[hash]) {
      identifiers[hash] = { commit: false };
    }
    if (canCommit(hash)) {
      transformedCSSArray.forEach((transformedCSS) => {
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
      });
      identifiers[hash].commit = true;
    }
  };

  return {
    addTransformedCSS,
    commitTransformedCSSArray,
    addGlobalTransformedCSSArray,
    addKeyframes,
    getServerStyles,
    identifiers,
  };
};

module.exports = createCache;
