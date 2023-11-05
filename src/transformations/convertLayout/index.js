const transform = ({ root, j }) => {
  let newLayoutSyntax = "";
  root
    .find(j.Property, {
      key: { name: "layout" },
    })
    .forEach((path) => {
      if (path.value?.value?.type === j.Literal.name) {
        let newSyntax = j(
          j.callExpression(j.identifier("definePageMeta"), [
            j.objectExpression([
              j.property(
                "init",
                j.identifier("layout"),
                j.literal(path.value?.value?.value)
              ),
            ]),
          ])
        ).toSource();
        newLayoutSyntax += newSyntax;
      } else {
        let newSyntax = j.callExpression(j.identifier("definePageMeta"), [
          j.objectExpression([]),
        ]);
        newSyntax.comments = [
          j.commentLine("TODO Need to migrate manually", false, true),
        ];
        newLayoutSyntax += j(newSyntax).toSource();
      }
    });
  return newLayoutSyntax;
};

module.exports = transform;
