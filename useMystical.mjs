import { ThemeContext } from "@emotion/react";
import React from "react";

export default function useMystical() {
  return React.useContext(ThemeContext);
}
