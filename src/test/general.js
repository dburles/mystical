'use strict';

/* eslint-disable react/prop-types */
/* eslint-disable jsdoc/check-tag-names */
/** @jsx jsx */

const ReactDOMServer = require('react-dom/server');
const snapshot = require('snapshot-assertion');
const MysticalProvider = require('../lib/MysticalProvider.js');
const createCache = require('../lib/css/createCache.js');
const jsx = require('../lib/css/jsx.js');
const snapshotPath = require('./lib/snapshotPath.js');
const theme = require('./lib/theme.js');

module.exports = (tests) => {
  tests.add('hash matches resolved theme values', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalProvider theme={theme} cache={cache}>
          <div css={{ marginLeft: 3 }}>A</div>
          <div css={{ marginLeft: '16px' }}>B</div>
        </MysticalProvider>
      );
    };

    ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();

    // Should generate one atom.
    await snapshot(css, snapshotPath('hash-match.css'));
  });

  tests.add('negative number values', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalProvider theme={theme} cache={cache}>
          <div css={{ marginLeft: -3 }}>A</div>
          <div css={{ marginLeft: -0 }}>B</div>
          <div css={{ marginLeft: -10 }}>not in theme</div>
          <div css={{ top: -5 }}>C</div>
        </MysticalProvider>
      );
    };

    ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();

    await snapshot(css, snapshotPath('negative-numbers.css'));
  });

  tests.add('falsey values, theme', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalProvider theme={theme} cache={cache}>
          <div
            css={{
              // should be ignored
              color: undefined,
              margin: null,
              backgroundColor: false,
              // should skip responsive values
              // eslint-disable-next-line no-sparse-arrays
              width: [0, , 2],
              height: [0, false, undefined, 2],
              ':hover': {
                padding: 3,
                width: [0, false, 2],
                // ignored
                color: false,
                margin: null,
              },
            }}
          >
            A
          </div>
        </MysticalProvider>
      );
    };

    ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();

    await snapshot(css, snapshotPath('falsey-values.css'));
  });
};
