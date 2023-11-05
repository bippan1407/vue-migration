const path = require("path");
const { expect } = require("@jest/globals");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("check if this.$router is present", () => {
  const testFile = path.resolve(__dirname, "testRouter.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.isRouterPresent).toEqual(true);
});

test("check if this.$route is present", () => {
  const testFile = path.resolve(__dirname, "testRoute.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.isRoutePresent).toEqual(true);
});

test("check if this.$device is present", () => {
  const testFile = path.resolve(__dirname, "testDevice.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.isDevicePresent).toEqual(true);
});
