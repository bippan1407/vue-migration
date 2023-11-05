const transform = ({ root, j }, { nuxtPropertyName }) => {
  if (!nuxtPropertyName) {
    console.log("No Nuxt property defined");
  }
  let isPropertyPresent = false;
  const property = root.find(j.MemberExpression, {
    object: { type: "ThisExpression" },
    property: { name: nuxtPropertyName },
  });
  if (property?.length) {
    isPropertyPresent = true;
  }
  return isPropertyPresent;
};

module.exports = transform;
