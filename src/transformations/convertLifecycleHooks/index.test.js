const { expect, beforeEach } = require("@jest/globals");
const transformations = require("../../transformations");
const path = require("path");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("convert lifecycle hooks to new  vue 3 syntax", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  const newSyntax = transformations.convertLifecycleHooks(
    codemod.transformationObject
  );
  expect(newSyntax).toEqual(`onMounted(async () =>  {
    this.$axios.$get('/users')
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.log(error)
    })
    const response = await this.$axios.$get('/users')
})
onBeforeUnmount(() =>  {
    const add = 1 + 2
})
onDestroyed(() =>  {
    const add = 1 + 2
})
`);
});
