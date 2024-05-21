import get from "./get.mjs";
import positiveOrNegative from "./positiveOrNegative.mjs";

function negativeTransform(property) {
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
    get,
  );
}

export default negativeTransform;
