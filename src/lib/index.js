import PropTypes from 'prop-types';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useLayoutEffect as useReactLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Global,
  MysticalCSSProvider,
  defaultBreakpoints,
  defaultCache,
  get,
  isDevelopment,
  isServer,
} from './css';
import { createTransformer } from './transform';

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
  disableCascade: true,
  usePrefersColorScheme: true,
};

const useLayoutEffect = isServer ? useEffect : useReactLayoutEffect;

const defaultColorMode = 'default';

const MysticalContext = createContext({});
export const MysticalProvider = ({
  theme: userTheme = defaultTheme,
  options: userOptions = defaultOptions,
  cache: userCache,
  children,
}) => {
  const cache = userCache || defaultCache;
  // Signals an intent to change the color mode
  const [colorModeIntent, setColorModeIntent] = useState(defaultColorMode);

  const [colorMode, setColorModeState] = useState(defaultColorMode);
  const setColorMode = useCallback(
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

  const options = useMemo(() => {
    return {
      ...defaultOptions,
      ...userOptions,
    };
  }, [userOptions]);

  const theme = useMemo(() => {
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

  const providerValue = useMemo(() => {
    return {
      theme,
      mystical: {
        colorMode,
        setColorMode,
        cache,
      },
    };
  }, [cache, colorMode, setColorMode, theme]);

  const prevThemeRef = useRef();
  useEffect(() => {
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

  const cssProviderOptions = useMemo(() => {
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

export const useMystical = () => {
  return useContext(MysticalContext);
};

export const useTheme = (key, value) => {
  const { theme } = useMystical();
  return get(theme[key], value, value);
};

export const useColorMode = () => {
  const { theme, mystical } = useMystical();

  const setColorMode = (mode) => {
    if (
      mode === 'default' ||
      (theme.colors?.modes && theme.colors.modes[mode])
    ) {
      return mystical.setColorMode(mode);
    } else if (isDevelopment) {
      throw new Error(
        `Color mode '${mode}' not found, did you forget to set it in your theme?`
      );
    }
  };

  return [mystical.colorMode, setColorMode];
};

export {
  createCache,
  useModifiers,
  merge,
  jsx,
  useCSS,
  useKeyframes,
  cloneElement,
  Global,
} from './css';
