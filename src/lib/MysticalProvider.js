'use strict';

const PropTypes = require('prop-types');
const React = require('react');
const MysticalContext = require('./MysticalContext.js');
const createTransformer = require('./createTransformer.js');
const Global = require('./css/Global.js');
const MysticalCSSProvider = require('./css/MysticalCSSProvider.js');
const defaultBreakpoints = require('./css/defaultBreakpoints.js');
const defaultCache = require('./css/defaultCache.js');
const isDevelopment = require('./css/isDevelopment.js');
const useLayoutEffect = require('./css/useLayoutEffect.js');

const defaultTheme = {
  global: {},
  breakpoints: defaultBreakpoints,
  space: [
    '0px',
    '4px',
    '8px',
    '16px',
    '32px',
    '64px',
    '128px',
    '256px',
    '512px',
  ],
  fontSizes: [
    '10px',
    '12px',
    '14px',
    '16px',
    '20px',
    '24px',
    '32px',
    '48px',
    '64px',
    '72px',
  ],
};

const defaultOptions = {
  disableCascade: false,
  usePrefersColorScheme: true,
};

const defaultColorMode = 'default';

const MysticalProvider = ({
  theme: userTheme = defaultTheme,
  options: userOptions = defaultOptions,
  cache: userCache,
  children,
}) => {
  const cache = userCache || defaultCache;
  // Signals an intent to change the color mode
  const [colorModeIntent, setColorModeIntent] = React.useState(
    defaultColorMode
  );

  const [colorMode, setColorModeState] = React.useState(defaultColorMode);
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
      setColorModeState(colorModeIntent);
    }
  }, [cache, colorMode, colorModeIntent]);

  const options = React.useMemo(() => {
    return {
      ...defaultOptions,
      ...userOptions,
    };
  }, [userOptions]);

  const theme = React.useMemo(() => {
    const global = {};

    if (options.disableCascade) {
      // it's important to have this first so other global styles are more specific
      global[
        'a,abbr,address,area,article,aside,audio,b,bdi,bdo,blockquote,body,br,button,caption,cite,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,header,hgroup,hr,i,img,input,ins,kbd,label,legend,li,main,map,mark,menu,meter,nav,ol,optgroup,option,output,p,picture,pre,progress,q,rb,rp,rt,rtc,ruby,s,section,select,small,source,span,strong,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,time,tr,track,u,ul,var,video,wbr'
      ] = {
        all: 'initial',
        boxSizing: 'border-box',
      };
    }

    global['*, *::before,*::after'] = {
      boxSizing: 'border-box',
    };

    return {
      ...userTheme,
      global: {
        ...global,
        ...userTheme.global,
      },
    };
  }, [options.disableCascade, userTheme]);

  const providerValue = React.useMemo(() => {
    return {
      theme,
      mystical: {
        colorMode,
        setColorMode,
        cache,
      },
    };
  }, [cache, colorMode, setColorMode, theme]);

  const prevThemeRef = React.useRef();
  React.useEffect(() => {
    if (
      prevThemeRef.current &&
      prevThemeRef.current !== theme &&
      isDevelopment
    ) {
      // Maybe we'll support dynamic theme changes here in future, for now bail out:
      throw new Error('Changing themes dynamically is not supported!');
    }
    prevThemeRef.current = theme;
  }, [theme]);

  useLayoutEffect(() => {
    if (options.usePrefersColorScheme && theme.colors?.modes?.dark) {
      const colorModeHandler = ({ matches }) => {
        if (matches) {
          setColorModeIntent('dark');
        } else {
          setColorModeIntent('default');
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

  const cssProviderOptions = React.useMemo(() => {
    return {
      // Pass locally defined breakpoints through to @mystical/css
      breakpoints: providerValue.theme.breakpoints,
      transformer: createTransformer(providerValue),
    };
  }, [providerValue]);

  return (
    <MysticalCSSProvider options={cssProviderOptions} cache={cache}>
      <MysticalContext.Provider value={providerValue}>
        <Global styles={theme.global} />
        {children}
      </MysticalContext.Provider>
    </MysticalCSSProvider>
  );
};

MysticalProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  options: PropTypes.object,
  cache: PropTypes.object,
  children: PropTypes.node.isRequired,
};

module.exports = MysticalProvider;
