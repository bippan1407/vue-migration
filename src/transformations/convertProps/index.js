const transform = ({ root, j }) => {
  let newPropSyntax = "const props = ";
  root
    .find(j.Property, {
      key: { name: "props" },
    })
    .forEach((path) => {
      const args = path.value.value;
      newPropSyntax += j(
        j.callExpression(j.identifier("defineProps"), [args])
      ).toSource();
      // j(path).replaceWith(newSyntax);
    });
  return newPropSyntax;
};

module.exports = transform;
