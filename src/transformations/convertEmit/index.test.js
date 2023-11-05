const { expect, beforeEach } = require("@jest/globals");
const transformations = require("../../transformations");
const path = require("path");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert emit to defineEmits", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  const newSyntax = transformations.convertEmit(codemod.transformationObject);
  expect(newSyntax).toBe(
    `const emit = defineEmits(["close", "input", "on-change", "on-new-change"])`
  );
});
