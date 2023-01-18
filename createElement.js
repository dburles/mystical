import { jsx as emotionJsx } from "@emotion/react";
import wrapCreateElement from "./private/wrapCreateElement.js";

const createElement = wrapCreateElement(emotionJsx);

export default createElement;
