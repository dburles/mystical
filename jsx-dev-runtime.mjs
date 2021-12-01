// eslint-disable-next-line node/file-extension-in-import
import { jsxDEV as emotionJsxDev } from "@emotion/react/jsx-dev-runtime";
import createJsxFn from "./private/createJsxFn.mjs";

export const jsxDEV = createJsxFn(emotionJsxDev);
