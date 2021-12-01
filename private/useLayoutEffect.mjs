import React from "react";
import isServer from "./isServer.mjs";

const useLayoutEffect = isServer ? React.useEffect : React.useLayoutEffect;

export default useLayoutEffect;
