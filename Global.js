"use strict";

const { Global: EmotionGlobal } = require("@emotion/react");
const PropTypes = require("prop-types");
const React = require("react");
const css = require("./private/css.js");
const ForceColorModeContext = require("./private/ForceColorModeContext.js");
const useMystical = require("./useMystical.js");

function Global({ styles }) {
  const context = useMystical();
  const forceColorModeContext = React.useContext(ForceColorModeContext);
  return React.createElement(EmotionGlobal, {
    styles: css(styles, forceColorModeContext)(context),
  });
}

Global.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

module.exports = Global;
