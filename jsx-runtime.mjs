import {
  jsx as emotionJsx,
  jsxs as emotionJsxs,
  // eslint-disable-next-line node/file-extension-in-import
} from "@emotion/react/jsx-runtime";
import createJsxFn from "./private/createJsxFn.mjs";

// https://github.com/facebook/react/blob/master/packages/react/src/jsx/ReactJSX.js#L16-L19
export const jsx = createJsxFn(emotionJsx);

export const jsxs = createJsxFn(emotionJsxs);
