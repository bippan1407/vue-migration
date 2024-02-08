const configOptionsService = require("../../configOptionsService");

const transform = ({ root, j }) => {
  let configOptions = configOptionsService().get();
  const thisExpressionToReplaceNames = Object.keys(
    configOptions.replaceThisExpression
  );
  const plugins = new Set();
  root.find(j.ThisExpression).forEach((path) => {
    let propertyName = path.parent?.value?.property?.name;
    if (!propertyName) {
      return;
    }
    if (thisExpressionToReplaceNames.includes(propertyName)) {
      const expressionToReplace =
        configOptions.replaceThisExpression[propertyName];
      if (expressionToReplace.isPlugin) {
        plugins.add(expressionToReplace.replaceWith);
      }
    }
  });
  return Array.from(plugins);
};

module.exports = transform;
