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
          if(property?.value?.type === 'FunctionExpression') {
            const key = property?.key?.name;
            const body = property?.value?.body;
            const isAsync = property?.value?.async;
            const params = property?.value?.params;
            if (key && body) {
              methods +=
                createMethodsSyntax(key, body, params, { isAsync }) + "\n";
            }
          } else if(["CallExpression", "ArrowFunctionExpression"].includes(property?.value?.type)) {
            const key = property?.key?.name;
            const body = property.value;
            if (key && body) {
              console.log(j(body).toSource())
              methods +=
                `const ${key} = ${j(body).toSource()} \n`;
            }
          }
        });
      }
    });
  return methods;
};

module.exports = transform;
