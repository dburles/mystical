import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  "eslint:recommended",
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "arrow-body-style": ["error", "always"],
      curly: ["error", "all"],
      "func-style": ["error", "declaration"],
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
];
