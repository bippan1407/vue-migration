const path = require("path");
const { expect } = require("@jest/globals");
const Codemod = require("../../codemod");
const transformations = require("../../transformations");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert this.$store getters and state", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  transformations.convertThisStoreGetters(codemod.transformationObject);
  const newSyntax = codemod.getSource().trim();
  expect(newSyntax).toEqual(`const name = username.value;
const docs = allDocs.value`);
});
