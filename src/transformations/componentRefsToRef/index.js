const { getRefSyntax } = require("../../utility/vueThreeSyntax");

const transform = ({ root, j }) => {
  root
    .find(j.MemberExpression, {
      object: { type: "ThisExpression" },
      property: { name: "$refs" },
    })
    ?.forEach((path) => {
      let name = path.parent?.node?.property?.name;
      if (!name) {
        name = path.parent?.node?.property?.value;
      }
      if(name) {
        j(path.parent).replaceWith(() => getRefSyntax(name));
      }
    });
};

module.exports = transform;
