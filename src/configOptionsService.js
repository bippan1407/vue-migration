let configInitialised = false;
let configOptions = {
  projectLocation: null,
  transformedFolderLocation: null,
  dryRun: true,
  emptyTransformFolder: false,
  saveErrorLogs: false,
  commentAxios: true,
  commentOtherCode: true,
  replaceThisExpression: {
    // $axios: {
    //   replaceWith: "$axios",
    //   isPlugin: true,
    // },
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
