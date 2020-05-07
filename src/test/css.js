/* eslint-disable react/prop-types */
/* eslint-disable jsdoc/check-tag-names */
/** @jsx jsx */
// import assert from 'assert';
// import { fireEvent, render, screen } from '@testing-library/react';
import ReactDOMServer from 'react-dom/server';
import snapshot from 'snapshot-assertion';
import {
  Global,
  MysticalCSSProvider,
  createCache,
  jsx,
  merge,
  useKeyframes,
  useModifiers,
} from '../lib/css';
import { snapshotPath } from './lib/utils';

export default (tests) => {
  tests.add('general css test', async () => {
    const cache = createCache();
    const modifiers = {
      variant: {
        primary: {
          color: 'white',
          backgroundColor: '#3182ce',
          ':hover:not(:disabled)': {
            backgroundColor: '#4299e1',
          },
          ':active:not(:disabled)': {
            backgroundColor: '#2b6cb0',
          },
        },
      },
      size: {
        small: {
          fontSize: '14px',
          padding: '8px 16px',
        },
        medium: {
          fontSize: '12px',
          padding: '8px 32px',
        },
        large: {
          fontSize: '14px',
          padding: '16px 64px',
        },
      },
      shape: {
        square: { borderRadius: '1px' },
        rounded: { borderRadius: '2px' },
        pill: { borderRadius: '99999px' },
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
              lineHeight: '1.5',
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
        <MysticalCSSProvider cache={cache}>
          <Global
            styles={{
              body: {
                backgroundColor: 'white',
                margin: 0,
              },
            }}
          />
          <Button
            modifiers={{
              shape: {
                rounded: { borderRadius: '3px' },
              },
              size: {
                small: {
                  fontSize: '12px',
                },
              },
            }}
          >
            Hello
          </Button>
        </MysticalCSSProvider>
      );
    };

    const html = ReactDOMServer.renderToString(<App />);
    await snapshot(html, snapshotPath('css-primary.html'));
    const { css, identifiers } = cache.getServerStyles();
    await snapshot(css, snapshotPath('css-primary.css'));
    await snapshot(
      JSON.stringify(identifiers),
      snapshotPath('css-primary-identifiers.json')
    );
  });

  tests.add('falsey values', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalCSSProvider cache={cache}>
          <div
            css={{
              // should be ignored
              color: undefined,
              margin: null,
              backgroundColor: false,
              ':hover': {
                padding: '16px',
                // ignored
                color: false,
                margin: null,
              },
            }}
          >
            A
          </div>
        </MysticalCSSProvider>
      );
    };

    ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();
    await snapshot(css, snapshotPath('css-falsey-values.css'));
  });

  tests.add('keyframes', async () => {
    const cache = createCache();

    const Component = () => {
      const animation = useKeyframes({
        '0%': {
          opacity: 0,
        },
        '100%': {
          opacity: 1,
        },
      });
      return <div css={{ animation: `${animation} 1s` }}>A</div>;
    };

    const App = () => {
      return (
        <MysticalCSSProvider cache={cache}>
          <Component />
        </MysticalCSSProvider>
      );
    };

    const html = ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();
    await snapshot(css, snapshotPath('css-keyframes.css'));
    await snapshot(html, snapshotPath('css-keyframes.html'));
  });

  tests.add('media queries', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalCSSProvider cache={cache}>
          <div
            css={{
              '@media (prefers-color-scheme: dark)': {
                backgroundColor: 'purple',
                color: 'white',
              },
            }}
          >
            A
          </div>
        </MysticalCSSProvider>
      );
    };

    const html = ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();
    await snapshot(css, snapshotPath('css-media-queries.css'));
    await snapshot(html, snapshotPath('css-media-queries.html'));
  });

  tests.add('style overrides', async () => {
    const cache = createCache();

    const Button = (props) => {
      return (
        <button
          {...props}
          css={{
            display: 'inline-flex',
            backgroundColor: 'red',
            margin: '10px',
          }}
        >
          Red Button
        </button>
      );
    };

    const App = () => {
      return (
        <MysticalCSSProvider cache={cache}>
          <Button
            css={{
              display: 'flex',
              backgroundColor: 'blue',
            }}
          >
            Blue Button
          </Button>
        </MysticalCSSProvider>
      );
    };

    const html = ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();
    await snapshot(html, snapshotPath('css-style-overrides.html'));
    await snapshot(css, snapshotPath('css-style-overrides.css'));
  });

  tests.add('css array merge', async () => {
    const cache = createCache();

    const App = () => {
      return (
        <MysticalCSSProvider cache={cache}>
          <div
            css={[
              {
                backgroundColor: 'red',
                color: 'white',
                ':hover': {
                  color: 'blue',
                  opacity: 0.5,
                },
              },
              {
                backgroundColor: 'blue',
                ':hover': {
                  opacity: 0.8,
                },
              },
            ]}
          >
            A
          </div>
        </MysticalCSSProvider>
      );
    };

    const html = ReactDOMServer.renderToString(<App />);
    const { css } = cache.getServerStyles();
    await snapshot(html, snapshotPath('css-array-merge.html'));
    await snapshot(css, snapshotPath('css-array-merge.css'));
  });
};
