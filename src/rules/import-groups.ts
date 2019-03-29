import { Rule } from "eslint";
import {
  ImportDeclaration,
  ImportSpecifier,
  ImportNamespaceSpecifier,
  ImportDefaultSpecifier
} from "estree";

type BaseImportSpecifier =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier;

export default {
  schema: [],
  create: (context: Rule.RuleContext) => {
    let imported: BaseImportSpecifier[] = [];

    function registerImport(imports: BaseImportSpecifier[]) {
      const previousRegisteredImport = imported[imported.length - 1] 

      if (
        previousRegisteredImport &&
        imports[0].type === 'ImportDefaultSpecifier' &&
        previousRegisteredImport.type === 'ImportSpecifier'
      ) {
        context.report({
          message: "Default and named imports should be grouped",
          loc: imports[0].loc!,
        })
      }

      imported = [...imported, ...imports]
    }

    return {
      ImportDeclaration: (node: ImportDeclaration) => {
        registerImport(node.specifiers)
      }
    } as Rule.RuleListener;
  }
};
