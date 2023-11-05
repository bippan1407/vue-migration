const { getRefSyntax } = require("../../utility/vueThreeSyntax");

const transform = ({ root, j }) => {
  root
    .find(j.MemberExpression, {
      object: { type: "ThisExpression" },
      property: { name: "$refs" },
    })
    ?.forEach((path) => {
      const name = path.parent.node.property.name;
      j(path.parent).replaceWith(() => getRefSyntax(name));
    });
};

module.exports = transform;
