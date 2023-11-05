const path = require("path");
const { expect, beforeEach } = require("@jest/globals");
const Codemod = require("../../codemod");
const transformations = require("../../transformations");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert all watch to new syntax", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  const newSyntax = transformations
    .convertWatch(codemod.transformationObject)
    ?.trim();
  expect(newSyntax).toEqual(`watch(onDelete, (value) => {
    const name = "test"
}, { deep: true })
watch(onCreate, (newValue,oldValue) => {
    this.validateFields();
})
watch(onUpdate, (value) => {
    const name = "test"
}, { immediate: true })`);
});
