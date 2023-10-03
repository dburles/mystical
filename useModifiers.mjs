import mergeModifiers from "./private/mergeModifiers.mjs";

function useModifiers(values, modifiers, modifiersOverride = {}) {
  return values ? mergeModifiers(values, modifiers, modifiersOverride) : {};
}

export default useModifiers;
