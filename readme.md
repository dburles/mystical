# 🌌 mystical-alpha

Build robust and maintainable React component libraries and applications with ease.

## Overview

- Mystical is a small (_Todo: size_) runtime CSS-in-JS library, similar to and inspired by [theme-ui](https://theme-ui.com/) but with a more concise API.
- Follows the [System UI theme specification](https://system-ui.com/theme).
- Purpose built and written entirely from scratch (except for vendor prefixing).
- Style with a just a CSS prop, begone `styled`!
- Atomic classes: Rather than serialising entire CSS objects (like emotion, styled-components, etc), instead, property:value pairs become reusable classes. This means that your application styles scale well with [SSR or static site generation](#server-side-rendering), a lot less data will be sent across the wire. Sticking with common theme values especially helps.
- Color scheme support with a `prefers-color-scheme` media query listener which by default will automatically switch based on users system preferences. The [useColorMode](#usecolormode) hook can be used if you wish the ability to switch it manually.
- Array values for media query breakpoints, e.g. `margin: [0, 3]`.
- `useModifiers` hook: A declarative API for handling prop based variations to component styles. It makes it simple to style individual elements within a single component from the outside. See [useModifiers](#usemodifiers).

## Table of Contents

- [Installation](#install)
- [Getting Started](#getting-started)
- [Babel Configuration](#babel-configuration)
- [API](#api)
  - [CSS Prop](#css-prop)
  - [Global](#global)
  - [useKeyframes](#usekeyframes)
  - [useTheme](#usetheme)
  - [useMystical](#usemystical)
  - [useModifiers](#usemodifiers)
  - [useColorMode](#usecolormode)
  - [useCSS](#usecss)
  - [cloneElement](#cloneelement)
  - [createCache](#createcache)
- [Defaults](#defaults)
- [Server Side Rendering](#server-side-rendering)
- [Contributors](#contributors)
- [License](#license)

## Install

`npm i dburles/mystical-alpha#semver:^1.0.0`

## Getting Started

Wrap your app in mystical context using `MysticalProvider`:

```js
import { MysticalProvider } from 'mystical';

// Optional theme object
const theme = {
  // System UI theme values, See: https://system-ui.com/theme
};

// Optional options
const options = {
  // Defaults:
  disableCascade: false, // Disables cascading styles (experimental)
  usePrefersColorScheme: true, // Sets color mode based on system preferences
};

const App = () => {
  return (
    <MysticalProvider theme={theme} options={options}>
      ...
    </MysticalProvider>
  );
};
```

This `Button` component attempts to illustrate some of the important parts of the Mystical API:

1. A [css prop](#css-prop) that transforms CSS property values from the theme, (like [theme-ui](https://theme-ui.com/))
2. The concept of _modifiers_, the combination of a `modifiers` object with a [useModifiers hook](#usemodifiers). This makes prop based variations of components simple and declarative.

```js
/** @jsx jsx **/
import { jsx, useModifiers } from 'mystical';

const modifiers = {
  variant: {
    primary: {
      color: 'white',
      backgroundColor: 'blues.600', // These values are picked up off the theme
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
      padding: '2 3', // Shorthand 1-4 properties such as padding are also translated to spacing values defined in the theme
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
  variant = 'primary',
  size = 'small',
  shape = 'rounded',
  modifiers: customModifiers,
  ...props
}) => {
  const modifierStyle = useModifiers(
    { variant, size, shape },
    modifiers,
    customModifiers // optional
  );

  return (
    <button
      {...props}
      css={[
        // Objects passed within arrays are merged
        {
          color: 'white',
          fontFamily: 'body',
          border: 0,
          ':disabled': {
            opacity: 'disabled',
          },
        },
        modifierStyle,
      ]}
    />
  );
};
```

### Babel Configuration

No explicit babel configuration is required when customising the jsx runtime with [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#customizing-with-the-classic-runtime). Just add the comment below at the beginning of files that use the `css` prop, and don't forget to import `jsx` from `mystical`.

```js
/** @jsx jsx **/
import { jsx } from 'mystical';
```

Alternatively, it's possible to do this automatically by installing [@emotion/babel-plugin-jsx-pragmatic](https://www.npmjs.com/package/@emotion/babel-plugin-jsx-pragmatic) and applying the following Babel configuration:

```json
{
  "plugins": [
    [
      "@emotion/babel-plugin-jsx-pragmatic",
      {
        "module": "mystical",
        "import": "jsx",
        "export": "jsx"
      }
    ],
    [
      "@babel/plugin-transform-react-jsx",
      {
        "pragma": "jsx",
        "pragmaFrag": "React.Fragment"
      }
    ]
  ]
}
```

With this configuration, no imports are required for the `css` prop to function. Also, you'll only need to import from `react`, if you wish to use fragments (`React.Fragment`) or of course any other parts of the React API.

## API

#### CSS Prop

This is the primary method of applying styles to components and elements. Aside from regular styles it supports [nested @ rules](https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule) and [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) but _not_ nesting.

```js
// Example theme:
const theme = {
  colors: {
    primary: '#1282A2',
  },
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
  // etc
};

// `padding` is keyed to the `space` property of the theme and looks up the third index in the array.
// `backgroundColor` is keyed to the `colors` property of the theme.
const Component = () => <div css={{ padding: 3, backgroundColor: 'primary' }}>...</div>;
```

Just like [theme-ui](https://theme-ui.com/), values passed to CSS properties are automatically translated from the theme based on a [lookup map](https://github.com/dburles/mystical-alpha/blob/master/src/lib/tokens.js), and will default to the literal value if there's no match.

Arrays and Object theme values can be retrieved by using dot properties:

```js
const theme = {
  colors: {
    red: ['#fed7d7', '#feb2b2', '#fc8181'],
  },
};

const Component = () => <div css={{ backgroundColor: 'red.2' }}>...</div>;
```

CSS [Shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) that relate to edges of a box are also translated from the theme. Given the following example:

```js
const theme = {
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
};

const Component = () => <div css={{ margin: '3 5' }}>...</div>;
```

...The following styles are generated:

```
.m1gs4698{margin-top:16px}
.mtxvrlm{margin-right:64px}
.mfpafnb{margin-bottom:16px}
.m1g6jlu2{margin-left:64px}
```

#### Global

Global style component that automatically removes its styles when unmounted.

```js
import { Global } from 'mystical';

const App = () => {
  return (
    <div>
      <Global
        styles={{
          body: {
            backgroundColor: 'white',
            border: 0,
          },
        }}
      />
      ...
    </div>
  );
};
```

#### useKeyframes

Generates keyframe styles and a unique identifier.

```js
import { useKeyframes } from 'mystical';

const Component = () => {
  const animation = useKeyframes({
    // ...
  });

  return <div css={{ animation: `${animation} ...` }}>...</div>;
};
```

#### useTheme

A simple way to pick out values from the theme similar to using the css prop.

```js
import { useTheme } from 'mystical';

const purple = useTheme('colors', 'purple');
```

#### useMystical

Provides access to the complete theme object.

```js
import { useMystical } from 'mystical';

const { theme } = useMystical();
```

#### useModifiers

A declarative API for handling prop based variations to component styles. This example demonstates applying modifier styles to a component with multiple elements. See the `Button` component above for another example.

```js
import { useModifiers } from 'mystical';

const modifiers = {
  // `default` is a special key for applying and overwriting default styles across each element (experimental).
  default: {
    title: { fontFamily: 'heading' },
    subtitle: { fontFamily: 'body' },
  },
  size: {
    small: {
      title: { fontSize: 3 },
      subtitle: { fontSize: 0 },
    },
    large: {
      title: { fontSize: 5 },
      subtitle: { fontSize: 2 },
    },
  },
};

const Component = ({ size = 'small', modifiers: customModifiers }) => {
  const modifierStyle = useModifiers(
    { size },
    modifiers,
    customModifiers // Optional secondary modifiers object that will merge with `modifiers`.
  );

  return (
    <div>
      <div css={modifierStyle.title}>{title}</div>
      <div css={modifierStyle.subtitle}>{subtitle}</div>
    </div>
  );
};
```

#### useColorMode

Allows for altering the color mode on the fly.

```js
import { useColorMode } from 'mystical';

const [colorMode, setColorMode] = useColorMode();
```

#### useCSS

Use this if you wish to have access to the generated class names.

```js
import { useCSS } from 'mystical';

const classNames = useCSS({ color: 'purple', margin: 0 });
```

#### cloneElement

Todo

#### createCache

Creates and returns a new `cache` object. Used on the server.

See [Server Side Rendering](#server-side-rendering).

### Defaults

Your theme object will be merged with the following defaults:

```js
const theme = {
  breakpoints: ['640px', '768px', '1024px', '1280px'],
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
```

### Server Side Rendering

Example framework agnostic configuration:

```js
import { createCache } from 'mystical';

const App = ({ cache }) => {
  // Pass the cache into the MysticalProvider:
  return <MysticalProvider cache={cache}>...</MysticalProvider>;
};

// IMPORTANT: Create a new `cache` object per request:
const cache = createCache();

// Retrieve the generated styles and identifiers
//
// getServerStyles returns an object containing two properties:
//
// - `identifiers` – A list of unique hash values to hydrate the client.
// - `css` – The generated styles to insert into the `style` element on the server.
const { identifiers, css } = cache.getServerStyles();

// Add the style tag to your server rendered markup:
const serverHTML = `
  <html>
    <title>Example</title>
    <head>
      <style id="__mystical__" data-identifiers="${identifiers}">{css}</style>
    </head>
    <body>
      ...
    </body>
  </html>
`;
```

Todo: Add nextjs integration example.

### Contributors

- [David Burles](https://github.com/dburles)
- [Alaister Young](https://github.com/alaister)
- [Jayden Seric](https://github.com/jaydenseric)

#### License

MIT
