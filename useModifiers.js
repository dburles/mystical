import mergeModifiers from "./private/mergeModifiers.js";

function useModifiers(values, modifiers, modifiersOverride = {}) {
  return values ? mergeModifiers(values, modifiers, modifiersOverride) : {};
}

export default useModifiers;
