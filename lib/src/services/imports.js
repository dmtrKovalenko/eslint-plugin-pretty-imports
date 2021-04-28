"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCalculateSortIndex = exports.createCalculateSpecifierSortIndex = exports.getFirstNotSorted = exports.getImportType = exports.getImportsWithNodesBetween = void 0;
const DEFAULT_SORT_INDEX = 100;
function getImportsWithNodesBetween(program) {
  const nodes = [];
  for (let i = 0, lastMatchedIndex = null; i < program.body.length; i++) {
    const node = program.body[i];
    if (node.type !== "ImportDeclaration") continue;
    if (lastMatchedIndex !== null && lastMatchedIndex !== i - 1) {
      nodes.push(...program.body.slice(lastMatchedIndex + 1, i + 1));
    } else {
      nodes.push(node);
    }
    lastMatchedIndex = i;
  }
  return nodes;
}
exports.getImportsWithNodesBetween = getImportsWithNodesBetween;
function getImportType(node) {
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
exports.getImportType = getImportType;
function getFirstNotSorted(imports, calculateSortIndex) {
  const isNodesSorted = (a, b) =>
    calculateSortIndex(a) <= calculateSortIndex(b);
  return imports.find((current, i) => {
    const next = imports[i + 1];
    if (next === undefined) return false;
    return !isNodesSorted(current, next);
  });
}
exports.getFirstNotSorted = getFirstNotSorted;
const createCalculateSpecifierSortIndex = (sourceCode, options) => (node) =>
  node && !options.disableLineSorts
    ? getNodeLength(node, sourceCode)
    : DEFAULT_SORT_INDEX;
exports.createCalculateSpecifierSortIndex = createCalculateSpecifierSortIndex;
const createCalculateSortIndex = (sourceCode, options) => (node) => {
  const includeLineLength = (initialIndex) => {
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
exports.createCalculateSortIndex = createCalculateSortIndex;
function getImportLength(node, sourceCode) {
  return getNodeLength(node, sourceCode);
}
function getNodeLength(node, sourceCode) {
  return sourceCode.getText(node).length;
}
function getSpecifiersLength(node, sourceCode) {
  const commaLength = 1;
  const specifiersLength = node.specifiers.reduce(
    (length, node) => getNodeLength(node, sourceCode) + commaLength + length,
    0
  );
  return specifiersLength - commaLength;
}
//# sourceMappingURL=imports.js.map
