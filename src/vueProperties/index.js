const getDataState = require("./getDataState");
const getEmitNames = require("./getEmitNames");
const getPropNames = require("./getPropNames");
const getProperties = require("./getProperties");
const getMethodNames = require("./getMethodNames");
const getComputedNames = require("./getComputedNames");
const getComponentRefs = require("./getComponentRefs");
const getNuxtProperties = require("./getNuxtProperties");
const getVuexGetterNames = require("./getVuexGetterNames");
const getVuexActionNames = require("./getVuexActionNames");

module.exports = {
  getEmitNames,
  getDataState,
  getPropNames,
  getProperties,
  getMethodNames,
  getComponentRefs,
  getComputedNames,
  getNuxtProperties,
  getVuexGetterNames,
  getVuexActionNames,
};
