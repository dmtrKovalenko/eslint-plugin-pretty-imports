import { Rule } from "eslint";
import {
  compareTypeWithPrevious,
  ImportDeclarationT,
  getImportType
} from "../services/import-resolver";
import { ImportDeclaration } from "estree";

export default {
  schema: [],
  meta: {
    fixable: "code"
  },
  create: (context: Rule.RuleContext) => {
    const sourceCode = context.getSourceCode();
    return {
      ImportDeclaration: (node: ImportDeclarationT) => {
        const { current, previous } = compareTypeWithPrevious(node);

        if (
          previous === "ImportSpecifier" &&
          current === "ImportDefaultSpecifier"
        ) {
          const firstNamedImport = node.parent.body.find(
            bodyNode =>
              bodyNode.type === "ImportDeclaration" &&
              getImportType(bodyNode) === "ImportSpecifier"
          )!;

          context.report({
            loc: node.loc!,
            message: "Default and named imports should be grouped",
            // @ts-ignore
            fix: fixer => [
              fixer.remove(node),
              fixer.insertTextBefore(
                firstNamedImport,
                sourceCode.getText(node) + "\n"
              )
            ]
          });
        }
      }
    } as Rule.RuleListener;
  }
} as Rule.RuleModule;
