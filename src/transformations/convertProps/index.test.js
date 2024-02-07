const path = require("path");
const { expect, beforeEach } = require("@jest/globals");
const Codemod = require("../../codemod");
const transformations = require("../../transformations");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert all props of vue which are in object", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  const newSyntax = transformations.convertProps(codemod.transformationObject);
  expect(newSyntax).toEqual(`const props = defineProps({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    }
})`);
});

test("convert all props of vue which are in array", () => {
  const testFile = path.resolve(__dirname, "test2.vue");
  codemod.initialiseFile(testFile);
  const newSyntax = transformations.convertProps(codemod.transformationObject);
  expect(newSyntax).toEqual(
    `const props = defineProps(['name', 'age', "modelValue"])`
  );
});
