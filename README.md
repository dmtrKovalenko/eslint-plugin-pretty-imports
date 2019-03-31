# eslint-plugin-pretty-imports

Automatically prettify import statements. No more mixes of default and named imports. Perfectly works in addition to prettier and typescript.

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

## Supported Rules

- Fill in provided rules here
