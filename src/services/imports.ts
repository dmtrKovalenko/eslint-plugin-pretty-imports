import { SourceCode } from "eslint";
import {
  Node,
  Program,
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

export function isImportDeclaration(node: Node): node is ImportDeclaration {
  return node.type === "ImportDeclaration";
}

export function getImportsWithNodesBetween(program: Program) {
  const nodes = [];

  for (let i = 0, lastMatchedIndex = null; i < program.body.length; i++) {
    const node = program.body[i];
    if (!isImportDeclaration(node)) continue;

    if (lastMatchedIndex !== null && lastMatchedIndex !== i - 1) {
      nodes.push(...program.body.slice(lastMatchedIndex + 1, i + 1));
    } else {
      nodes.push(node);
    }

    lastMatchedIndex = i;
  }

  return nodes as ImportDeclaration[];
}

export function getImportType(node?: ImportDeclaration) {
  /* istanbul ignore if */
  if (!node) {
    return null;
  }

  if (!node.specifiers || !node.specifiers.length) {
    if (isImportDeclaration(node)) {
      return "ImportFileSpecifier";
    }

    /* istanbul ignore next */
    return null;
  }

  // treat import React, { useState } from 'react' as defaults by the type of the first specifier
  return node.specifiers[0].type;
}

export function getFirstNotSorted<T extends Node>(
  imports: T[],
  calculateSortIndex: (node?: T) => number
) {
  const isNodesSorted = (a: T, b: T) =>
    calculateSortIndex(a) <= calculateSortIndex(b);

  return imports.find((current, i) => {
    const next = imports[i + 1];
    if (next === undefined) return false;

    return !isNodesSorted(current, next);
  });
}

function getNodeLength(node: Node, sourceCode: SourceCode) {
  return sourceCode.getText(node).length;
}

function getImportLength(node: ImportDeclaration, sourceCode: SourceCode) {
  return getNodeLength(node, sourceCode);
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

export const createCalculateSpecifierSortIndex = (
  sourceCode: SourceCode,
  options: CalculateSortOpts
) => (node?: ImportSpecifierNode) =>
  node && !options.disableLineSorts
    ? getNodeLength(node, sourceCode)
    : /* istanbul ignore next */
      DEFAULT_SORT_INDEX;

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
