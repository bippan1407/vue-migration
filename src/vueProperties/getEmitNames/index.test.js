const path = require("path");
const { expect, beforeEach } = require("@jest/globals");
const Codemod = require("../../codemod");

let codemod;

beforeEach(() => {
  codemod = new Codemod();
});

test("get all emits", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.emitNames).toEqual([
    "close",
    "input",
    "on-change",
    "on-new-change",
  ]);
});
