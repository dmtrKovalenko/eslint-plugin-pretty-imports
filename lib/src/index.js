"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.rules = void 0;
const sorted_1 = __importDefault(require("./rules/sorted"));
const sorted_specifiers_1 = __importDefault(
  require("./rules/sorted-specifiers")
);
exports.rules = {
  sorted: sorted_1.default,
  "sorted-specifiers": sorted_specifiers_1.default,
};
//# sourceMappingURL=index.js.map
