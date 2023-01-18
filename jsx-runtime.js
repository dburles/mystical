import {
  jsx as emotionJsx,
  jsxs as emotionJsxs,
} from "@emotion/react/jsx-runtime";
import createJsxFn from "./private/createJsxFn.js";

// https://github.com/facebook/react/blob/master/packages/react/src/jsx/ReactJSX.js#L16-L19
export const jsx = createJsxFn(emotionJsx);

export const jsxs = createJsxFn(emotionJsxs);
