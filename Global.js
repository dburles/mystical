"use strict";

const { Global: EmotionGlobal } = require("@emotion/react");
const PropTypes = require("prop-types");
const React = require("react");
const css = require("./private/css.js");
const useMystical = require("./useMystical.js");

function Global({ styles }) {
  const context = useMystical();
  return React.createElement(EmotionGlobal, { styles: css(styles)(context) });
}

Global.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

module.exports = Global;
