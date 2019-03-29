import { Rule } from "eslint";
import { ImportDeclaration } from "estree";

export default {
  schema: [],
  create: (context: Rule.RuleContext) => {
    return {
      ImportDeclaration: (node: ImportDeclaration) => {
        node.specifiers.forEach(specifier => {});
      }
    } as Rule.RuleListener;
  }
};
