const { createWatchSyntax } = require("../../utility/vueThreeSyntax");

const getSyntax = (j, watcherName, functionExpression, options) => {
  const params = j(functionExpression.params).toSource();
  const body = j(functionExpression.body).toSource();
  let watcherOption = { isDeep: false, isImmediate: false };
  if (options?.key.name === "deep") {
    watcherOption.isDeep = true;
  } else if (options?.key.name === "immediate") {
    watcherOption.isImmediate = true;
  }
  return createWatchSyntax(watcherName, params, body, watcherOption);
};

const transform = ({ root, j }) => {
  let newWatchSyntax = "";
  root
    .find(j.Property, {
      key: { name: "watch" },
    })
    .forEach((path) => {
      path?.value?.value?.properties?.forEach((property) => {
        const watcherName = property?.key?.name;
        const expression = property.value;
        if (expression.type === j.ObjectExpression.name) {
          let [functionExpression, options] = expression.properties;
          functionExpression = functionExpression.value;
          newWatchSyntax +=
            getSyntax(j, watcherName, functionExpression, options) + "\n";
        } else if (expression.type === j.FunctionExpression.name) {
          const functionExpression = property.value;
          newWatchSyntax +=
            getSyntax(j, watcherName, functionExpression) + "\n";
        }
      });
    });
  return newWatchSyntax;
};

module.exports = transform;
