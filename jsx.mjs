import { jsx as emotionJsx } from "@emotion/react";
import createJsxFn from "./private/createJsxFn.mjs";

const jsx = createJsxFn(emotionJsx);

export default jsx;
