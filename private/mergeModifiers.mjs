import get from "./get.mjs";
import merge from "./merge.mjs";

function mergeModifiers(
  values,
  initialModifiers,
  modifiersOverride,
  breakpoints,
) {
  const { default: defaults, ...modifiers } = initialModifiers;

  return merge(
    defaults,
    merge(
      ...Object.keys(values).map((value) => {
        const style = get(modifiers, value);
        if (!style) {
          throw new Error(
            `useModifiers: '${value}' not found in modifiers object!`,
          );
        }
        if (Array.isArray(values[value])) {
          if (breakpoints?.length > 0) {
            let responsiveStyles = {};
            values[value].forEach((value, index) => {
              if (index === 0) {
                responsiveStyles = { ...style[value] };
              } else {
                if (value && breakpoints[index]) {
                  responsiveStyles[
                    `@media (min-width: ${breakpoints[index]})`
                  ] = style[value];
                }
              }
            });
            return responsiveStyles;
          } else {
            throw new Error(
              `useModifiers: '${value}' is an array but no breakpoints are defined!`,
            );
          }
        }
        return style[values[value]];
      }),
    ),
    modifiersOverride,
  );
}

export default mergeModifiers;
