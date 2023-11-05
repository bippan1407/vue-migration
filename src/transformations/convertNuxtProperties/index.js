const { nuxtPropertiesToConvert } = require("../../utility");

const transform = ({ root, j }) => {
  nuxtPropertiesToConvert.forEach((property) => {
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
