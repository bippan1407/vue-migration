const transform = ({ root, j }) => {
  let state = [];
  root
    .find(j.Property, (path) => {
      if (path.key.name === "data") {
        return true;
      }
      return false;
    })
    .find(j.ReturnStatement)
    .forEach((path) => {
      const properties = path.value.argument.properties;
      if (properties) {
        properties.forEach((property) => {
          const key = property.key.name;
          state.push(key);
        });
      }
    });
  return state;
};

module.exports = transform;
