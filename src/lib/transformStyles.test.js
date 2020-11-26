'use strict';

const snapshot = require('snapshot-assertion');
const snapshotPath = require('../test/lib/snapshotPath.js');
const theme = require('../test/lib/theme');
const transformStyles = require('./transformStyles');

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
