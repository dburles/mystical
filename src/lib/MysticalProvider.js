'use strict';

const { ThemeProvider } = require('@emotion/react');
const PropTypes = require('prop-types');
const React = require('react');
const Global = require('./Global.js');
const customProperties = require('./customProperties.js');
const isDevelopment = require('./isDevelopment.js');
const isServer = require('./isServer.js');
const useLayoutEffect = require('./useLayoutEffect.js');

const defaultOptions = {
  usePrefersColorScheme: true,
};

const defaultColorMode = () => {
  return (
    (!isServer && window.localStorage.getItem('mystical-color-mode')) ||
    'default'
  );
};

const MysticalProvider = ({
  theme = {},
  options: userOptions = defaultOptions,
  children,
}) => {
  // This is used purely as a means of equality checking
  const stringifiedTheme = JSON.stringify(theme);

  // Signals an intent to change the color mode
  const [colorModeIntent, setColorModeIntent] = React.useState(
    defaultColorMode()
  );

  const [colorMode, setColorModeState] = React.useState(defaultColorMode());
  const setColorMode = React.useCallback(
    (mode) => {
      if (mode !== colorMode) {
        setColorModeIntent(mode);
      }
    },
    [colorMode]
  );

  useLayoutEffect(() => {
    if (colorMode !== colorModeIntent) {
      window.localStorage.setItem('mystical-color-mode', colorModeIntent);
      document.body.setAttribute('data-color-mode', colorModeIntent);
      setColorModeState(colorModeIntent);
    }
  }, [colorMode, colorModeIntent]);

  const options = React.useMemo(() => {
    return {
      ...defaultOptions,
      ...userOptions,
    };
  }, [userOptions]);

  const defaultGlobalStyles = React.useMemo(() => {
    const global = {};

    global['*, *::before,*::after'] = {
      boxSizing: 'border-box',
    };

    return global;
  }, []);

  const providerValue = React.useMemo(() => {
    return {
      theme,
      mystical: {
        colorMode,
        setColorMode,
      },
    };
  }, [colorMode, setColorMode, theme]);

  const prevThemeRef = React.useRef();
  React.useEffect(() => {
    if (prevThemeRef.current && prevThemeRef.current !== stringifiedTheme) {
      if (isDevelopment) {
        console.info(
          'Mystical: theme changed, reloading window...\n' +
            'If this was unexpected, ensure that your theme does not change between renders.'
        );
      }
      window.location.reload();
    }
    prevThemeRef.current = stringifiedTheme;
  }, [stringifiedTheme]);

  useLayoutEffect(() => {
    if (
      options.usePrefersColorScheme &&
      theme.colors?.modes?.dark &&
      // only set mode based on system preferences the first time
      !window.localStorage.getItem('mystical-color-mode')
    ) {
      const colorModeHandler = ({ matches }) => {
        if (matches) {
          setColorModeIntent('dark');
        }
      };

      colorModeHandler(window.matchMedia('(prefers-color-scheme: dark)'));

      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addListener(colorModeHandler);

      return () => {
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .removeListener(colorModeHandler);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { modes, ...colors } = theme.colors;

  return (
    <ThemeProvider theme={providerValue}>
      <Global styles={[defaultGlobalStyles, theme.global]} />
      <Global
        styles={{
          ':root': customProperties(colors, 'colors'),
          '[data-color-mode="default"]': customProperties(colors, 'colors'),
          ...Object.keys(modes).reduce((acc, key) => {
            acc[`[data-color-mode="${key}"]`] = customProperties(
              theme.colors.modes[key],
              'colors'
            );
            return acc;
          }, {}),
        }}
      />
      {children}
    </ThemeProvider>
  );
};

MysticalProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  options: PropTypes.object,
  children: PropTypes.node.isRequired,
};

module.exports = MysticalProvider;
