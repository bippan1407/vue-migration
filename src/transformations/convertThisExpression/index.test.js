const { expect, beforeEach } = require("@jest/globals");
const transformations = require("../../transformations");
const path = require("path");
const Codemod = require("../../codemod");
const fs = require("fs");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("remove this expression", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  const requiredSyntaxFileLocation = path.resolve(
    __dirname,
    "./requiredSyntax/thisExpression"
  );
  const requiredSyntax = fs.readFileSync(requiredSyntaxFileLocation, {
    encoding: "utf8",
  });
  codemod.initialiseFile(testFile);
  transformations.convertThisExpression(codemod.transformationObject);
  const transformedValue = codemod.getSource().trim();
  expect(transformedValue).toEqual(requiredSyntax);
});
