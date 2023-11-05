const { expect, beforeEach } = require("@jest/globals");
const transformations = require("../../transformations");
const path = require("path");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert nuxt 2 computed to new  vue 3 syntax", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  const newSyntax = transformations.convertComputed(
    codemod.transformationObject
  );
  expect(newSyntax).toEqual(`const isPremiumUser = computed(() => {
    return this.isPremium;
})
`);
});
