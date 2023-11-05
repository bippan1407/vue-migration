const { capitalizeFirstLetter } = require(".");
const j = require("jscodeshift");

const getRefSyntax = (refName) => {
  return `${refName}.value`;
};

const getVuexActionSyntax = (actionName, paramsSyntax) => {
  let newSyntax;
  if (paramsSyntax) {
    newSyntax = `${actionName}(${paramsSyntax})`;
  } else {
    newSyntax = `${actionName}()`;
  }
  return newSyntax;
};

const createState = (refName, refValues) => {
  if (refValues) {
    return `const ${refName} = ref(${refValues});\n`;
  } else {
    return `const ${refName} = ref();\n`;
  }
};

const createAccessPiniaStoreSyntax = (
  storeName,
  options = { withoutFunctionCalling: false }
) => {
  if (options.withoutFunctionCalling) {
    return "use" + capitalizeFirstLetter(storeName) + "Store";
  } else {
    return "use" + capitalizeFirstLetter(storeName) + "Store()";
  }
};

const createPiniaStoreSyntax = (storeName) => {
  return `const ${storeName}Store = ${createAccessPiniaStoreSyntax(storeName)}`;
};

const generateCreatePiniaStoreSyntax = (storeNames = []) => {
  let syntax = "";
  storeNames.forEach((name) => {
    syntax += createPiniaStoreSyntax(name) + "\n";
  });
  return syntax;
};

const createRefsPiniaStateAndGettersSyntax = (storeName) => {
  return `storeToRefs(${storeName}Store)`;
};

const createActionsPiniaStore = (arr = []) => {
  let syntax = "";
  Object.entries(arr).forEach(([_storeName, value]) => {
    const storeName = `${_storeName}Store`;
    syntax +=
      createDeclarationSyntax(value, storeName, { spreadSyntax: true }) + "\n";
  });
  return syntax;
};

const createRefsPiniaStateAndGetters = (arr = []) => {
  let syntax = "";
  Object.entries(arr).forEach(([_storeName, _storeStateGetters]) => {
    const storeName = createRefsPiniaStateAndGettersSyntax(_storeName);
    syntax +=
      createDeclarationSyntax(_storeStateGetters, storeName, {
        spreadSyntax: true,
      }) + "\n";
  });
  return syntax;
};

const createDeclarationSyntax = (
  arr = [],
  declarationValue,
  options = { spreadSyntax: false }
) => {
  let syntax = "";
  if (!Array.isArray(arr)) {
    arr = [{ name: arr }];
  }
  arr = arr.map((value) => {
    if (value.as) {
      return `${value.name}: ${value.as}`;
    } else {
      return `${value.name}`;
    }
  });
  syntax += arr.join(", ");
  if (options.spreadSyntax) {
    syntax = `const { ${syntax} } = ${declarationValue}`;
  } else {
    syntax = `const ${syntax} = ${declarationValue}`;
  }
  return syntax;
};

const createComputedSyntax = (computedName, computedBody) => {
  return `const ${computedName} = computed(() => ${j(
    computedBody
  ).toSource()})`;
};

const createMethodsSyntax = (
  methodName,
  methodBody,
  methodParams,
  options = { isAsync: false }
) => {
  let params = "";
  if (methodParams) {
    params = j(methodParams).toSource();
  }
  if (options.isAsync) {
    return `const ${methodName} = async (${params}) => ${j(
      methodBody
    ).toSource()}`;
  } else {
    return `const ${methodName} = (${params}) => ${j(methodBody).toSource()}`;
  }
};

const createLifeCycleHookSyntax = (
  methodName,
  methodBody,
  methodParams = [],
  options = { isAsync: false }
) => {
  let params = "";
  if (methodParams) {
    params = j(methodParams).toSource();
  }
  if (options.isAsync) {
    return `${methodName}(async (${params}) =>  ${j(methodBody).toSource()})`;
  } else {
    return `${methodName}((${params}) =>  ${j(methodBody).toSource()})`;
  }
};

const createImportStoreSyntax = (storeName) => {
  let importValues = createAccessPiniaStoreSyntax(storeName, {
    withoutFunctionCalling: true,
  });
  return createImportSyntax(`~/store/${storeName}`, importValues);
};

const createImportSyntax = (
  importFrom,
  importValues = [],
  options = { destructureImport: true }
) => {
  let importValuesSyntax;
  if (!Array.isArray(importValues)) {
    importValues = [importValues];
  }
  if (options.destructureImport) {
    importValuesSyntax = importValues.join(", ");
  } else {
    importValuesSyntax = importValues[0];
  }
  if (options.destructureImport) {
    return `import { ${importValuesSyntax} } from '${importFrom}'`;
  } else {
    return `import ${importValuesSyntax} from '${importFrom}'`;
  }
};

const createVariableDeclarationSyntax = (
  variableDeclarationKind,
  variableDeclarator,
  initialisedValue
) => {
  const routerDeclaration = j.variableDeclaration(variableDeclarationKind, [
    j.variableDeclarator(
      j.identifier(variableDeclarator),
      j.identifier(initialisedValue)
    ),
  ]);

  return j(routerDeclaration).toSource();
};

const createWatchSyntax = (
  watchValue,
  watchParams,
  watchBody,
  options = { isDeep: false, isImmediate: false }
) => {
  let watchOptionSyntax = "",
    watchSyntax = "";
  if (options.isDeep) watchOptionSyntax += "deep: true";
  else if (options.isImmediate) watchOptionSyntax += "immediate: true";

  if (watchOptionSyntax) {
    watchOptionSyntax = `, { ${watchOptionSyntax} }`;
  }
  watchSyntax = `watch(${watchValue}, (${watchParams}) => ${watchBody}${watchOptionSyntax})`;
  return watchSyntax;
};

module.exports = {
  createState,
  getRefSyntax,
  createWatchSyntax,
  createImportSyntax,
  createMethodsSyntax,
  getVuexActionSyntax,
  createComputedSyntax,
  createPiniaStoreSyntax,
  createDeclarationSyntax,
  createActionsPiniaStore,
  createImportStoreSyntax,
  createLifeCycleHookSyntax,
  createAccessPiniaStoreSyntax,
  generateCreatePiniaStoreSyntax,
  createRefsPiniaStateAndGetters,
  createVariableDeclarationSyntax,
  createRefsPiniaStateAndGettersSyntax,
};
