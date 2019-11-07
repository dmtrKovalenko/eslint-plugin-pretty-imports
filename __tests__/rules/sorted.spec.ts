import rule from "../../src/rules/sorted";
import ruleTester from "../rule-tester";
import { messages } from "../../src/constants/messages";

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
import * as smth from 'smth';
import { shouldBeAligned } from './super_another_module'
import 'someFile.scss'

const five = 5`,
      output: `
import 'someFile.scss'
import * as smth from 'smth';
import React from 'react'
import { named } from './some_module'
import { shouldBeAligned } from './super_another_module'
import { imports, andAlsoLongImportsThatTakesSpace } from './another_module'

const five = 5`,
      errors: [
        {
          message: messages.NOT_SORTED
        }
      ]
    }
  ]
});

ruleTester.run("sorted with comments", rule, {
  valid: [
    `
import React from 'react'
import { imports } from './another_module'`
  ],
  invalid: [
    {
      // ensure that comments are moved properly
      code: `
import { /* named, */ Import } from './some_module'
/** leading comment as block */
import React from 'react' // trailing comment

const five = 5`,
      output: `
/** leading comment as block */
import React from 'react' // trailing comment
import { /* named, */ Import } from './some_module'

const five = 5`,
      errors: [
        {
          message: messages.NOT_SORTED
        }
      ]
    }
  ]
});
