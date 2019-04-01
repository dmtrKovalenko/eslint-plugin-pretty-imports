import rule from "../../src/rules/sorted";
import ruleTester from "../rule-tester";
import { messages } from "../../src/constants/messages";

ruleTester.run("sorted (no-line-length-sort)", rule, {
  valid: [
    {
      options: ["no-line-length-sort"],
      code: `
import React from 'react'
import { shouldBeAligned } from './super_another_module'
import { named, exported } from './some_module'
import { imports } from './another_module'
`
    }
  ],
  invalid: [
    {
      options: ["no-line-length-sort"],
      code: `
import { named } from './some_module'
import React from 'react' 
import { imports, andAlsoLongImportsThatTakesSpace } from './another_module'
import { shouldBeAligned } from './super_another_module'
`,
      errors: [
        {
          message: messages.NOT_SORTED
        }
      ],
      output: `
import React from 'react'
import { named } from './some_module'
import { imports, andAlsoLongImportsThatTakesSpace } from './another_module'
import { shouldBeAligned } from './super_another_module'
`
    }
  ]
});
