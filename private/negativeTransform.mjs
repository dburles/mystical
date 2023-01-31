import get from "./get.js";
import positiveOrNegative from "./positiveOrNegative.js";

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
    get
  );
}

export default negativeTransform;
