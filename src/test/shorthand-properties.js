/* eslint-disable react/prop-types */
/* eslint-disable jsdoc/check-tag-names */
/** @jsx jsx */
import ReactDOMServer from 'react-dom/server';
import snapshot from 'snapshot-assertion';
import { MysticalProvider, createCache, jsx } from '../lib';
import theme from './lib/theme';
import { snapshotPath } from './lib/utils';

export default (tests) => {
  tests.add('shorthand properties: margin', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalProvider theme={theme} cache={cache}>
          <div css={{ margin: '3' }}>A</div>
          <div css={{ margin: '0 2' }}>B</div>
          <div css={{ margin: '1 2 3' }}>C</div>
          <div css={{ margin: '1 2 3 4' }}>D</div>
          <div css={{ margin: '-1 -2 -3 -4' }}>E</div>
          <div css={{ margin: '1 2 3 4 5' }}>F</div>
          <div css={{ margin: 0 }}>G</div>
          <div css={{ margin: 1 }}>H</div>
          <div css={{ margin: -1 }}>I</div>
          <div css={{ margin: -0 }}>J</div>
          <div css={{ margin: '-1' }}>K</div>
          <div css={{ margin: '-0' }}>L</div>
          <div css={{ margin: '10px' }}>not in theme</div>
        </MysticalProvider>
      );
    };

    ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();

    await snapshot(css, snapshotPath('shorthand-properties-margin.css'));
  });

  tests.add('shorthand properties: padding', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalProvider theme={theme} cache={cache}>
          <div css={{ padding: '3' }}>A</div>
          <div css={{ padding: '0 2' }}>B</div>
          <div css={{ padding: '1 2 3' }}>C</div>
          <div css={{ padding: '1 2 3 4' }}>D</div>
          <div css={{ padding: '1 2 3 4 5' }}>E</div>
          <div css={{ padding: 0 }}>F</div>
          <div css={{ padding: 1 }}>G</div>
          <div css={{ padding: '10px' }}>not in theme</div>
        </MysticalProvider>
      );
    };

    ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();

    await snapshot(css, snapshotPath('shorthand-properties-padding.css'));
  });

  tests.add('shorthand properties: borderWidth', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalProvider theme={theme} cache={cache}>
          <div css={{ borderWidth: '3' }}>A</div>
          <div css={{ borderWidth: '0 2' }}>B</div>
          <div css={{ borderWidth: '1 2 3' }}>C</div>
          <div css={{ borderWidth: '1 2 3 4' }}>D</div>
          <div css={{ borderWidth: '1 2 3 4 5' }}>E</div>
          <div css={{ borderWidth: 0 }}>F</div>
          <div css={{ borderWidth: 1 }}>G</div>
          <div css={{ borderWidth: '10px' }}>not in theme</div>
        </MysticalProvider>
      );
    };

    ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();

    await snapshot(css, snapshotPath('shorthand-properties-border-width.css'));
  });

  tests.add('shorthand properties: borderRadius', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalProvider theme={theme} cache={cache}>
          <div css={{ borderRadius: '3' }}>A</div>
          <div css={{ borderRadius: '0 2' }}>B</div>
          <div css={{ borderRadius: '1 2 3' }}>C</div>
          <div css={{ borderRadius: '1 2 3 4' }}>D</div>
          <div css={{ borderRadius: '1 2 3 4 5' }}>E</div>
          <div css={{ borderRadius: 0 }}>F</div>
          <div css={{ borderRadius: 1 }}>G</div>
          <div css={{ borderRadius: '10px' }}>not in theme</div>
        </MysticalProvider>
      );
    };

    ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();

    await snapshot(css, snapshotPath('shorthand-properties-border-radius.css'));
  });

  tests.add('shorthand properties: borderStyle', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalProvider theme={theme} cache={cache}>
          <div css={{ borderStyle: 'groove' }}>A</div>
          <div css={{ borderStyle: 'groove solid' }}>B</div>
          <div css={{ borderStyle: 'groove solid ridge' }}>C</div>
          <div css={{ borderStyle: 'dashed groove none dotted' }}>D</div>
          <div css={{ borderStyle: 'dashed groove none dotted solid' }}>E</div>
          <div css={{ borderStyle: 'none' }}>F</div>
        </MysticalProvider>
      );
    };

    ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();

    await snapshot(css, snapshotPath('shorthand-properties-border-style.css'));
  });
};
