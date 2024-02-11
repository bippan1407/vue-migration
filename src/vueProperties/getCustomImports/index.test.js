const path = require("path");
const { expect } = require("@jest/globals");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

// Nuxt3TODO
test("check if this.$test is present", () => {
  // const testFile = path.resolve(__dirname, "testRouter.vue");
  // codemod.initialiseFile(testFile);
  // expect(codemod.vueFileData.isRouterPresent).toEqual(true);
});
