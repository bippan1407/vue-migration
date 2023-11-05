const transform = ({ root, j, vueFileData }) => {
  let emitNames = vueFileData.emitNames;
  let newEmitSyntax = "const emit = ";
  // root
  //   .find(j.Property, {
  //     key: { name: "emits" },
  //   })
  //   .forEach((path) => {
  //     const args = path.value.value;
  //     args.elements.forEach((elem) => {
  //       const emitName = elem.value;
  //       if (emitName) {
  //         emitNames.push(emitName);
  //       }
  //     });
  //     // j(path).replaceWith(newSyntax);
  //   });
  // //  In case emit is not defined as property
  // root
  //   .find(j.MemberExpression, {
  //     object: { type: "ThisExpression" },
  //     property: { name: "$emit" },
  //   })
  //   ?.forEach((path) => {
  //     const args = path.parent.value.arguments;
  //     const emitName = args?.[0]?.value;
  //     if (emitName) {
  //       emitNames.push(emitName);
  //     }
  //   });

  if (emitNames.length) {
    newEmitSyntax += j(
      j.callExpression(j.identifier("defineEmits"), [
        j.arrayExpression(emitNames.map((e) => j.literal(e))),
      ])
    ).toSource();
  }
  return newEmitSyntax;
};

module.exports = transform;
