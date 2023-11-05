const {
  createImportStoreSyntax,
  createImportSyntax,
} = require("../../utility/vueThreeSyntax");

const transform = ({ root, j, vueFileData, config }) => {
  let importSyntax = [];
  let shouldImportStoreToRefs = !!Object.keys(vueFileData?.vuexGetters).length;
  let importsToSkip = config.importsToSkip;
  root.find(j.Program)?.forEach((path) => {
    const body = path.value.body;
    const imports = body.filter(
      (node) => node.type !== j.ExportDefaultDeclaration.name
    );
    imports.forEach((importValue) => {
      if (!importsToSkip.includes(importValue?.source?.value))
        importSyntax += j(importValue).toSource() + "\n";
    });
  });
  let storeToImport = new Set();
  Object.keys(vueFileData.vuexGetters).forEach((storeName) =>
    storeToImport.add(storeName)
  );
  Object.keys(vueFileData.vuexActions).forEach((storeName) => {
    storeToImport.add(storeName);
  });
  if (shouldImportStoreToRefs) {
    importSyntax += createImportSyntax("pinia", ["storeToRefs"]) + "\n";
  }
  if (storeToImport.size) {
    storeToImport = Array.from(storeToImport);
    storeToImport.forEach((storeName) => {
      importSyntax += createImportStoreSyntax(storeName) + "\n";
    });
  }

  return importSyntax;
};

module.exports = transform;
