import rule from "../../src/rules/sorted";
import ruleTester from "../rule-tester";
import { messages } from "../../src/constants/messages";

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

ruleTester.run("sorted with leading comment", rule, {
  valid: [
    `// top comment
import React from 'react'
import { something } from 'somewhere'
  
const five = 5`
  ],
  invalid: [
    {
      code: `// top comment
import { something } from 'somewhere'
import React from 'react'

const five = 5`,
      output: `// top comment
import React from 'react'
import { something } from 'somewhere'

const five = 5`,
      errors: [
        {
          message: messages.NOT_SORTED
        }
      ]
    }
  ]
});

ruleTester.run("sorted with leading comment", rule, {
  valid: [
    `/* some inline top comment */
import React from 'react'
import { something } from 'somewhere'
  
const five = 5`
  ],
  invalid: [
    {
      code: `/* some inline top comment */
import { something } from 'somewhere'
import React from 'react'

const five = 5`,
      output: `/* some inline top comment */
import React from 'react'
import { something } from 'somewhere'

const five = 5`,
      errors: [
        {
          message: messages.NOT_SORTED
        }
      ]
    }
  ]
});
