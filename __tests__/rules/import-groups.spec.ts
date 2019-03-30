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
    // `
    // import React from 'react'
    // import { named } from './some_module'
    // import { imports } from './another_module'
    // import { shouldBeAligned } from './super_another_module'
    // `,
    `
    import React from 'react'
    import { named, exported } from './some_module'
    import { imports } from './another_module'
    import { shouldBeAligned } from './super_another_module'
    `
  ],

  invalid: [
    {
      code: `
        import { named } from './some_module'
        import React from 'react'
        import { imports } from './another_module'
        import { shouldBeAligned } from './super_another_module'
      `,
      errors: [
        {
          message: "Default and named imports should be grouped"
        }
      ],
      output: `
        import React from 'react'
        import { named } from './some_module'
        import { imports } from './another_module'
        import { shouldBeAligned } from './super_another_module'
      `
    }
  ]
});
