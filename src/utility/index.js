const path = require("path");
const fs = require("fs");

const addUniqueValuesToArray = (arr, key, value) => {
  if (arr[key]) {
    arr[key].push(value);
  } else {
    arr[key] = [value];
  }
  return arr;
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getFileName(filePath) {
  var filename = path.basename(filePath);
  return filename;
}

function deleteFilesInFolderSync(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

const lifecycleHooks = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeUnmount",
  "unmounted",
  "errorCaptured",
  "activated",
  "deactivated",
  "destroyed",
  "beforeDestroy",
];

const notRequiredProperties = ["name", "components"];

const allVueProperties = [
  "mounted",
  "computed",
  "watch",
  "emits",
  "head",
  "fetch",
  "asyncData",
  "head",
  "layout",
  "mixins",
  ...lifecycleHooks,
  ...notRequiredProperties,
];

function readFilesRecursively(folderPath, fileCallback) {
  const files = fs.readdirSync(folderPath);

  files.forEach((fileName) => {
    const filePath = path.join(folderPath, fileName);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      readFilesRecursively(filePath, fileCallback);
    } else if (fileStat.isFile()) {
      fileCallback(filePath);
    }
  });
}

function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

const nuxtPropertiesToConvert = [
  {
    name: "$router",
    newName: "router",
  },
  {
    name: "$route",
    newName: "route",
  },
  {
    name: "$device",
    newName: "device",
  },
];

const homeDirectory = path.join(
  process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH
);

const addCodeInRegion = (regionName, code) => {
  if (!code) {
    return "";
  }
  return `\n// #region ${regionName}
${code}
// #endregion ${regionName}\n`;
};

module.exports = {
  getFileName,
  homeDirectory,
  lifecycleHooks,
  addCodeInRegion,
  getFileExtension,
  allVueProperties,
  readFilesRecursively,
  notRequiredProperties,
  capitalizeFirstLetter,
  addUniqueValuesToArray,
  deleteFilesInFolderSync,
  nuxtPropertiesToConvert,
};
