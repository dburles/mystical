"use strict";

const { ThemeProvider } = require("@emotion/react");
const PropTypes = require("prop-types");
const React = require("react");
const Global = require("./Global.js");
const customProperties = require("./private/customProperties.js");
const isDevelopment = require("./private/isDevelopment.js");
const isServer = require("./private/isServer.js");
const useLayoutEffect = require("./private/useLayoutEffect.js");

const defaultOptions = {
  usePrefersColorScheme: true,
};

function defaultColorMode() {
  try {
    return (
      (!isServer && window.localStorage.getItem("mystical-color-mode")) ||
      "default"
    );
  } catch (error) {
    return "default";
  }
}

function MysticalProvider({
  theme = {},
  options: userOptions = defaultOptions,
  children,
}) {
  // This is used purely as a means of equality checking
  const stringifiedTheme = JSON.stringify(theme);

  // Signals an intent to change the color mode
  const [colorModeIntent, setColorModeIntent] =
    React.useState(defaultColorMode);

  const [colorMode, setColorModeState] = React.useState(defaultColorMode);
  const setColorMode = React.useCallback(
    (mode) => {
      if (mode !== colorMode) {
        setColorModeIntent(mode);
        try {
          window.localStorage.setItem("mystical-color-mode", mode);
        } catch (error) {
          // do nothing
        }
      }
    },
    [colorMode]
  );

  useLayoutEffect(() => {
    if (colorMode !== colorModeIntent) {
      document.body.setAttribute("data-color-mode", colorModeIntent);
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

    global["*, *::before,*::after"] = {
      boxSizing: "border-box",
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
          "Mystical: theme changed, reloading window...\n" +
            "If this was unexpected, ensure that your theme does not change between renders."
        );
      }
      window.location.reload();
    }
    prevThemeRef.current = stringifiedTheme;
  }, [stringifiedTheme]);

  useLayoutEffect(() => {
    let hasSetColorMode = false;
    try {
      hasSetColorMode = Boolean(
        window.localStorage.getItem("mystical-color-mode")
      );
    } catch (error) {
      // do nothing
    }

    function colorModeHandler({ matches }) {
      setColorModeIntent(matches ? "dark" : "default");
    }

    if (
      options.usePrefersColorScheme &&
      // useColorMode sets localStorage 'mystical-color-mode' which overrides system preferences.
      !hasSetColorMode
    ) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");

      colorModeHandler(mq);

      mq.addEventListener("change", colorModeHandler);

      return () => {
        mq.removeEventListener("change", colorModeHandler);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.createElement(
    ThemeProvider,
    { theme: providerValue },
    React.createElement(Global, {
      styles: {
        ":root": customProperties(theme.colors, "colors"),
      },
    }),
    React.createElement(Global, {
      styles: [defaultGlobalStyles, theme.global],
    }),
    children
  );
}

MysticalProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  options: PropTypes.object,
  children: PropTypes.node.isRequired,
};

module.exports = MysticalProvider;
