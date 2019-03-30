import { Node } from "estree";
import { SourceCode } from "eslint";

export function nodesArrayToText(
  sourceCode: SourceCode,
  nodes: Node[],
  pipe?: (source: string, index: number) => string
) {
  return nodes.reduce((value, node) => {
    let astSource = sourceCode.getText(node);
    if (pipe) {
      astSource = pipe(
        astSource,
        nodes.indexOf(node)
      );
    }

    return value + astSource;
  }, "");
}
