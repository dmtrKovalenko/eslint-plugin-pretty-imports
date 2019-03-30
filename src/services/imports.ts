import {
  Node,
  ImportDeclaration,
} from "estree";

export type ImportDeclarationT = {
  parent: {
    body: Node[];
  };
} & ImportDeclaration;

export function getNextNode(node: ImportDeclaration) {
  const { parent } = node as ImportDeclarationT;
  return parent.body[
    parent.body.indexOf(node) + 1
  ];
}

export function getImportType(node?: ImportDeclaration) {
  if (!node) {
    return null
  }
  
  return node.specifiers[0].type;
}

export function getImportSortIndex(node?: ImportDeclaration) {
  switch (getImportType(node)) {
    case 'ImportNamespaceSpecifier':
      return 1
    case 'ImportDefaultSpecifier':
      return 2
    case 'ImportSpecifier':
      return 3
    default:
      return 10
  }
}
