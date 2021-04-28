import { Rule } from "eslint";
import { messages } from "../constants/messages";
import { Program, ImportDeclaration } from "estree";
import { nodesArrayToText, getNodeEndPosition } from "../services/eslint";
import {
  getFirstNotSorted,
  createCalculateSortIndex,
  getImportsWithNodesBetween,
} from "../services/imports";

const opts = {
  DISABLE_LINE_SORTS: "no-line-length-sort",
  SORT_BY_SPECIFIER: "sort-by-specifiers-length",
};

export default {
  meta: {
    fixable: "code",
  },
  schema: [
    {
      enum: [opts.DISABLE_LINE_SORTS, opts.SORT_BY_SPECIFIER],
    },
  ],
  create: (context: Rule.RuleContext) => {
    const sourceCode = context.getSourceCode();

    const sortBySpecifier = context.options.includes(opts.SORT_BY_SPECIFIER);
    const disableLineSorts = context.options.includes(opts.DISABLE_LINE_SORTS);

    const calculateSortIndex = createCalculateSortIndex(sourceCode, {
      sortBySpecifier,
      disableLineSorts,
    });

    return {
      Program: (program: Program) => {
        const imports = getImportsWithNodesBetween(program);

        if (!imports.length) {
          return;
        }

        const firstNotSorted = getFirstNotSorted(
          imports as ImportDeclaration[],
          calculateSortIndex
        );

        if (firstNotSorted) {
          const autoFix = (fixer: Rule.RuleFixer) => {
            const importsStart = imports[0].range![0];
            const importsEnd = getNodeEndPosition(
              sourceCode,
              imports[imports.length - 1]
            );

            const sortedImports = (imports as ImportDeclaration[]).sort(
              (a, b) => calculateSortIndex(a) - calculateSortIndex(b)
            );

            const sortedImportsText = nodesArrayToText(sourceCode)(
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
            loc: firstNotSorted.loc!,
            message: messages.NOT_SORTED,
          });
        }
      },
    } as Rule.RuleListener;
  },
} as Rule.RuleModule;
