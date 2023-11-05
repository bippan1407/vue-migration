const { expect, beforeEach } = require("@jest/globals");
const transformations = require("../../transformations");
const path = require("path");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert data() to ref", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  const transformedValue = transformations.dataToRef(
    codemod.transformationObject
  );
  expect(transformedValue).toBe(`const isDropdownOpen = ref(false);
const user = ref({
    name: 'tom',
    age: 20
});
`);
});
