const transform = ({ root, j }) => {
  let headSyntax = "";
  root
    .find(j.Property, {
      key: { name: "head" },
    })
    .forEach((path) => {
      if (path.value.value.body) {
        headSyntax += `useHead(() => ${j(path.value.value.body).toSource()})`;
      }
    });
  return headSyntax;
};

module.exports = transform;
