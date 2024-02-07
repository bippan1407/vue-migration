const { newEmitSyntaxMapping } = require("../../constants/emitSyntax");

const transform = ({ root, j, vueFileData }) => {
  let emitNames = vueFileData.emitNames;
  let newEmitSyntax = "const emit = ";
  emitNames = emitNames.map((name) => {
    if (newEmitSyntaxMapping[name]) {
      return newEmitSyntaxMapping[name];
    }
    return name;
  });
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
