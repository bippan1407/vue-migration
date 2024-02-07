const { newPropSyntaxMapping } = require("../../constants/propSyntax");

const transform = ({ root, j }) => {
  let newPropSyntax = "const props = ";
  root
    .find(j.Property, {
      key: { name: "props" },
    })
    .forEach((path) => {
      const args = path.value.value;
      if (args.type === j.ObjectExpression.name) {
        args.properties = args.properties.map((arg) => {
          if (arg?.key?.name && newPropSyntaxMapping[arg.key.name]) {
            arg.key.name = newPropSyntaxMapping[arg.key.name];
          }
          return arg;
        });
      } else if (args.type === j.ArrayExpression.name) {
        args.elements = args.elements.map((arg) => {
          if (arg?.value && newPropSyntaxMapping[arg.value]) {
            arg.value = newPropSyntaxMapping[arg.value];
          }
          return arg;
        });
      }

      newPropSyntax += j(
        j.callExpression(j.identifier("defineProps"), [args])
      ).toSource();
      // j(path).replaceWith(newSyntax);
    });
  return newPropSyntax;
};

module.exports = transform;
