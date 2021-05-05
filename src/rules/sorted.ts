import { Rule } from "eslint";
import { messages } from "../constants/messages";
import { Program, ImportDeclaration } from "estree";
import { nodesArrayToText, getNodeEndPosition } from "../services/eslint";
import {
  getFirstNotSorted,
  isImportDeclaration,
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

    const calculateSortIndex = createCalculateSortIndex(sourceCode, {
      sortBySpecifier: context.options.includes(opts.SORT_BY_SPECIFIER),
      disableLineSorts: context.options.includes(opts.DISABLE_LINE_SORTS),
    });

    return {
      Program: (program: Program) => {
        const imports = getImportsWithNodesBetween(program);
        if (!imports.length) {
          return;
        }

        const firstNotSorted = getFirstNotSorted(imports, calculateSortIndex);

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

            let metNonImportNode = false;

            // do not add additional \n to the end of imports
            const addSeparatorBetweenNodes = (
              source: string,
              index: number
            ) => {
              const node = sortedImports[index];

              if (!metNonImportNode && !isImportDeclaration(node)) {
                metNonImportNode = true;
                source = "\n" + source;
              }

              return index < sortedImports.length - 1 ? source + "\n" : source;
            };

            const sortedImportsText = nodesArrayToText(sourceCode)(
              sortedImports,
              addSeparatorBetweenNodes
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
