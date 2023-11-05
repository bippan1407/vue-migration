const path = require("path");
const { expect, beforeEach } = require("@jest/globals");
const Codemod = require("../../codemod");

let codemod;

beforeEach(() => {
  codemod = new Codemod();
});

test("get all component refs", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.componentRefNames).toEqual(["dropdownOptions"]);
});
