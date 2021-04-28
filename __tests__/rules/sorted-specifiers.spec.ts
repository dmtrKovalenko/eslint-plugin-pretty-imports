import rule from "../../src/rules/sorted-specifiers";
import ruleTester from "../rule-tester";
import { messages } from "../../src/constants/messages";

ruleTester.run("sorted-specifiers", rule, {
  valid: [
    "const five = 5", // should not report errors if no imports in file
    `
import * as smth from 'smth'
import React from 'react'
import { imports } from './another_module'
import { named, exported, largeExported } from './some_module'
import { shouldBeAligned } from './super_another_module'
`,
  ],
  invalid: [
    {
      code: `
import { andAlsoLongImportsThatTakesSpace, imports } from './another_module'
import { shouldBeAligned, smallImport, value } from './super_another_module'

const five = 5`,
      output: `
import { imports, andAlsoLongImportsThatTakesSpace } from './another_module'
import { value, smallImport, shouldBeAligned } from './super_another_module'

const five = 5`,
      errors: [
        { message: messages.NOT_SORTED_SPECIFIERS },
        { message: messages.NOT_SORTED_SPECIFIERS },
      ],
    },
  ],
});
