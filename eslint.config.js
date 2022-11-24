import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  "eslint:recommended",
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
    ignores: ["eslint.config.js"],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    rules: {
      "arrow-body-style": ["error", "always"],
      curly: ["error", "all"],
      "func-style": ["error", "declaration"],
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
];
