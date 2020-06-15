'use strict';

const { keyframes } = require('@emotion/react');
const { useMemo } = require('react');

const useKeyframes = (styles) => {
  const stringifiedStyles = JSON.stringify(styles);
  const animation = useMemo(() => {
    return keyframes(styles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedStyles]);

  return animation;
};

module.exports = useKeyframes;
