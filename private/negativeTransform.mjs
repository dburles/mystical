import get from "./get.mjs";
import positiveOrNegative from "./positiveOrNegative.mjs";

export default function negativeTransform(property) {
  return get(
    [
      "margin",
      "marginTop",
      "marginRight",
      "marginBottom",
      "marginLeft",
      "top",
      "bottom",
      "left",
      "right",
    ].reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: positiveOrNegative,
      };
    }, {}),
    property,
    get
  );
}
