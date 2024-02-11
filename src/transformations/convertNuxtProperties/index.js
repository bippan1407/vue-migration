const transform = ({ root, j }, options = { properties: [] }) => {
  if (!Array.isArray(options.properties)) {
    options.properties = []
  }
  options.properties.forEach((property) => {
    root
      .find(j.MemberExpression, {
        object: { type: "ThisExpression" },
        property: { name: property.name },
      })
      ?.forEach((path) => {
        j(path).replaceWith(() => property.newName);
      });
  });
};

module.exports = transform;
