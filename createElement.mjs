import { jsx as emotionJsx } from "@emotion/react";
import wrapCreateElement from "./private/wrapCreateElement.mjs";

const createElement = wrapCreateElement(emotionJsx);

export default createElement;
