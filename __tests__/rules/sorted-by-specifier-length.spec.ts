import ruleTester from "../rule-tester";
import rule from "../../src/rules/sorted";
import { messages } from "../../src/constants/messages";

ruleTester.run("sorted (sort-by-specifiers-length)", rule, {
  valid: [
    {
      options: ["sort-by-specifiers-length"],
      code: `
import * as smth from 'smth'
import React from 'react'
import { imports } from './another_module'
import { shouldBeAligned } from './super_another_module'
import { named, someExportedVal } from './some_module'
`,
    },
  ],
  invalid: [
    {
      options: ["sort-by-specifiers-length"],
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
          message: messages.NOT_SORTED,
        },
      ],
    },
  ],
});
