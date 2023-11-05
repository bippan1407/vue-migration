const { expect, beforeEach } = require("@jest/globals");
const transformations = require("../../transformations");
const path = require("path");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert methods to new  vue 3 syntax", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  const newSyntax = transformations.convertMethods(
    codemod.transformationObject
  );
  expect(newSyntax).toEqual(`const subtract = () => {
    return 2-1;
}
const addNumber = async () => {
    const test = 1 + 2;
    return test
}
const multiply = async (a,b) => {
    const test = a * b;
    return test
}
const divide = async (a,{b}) => {
    const test = a / b;
    return test
}
`);
});
