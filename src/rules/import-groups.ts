import { Rule } from "eslint";
import { getImportType, getImportSortIndex } from "../services/import-resolver";
import { Program, ImportDeclaration } from "estree";

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
          context.report({
            loc: firstNotSorted.loc!,
            message: "Default and named imports should be grouped",
            fix: fixer => {
              const importsStart = imports[0].range![0];
              const importsEnd = imports[imports.length - 1].range![1];

              const insertSortedImports = null;
              const removeImports = fixer.removeRange([
                importsStart,
                importsEnd
              ]);

              return [removeImports, insertSortedImports] as any; // any required due to lack of typings
            }
          });
        }
      }
    } as Rule.RuleListener;
  }
} as Rule.RuleModule;
