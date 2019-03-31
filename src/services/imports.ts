import { SourceCode } from "eslint";
import { ImportDeclaration } from "estree";

export function getImportType(node?: ImportDeclaration) {
  if (!node) {
    return null;
  }

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
    case "ImportNamespaceSpecifier":
      return includeLineLength(1);
    case "ImportDefaultSpecifier":
      return includeLineLength(2);
    case "ImportSpecifier":
      return includeLineLength(3);
    default:
      return 100;
  }
};
