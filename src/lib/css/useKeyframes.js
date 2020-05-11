'use strict';

const React = require('react');
const MysticalCSSContext = require('./MysticalCSSContext.js');
const isServer = require('./isServer.js');
const murmur2 = require('./murmur2.js');
const transformKeyframes = require('./transformKeyframes.js');
const useLayoutEffect = require('./useLayoutEffect.js');

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
