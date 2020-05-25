'use strict';

const isDevelopment = require('./isDevelopment.js');
const isServer = require('./isServer.js');
const transformedCSSToClass = require('./transformedCSSToClass.js');

const identity = (x) => {
  return x;
};

const createStyleElement = (name) => {
  if (!isServer) {
    const element = document.createElement('style');
    element.setAttribute('data-mystical', name);
    document.head.appendChild(element);
    return element;
  }
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
  const baseStyleElement = createStyleElement('base');
  const atRuleStyleElement = createStyleElement('at-rules');

  let initialised = false;
  let pseudoOrder = [];
  let dynamicElements = {}; // Client only
  let hasCommitInitialRules = false;

  const identifiers = {};
  const serverStyles = {
    base: '',
    atRules: '',
    // Also populated with dynamic styles via the initalize method.
  };

  const hydrate = () => {
    const serverRenderedRules =
      !isServer && hydrateElement
        ? hydrateElement.getAttribute('data-identifiers').split(',')
        : [];

    serverRenderedRules.forEach((identifier) => {
      if (identifier && !identifiers[identifier]) {
        // Denote as server rendered:
        identifiers[identifier] = { hydrated: true };
      }
    });
  };

  if (hydrateElement) {
    hydrate();
  }

  const getServerStyles = () => {
    return {
      css: Object.keys(serverStyles)
        .filter((key) => {
          // Remove unused types
          return !!serverStyles[key];
        })
        .map((key) => {
          return { id: key, rules: serverStyles[key] };
        }),
      identifiers: Object.keys(identifiers).join(','),
    };
  };

  const canCommit = (hash) => {
    return identifiers[hash].commit === false;
  };

  const elementTargets = (
    transformedCSS,
    {
      mediaQuery = identity,
      mediaQueryPseudo = identity,
      pseudo = identity,
      atRules = identity,
      base = identity,
    } = {}
  ) => {
    let psuedoClassSelector;

    if (transformedCSS.pseudo) {
      // Find pseudo class selectors that we need to group
      const matches = /^:+([\w-]+)/.exec(transformedCSS.pseudo);
      const match = matches && matches[1];
      if (match && pseudoOrder.includes(match)) {
        psuedoClassSelector = match;
      }
    }
    if (transformedCSS.breakpoint) {
      if (psuedoClassSelector) {
        return mediaQueryPseudo(
          psuedoClassSelector + '-' + transformedCSS.breakpoint
        );
      }
      return mediaQuery(transformedCSS.breakpoint);
    }
    if (psuedoClassSelector) {
      return pseudo(psuedoClassSelector);
    }
    if (transformedCSS.at) {
      return atRules('atRules');
    }
    return base('base');
  };

  const commitRule = (element, rule) => {
    if (isDevelopment) {
      appendTextNode(element, rule);
    } else {
      try {
        insertRule(element, rule);
      } catch (error) {
        appendTextNode(element, rule);
      }
    }
  };

  const commitTransformedCSS = (transformedCSS) => {
    const rule = transformedCSSToClass(transformedCSS);

    if (isServer) {
      const target = elementTargets(transformedCSS);
      serverStyles[target] += rule;
    } else {
      const dynamicElement = (name) => {
        return dynamicElements[name];
      };

      const element = elementTargets(transformedCSS, {
        mediaQuery: dynamicElement,
        mediaQueryPseudo: dynamicElement,
        pseudo: dynamicElement,
        atRules() {
          return atRuleStyleElement;
        },
        base() {
          return baseStyleElement;
        },
      });

      commitRule(element, rule);
    }
  };

  let transformedCSSPendingCommit = [];

  const commitTransformedCSSRules = () => {
    transformedCSSPendingCommit.forEach(commitTransformedCSS);
    hasCommitInitialRules = true;
    transformedCSSPendingCommit = [];
  };

  const addTransformedCSS = (transformedCSS) => {
    const hash = transformedCSS.selector.slice(1);
    if (!identifiers[hash]) {
      identifiers[hash] = transformedCSS;
    } else if (identifiers[hash].hydrated) {
      // If denoted as hydrated, add to cache but inform the client not to commit to the DOM.
      transformedCSS.commit = true;
      identifiers[hash] = transformedCSS;
    }
  };

  const preCommitTransformedCSSArray = (transformedCSSArray) => {
    transformedCSSArray.forEach((transformedCSS) => {
      const hash = transformedCSS.selector.slice(1);
      if (canCommit(hash)) {
        if (hasCommitInitialRules) {
          commitTransformedCSS(transformedCSS);
        } else {
          transformedCSSPendingCommit.push(transformedCSS);
        }
        identifiers[hash].commit = true;
      }
    });
  };

  const addKeyframes = (hash, rule) => {
    if (!identifiers[hash]) {
      identifiers[hash] = { commit: false };
    }
    if (canCommit(hash)) {
      if (isServer) {
        serverStyles.atRules += rule;
      } else {
        commitRule(atRuleStyleElement, rule);
      }
      identifiers[hash].commit = true;
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

  const initialise = (options) => {
    if (initialised) {
      return;
    }
    // eslint-disable-next-line prefer-destructuring
    pseudoOrder = options.pseudoOrder;

    options.pseudoOrder.forEach((selector) => {
      if (isServer) {
        serverStyles[selector] = '';
      } else {
        dynamicElements[selector] = createStyleElement(selector);
      }
      options.breakpoints.forEach((breakpoint) => {
        const name = selector + '-' + breakpoint;
        if (isServer) {
          serverStyles[name] = '';
        } else {
          dynamicElements[name] = createStyleElement(name);
        }
      });
    });

    options.breakpoints.forEach((breakpoint) => {
      if (isServer) {
        serverStyles[breakpoint] = '';
      } else {
        dynamicElements[breakpoint] = createStyleElement(breakpoint);
      }
    });

    commitTransformedCSSRules();

    initialised = true;
  };

  return {
    addTransformedCSS,
    addGlobalTransformedCSSArray,
    preCommitTransformedCSSArray,
    addKeyframes,
    getServerStyles,
    initialise,
    identifiers,
  };
};

module.exports = createCache;
