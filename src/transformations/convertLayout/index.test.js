const path = require("path");
const { expect, beforeEach } = require("@jest/globals");
const Codemod = require("../../codemod");
const transformations = require("../../transformations");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert layout string expression to definePageMeta", () => {
  const testFile = path.resolve(__dirname, "test2.vue");
  codemod.initialiseFile(testFile);
  const newSyntax = transformations
    .convertLayout(codemod.transformationObject)
    ?.trim();
  expect(newSyntax).toEqual(`definePageMeta({
  layout: 'default',

})`);
});

test("convert layout function expression to definePageMeta", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  const newSyntax = transformations
    .convertLayout(codemod.transformationObject)
    ?.trim();
  expect(newSyntax).toEqual(`//Nuxt3TODO Need to migrate manually
definePageMeta({})`);
});
