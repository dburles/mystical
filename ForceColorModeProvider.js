"use strict";

const ForceColorModeContext = require("./private/ForceColorModeContext.js");
const React = require("react");
const PropTypes = require("prop-types");

function ForceColorModeProvider({ mode, children }) {
  return React.createElement(
    ForceColorModeContext.Provider,
    { value: { mode } },
    children
  );
}

ForceColorModeProvider.propTypes = {
  mode: PropTypes.oneOf(["light", "dark"]),
  children: PropTypes.node.isRequired,
};

module.exports = ForceColorModeProvider;
