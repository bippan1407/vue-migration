const { createComputedSyntax } = require("../../utility/vueThreeSyntax");

const transform = ({ root, j }) => {
  let computed = "";
  root
    .find(j.Identifier, {
      name: "computed",
    })
    .forEach((path) => {
      let properties = path?.parent?.value?.value?.properties;
      properties = properties?.filter((prop) => prop.type === j.Property.name);
      if (properties) {
        properties.forEach((property) => {
          const key = property?.key?.name;
          const body = property.value.body;
          const hasProperties = property.value.properties?.length
          if (key && body) {
            computed += createComputedSyntax(key, body) + "\n";
          } else if (hasProperties) {
            computed += `const ${key} = computed(${j(property.value).toSource()})\n`
          }
        });
      }
    });
  return computed;
};

module.exports = transform;
