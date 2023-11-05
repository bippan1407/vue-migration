const transform = ({ root, j }) => {
  let computedNames = [];
  root
    .find(j.Property, (path) => {
      if (path.key.name === "computed") {
        return true;
      }
      return false;
    })
    .forEach((path) => {
      const properties = path?.value?.value?.properties;
      if (properties) {
        properties.forEach((property) => {
          const key = property?.key?.name;
          if (key) computedNames.push(key);
        });
      }
    });
  return computedNames;
};

module.exports = transform;
