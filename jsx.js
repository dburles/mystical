import { jsx as emotionJsx } from "@emotion/react";
import createJsxFn from "./private/createJsxFn.js";

const jsx = createJsxFn(emotionJsx);

export default jsx;
