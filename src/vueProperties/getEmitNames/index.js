const transform = ({ root, j }) => {
  let emitNames = [];
  root
    .find(j.Property, {
      key: { name: "emits" },
    })
    .forEach((path) => {
      const args = path.value.value;
      args.elements.forEach((elem) => {
        const emitName = elem.value;
        if (emitName) {
          emitNames.push(emitName);
        }
      });
    });
  root
    .find(j.MemberExpression, {
      object: { type: "ThisExpression" },
      property: { name: "$emit" },
    })
    ?.forEach((path) => {
      const args = path.parent.value.arguments;
      const emitName = args?.[0]?.value;
      if (emitName) {
        emitNames.push(emitName);
      }
    });
  return emitNames;
};

module.exports = transform;
