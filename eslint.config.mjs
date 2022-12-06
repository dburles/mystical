import reactRecommended from "eslint-plugin-react/recommended.js";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  "eslint:recommended",
  reactRecommended,
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    rules: {
      "arrow-body-style": ["error", "always"],
      curly: ["error", "all"],
      "func-style": ["error", "declaration"],
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
];
