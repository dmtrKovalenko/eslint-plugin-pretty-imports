import { Rule } from "eslint";
import { messages } from "../constants/messages";
import { Program, ImportDeclaration } from "estree";
import { createCalculateSortIndex } from "../services/imports";
import { nodesArrayToText, getNodeEndPosition } from "../services/eslint";

const opts = {
  DISABLE_LINE_SORTS: "no-line-length-sort"
};

export default {
  meta: {
    fixable: "code"
  },
  schema: [
    {
      enum: [opts.DISABLE_LINE_SORTS]
    }
  ],
  create: (context: Rule.RuleContext) => {
    const sourceCode = context.getSourceCode();
    const calculateSortIndex = createCalculateSortIndex(sourceCode, {
      disableLineSorts: context.options.includes(opts.DISABLE_LINE_SORTS)
    });

    return {
      Program: (program: Program) => {
        const imports = program.body.filter(
          node => node.type === "ImportDeclaration"
        ) as ImportDeclaration[];

        if (!imports.length) {
          return;
        }

        const firstNotSorted = imports.find((node, i) => {
          const nextNode = imports[i + 1];

          return (
            nextNode && calculateSortIndex(node) > calculateSortIndex(nextNode)
          );
        });

        if (firstNotSorted) {
          const autoFix = (fixer: Rule.RuleFixer) => {
            const importsStart = imports[0].range![0];
            const importsEnd = getNodeEndPosition(
              sourceCode,
              imports[imports.length - 1]
            );

            const sortedImports = imports.sort(
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
            message: messages.NOT_SORTED
          });
        }
      }
    } as Rule.RuleListener;
  }
} as Rule.RuleModule;
