const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");

module.exports = [
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
