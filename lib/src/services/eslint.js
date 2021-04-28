"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeEndPosition = exports.nodesArrayToText = void 0;
function getFullCommentText(comment) {
  return comment.type === "Line"
    ? "//" + comment.value
    : `/*${comment.value}*/`;
}
const wrapSourceWithLeadingComments = (source, comments) => {
  const commentText = comments.reduce((value, comment) => {
    return value + getFullCommentText(comment) + "\n";
  }, "");
  return commentText + source;
};
function getTrailingCommentsFromSameLine(sourceCode, node) {
  return sourceCode.getCommentsAfter(node).filter((comment) => {
    var _a, _b;
    return (
      ((_a = comment.loc) === null || _a === void 0
        ? void 0
        : _a.start.line) ===
      ((_b = node.loc) === null || _b === void 0 ? void 0 : _b.start.line)
    );
  });
}
const nodesArrayToText = (sourceCode) => (nodes, pipe) => {
  return nodes.reduce((value, node) => {
    let astSource = sourceCode.getText(node);
    const trailingComments = getTrailingCommentsFromSameLine(sourceCode, node);
    const leadingComments = sourceCode
      .getCommentsBefore(node)
      .filter((comment) => {
        var _a;
        return (
          ((_a = comment.loc) === null || _a === void 0
            ? void 0
            : _a.start.line) !== 1
        );
      });
    if (leadingComments.length) {
      astSource = wrapSourceWithLeadingComments(astSource, leadingComments);
    }
    if (trailingComments.length) {
      trailingComments
        // Eslint treats block comments (/* */) as trailing even if they are on the previous line
        // .filter(trailing => trailing.loc!.start.column > 0)
        .forEach((comment) => {
          astSource = astSource + " " + getFullCommentText(comment);
        });
    }
    if (pipe) {
      astSource = pipe(astSource, nodes.indexOf(node));
    }
    return value + astSource;
  }, "");
};
exports.nodesArrayToText = nodesArrayToText;
const getNodeEndPosition = (sourceCode, node) => {
  const trailingComments = getTrailingCommentsFromSameLine(sourceCode, node);
  if (trailingComments && trailingComments.length) {
    return trailingComments[trailingComments.length - 1].range[1];
  }
  return node.range[1];
};
exports.getNodeEndPosition = getNodeEndPosition;
//# sourceMappingURL=eslint.js.map
