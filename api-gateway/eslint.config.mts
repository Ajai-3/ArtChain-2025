import ts from "typescript-eslint";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      globals: globals.node,
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": ts.plugin
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      indent: ["error", 2],
      "no-unused-vars": ["warn"],
      "no-console": "off"
    }
  }
];
