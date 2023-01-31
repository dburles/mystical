import get from "./get.js";
import merge from "./merge.js";

function mergeModifiers(values, initialModifiers, modifiersOverride) {
  const { default: defaults, ...modifiers } = initialModifiers;

  return merge(
    defaults,
    merge(
      ...Object.keys(values).map((value) => {
        const style = get(modifiers, value);
        if (!style) {
          throw new Error(
            `useModifiers: '${value}' not found in modifiers object!`
          );
        }
        return style[values[value]];
      })
    ),
    modifiersOverride
  );
}

export default mergeModifiers;
