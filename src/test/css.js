'use strict';

/* eslint-disable react/prop-types */
/* eslint-disable jsdoc/check-tag-names */
/** @jsx jsx */

const ReactDOMServer = require('react-dom/server');
const snapshot = require('snapshot-assertion');
const Global = require('../lib/css/Global.js');
const MysticalCSSProvider = require('../lib/css/MysticalCSSProvider.js');
const createCache = require('../lib/css/createCache.js');
const jsx = require('../lib/css/jsx.js');
const useKeyframes = require('../lib/css/useKeyframes.js');
const useModifiers = require('../lib/useModifiers.js');
const snapshotPath = require('./lib/snapshotPath.js');

module.exports = (tests) => {
  tests.add('general css test', async () => {
    const cache = createCache();

    const modifiers = {
      default: {
        display: 'flex',
        lineHeight: '1.5',
        ':after': {
          content: '',
        },
      },
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
      return <button {...props} css={modifierStyle} />;
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
              'h1,h2,h3,h4,h5,h6': {
                color: 'red',
              },
            }}
          />
          <Button
            css={{
              // Descendant combinator
              div: {
                margin: 0,
              },
              ':hover, :active': {
                backgroundColor: 'green',
              },
            }}
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
    await snapshot(JSON.stringify(css), snapshotPath('css-primary.json'));
    await snapshot(identifiers, snapshotPath('css-primary-identifiers.txt'));
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
    await snapshot(JSON.stringify(css), snapshotPath('css-falsey-values.json'));
  });

  tests.add('keyframes', async () => {
    const cache = createCache();

    const Component = () => {
      const animationName = useKeyframes({
        '0%': {
          opacity: 0,
        },
        '100%': {
          opacity: 1,
        },
      });
      return <div css={{ animationName }}>A</div>;
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
    await snapshot(JSON.stringify(css), snapshotPath('css-keyframes.json'));
    await snapshot(html, snapshotPath('css-keyframes.html'));
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
    await snapshot(
      JSON.stringify(css),
      snapshotPath('css-style-overrides.json')
    );
  });

  tests.add(
    'style overrides - non responsive values should override responsive values',
    async () => {
      const cache = createCache();

      const Button = (props) => {
        return (
          <button
            {...props}
            css={{ backgroundColor: ['blue', 'orange', 'purple'] }}
          >
            button
          </button>
        );
      };

      const App = () => {
        return (
          <MysticalCSSProvider cache={cache}>
            <Button css={{ backgroundColor: 'red' }}>button</Button>
          </MysticalCSSProvider>
        );
      };

      const html = ReactDOMServer.renderToStaticMarkup(<App />);

      await snapshot(
        html,
        snapshotPath('css-style-overrides-responsive-1.html')
      );
    }
  );

  tests.add(
    'style overrides - responsive values should override responsive values',
    async () => {
      const cache = createCache();

      const Button = (props) => {
        return (
          <button
            {...props}
            css={{ backgroundColor: ['blue', 'orange', 'purple'] }}
          >
            button
          </button>
        );
      };

      const App = () => {
        return (
          <MysticalCSSProvider cache={cache}>
            <Button css={{ backgroundColor: ['red', 'green'] }}>button</Button>
          </MysticalCSSProvider>
        );
      };

      const html = ReactDOMServer.renderToStaticMarkup(<App />);

      await snapshot(
        html,
        snapshotPath('css-style-overrides-responsive-2.html')
      );
    }
  );

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
    await snapshot(JSON.stringify(css), snapshotPath('css-array-merge.json'));
  });
};
