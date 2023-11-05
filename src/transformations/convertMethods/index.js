const { createMethodsSyntax } = require("../../utility/vueThreeSyntax");

const transform = ({ root, j }) => {
  let methods = "";
  root
    .find(j.Identifier, {
      name: "methods",
    })
    .forEach((path) => {
      let properties = path?.parent?.value?.value?.properties;
      properties = properties?.filter((prop) => prop.type === j.Property.name);
      if (properties) {
        properties.forEach((property) => {
          const key = property?.key?.name;
          const body = property?.value?.body;
          const isAsync = property?.value?.async;
          const params = property?.value?.params;
          if (key && body) {
            methods +=
              createMethodsSyntax(key, body, params, { isAsync }) + "\n";
          }
        });
      }
    });
  return methods;
};

module.exports = transform;
