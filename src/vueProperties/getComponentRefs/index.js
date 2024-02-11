const transform = ({ root, j }) => {
  let refNames = new Set();
  root
    .find(j.MemberExpression, {
      object: { type: "ThisExpression" },
      property: { name: "$refs" },
    })
    ?.forEach((path) => {
      const name = path?.parent?.node?.property?.name;
      if(name) {
        refNames.add(name);
      }
    });
  return Array.from(refNames);
};

module.exports = transform;
