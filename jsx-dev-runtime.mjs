import { jsxDEV as emotionJsxDev } from "@emotion/react/jsx-dev-runtime";
import wrapCreateElement from "./private/wrapCreateElement.mjs";

const jsxDEV = wrapCreateElement(emotionJsxDev);

export { jsxDEV };
