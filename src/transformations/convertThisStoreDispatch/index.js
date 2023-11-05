const { getVuexActionSyntax } = require("../../utility/vueThreeSyntax");

const transform = ({ root, j }) => {
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
        let newSyntax = getVuexActionSyntax(currentActionName, paramsSyntax);
        j(path?.parent?.parent).replaceWith(newSyntax);
      }
    });
};

module.exports = transform;
