const dataToRef = require("./dataToRef");
const convertEmit = require("./convertEmit");
const convertWatch = require("./convertWatch");
const convertProps = require("./convertProps");
const convertHead = require("./convertHead");
const convertLayout = require("./convertLayout");
const convertImports = require("./convertImports");
const convertMethods = require("./convertMethods");
const convertComputed = require("./convertComputed");
const componentRefToRefs = require("./componentRefsToRef");
const convertNuxtProperties = require("./convertNuxtProperties");
const convertLifecycleHooks = require("./convertLifecycleHooks");
const convertThisExpression = require("./convertThisExpression");
const convertThisStoreGetters = require("./convertThisStoreGetters");
const convertThisStoreDispatch = require("./convertThisStoreDispatch");
module.exports = {
  dataToRef,
  convertEmit,
  convertHead,
  convertWatch,
  convertProps,
  convertLayout,
  convertMethods,
  convertImports,
  convertComputed,
  componentRefToRefs,
  convertThisExpression,
  convertNuxtProperties,
  convertLifecycleHooks,
  convertThisStoreGetters,
  convertThisStoreDispatch,
};
