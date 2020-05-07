import { get } from './css';

export const positiveOrNegative = (scale, value) => {
  if (typeof value !== 'number' || value >= 0) {
    return get(scale, value, value);
  }
  const absolute = Math.abs(value);
  const n = get(scale, absolute, absolute);
  if (typeof n === 'string') {
    return '-' + n;
  }
  return Number(n) * -1;
};

export const negativeTransform = (property) => {
  return get(
    [
      'margin',
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
      'top',
      'bottom',
      'left',
      'right',
    ].reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: positiveOrNegative,
      };
    }, {}),
    property,
    get
  );
};
