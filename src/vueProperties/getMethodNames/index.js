const transform = ({ root, j }) => {
  let methodNames = [];
  root
    .find(j.Property, (path) => {
      if (path.key.name === "methods") {
        return true;
      }
      return false;
    })
    .forEach((path) => {
      const properties = path?.value?.value?.properties;
      if (properties) {
        properties.forEach((property) => {
          const key = property?.key?.name;
          if (key) methodNames.push(key);
        });
      }
    });
  return methodNames;
};

module.exports = transform;
