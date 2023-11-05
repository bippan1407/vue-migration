const path = require("path");
const { expect } = require("@jest/globals");
const Codemod = require("../../codemod");
const transformations = require("../../transformations");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert all this.$store.dispatch", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  transformations.convertThisStoreDispatch(codemod.transformationObject);
  const newSyntax = codemod.getSource().trim();
  expect(newSyntax).toEqual(`username();
name('jerry');
age(10);
toggleAccordian({ document, template });`);
});
