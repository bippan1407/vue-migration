const { expect, beforeEach } = require("@jest/globals");
const path = require("path");
const Codemod = require("../../codemod");
const transformations = require("../../transformations");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert nuxt this.$properties", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  transformations.convertNuxtProperties(codemod.transformationObject);
  const newSyntax = codemod.getSource().trim();
  expect(newSyntax).toBe(`device.isMobile;
router.push('/');
route.fullPath;`);
});
