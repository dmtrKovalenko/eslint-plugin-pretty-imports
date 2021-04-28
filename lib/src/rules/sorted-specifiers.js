"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../constants/messages");
const eslint_1 = require("../services/eslint");
const imports_1 = require("../services/imports");
const opts = {
  DISABLE_LINE_SORTS: "no-line-length-sort",
};
exports.default = {
  meta: {
    fixable: "code",
  },
  schema: [
    {
      enum: [opts.DISABLE_LINE_SORTS],
    },
  ],
  create: (context) => {
    const sourceCode = context.getSourceCode();
    const disableLineSorts = context.options.includes(opts.DISABLE_LINE_SORTS);
    const calculateSpecifierSortIndex = imports_1.createCalculateSpecifierSortIndex(
      sourceCode,
      { disableLineSorts }
    );
    return {
      ImportDeclaration: (node) => {
        const specifiers = node.specifiers;
        const firstNotSorted = imports_1.getFirstNotSorted(
          specifiers,
          calculateSpecifierSortIndex
        );
        if (firstNotSorted) {
          const autoFix = (fixer) => {
            const specifiersStart = specifiers[0].range[0];
            const specifiersEnd = eslint_1.getNodeEndPosition(
              sourceCode,
              specifiers[specifiers.length - 1]
            );
            const sortedSpecifiers = specifiers.sort(
              (a, b) =>
                calculateSpecifierSortIndex(a) - calculateSpecifierSortIndex(b)
            );
            const sortedSpecifiersText = eslint_1.nodesArrayToText(sourceCode)(
              sortedSpecifiers,
              // do not add additional \n to the end of imports
              (source, index) =>
                index < sortedSpecifiers.length - 1 ? source + ", " : source
            );
            return fixer.replaceTextRange(
              [specifiersStart, specifiersEnd],
              sortedSpecifiersText
            );
          };
          context.report({
            fix: autoFix,
            loc: firstNotSorted.loc,
            message: messages_1.messages.NOT_SORTED_SPECIFIERS,
          });
        }
      },
    };
  },
};
//# sourceMappingURL=sorted-specifiers.js.map
