'use strict';

const isDevelopment = require('./isDevelopment.js');
const isServer = require('./isServer.js');
const transformedCSSToClass = require('./transformedCSSToClass.js');

const createStyleElement = () => {
  return isServer ? undefined : document.createElement('style');
};

const appendTextNode = (element, rule) => {
  element.appendChild(document.createTextNode(rule));
};

const insertRule = (element, rule) => {
  element.sheet.insertRule(rule, element.sheet.cssRules.length);
};

const createCache = () => {
  const hydrateElement = isServer
    ? undefined
    : document.getElementById('__mystical__');
  const baseStyleElement = createStyleElement();
  const atRuleStyleElement = createStyleElement();

  if (baseStyleElement && atRuleStyleElement) {
    document.head.appendChild(baseStyleElement);
    // We insert this *after* the base styles to avoid specificity issues.
    document.head.appendChild(atRuleStyleElement);
  }

  // Key is the identifier, value is the transformedCSS or
  // an object containing only the commit value.
  const identifiers = {};
  const serverStyles = {
    base: '',
    atRules: '',
  };

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
      css: Object.keys(serverStyles).map((key) => {
        return { id: key, rules: serverStyles[key] };
      }),
      identifiers: Object.keys(identifiers).join(','),
    };
  };

  const canCommit = (hash) => {
    return identifiers[hash].commit === false;
  };

  const commitRule = (hash, rule, isAtRule) => {
    if (isServer) {
      serverStyles[isAtRule ? 'atRules' : 'base'] += rule;
    } else {
      const element = isAtRule ? atRuleStyleElement : baseStyleElement;

      if (isDevelopment) {
        appendTextNode(element, rule);
      } else {
        try {
          insertRule(element, rule);
        } catch (error) {
          appendTextNode(element, rule);
        }
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
        commitRule(hash, rule, transformedCSS.at || transformedCSS.breakpoint);
      }
    });
  };

  const addKeyframes = (hash, rule) => {
    if (!identifiers[hash]) {
      identifiers[hash] = { commit: false };
    }
    if (canCommit(hash)) {
      commitRule(hash, rule, true);
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
          serverStyles.base += rule;
        } else {
          if (isDevelopment) {
            appendTextNode(element, rule);
          } else {
            try {
              insertRule(element, rule);
            } catch (error) {
              appendTextNode(element, rule);
            }
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
