import { SourceCode } from "eslint";
import { Node, Comment } from "estree";

function getFullCommentText(comment: Comment) {
  return comment.type === "Line"
    ? "//" + comment.value
    : `/*${comment.value}*/`;
}

const wrapSourceWithLeadingComments = (source: string, comments: Comment[]) => {
  const commentText = comments.reduce((value, comment) => {
    return value + getFullCommentText(comment) + "\n";
  }, "");

  return commentText + source;
};

function getTrailingCommentsFromSameLine(sourceCode: SourceCode, node: Node) {
  return sourceCode
    .getCommentsAfter(node)
    .filter(comment => comment.loc?.start.line === node.loc?.start.line);
}

export const nodesArrayToText = (sourceCode: SourceCode) => (
  nodes: Node[],
  pipe?: (source: string, index: number) => string
) => {
  return nodes.reduce((value, node) => {
    let astSource = sourceCode.getText(node);
    const trailingComments = getTrailingCommentsFromSameLine(sourceCode, node);

    const leadingComments = sourceCode
      .getCommentsBefore(node)
      .filter(comment => comment.loc?.start.line !== 1);

    if (leadingComments.length) {
      astSource = wrapSourceWithLeadingComments(astSource, leadingComments);
    }

    if (trailingComments.length) {
      trailingComments
        // Eslint treats block comments (/* */) as trailing even if they are on the previous line
        // .filter(trailing => trailing.loc!.start.column > 0)
        .forEach(comment => {
          astSource = astSource + " " + getFullCommentText(comment);
        });
    }

    if (pipe) {
      astSource = pipe(astSource, nodes.indexOf(node));
    }

    return value + astSource;
  }, "");
};

export const getNodeEndPosition = (sourceCode: SourceCode, node: Node) => {
  const trailingComments = getTrailingCommentsFromSameLine(sourceCode, node);
  if (trailingComments && trailingComments.length) {
    return trailingComments[trailingComments.length - 1]!.range![1];
  }

  return node.range![1];
};
