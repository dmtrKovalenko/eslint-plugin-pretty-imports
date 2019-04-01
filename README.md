# pretty-imports 

No more mixes of default and named imports. Automatically prettify and sort your import statements.

![Demo](https://github.com/dmtrKovalenko/eslint-plugin-pretty-imports/blob/master/demo.gif?raw=true)

🌟 Perfectly works in addition to [prettier](https://github.com/prettier/prettier) and [typescript](https://www.typescriptlang.org/). 

## Installation

```
npm install eslint-plugin-pretty-imports --save-dev

yarn add --dev eslint-plugin-pretty-imports
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-pretty-imports` globally.

## Usage

Add `pretty-imports` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["pretty-imports"],
  "rules": {
    "pretty-imports/sorted": 2
  }
}
```

## Customization

This plugin provides only 1 rule, that fully takes care of your imports. But you can also customize the behavior thanks to eslint rule options. 

```json
"rules": {
  "pretty-imports/sorted": ["error", "no-line-length-sort"]
}
```

Options allows to **disable** some functionality. Here is a list

- `no-line-length-sort` — disable sorting of same-type imports by line length
