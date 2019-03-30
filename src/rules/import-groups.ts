import { Rule } from "eslint";
import { getImportSortIndex } from "../services/imports";
import { Program, ImportDeclaration } from "estree";
import { nodesArrayToText } from "../services/eslint";

export default {
  schema: [],
  meta: {
    fixable: "code"
  },
  create: (context: Rule.RuleContext) => {
    const sourceCode = context.getSourceCode();
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
            nextNode && getImportSortIndex(node) > getImportSortIndex(nextNode)
          );
        });

        if (firstNotSorted) {
          const autoFix = (fixer: Rule.RuleFixer) => {
            const importsStart = imports[0].range![0];
            const importsEnd = imports[imports.length - 1].range![1];

            const sortedImports = imports.sort(
              (a, b) => getImportSortIndex(a) - getImportSortIndex(b)
            );

            const sortedImportsText = nodesArrayToText(
              sourceCode,
              sortedImports,
              source => source + "\n"
            );

            return fixer.replaceTextRange(
              [importsStart, importsEnd],
              sortedImportsText
            );
          };

          context.report({
            fix: autoFix,
            loc: firstNotSorted.loc!,
            message: "Default and named imports should be grouped"
          });
        }
      }
    } as Rule.RuleListener;
  }
} as Rule.RuleModule;
