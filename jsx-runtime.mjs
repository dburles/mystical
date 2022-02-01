import runtime from "@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.cjs.js";
import createJsxFn from "./private/createJsxFn.mjs";

// https://github.com/facebook/react/blob/master/packages/react/src/jsx/ReactJSX.js#L16-L19
export const jsx = createJsxFn(runtime.jsx);

export const jsxs = createJsxFn(runtime.jsxs);
