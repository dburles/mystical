'use strict';

const { Global: EmotionGlobal } = require('@emotion/react');
const PropTypes = require('prop-types');
const React = require('react');
const transformStyles = require('./transformStyles');
const useMystical = require('./useMystical');

const Global = ({ styles: initialStyles }) => {
  const context = useMystical();
  const styles = transformStyles(initialStyles)(context);
  return <EmotionGlobal styles={styles} />;
};

Global.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

module.exports = Global;
