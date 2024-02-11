let configInitialised = false;
let configOptions = {
  isDev: false,
  projectLocation: null,
  transformedFolderLocation: null,
  dryRun: true,
  emptyTransformFolder: false,
  saveErrorLogs: false,
  saveErrorLogsFilePath: "",
  commentAxios: true,
  commentOtherCode: true,
  replaceThisExpression: {
    // $axios: {
    //   replaceWith: "$axios",
    //   isPlugin: true,
    // },
  //   "getSourceModule": {
  //     "replaceWith": "getSourceModule",
  //     "isPlugin": false,
  //     "isImport": true,
  //     "importSyntax": "import getSourceModule from '~/utils/webengageAttributeSelect'"
  // }
  },
};

function configOptionsService() {
  return {
    get() {
      return configOptions;
    },
    initialise(options) {
      if (configInitialised) {
        return;
      }
      configInitialised = true;
      configOptions = {
        ...configOptions,
        ...options,
      };
    },
  };
}

module.exports = configOptionsService;
