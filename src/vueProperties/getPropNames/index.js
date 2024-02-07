const transform = ({ root, j }) => {
  let propNames = new Set();
  root
    .find(j.Property, {
      key: { name: "props" },
    })
    .forEach((path) => {
      path.value?.value?.properties?.forEach((property) => {
        propNames.add(property.key.name);
      });
    });
  // for array syntax
  root
    .find(j.Property, {
      key: { name: "props" },
    })
    .forEach((path) => {
      path.value?.value?.elements?.forEach((element) => {
        propNames.add(element.value);
      });
    });
  return Array.from(propNames);
};

module.exports = transform;
