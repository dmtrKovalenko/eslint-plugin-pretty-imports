import {
  Node,
  ImportDeclaration,
  ImportSpecifier,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier
} from "estree";

type BaseImportSpecifier =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier;

export type ImportDeclarationT = {
  parent: {
    body: Node[];
  };
} & ImportDeclaration;

export function compareTypeWithPrevious(node: ImportDeclarationT) {
  const { parent } = node;
  const previousNode = parent.body[
    parent.body.indexOf(node) - 1
  ] as ImportDeclarationT;

  return {
    current: getImportType(node),
    previous: getImportType(previousNode)
  };
}

export function getImportType(node?: ImportDeclaration) {
  if (!node) {
    return null
  }
  
  return node.specifiers[0].type;
}
