const vc = require("vue-codemod");
const fs = require("fs");
const vueProperties = require("./vueProperties");
const transformations = require("./transformations");
const {
  createState,
  createRefsPiniaStateAndGetters,
  createActionsPiniaStore,
  generateCreatePiniaStoreSyntax,
  createVariableDeclarationSyntax,
} = require("./utility/vueThreeSyntax");
const {
  lifecycleHooks,
  notRequiredProperties,
  allVueProperties,
  getFileName,
  addCodeInRegion,
} = require("./utility");

class Codemod {
  filePath = "";
  fileInfo;
  transformationValues = {
    layout: "",
    data: "",
    props: "",
    emits: "",
    lifecycleHooks: "",
    computed: "",
    watch: "",
    methods: "",
    codeToMigrateManually: "",
    imports: "",
  };
  vueFileData = {
    vuexGetters: {},
    vuexActions: {},
    allProperties: [],
    componentRefNames: [],
    propNames: [],
    data: [],
    computedNames: [],
    methodNames: [],
    emitNames: [],
    isRouterPresent: false,
    isDevicePresent: false,
    isRoutePresent: false,
  };
  config = {
    importsToSkip: ["vuex"],
  };
  transformationObject = {
    j: null,
    root: null,
    vueFileData: this.vueFileData,
    config: this.config,
  };

