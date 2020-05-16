'use strict';

const { prefix } = require('inline-style-prefixer');
const flatMap = require('./flatMap.js');
const formatRule = require('./formatRule.js');

const generateRulePairs = (key, value) => {
  const output = prefix({ [key]: value });

  const result = flatMap(
    Object.keys(output).map((outputKey) => {
      const outputValue = output[outputKey];
      if (Array.isArray(outputValue)) {
        return outputValue.map((outputArrayValue) => {
          return formatRule(outputKey, outputArrayValue);
        });
      }

      return formatRule(outputKey, outputValue);
    })
  );

  return result;
};

exports.generateRulePairs = generateRulePairs;
