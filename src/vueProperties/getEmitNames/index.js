const transform = ({ root, j }) => {
  let emitNames = new Set();
  root
    .find(j.Property, {
      key: { name: "emits" },
    })
    .forEach((path) => {
      const args = path.value.value;
      args.elements.forEach((elem) => {
        const emitName = elem.value;
        if (emitName) {
          emitNames.add(emitName);
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
        emitNames.add(emitName);
      }
    });
  return Array.from(emitNames);
};

module.exports = transform;
