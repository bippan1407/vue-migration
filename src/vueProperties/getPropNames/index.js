const transform = ({ root, j }) => {
  let propNames = [];
  root
    .find(j.Property, {
      key: { name: "props" },
    })
    .forEach((path) => {
      path.value?.value?.properties?.forEach((property) => {
        propNames.push(property.key.name);
      });
    });
  // for array syntax
  root
    .find(j.Property, {
      key: { name: "props" },
    })
    .forEach((path) => {
      path.value?.value?.elements?.forEach((element) => {
        propNames.push(element.value);
      });
    });
  return propNames;
};

module.exports = transform;
