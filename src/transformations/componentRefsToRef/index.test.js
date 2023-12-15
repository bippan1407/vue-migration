const { expect, beforeEach } = require("@jest/globals");
const path = require("path");
const Codemod = require("../../codemod");
const transformations = require("../../transformations");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert component this.$ref to ref.value", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  transformations.componentRefToRefs(codemod.transformationObject);
  const newSyntax = codemod.getSource().trim();
  expect(newSyntax).toBe(
    `dropdownOptions.value.style.setProperty('--dd-left', \`-\${left}px\`);
dropdownOptions.value.style.setProperty('--dd-left', \`-\${left}px\`);
dropdownOptions.value[0].style.setProperty('--dd-left', \`-\${left}px\`);`
  );
});
