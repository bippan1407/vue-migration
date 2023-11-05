const transform = ({ root, j }) => {
  const allPropertiesName = [];
  root.find(j.ExportDefaultDeclaration).forEach((path) => {
    const properties = path?.value?.declaration?.properties;
    properties?.forEach((property) => {
      if (property?.key?.name) {
        allPropertiesName.push(property.key.name);
      }
    });
  });
  root
    .find(j.CallExpression, (path) => path.callee.name === "defineComponent")
    .forEach((path) => {
      const properties = path?.value?.arguments?.[0]?.properties;
      properties?.forEach((property) => {
        if (property?.key?.name) {
          allPropertiesName.push(property.key.name);
        }
      });
    });
  return allPropertiesName;
};

module.exports = transform;
