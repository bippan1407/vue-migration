const path = require("path");
const { expect } = require("@jest/globals");
const Codemod = require("../../codemod");
const configOptionsService = require("../../configOptionsService");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
  configOptionsService().initialise({
    projectLocation: null,
    transformedFolderLocation: null,
    dryRun: true,
    emptyTransformFolder: false,
    saveErrorLogs: false,
    commentAxios: true,
    commentOtherCode: true,
    replaceThisExpression: {
      $axios: {
        replaceWith: "$axios",
        isPlugin: true,
      },
    },
  });
});

test("get all plugin names", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.pluginNames).toEqual(["$axios"]);
});