  #mapVuePropertiesToCodeGenerationFunc = {
    layout: () => this.runTransformation.generateLayout(),
    emits: () => this.runTransformation.generateEmits(),
    props: () => this.runTransformation.generateProps(),
    data: () => this.runTransformation.generateState(),
    computed: () => this.runTransformation.generateComputedProperties(),
    methods: () => this.runTransformation.generateMethods(),
    lifecycleHooks: () => this.runTransformation.generateAllLifeCycleHooks(),
    watch: () => this.runTransformation.generateWatch(),
  };

  initialiseFile = (
    _filePath,
    options = {
      shouldTransformMainFile: false,
      transformedFolderLocation: null,
    }
  ) => {
    this.filePath = _filePath;
    this.fileInfo = {
      path: this.filePath,
      source: fs.readFileSync(this.filePath).toString(),
    };
    let fileSource = vc.runTransformation(this.fileInfo, (fileInfo, api) => {
      this.transformationObject.j = api.jscodeshift;
      this.transformationObject.root = api.jscodeshift(fileInfo.source);
      this.initialiseVueProperties();
      if (
        options.transformedFolderLocation ||
        options.shouldTransformMainFile
      ) {
        return this.transform();
      }
    });
    fileSource = fileSource.replace("<script>", "<script setup>");
    let transformFileLocation;
    if (!options.shouldTransformMainFile && options.transformedFolderLocation) {
      transformFileLocation = `${
        options.transformedFolderLocation
      }/${getFileName(this.filePath)}`;
    } else if (options.shouldTransformMainFile) {
      transformFileLocation = this.filePath;
    }
    if (transformFileLocation) {
      fs.writeFileSync(`${transformFileLocation}`, fileSource);
    }
  };

  initialiseVueProperties = () => {
    this.vueFileData.data = vueProperties.getDataState(
      this.transformationObject
    );
    this.vueFileData.componentRefNames = vueProperties.getComponentRefs(
      this.transformationObject
    );
    this.vueFileData.allProperties = vueProperties.getProperties(
      this.transformationObject
    );
    this.vueFileData.propNames = vueProperties.getPropNames(
      this.transformationObject
    );
    this.vueFileData.vuexGetters = vueProperties.getVuexGetterNames(
      this.transformationObject
    );
    this.vueFileData.vuexActions = vueProperties.getVuexActionNames(
      this.transformationObject
    );
    this.vueFileData.computedNames = vueProperties.getComputedNames(
      this.transformationObject
    );
    this.vueFileData.methodNames = vueProperties.getMethodNames(
      this.transformationObject
    );
    this.vueFileData.emitNames = vueProperties.getEmitNames(
      this.transformationObject
    );
    this.vueFileData.isRouterPresent = vueProperties.getNuxtProperties(
      this.transformationObject,
      { nuxtPropertyName: "$router" }
    );
    this.vueFileData.isRoutePresent = vueProperties.getNuxtProperties(
      this.transformationObject,
      { nuxtPropertyName: "$route" }
    );
    this.vueFileData.isDevicePresent = vueProperties.getNuxtProperties(
      this.transformationObject,
      { nuxtPropertyName: "$device" }
    );
    // Handling edge cases
    if (
      (this.vueFileData.componentRefNames.length ||
        Object.keys(this.vueFileData.vuexGetters)?.length) &&
      !this.vueFileData.allProperties.includes("data")
    ) {
      this.vueFileData.allProperties.push("data");
    }
    if (
      this.vueFileData.emitNames.length &&
      !this.vueFileData?.allProperties?.includes("emits")
    ) {
      this.vueFileData.allProperties.push("emits");
    }
  };

  getCurrentTransformFileName = () => {
    return filePath;
  };

  transform = () => {
    const { j, root } = this.transformationObject;
    this.transformationValues.imports = transformations.convertImports(
      this.transformationObject
    );
    transformations.convertThisExpression(this.transformationObject);
    this.vueFileData.allProperties.forEach((propertyName) => {
      const isLifecycleHook = lifecycleHooks.includes(propertyName);
      const isNotrequiredProperties =
        notRequiredProperties.includes(propertyName);
      if (isLifecycleHook) {
        propertyName = "lifecycleHooks";
      }
      const generationCodeExists =
        this.#mapVuePropertiesToCodeGenerationFunc[propertyName];
      if (
        !isNotrequiredProperties &&
        generationCodeExists &&
        typeof generationCodeExists === "function"
      ) {
        generationCodeExists();
      } else if (
        !isNotrequiredProperties &&
        allVueProperties.includes(propertyName)
      ) {
        root
          .find(j.Property, {
            key: { name: propertyName },
          })
          .forEach((path) => {
            const newSyntax = `// TODO Code to migrate manually
            ${j(path).toSource()}
            `;
            this.transformationValues.codeToMigrateManually += newSyntax + "\n";
          });
      }
    });
    const newUpdatedSyntax = this.addSyntaxInOrder();
    root.find(j.Program).replaceWith((_path) => {
      return newUpdatedSyntax;
    });
    return newUpdatedSyntax;
  };

  runTransformation = {
    generateState: () => {
      let state = "",
        storeSyntax = "",
        componentRefs = "";
      state += addCodeInRegion(
        "nuxt properties",
        this.generateNuxtPropertiesSyntax()
      );
      const allStoreNames = this.getAllStoreNames();
      storeSyntax += generateCreatePiniaStoreSyntax(allStoreNames);
      storeSyntax += createRefsPiniaStateAndGetters(
        this.vueFileData.vuexGetters
      );
      storeSyntax += createActionsPiniaStore(this.vueFileData.vuexActions);
      state += addCodeInRegion("pinia state, getters and actions", storeSyntax);
      state += addCodeInRegion(
        "component data",
        transformations.dataToRef(this.transformationObject)
      );
      this.vueFileData.componentRefNames.forEach((value) => {
        componentRefs += createState(value);
      });
      state += addCodeInRegion("component refs", componentRefs);
      this.transformationValues.data = state;
    },
    generateProps: () => {
      this.transformationValues.props = addCodeInRegion(
        "props",
        transformations.convertProps(this.transformationObject)
      );
    },
    generateEmits: () => {
      this.transformationValues.emits = addCodeInRegion(
        "emits",
        transformations.convertEmit(this.transformationObject)
      );
    },
    generateAllLifeCycleHooks: () => {
      this.transformationValues.lifecycleHooks = addCodeInRegion(
        "lifecycle hooks",
        transformations.convertLifecycleHooks(this.transformationObject)
      );
    },
    generateComputedProperties: () => {
      this.transformationValues.computed = addCodeInRegion(
        "computed properties",
        transformations.convertComputed(this.transformationObject)
      );
    },
    generateMethods: () => {
      this.transformationValues.methods = addCodeInRegion(
        "methods",
        transformations.convertMethods(this.transformationObject)
      );
    },
    generateLayout: () => {
      this.transformationValues.layout = addCodeInRegion(
        "layout",
        transformations.convertLayout(this.transformationObject)
      );
    },
    generateWatch: () => {
      this.transformationValues.watch = addCodeInRegion(
        "watch",
        transformations.convertWatch(this.transformationObject)
      );
    },
  };

  getSource() {
    return this.transformationObject.root.toSource();
  }

  getAllStoreNames() {
    let storeNames = new Set();
    Object.keys(this.vueFileData.vuexActions).forEach((name) =>
      storeNames.add(name)
    );
    Object.keys(this.vueFileData.vuexGetters).forEach((name) =>
      storeNames.add(name)
    );
    return Array.from(storeNames);
  }

  addSyntaxInOrder = () => {
    let order = [
      "imports",
      "layout",
      "emits",
      "props",
      "data",
      "computed",
      "watch",
      "methods",
      "lifecycleHooks",
      "codeToMigrateManually",
    ];
    let newUpdatedSyntax = "\n";
    order.forEach((propertyName) => {
      const newSyntax = this.transformationValues[propertyName];
      if (newSyntax) {
        newUpdatedSyntax += newSyntax + "\n";
      }
    });
    return newUpdatedSyntax;
  };

  generateNuxtPropertiesSyntax = () => {
    let syntax = "";
    if (this.vueFileData.isRouterPresent) {
      syntax +=
        createVariableDeclarationSyntax("const", "router", "useRouter()") +
        "\n";
    }
    if (this.vueFileData.isRoutePresent) {
      syntax +=
        createVariableDeclarationSyntax("const", "route", "useRoute()") + "\n";
    }
    if (this.vueFileData.isDevicePresent) {
      syntax +=
        createVariableDeclarationSyntax("const", "device", "useDevice()") +
        "\n";
    }
    return syntax;
  };
}

module.exports = Codemod;
