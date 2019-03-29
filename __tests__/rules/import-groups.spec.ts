import { RuleTester } from "eslint";
import rule from "../../src/rules/import-groups";

// @ts-ignore
RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module"
  }
});

var ruleTester = new RuleTester();
ruleTester.run("import-groups", rule, {
  valid: [
    `
    import React from 'react'
    import { named } from './some_module'
    import { imports } from './another_module'
    import { shouldBeAligned } from './super_another_module'
    `
  ],

  invalid: [
    // {
    //     code: "import _ from 'lodash';",
    //     errors: [{
    //       message: 'Prefer importing single functions over a full FP library',
    //       type: 'ImportDeclaration'
    //     }]
    // }
  ]
});
