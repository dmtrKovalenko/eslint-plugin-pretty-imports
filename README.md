# pretty-imports

> Opinionated Imports Sorter

[![npm package](https://img.shields.io/npm/v/eslint-plugin-pretty-imports.svg)](https://www.npmjs.org/package/eslint-plugin-pretty-imports)
[![codecov](https://codecov.io/gh/dmtrKovalenko/eslint-plugin-pretty-imports/branch/master/graph/badge.svg)](https://codecov.io/gh/dmtrKovalenko/eslint-plugin-pretty-imports)
[![CircleCI](https://circleci.com/gh/dmtrKovalenko/eslint-plugin-pretty-imports.svg?style=svg)](https://circleci.com/gh/dmtrKovalenko/eslint-plugin-pretty-imports)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

No more mixes of default and named imports. Automatically prettify and sort your import statements.

> 🌟 Perfectly works in addition to [prettier](https://github.com/prettier/prettier) and [typescript](https://www.typescriptlang.org/).

## 😨 Before

```js
import * as React from "react";
import { runKeyHandler } from "../../_shared/hooks/useKeyDown";
import * as PropTypes from "prop-types";
import DayWrapper from "./DayWrapper";
import CalendarHeader from "./CalendarHeader";
import { Theme } from "@material-ui/core";

import { IconButtonProps } from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import SlideTransition, { SlideDirection } from "./SlideTransition";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { findClosestEnabledDate } from "../../_helpers/date-utils";
// TODO smth
import Day from "./Day";
import { withUtils, WithUtilsProps } from "../../_shared/WithUtils";
```

## 😊 After

```js
import * as React from "react";
import * as PropTypes from "prop-types";
// TODO smth
import Day from "./Day";
import DayWrapper from "./DayWrapper";
import CalendarHeader from "./CalendarHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import SlideTransition, { SlideDirection } from "./SlideTransition";
import { Theme } from "@material-ui/core";
import { runKeyHandler } from "../../_shared/hooks/useKeyDown";
import { IconButtonProps } from "@material-ui/core/IconButton";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import { findClosestEnabledDate } from "../../_helpers/date-utils";
import { withUtils, WithUtilsProps } from "../../_shared/WithUtils";
```

## 💿 Installation

```
npm install eslint-plugin-pretty-imports --save-dev

yarn add --dev eslint-plugin-pretty-imports
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-pretty-imports` globally.

## 🌚 Usage

Add `pretty-imports` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["pretty-imports"],
  "rules": {
    "pretty-imports/sorted": "warn"
  }
}
```

## 🦆 Sorting

A little about the sorting logic. This package takes the import type as a first parameter to sort. We sort import groups in the following order:

1.  `import 'anyfile'`
2.  `import * as anything from 'anywhere'`
3.  `import default from 'anywhere'`
4.  `import { anything } from 'anywhere`

And then we are sorting imports **by line length** inside each group. It needs only to improve the visual readability of the imports section. This behavior can be disabled by `"no-line-length-sort"` rule option.

## 🔧 Customization

This plugin provides only 1 rule, that fully takes care of your imports. But you can also customize the behavior thanks to eslint rule options.

```json
"rules": {
  "pretty-imports/sorted": "warn" // or ["warn", ...options (see below)]
}
```

Here is a list of available options

- `sort-by-specifiers-length` – sorts imports not by line length, but firstly by import specifier length

  Example

  ```js
  import { one } from "someLongImport.tsx"; // so this imports comes before
  import { longSpecifier } from "b.js";
  import { longSpecifier } from "longImport.js";
  ```

- `no-line-length-sort` — disable sorting of same-type imports by line length

  Example

  ```js
  import * as React from "react";
  // imports of one category won't be sorted inside by line length
  import { longSpecifier } from "longImport.js";
  import { longSpecifier } from "b.js";
  ```
