import { SourceCode } from "eslint";
import { ImportDeclaration } from "estree";

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

export const createCalculateSortIndex = (
  sourceCode: SourceCode,
  options: {
    disableLineSorts: boolean;
  }
) => (node?: ImportDeclaration) => {
  const includeLineLength = (initialIndex: number) => {
    if (options.disableLineSorts) {
      return initialIndex;
    }

    const lineLengthIndex = sourceCode.getText(node).length / 100;
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
