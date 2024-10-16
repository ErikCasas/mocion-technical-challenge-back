import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["schemaTypes.ts"], 
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/unbound-method": "off",
      "arrow-parens": [2, "always"],
      "default-case": "off",
      "no-undef": "error",
      "no-console": "error",
      "import/extensions": "off",
      "import/no-unresolved": "off",
      "import/order": "off",
      "import/prefer-default-export": "off",
      "import/no-extraneous-dependencies": "off",
      "no-nested-ternary": "off",
      "no-restricted-globals": "off",
      "no-underscore-dangle": "off",
      "object-literal-sort-keys": "off",
      "quote-props": "off",
      quotemark: "off",
      "import/no-default-export": "off",
      semi: "off",
      "security/detect-object-injection": "off",
    },
  },
];
