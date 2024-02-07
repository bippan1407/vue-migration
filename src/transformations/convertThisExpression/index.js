const convertThisStoreGetters = require("../convertThisStoreGetters");
const { getRefSyntax } = require("../../utility/vueThreeSyntax");
const convertThisStoreDispatch = require("../convertThisStoreDispatch");
const componentRefToRefs = require("../componentRefsToRef");
const convertNuxtProperties = require("../convertNuxtProperties");
const { nuxtPropertiesToConvert } = require("../../utility");

const transform = ({ root, j, vueFileData }) => {
  const propNames = vueFileData.propNames;
  const data = vueFileData.data;
  const computedNames = vueFileData.computedNames;
  const methodNames = vueFileData.methodNames;
  const componentRefNames = vueFileData.componentRefNames;
  let vuexStateGetters = getVuexStateAndGetterArray(vueFileData.vuexGetters);
  let vuexActions = getVuexStateAndGetterArray(vueFileData.vuexActions);
  vuexStateGetters = Array.from(vuexStateGetters);
  convertNuxtProperties({ root, j });
  root.find(j.ThisExpression).forEach((path) => {
    const propertyName = path.parent?.value?.property?.name;
    if (!propertyName) {
      return;
    }
    if (propNames.includes(propertyName)) {
      j(path.parent).replaceWith(`props.${propertyName}`);
    } else if (
      data.includes(propertyName) ||
      computedNames.includes(propertyName) ||
      vuexStateGetters.includes(propertyName)
    ) {
      j(path.parent).replaceWith(`${propertyName}.value`);
    } else if (
      methodNames.includes(propertyName) ||
      vuexActions.includes(propertyName)
    ) {
      j(path.parent).replaceWith(`${propertyName}`);
    } else if (["$emit"].includes(propertyName)) {
      j(path.parent).replaceWith(`emit`);
    } else if (["$refs"].includes(propertyName)) {
      componentRefToRefs({ root, j });
    } else if (["$axios"].includes(propertyName)) {
      j(path.parent.parent).forEach((path) => {
        path.value.comments = [
          j.commentLine("TODO Need to migrate manually", false, true),
        ];
        // return j(path).toSource();
      });
    } else {
      j(path.parent.parent).forEach((path) => {
        path.value.comments = [
          j.commentLine("TODO Need to migrate manually", false, true),
        ];
        // return `// TODO Need to migrate manually
        // // ${j(path).toSource()}`;
      });
    }
  });
  convertThisStoreGetters({ root, j });
  convertThisStoreDispatch({ root, j });
};

const getVuexStateAndGetterArray = (vuexStateGetters) => {
  let uniqueVuexStateGetters = new Set();
  Object.entries(vuexStateGetters).forEach(([_storeName, stateGetter]) => {
    stateGetter.forEach((value) => {
      if (value.as) uniqueVuexStateGetters.add(value.as);
      uniqueVuexStateGetters.add(value.name);
    });
  });
  return Array.from(uniqueVuexStateGetters);
};

module.exports = transform;
