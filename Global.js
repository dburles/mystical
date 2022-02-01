"use strict";

const { Global: EmotionGlobal } = require("@emotion/react");
const PropTypes = require("prop-types");
const React = require("react");
const transformStyles = require("./private/transformStyles.js");
const useMystical = require("./useMystical.js");

function Global({ styles: initialStyles }) {
  const context = useMystical();
  const styles = transformStyles(initialStyles)(context);
  return React.createElement(EmotionGlobal, { styles });
}

Global.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

module.exports = Global;
