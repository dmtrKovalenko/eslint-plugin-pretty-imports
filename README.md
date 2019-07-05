# pretty-imports 

[![npm package](https://img.shields.io/npm/v/eslint-plugin-pretty-imports.svg)](https://www.npmjs.org/package/eslint-plugin-pretty-imports)
[![codecov](https://codecov.io/gh/dmtrKovalenko/eslint-plugin-pretty-imports/branch/master/graph/badge.svg)](https://codecov.io/gh/dmtrKovalenko/eslint-plugin-pretty-imports)
[![CircleCI](https://circleci.com/gh/dmtrKovalenko/eslint-plugin-pretty-imports.svg?style=svg)](https://circleci.com/gh/dmtrKovalenko/eslint-plugin-pretty-imports)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

No more mixes of default and named imports. Automatically prettify and sort your import statements.
> 🌟 Perfectly works in addition to [prettier](https://github.com/prettier/prettier) and [typescript](https://www.typescriptlang.org/). 

## 😨 Before
```js
import * as React from 'react';
import { runKeyHandler } from '../../_shared/hooks/useKeyDown';
import * as PropTypes from 'prop-types';
import DayWrapper from './DayWrapper';
import CalendarHeader from './CalendarHeader';
import { Theme } from '@material-ui/core';

import { IconButtonProps } from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import SlideTransition, { SlideDirection } from './SlideTransition';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { findClosestEnabledDate } from '../../_helpers/date-utils';
// TODO smth
import Day from './Day';
import { withUtils, WithUtilsProps } from '../../_shared/WithUtils';
```

## 😊 After
```js
import * as React from 'react';
import * as PropTypes from 'prop-types';
// TODO smth
import Day from './Day';
import DayWrapper from './DayWrapper';
import CalendarHeader from './CalendarHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import SlideTransition, { SlideDirection } from './SlideTransition';
import { Theme } from '@material-ui/core';
import { runKeyHandler } from '../../_shared/hooks/useKeyDown';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { findClosestEnabledDate } from '../../_helpers/date-utils';
import { withUtils, WithUtilsProps } from '../../_shared/WithUtils';
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

## 🔧 Customization

This plugin provides only 1 rule, that fully takes care of your imports. But you can also customize the behavior thanks to eslint rule options. 

```json
"rules": {
  "pretty-imports/sorted": ["error", "no-line-length-sort"]
}
```

Options allows to **disable** some functionality. Here is a list

- `no-line-length-sort` — disable sorting of same-type imports by line length
