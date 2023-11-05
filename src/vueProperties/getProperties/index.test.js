const path = require("path");
const { expect } = require("@jest/globals");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("get all properties of vue", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.allProperties).toEqual([
    "name",
    "computed",
    "data",
    "methods",
  ]);
});

test("get all properties of vue in defineComponent", () => {
  const testFile = path.resolve(__dirname, "test2.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.allProperties).toEqual([
    "name",
    "computed",
    "data",
    "methods",
  ]);
});
