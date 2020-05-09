import { useEffect, useLayoutEffect as useReactLayoutEffect } from 'react';
import murmur2 from './hash';

export const get = (obj, key, def, p, undef) => {
  const path = key && typeof key === 'string' ? key.split('.') : [key];
  for (p = 0; p < path.length; p++) {
    obj = obj ? obj[path[p]] : undef;
  }
  return obj === undef ? def : obj;
};

export const camelDash = (string) => {
  return string.replace(/([A-Z])/g, (g) => {
    return `-${g[0].toLowerCase()}`;
  });
};

export const isObject = (value) => {
  return typeof value === 'object' && value.constructor === Object;
};

export const isServer = typeof document === 'undefined';

export const validRule = (value) => {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    Array.isArray(value) ||
    // Objects are what we consider to be pseudo selectors
    (value && isObject(value))
  );
};

export const flatMap = (
  array,
  fn = (x) => {
    return x;
  },
  newArray = []
) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    const result = fn(element, i);
    if (Array.isArray(result)) {
      flatMap(result, fn, newArray);
    } else {
      newArray.push(result);
    }
  }
  return newArray;
};

export const hashObject = (object) => {
  return murmur2(JSON.stringify(object));
};

export const isDevelopment = process.env.NODE_ENV === 'development';

export const useLayoutEffect = isServer ? useEffect : useReactLayoutEffect;
