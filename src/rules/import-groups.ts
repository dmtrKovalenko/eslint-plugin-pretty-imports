import { Rule } from 'eslint'
import { ImportDeclaration } from 'estree';

export const schema = []

export default (context: Rule.RuleContext) => {
  return {
    ImportDeclaration: (node: ImportDeclaration) => {
      node.specifiers.forEach((specifier) =>  {
 
      });
    }
  };
};

