const { getRefSyntax } = require("../../utility/vueThreeSyntax");

const transform = ({ root, j }) => {
  root
    .find(j.Identifier, {
      name: "getters",
    })
    .forEach((path) => {
      const parent = path?.parent?.parent?.value?.property;
      const isStore = path.parent?.value?.object?.property?.name === "$store";
      if (parent && parent.value && isStore) {
        const [storeName, currentGetterName] = parent.value.split("/");
        j(path?.parent?.parent).replaceWith(getRefSyntax(currentGetterName));
      }
    });
  root
    .find(j.Identifier, {
      name: "state",
    })
    .forEach((path) => {
      const storeName = path?.parent?.parent?.value?.property?.name;
      const stateName = path?.parent?.parent.parent.value.property?.name;
      const isStore = path?.parent?.value?.object?.property?.name === "$store";
      if (storeName && stateName && isStore) {
        j(path?.parent?.parent.parent).replaceWith(getRefSyntax(stateName));
      }
    });
};

module.exports = transform;
