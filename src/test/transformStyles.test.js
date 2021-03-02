'use strict';

const snapshot = require('snapshot-assertion');
const transformStyles = require('../private/transformStyles');
const snapshotPath = require('./lib/snapshotPath');
const theme = require('./lib/theme');

module.exports = (tests) => {
  tests.add('colors', async () => {
    const styles = transformStyles({
      borderColor: 'orange.500',
      color: 'orange.500',
    })({ theme });

    await snapshot(
      JSON.stringify(styles),
      snapshotPath('transformStyles-colors.json')
    );
  });
};
