const { addUniqueValuesToArray } = require("../../utility");

const createActions = (arr, key, value, options = {}) => {
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
  let vuexActions = {};
  root
    .find(j.CallExpression, {
      callee: { name: "mapActions" },
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
          vuexActions = createActions(
            vuexActions,
            getterStoreName,
            getterName.value
          );
        });
      } else if (getterObjectIndex != -1) {
        getterNames = args[getterObjectIndex]?.properties;
        if (getterNameIndex !== -1) {
          getterNames.forEach((getterName) => {
            const currentName = getterName.value.value;
            let asName = getterName.key.name;
            if (asName === currentName) {
              asName = undefined;
            }
            vuexActions = createActions(
              vuexActions,
              getterStoreName,
              currentName,
              { as: asName }
            );
          });
        } else {
          getterNames.forEach((getterName) => {
            const [storeName, currentActionName] =
              getterName.value.value.split("/");
            let asName = getterName.key.name;
            if (asName === currentActionName) {
              asName = undefined;
            }
            if (storeName && currentActionName) {
              vuexActions = createActions(
                vuexActions,
                storeName,
                currentActionName,
                { as: asName }
              );
            }
          });
        }
      }
    });

  root
    .find(j.Identifier, (path) => {
      if (["dispatch", "commit"].includes(path.name)) {
        return true;
      }
      return false;
    })
    .forEach((path) => {
      const nodeArguments = path?.parent?.parent?.value?.arguments;
      // fist literal should have store and action name
      const [storeName, currentActionName] =
        nodeArguments?.[0]?.value.split("/");
      const objectExpression = nodeArguments.find(
        (arg) => arg.type === j.ObjectExpression.name
      );
      const nonObjectParams = nodeArguments[1];
      let paramsSyntax;

      if (objectExpression) paramsSyntax = j(objectExpression).toSource();
      else if (nonObjectParams) paramsSyntax = j(nonObjectParams).toSource();

      if (storeName && currentActionName) {
        vuexActions = createActions(vuexActions, storeName, currentActionName, {
          ...(paramsSyntax ? { params: paramsSyntax } : {}),
        });
      }
    });
  return vuexActions;
};

module.exports = transform;
