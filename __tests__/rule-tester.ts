import { RuleTester } from "eslint";

// @ts-ignore
RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  }
});

export default new RuleTester();
