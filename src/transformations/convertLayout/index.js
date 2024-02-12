const transform = ({ root, j }) => {
  let metaObj = "";
  root.find(j.Property).forEach((path) => {
    if (["layout", "middleware"].includes(path.value?.key?.name)) {
      console.log(path);
      const tagName = path.value?.key?.name;
      if (path.value?.value?.elements) {
        metaObj += `${tagName}: [${j(
          path.value.value.elements
        ).toSource()}],\n`;
      } else if (path.value?.value?.value) {
        metaObj += `${tagName}: ${j(path.value.value).toSource()},\n`;
      }
    }
  });
  let definePageMetaSyntax = "";
  if (metaObj) {
    definePageMetaSyntax += `definePageMeta({
  ${metaObj.toString()}
})`;
  } else {
    let newSyntax = j.callExpression(j.identifier("definePageMeta"), [
      j.objectExpression([]),
    ]);
    newSyntax.comments = [
      j.commentLine("TODO Need to migrate manually", false, true),
    ];
    definePageMetaSyntax += j(newSyntax).toSource();
  }
  return definePageMetaSyntax;
};

module.exports = transform;
