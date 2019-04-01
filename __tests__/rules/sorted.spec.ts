import rule from "../../src/rules/sorted";
import ruleTester from "../rule-tester";

ruleTester.run("sorted", rule, {
  valid: [
    "const five = 5", // should not report errors if no imports in file
    `
import * as smth from 'smth'
import React from 'react'
import { imports } from './another_module'
import { named, exported } from './some_module'
import { shouldBeAligned } from './super_another_module'
`
  ],
  invalid: [
    {
      code: `
import { named } from './some_module'
import React from 'react'
import { imports, andAlsoLongImportsThatTakesSpace } from './another_module'
import * as smth from 'smth'
import { shouldBeAligned } from './super_another_module'

const five = 5`,
      errors: [
        {
          message: "Default and named imports should be grouped"
        }
      ],
      output: `
import * as smth from 'smth'
import React from 'react'
import { named } from './some_module'
import { shouldBeAligned } from './super_another_module'
import { imports, andAlsoLongImportsThatTakesSpace } from './another_module'

const five = 5`
    }
  ]
});
