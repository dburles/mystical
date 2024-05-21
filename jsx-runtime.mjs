import {
  jsx as emotionJsx,
  jsxs as emotionJsxs,
} from "@emotion/react/jsx-runtime";
import wrapCreateElement from "./private/wrapCreateElement.mjs";

const jsx = wrapCreateElement(emotionJsx);
const jsxs = wrapCreateElement(emotionJsxs);

// https://github.com/facebook/react/blob/master/packages/react/src/jsx/ReactJSX.js#L16-L19
export { jsx, jsxs };
