import { Global as EmotionGlobal } from "@emotion/react";
import PropTypes from "prop-types";
import React from "react";
import css from "./private/css.mjs";
import useMystical from "./useMystical.mjs";

function Global({ styles }) {
  const context = useMystical();
  return React.createElement(EmotionGlobal, { styles: css(styles)(context) });
}

Global.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};

export default Global;
