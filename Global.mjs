import { Global as EmotionGlobal } from "@emotion/react";
import PropTypes from "prop-types";
import React from "react";
import css from "./private/css.js";
import useMystical from "./useMystical.js";

function Global({ styles }) {
  const context = useMystical();
  return React.createElement(EmotionGlobal, { styles: css(styles)(context) });
}

Global.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default Global;
