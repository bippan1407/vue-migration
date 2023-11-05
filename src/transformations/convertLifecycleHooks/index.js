const { lifecycleHooks } = require("../../utility");
const { createLifeCycleHookSyntax } = require("../../utility/vueThreeSyntax");

const vue2ToVue3LifeCycleHookMappings = {
  beforeCreate: "onBeforeCreate",
  created: "onCreated",
  beforeMount: "onBeforeMount",
  mounted: "onMounted",
  beforeUpdate: "onBeforeUpdate",
  updated: "onUpdated",
  beforeUnmount: "onBeforeUnmount",
  unmounted: "onUnmounted",
  errorCaptured: "onErrorCaptured",
  activated: "onActivated",
  deactivated: "onDeactivated",
  destroyed: "onDestroyed",
  beforeDestroy: "onBeforeUnmount",
};

const transform = ({ root, j }) => {
  let lifecycleHooksSyntax = "";
  root
    .find(j.Identifier, (path) => {
      if (lifecycleHooks.includes(path.name)) return true;
      return false;
    })
    .forEach((path) => {
      const lifecycleHookName = path?.value?.name;
      const body = path?.parent.value?.value?.body;
      const isAsync = path?.parent.value?.value?.async;
      const params = path?.parent.value?.value?.params;
      const newLifecycleHookName =
        vue2ToVue3LifeCycleHookMappings[lifecycleHookName];
      if (newLifecycleHookName && body) {
        lifecycleHooksSyntax +=
          createLifeCycleHookSyntax(newLifecycleHookName, body, params, {
            isAsync,
          }) + "\n";
      }
    });
  return lifecycleHooksSyntax;
};

module.exports = transform;
