import { SourceCode } from "eslint";
import {
  Node,
  ImportSpecifier,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
} from "estree";

const DEFAULT_SORT_INDEX = 100;

type ImportSpecifierNode =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier;

export type CalculateSortOpts = {
  sortBySpecifier?: boolean;
  disableLineSorts: boolean;
};

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

export function getFirstNotSorted(
  imports: ImportDeclaration[],
  calculateSortIndex: (node?: ImportDeclaration) => number,
  calculateSpecifierSortIndex?: (node?: ImportSpecifierNode) => number
) {
  const isImportsSorted = (a: ImportDeclaration, b: ImportDeclaration) =>
    calculateSortIndex(a) <= calculateSortIndex(b);

  const isSpecifiersSorted = (a: ImportSpecifierNode, b: ImportSpecifierNode) =>
    calculateSpecifierSortIndex!(a) <= calculateSpecifierSortIndex!(b);

  const hasNotSortedSpecifiers = (node: ImportDeclaration) =>
    calculateSpecifierSortIndex !== undefined &&
    node.specifiers.some((current, i) => {
      const next = node.specifiers[i + 1];
      return next && !isSpecifiersSorted(current, next);
    });

  return imports.find((current, i) => {
    if (hasNotSortedSpecifiers(current)) return true;

    const next = imports[i + 1];
    if (next === undefined) return false;

    return !isImportsSorted(current, next);
  });
}

export const createCalculateSpecifierSortIndex = (sourceCode: SourceCode) => (
  node?: ImportSpecifierNode
) => (node ? getNodeLength(node, sourceCode) : DEFAULT_SORT_INDEX);

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
      return DEFAULT_SORT_INDEX;
  }
};

function getImportLength(node: ImportDeclaration, sourceCode: SourceCode) {
  return getNodeLength(node, sourceCode);
}

function getNodeLength(node: Node, sourceCode: SourceCode) {
  return sourceCode.getText(node).length;
}

function getSpecifiersLength(node: ImportDeclaration, sourceCode: SourceCode) {
  const commaLength = 1;
  const specifiersLength = node.specifiers.reduce(
    (length: number, node: Node) =>
      getNodeLength(node, sourceCode) + commaLength + length,
    0
  );
  return specifiersLength - commaLength;
}
