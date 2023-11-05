const path = require("path");
const { expect, beforeEach } = require("@jest/globals");
const Codemod = require("../../codemod");
const transformations = require("../../transformations");

let codemod;

beforeEach(() => {
  codemod = new Codemod();
});

test("get all imports in vue file", () => {
  const testFile = path.resolve(__dirname, "test.vue");
  codemod.initialiseFile(testFile);
  const importSyntax = transformations.convertImports(
    codemod.transformationObject
  );
  expect(importSyntax).toEqual(`import Icon from '~/assets/svgs/Icon.vue';
const Modal = () => import("~/components/Modal.vue");
import { storeToRefs } from 'pinia'
import { useDocumentsStore } from '~/store/documents'
import { useUserStore } from '~/store/user'
import { useDocumentStore } from '~/store/document'
import { useAppsStore } from '~/store/apps'
import { useGuestStore } from '~/store/guest'
import { useDocsStore } from '~/store/docs'
`);
});
