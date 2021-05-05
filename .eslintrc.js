module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
  ],
  plugins: ["pretty-imports", "@typescript-eslint"],
  rules: {
    "pretty-imports/sorted": "warn", // ❤️
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-use-before-define": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
  },
};
