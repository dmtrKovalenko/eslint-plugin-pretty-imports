import { Rule } from "eslint";
import { ImportDeclaration } from "estree";
import { messages } from "../constants/messages";
import { nodesArrayToText, getNodeEndPosition } from "../services/eslint";
import {
  getFirstNotSorted,
  createCalculateSpecifierSortIndex,
} from "../services/imports";

const opts = {
  DISABLE_LINE_SORTS: "no-line-length-sort",
};

export default {
  meta: {
    fixable: "code",
  },
  schema: [
    {
      enum: [opts.DISABLE_LINE_SORTS],
    },
  ],
  create: (context: Rule.RuleContext) => {
    const sourceCode = context.getSourceCode();

    const disableLineSorts = context.options.includes(opts.DISABLE_LINE_SORTS);

    const calculateSpecifierSortIndex = createCalculateSpecifierSortIndex(
      sourceCode,
      { disableLineSorts }
    );

    return {
      ImportDeclaration: (node: ImportDeclaration) => {
        const specifiers = node.specifiers;
        const firstNotSorted = getFirstNotSorted(
          specifiers,
          calculateSpecifierSortIndex
        );

        if (firstNotSorted) {
          const autoFix = (fixer: Rule.RuleFixer) => {
            /* istanbul ignore next */
            const specifiersStart = specifiers[0].range?.[0] ?? 0;
            const specifiersEnd = getNodeEndPosition(
              sourceCode,
              specifiers[specifiers.length - 1]
            );

            const sortedSpecifiers = specifiers.sort(
              (a, b) =>
                calculateSpecifierSortIndex(a) - calculateSpecifierSortIndex(b)
            );

            const sortedSpecifiersText = nodesArrayToText(sourceCode)(
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
            loc: firstNotSorted.loc!,
            message: messages.NOT_SORTED_SPECIFIERS,
          });
        }
      },
    } as Rule.RuleListener;
  },
} as Rule.RuleModule;
