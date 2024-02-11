const { addUniqueValuesToArray } = require("../../utility");

const createGetters = (arr, key, value, options = {}) => {
  const checkIfKeyValuesAlreadyExists = arr[key]?.filter(
    (getter) => getter.name === value
  );
  if (checkIfKeyValuesAlreadyExists?.length) {
    return arr;
  }
  const updatedValue = {
    name: value,
    ...options,
  };
  arr = addUniqueValuesToArray(arr, key, updatedValue);
  return arr;
};

const transform = ({ root, j }) => {
  let vuexGetters = {};
  root
    .find(j.CallExpression, (path) => {
      if (["mapGetters", "mapState"].includes(path.callee.name)) {
        return true;
      }
      return false;
    })
    .forEach((path) => {
      const args = path?.value?.arguments;
      const getterNameIndex = args.findIndex(
        (arg) => arg.type === j.Literal.name
      );
      const getterArrayIndex = args.findIndex(
        (arg) => arg.type === j.ArrayExpression.name
      );
      const getterObjectIndex = args.findIndex(
        (arg) => arg.type === j.ObjectExpression.name
      );
      let getterStoreName = args[getterNameIndex]?.value;
      let getterNames;
      if (getterArrayIndex !== -1) {
        getterNames = args[getterArrayIndex]?.elements;
        getterNames.forEach((getterName) => {
          vuexGetters = createGetters(
            vuexGetters,
            getterStoreName,
            getterName.value
          );
        });
      } else if (getterObjectIndex != -1) {
        getterNames = args[getterObjectIndex]?.properties;
        if (getterNameIndex !== -1) {
          getterNames.forEach((getterName) => {
            const options = {};
            const currentName = getterName.value.value;
            let asName = getterName.key.name;
            if (asName !== currentName) {
              options.as = asName;
            }
            vuexGetters = createGetters(
              vuexGetters,
              getterStoreName,
              currentName,
              options
            );
          });
        } else {
          getterNames.forEach((getterName) => {
            const options = {};
            const [storeName, currentGetterName] =
              getterName?.value?.value?.split("/") ?? [];
            let asName = getterName?.key?.name;
            if (asName !== currentGetterName) {
              options.as = asName;
            }
            if (storeName && currentGetterName) {
              vuexGetters = createGetters(
                vuexGetters,
                storeName,
                currentGetterName,
                options
              );
            }
          });
        }
      }
    });
  root
    .find(j.Identifier, {
      name: "getters",
    })
    .forEach((path) => {
      const parent = path?.parent?.parent?.value?.property;
      if (parent && parent.value) {
        const [storeName, currentGetterName] = parent.value.split("/");
        if (storeName && currentGetterName) {
          vuexGetters = createGetters(
            vuexGetters,
            storeName,
            currentGetterName
          );
        }
      }
    });
  root
    .find(j.Identifier, {
      name: "state",
    })
    .forEach((path) => {
      const storeName = path?.parent?.parent?.value?.property?.name;
      const stateName = path?.parent?.parent?.parent?.value.property?.name;
      const isStore = path?.parent?.value?.object?.property?.name === "$store";
      if (isStore && storeName && stateName) {
        if (storeName && stateName) {
          vuexGetters = createGetters(vuexGetters, storeName, stateName);
        }
      }
    });
  return vuexGetters;
};

module.exports = transform;
