const path = require("path");
const { expect } = require("@jest/globals");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("get all vuex getters and state in vue file", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.vuexGetters).toEqual({
    documents: [{ name: "requiredDocuments" }, { name: "oldDocument" }],
    user: [{ name: "isPremium", as: "user" }],
    document: [{ name: "newDocument", as: "document" }],
    apps: [{ name: "app" }],
    guest: [
      { name: "isInterested", as: "isGuest" },
      { name: "newApplication" },
      { name: "username" },
    ],
    docs: [{ name: "allDocs" }],
  });
});
