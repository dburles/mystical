/* eslint-disable react/prop-types */
/* eslint-disable jsdoc/check-tag-names */
/** @jsx jsx */
// import assert from 'assert';
// import { fireEvent, render, screen } from '@testing-library/react';
import ReactDOMServer from 'react-dom/server';
import snapshot from 'snapshot-assertion';
import { MysticalProvider, createCache, jsx } from '../lib';
import theme from './lib/theme';
import { snapshotPath } from './lib/utils';

export default (tests) => {
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
