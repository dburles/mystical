import { Global as EmotionGlobal } from "@emotion/react";
import PropTypes from "prop-types";
import React from "react";
import transformStyles from "./private/transformStyles.mjs";
import useMystical from "./useMystical.mjs";

export default function Global({ styles: initialStyles }) {
  const context = useMystical();
  const styles = transformStyles(initialStyles)(context);
  return React.createElement(EmotionGlobal, { styles });
}

Global.propTypes = {
  styles: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
};
