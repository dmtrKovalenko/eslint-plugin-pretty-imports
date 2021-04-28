"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../constants/messages");
const eslint_1 = require("../services/eslint");
const imports_1 = require("../services/imports");
const opts = {
  DISABLE_LINE_SORTS: "no-line-length-sort",
  SORT_BY_SPECIFIER: "sort-by-specifiers-length",
};
exports.default = {
  meta: {
    fixable: "code",
  },
  schema: [
    {
      enum: [opts.DISABLE_LINE_SORTS, opts.SORT_BY_SPECIFIER],
    },
  ],
  create: (context) => {
    const sourceCode = context.getSourceCode();
    const sortBySpecifier = context.options.includes(opts.SORT_BY_SPECIFIER);
    const disableLineSorts = context.options.includes(opts.DISABLE_LINE_SORTS);
    const calculateSortIndex = imports_1.createCalculateSortIndex(sourceCode, {
      sortBySpecifier,
      disableLineSorts,
    });
    return {
      Program: (program) => {
        const imports = imports_1.getImportsWithNodesBetween(program);
        if (!imports.length) {
          return;
        }
        const firstNotSorted = imports_1.getFirstNotSorted(
          imports,
          calculateSortIndex
        );
        if (firstNotSorted) {
          const autoFix = (fixer) => {
            const importsStart = imports[0].range[0];
            const importsEnd = eslint_1.getNodeEndPosition(
              sourceCode,
              imports[imports.length - 1]
            );
            const sortedImports = imports.sort(
              (a, b) => calculateSortIndex(a) - calculateSortIndex(b)
            );
            const sortedImportsText = eslint_1.nodesArrayToText(sourceCode)(
              sortedImports,
              // do not add additional \n to the end of imports
              (source, index) =>
                index < sortedImports.length - 1 ? source + "\n" : source
            );
            return fixer.replaceTextRange(
              [importsStart, importsEnd],
              sortedImportsText
            );
          };
          context.report({
            fix: autoFix,
            loc: firstNotSorted.loc,
            message: messages_1.messages.NOT_SORTED,
          });
        }
      },
    };
  },
};
//# sourceMappingURL=sorted.js.map
