const convertThisStoreGetters = require("../convertThisStoreGetters");
const convertThisStoreDispatch = require("../convertThisStoreDispatch");
const componentRefToRefs = require("../componentRefsToRef");
const convertNuxtProperties = require("../convertNuxtProperties");
const { newEmitSyntaxMapping } = require("../../constants/emitSyntax");
const configOptionsService = require("../../configOptionsService");
const { newPropSyntaxMapping } = require("../../constants/propSyntax");
const { nuxtPropertiesToConvert } = require("../../utility");

const transform = ({ root, j, vueFileData }) => {
  let configOptions = configOptionsService().get();
  const replaceThisExpressionConfigOptions =
    configOptions.replaceThisExpression;
  const propNames = vueFileData.propNames;
  const data = vueFileData.data;
  const computedNames = vueFileData.computedNames;
  const methodNames = vueFileData.methodNames;
  const componentRefNames = vueFileData.componentRefNames;
  let vuexStateGetters = getVuexStateAndGetterArray(vueFileData.vuexGetters);
  let vuexActions = getVuexStateAndGetterArray(vueFileData.vuexActions);
  vuexStateGetters = Array.from(vuexStateGetters);
  const expressionsToConvert = [
    ...nuxtPropertiesToConvert,
    ...vueFileData.importsToAdd,
  ];
  convertNuxtProperties({ root, j }, { properties: expressionsToConvert });
  root.find(j.ThisExpression).forEach((path) => {
    let propertyName = path?.parent?.value?.property?.name;
    const args = path.parent?.parent?.value?.args;
    if (!propertyName) {
      return;
    }
    if (
      Object.keys(replaceThisExpressionConfigOptions).includes(propertyName)
    ) {
      const replaceThisExpressionWithConfigOptions =
        replaceThisExpressionConfigOptions[propertyName];
      if (replaceThisExpressionWithConfigOptions.replaceWith) {
        j(path.parent).replaceWith(
          replaceThisExpressionWithConfigOptions.replaceWith
        );
      } else if (replaceThisExpressionWithConfigOptions.replaceFunctionWith) {
        j(path.parent.parent).replaceWith(
          replaceThisExpressionWithConfigOptions.replaceFunctionWith
        );
      }
    } else if (propNames.includes(propertyName)) {
      const newPropNameForVue3 = newPropSyntaxMapping[propertyName];
      if (newPropNameForVue3) {
        j(path.parent).replaceWith(`props.${newPropNameForVue3}`);
      } else {
        j(path.parent).replaceWith(`props.${propertyName}`);
      }
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
      if (Array.isArray(args)) {
        const [expression] = args;
        if (
          expression &&
          expression.type === j.Literal.name &&
          expression.value &&
          newEmitSyntaxMapping[expression.value]
        ) {
          expression.value = newEmitSyntaxMapping[expression.value];
        }
      }
    } else if (["$refs"].includes(propertyName)) {
      componentRefToRefs({ root, j });
    } else if (["$axios"].includes(propertyName)) {
      if (configOptions.commentAxios) {
        j(path.parent.parent).forEach((path) => {
          path.value.comments = [
            j.commentLine("TODO Need to migrate manually", false, true),
          ];
        });
      }
    } else if (configOptions.commentOtherCode) {
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
