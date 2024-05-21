import { jsx as emotionJsx } from "@emotion/react";
import wrapCreateElement from "./private/wrapCreateElement.mjs";

const jsx = wrapCreateElement(emotionJsx);

export default jsx;
