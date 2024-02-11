const transform = ({ root, j }) => {
  let state = [];
  const foundData = root
    .find(j.Property, (path) => {
      if (path.key.name === "data") {
        return true;
      }
      return false;
    })

  foundData.find(j.ReturnStatement)
    .forEach((path) => {
      const properties = path.value?.argument?.properties;
      if (properties) {
        properties.forEach((property) => {
          const key = property?.key?.name;
          if (key) {
            state.push(key);
          }
        });
      }
    });
  if (!state.length) {
    foundData
      .find(j.ArrowFunctionExpression)
      .forEach((path) => {
        const properties = path.value?.body?.properties;
        if (properties) {
          properties.forEach((property) => {
            const key = property?.key?.name;
            if (key) {
              state.push(key);
            }
          });
        }
      });
  }
  return state;
};

module.exports = transform;
