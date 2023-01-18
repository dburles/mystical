import { ThemeContext } from "@emotion/react";
import React from "react";

function useMystical() {
  return React.useContext(ThemeContext);
}

export default useMystical;
