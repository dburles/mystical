import get from "./private/get.mjs";
import useMystical from "./useMystical.mjs";

export default function useTheme(key, value) {
  const { theme } = useMystical();
  return get(theme[key], value, value);
}
