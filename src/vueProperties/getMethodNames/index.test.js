const path = require("path");
const { expect, beforeEach } = require("@jest/globals");
const Codemod = require("../../codemod");

let codemod;

beforeEach(() => {
  codemod = new Codemod();
});

test("get all method names", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.methodNames).toEqual(["activeMenu", "showUser"]);
});
