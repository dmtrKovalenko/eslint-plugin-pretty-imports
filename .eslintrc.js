module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint"
  ],
  plugins: ["pretty-imports", "@typescript-eslint"],
  rules: {
    "pretty-imports/sorted": "warn", // ❤️
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-use-before-define": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        argsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }
    ]
  }
};
