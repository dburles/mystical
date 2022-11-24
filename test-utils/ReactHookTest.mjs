/* eslint-disable react/prop-types */
/**
 * React component for testing a React hook.
 *
 * @param {object} props Props.
 * @param {Function} props.hook React hook.
 * @param {Array<any>} props.results Results of each render; the hook return value or error.
 * @returns {null} Null.
 */
export default function ReactHookTest({ hook, results }) {
  let result;

  try {
    result = hook();
  } catch (error) {
    result = error;
  }

  results.push(result);

  return null;
}
