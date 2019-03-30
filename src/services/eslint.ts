import { Node } from "estree";
import { SourceCode } from "eslint";


export function nodesArrayToText(
  sourceCode: SourceCode,
  nodes: Node[],
  pipe?: (source: string) => string
) {
  return nodes.reduce<string>((value, node) => {
    let astSource = sourceCode.getText(node);
    if (pipe) {
      astSource = pipe(astSource)
    }

    return value + astSource
  }, "");
}
