const path = require("path");
const { expect } = require("@jest/globals");
const Codemod = require("../../codemod");

let codemod;
beforeEach(() => {
  codemod = new Codemod();
});

test("get all vuex actions in vue file", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  expect(codemod.vueFileData.vuexActions).toEqual({
    documents: [
      { name: "requiredDocuments" },
      { name: "oldDocument" },
      { name: "toggleAccordian", params: "{ document, template }" },
    ],
    user: [{ name: "isPremium", as: "user" }],
    document: [{ name: "newDocument", as: "document" }],
    guest: [
      { name: "isInterested", as: "isGuest" },
      { name: "username" },
      { name: "name", params: "'jerry'" },
      { name: "age", params: "10" },
    ],
    app: [{ name: "newApplication" }],
  });
});
