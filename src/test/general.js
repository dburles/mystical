/* eslint-disable react/prop-types */
/* eslint-disable jsdoc/check-tag-names */
/** @jsx jsx */
// import assert from 'assert';
// import { fireEvent, render, screen } from '@testing-library/react';
import ReactDOMServer from 'react-dom/server';
import snapshot from 'snapshot-assertion';
import {
  MysticalProvider,
  createCache,
  jsx,
  merge,
  useModifiers,
} from '../lib';
import theme from './lib/theme';
import { snapshotPath } from './lib/utils';

export default (tests) => {
  tests.add("if this breaks, you've probably messed up", async () => {
    const cache = createCache();

    const modifiers = {
      variant: {
        primary: {
          color: 'white',
          backgroundColor: 'blues.600',
          ':hover:not(:disabled)': {
            backgroundColor: 'blues.500',
          },
          ':active:not(:disabled)': {
            backgroundColor: 'blues.700',
          },
        },
      },
      size: {
        small: {
          fontSize: 0,
          lineHeight: 'none',
          padding: '2 3',
        },
        medium: {
          fontSize: 1,
          lineHeight: 'normal',
          padding: '2 4',
        },
        large: {
          fontSize: 2,
          lineHeight: 'normal',
          padding: '3 5',
        },
      },
      shape: {
        square: { borderRadius: 1 },
        rounded: { borderRadius: 2 },
        pill: { borderRadius: 5 },
      },
    };

    const Button = ({
      css,
      variant = 'primary',
      size = 'small',
      shape = 'rounded',
      modifiers: customModifiers,
      ...props
    }) => {
      const modifierStyle = useModifiers(
        { variant, size, shape },
        modifiers,
        customModifiers
      );

      return (
        <button
          {...props}
          css={merge(
            {
              display: 'flex',
              fontFamily: 'serif',
              ':after': {
                content: '',
              },
            },
            modifierStyle,
            css
          )}
        />
      );
    };

    const App = () => {
      return (
        <MysticalProvider theme={theme} cache={cache}>
          <Button
            modifiers={{
              shape: {
                rounded: { borderRadius: 3 },
              },
              size: {
                small: {
                  fontSize: 1,
                },
              },
            }}
          >
            Hello
          </Button>
        </MysticalProvider>
      );
    };

    const html = ReactDOMServer.renderToString(<App />);

    await snapshot(html, snapshotPath('theme.html'));

    const { css, identifiers } = cache.getServerStyles();

    await snapshot(css, snapshotPath('theme.css'));
    await snapshot(
      JSON.stringify(identifiers),
      snapshotPath('theme-identifiers.json')
    );
  });

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
