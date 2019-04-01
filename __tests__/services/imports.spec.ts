import {
  getImportType,
  createCalculateSortIndex
} from "../../src/services/imports";

const createFakeNode = (specifier: string) =>
  ({
    type: "ImportDeclaration",
    specifiers: [
      {
        type: specifier
      }
    ]
  } as any);

const calculateMock = (sourceTest: string) => {
  const sourceCodeMock = {
    getText: jest.fn(() => sourceTest)
  } as any;

  return createCalculateSortIndex(sourceCodeMock, { disableLineSorts: false });
};

test("getImportType", () => {
  expect(
    getImportType({ ...createFakeNode("ImportSpecifier"), specifiers: [] })
  ).toBe(null);
});

test("calculateSortingIndex", () => {
  expect(calculateMock("string")(createFakeNode("ImportSpecifier"))).toBe(3.06);
  expect(
    calculateMock("short")(createFakeNode("ImportNamespaceSpecifier"))
  ).toBe(1.05);
  expect(
    calculateMock("some another")(createFakeNode("ImportDefaultSpecifier"))
  ).toBe(2.12);

  // should be unreachable
  expect(calculateMock("")(createFakeNode("CallExpression"))).toBe(100);
});
