import { SourceCode } from "eslint";
import { Node, ImportDeclaration } from "estree";

export function getImportType(node?: ImportDeclaration) {
  /* istanbul ignore if */

  if (!node) {
    return null;
  }

  if (!node.specifiers || !node.specifiers.length) {
    if (node.type === "ImportDeclaration") {
      return "ImportFileSpecifier";
    }

    /* istanbul ignore next */
    return null;
  }

  // treat import React, { useState } from 'react' as defaults by the type of the first specifier
  return node.specifiers[0].type;
}

export type CalculateSortOpts = {
  sortBySpecifier?: boolean;
  disableLineSorts: boolean;
};

export const createCalculateSortIndex = (
  sourceCode: SourceCode,
  options: CalculateSortOpts
) => (node?: ImportDeclaration) => {
  const includeLineLength = (initialIndex: number) => {
    if (!node || options.disableLineSorts) {
      return initialIndex;
    }

    const criterion = options.sortBySpecifier
      ? getSpecifiersLength(node, sourceCode)
      : getImportLength(node, sourceCode);

    const lineLengthIndex = criterion / 100;
    return initialIndex + lineLengthIndex;
  };

  switch (getImportType(node)) {
    case "ImportFileSpecifier":
      return includeLineLength(1);
    case "ImportNamespaceSpecifier":
      return includeLineLength(2);
    case "ImportDefaultSpecifier":
      return includeLineLength(3);
    case "ImportSpecifier":
      return includeLineLength(4);
    default:
      return 100;
  }
};

function getSpecifiersLength(node: ImportDeclaration, sourceCode: SourceCode) {
  return node.specifiers.reduce(
    (length: number, node: Node) => getNodeLength(node, sourceCode) + length,
    0
  );
}

function getImportLength(node: ImportDeclaration, sourceCode: SourceCode) {
  return getNodeLength(node, sourceCode);
}

function getNodeLength(node: Node, sourceCode: SourceCode) {
  return sourceCode.getText(node).length;
}
