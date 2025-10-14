import { Global as EmotionGlobal } from "@emotion/react";
import React from "react";
import css from "./private/css.mjs";
import useMystical from "./useMystical.mjs";

// eslint-disable-next-line react/prop-types
function Global({ styles }) {
  const context = useMystical();
  return React.createElement(EmotionGlobal, { styles: css(styles)(context) });
}

export default Global;
