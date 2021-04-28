import { Rule } from "eslint";
import { messages } from "../constants/messages";
import { Program, ImportDeclaration } from "estree";
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
      Program: (program: Program) => {
        const imports = program.body.filter(
          (node) => node.type === "ImportDeclaration"
        ) as ImportDeclaration[];

        if (!imports.length) {
          return;
        }

        const firstNotSorted = imports.find((node) =>
          getFirstNotSorted(node.specifiers, calculateSpecifierSortIndex)
        );

        if (firstNotSorted) {
          const autoFix = (fixer: Rule.RuleFixer) => {
            const importsStart = imports[0].range![0];
            const importsEnd = getNodeEndPosition(
              sourceCode,
              imports[imports.length - 1]
            );

            imports.forEach((node) =>
              node.specifiers.sort(
                (a, b) =>
                  calculateSpecifierSortIndex(a) -
                  calculateSpecifierSortIndex(b)
              )
            );

            const sortedImportsText = nodesArrayToText(sourceCode)(
              imports,
              // do not add additional \n to the end of imports
              (source, index) =>
                index < imports.length - 1 ? source + "\n" : source
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
