# eslint-plugin-import-groups

Group imports statements

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-import-groups`:

```
$ npm install eslint-plugin-import-groups --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-import-groups` globally.

## Usage

Add `import-groups` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "import-groups"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "import-groups/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





