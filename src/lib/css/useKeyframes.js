'use strict';

const React = require('react');
const MysticalCSSContext = require('./MysticalCSSContext.js');
const generateRulePairs = require('./generateRulePairs.js');
const isServer = require('./isServer.js');
const murmur2 = require('./murmur2.js');
const useLayoutEffect = require('./useLayoutEffect.js');

const transformKeyframes = (css, hash) => {
  let keyframes = `@keyframes m${hash} {`;

  Object.keys(css).forEach((key) => {
    const value = css[key];

    keyframes += `${key}{`;

    Object.keys(value).forEach((innerKey) => {
      const rules = generateRulePairs(innerKey, value[innerKey]);
      rules.forEach((rule) => {
        return (keyframes += rule + ';');
      });
    });

    keyframes += `}`;
  });

  keyframes += `}`;

  return keyframes;
};

const useKeyframes = (css) => {
  const { cache } = React.useContext(MysticalCSSContext);
  const json = JSON.stringify(css);
  const hash = React.useMemo(() => {
    return murmur2(json);
  }, [json]);

  const insertKeyframes = () => {
    cache.addKeyframes(hash, transformKeyframes(css, hash));
  };

  if (isServer) {
    insertKeyframes();
  }

  useLayoutEffect(() => {
    insertKeyframes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [json]);

  return 'm' + hash;
};

module.exports = useKeyframes;
