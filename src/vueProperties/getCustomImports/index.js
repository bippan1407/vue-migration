const configOptionsService = require("../../configOptionsService");

const transform = ({ root, j }) => {
  const configOptions = configOptionsService().get()
  const imports = {}; 
  const foundImports = new Set();
  const expressionToReplace = configOptions.replaceThisExpression
  Object.keys(expressionToReplace).map(k => {
    if (expressionToReplace[k]?.isImport) {
      imports[k] = expressionToReplace[k];
    }
  })
  Object.keys(imports).forEach(v => {
    const property = root.find(j.MemberExpression, {
      object: { type: "ThisExpression" },
      property: { name: v },
    });
    if (property?.length) {
      foundImports.add(v)
    }
  })
  return Array.from(foundImports);
};

module.exports = transform;
