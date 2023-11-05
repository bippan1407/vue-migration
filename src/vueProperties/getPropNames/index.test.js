const path = require("path");
const { expect, beforeEach } = require("@jest/globals");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("get all props of vue", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.propNames).toEqual(["name", "age"]);
});

test("get all props in file in defineComponent", () => {
  const testFile = path.resolve(__dirname, "test2.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.propNames).toEqual(["name", "age"]);
});
