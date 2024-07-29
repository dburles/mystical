import mergeModifiers from "./private/mergeModifiers.mjs";
import useMystical from "./useMystical.mjs";

function useModifiers(values, modifiers, modifiersOverride = {}) {
  const { theme } = useMystical();
  if (values) {
    return mergeModifiers(
      values,
      modifiers,
      modifiersOverride,
      theme.breakpoints,
    );
  }
  return {};
}

export default useModifiers;
