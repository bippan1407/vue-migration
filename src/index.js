#!/usr/bin/env node
const yargs = require("yargs");
const Codemod = require("./codemod");
const fs = require("fs");
const {
  readFilesRecursively,
  getFileExtension,
  deleteFilesInFolderSync,
  homeDirectory,
} = require("./utility");
const path = require("path");
const chalk = require("chalk");
const configOptionsService = require("./configOptionsService");

const { argv } = yargs;
let configOptions = {};
const configLocation = argv["configLocation"];
if (configLocation) {
  configOptionsService().initialise(require(configLocation));
  configOptions = configOptionsService().get();
} else {
  configOptions.projectLocation = argv["projectLocation"];
  configOptions.transformedFolderLocation = argv["transformFolder"];
  configOptions.dryRun = Boolean(argv["configOptions.dryRun"]);
  configOptions.emptyTransformFolder = Boolean(
    argv["configOptions.emptyTransformFolder"]
  );
  configOptions.saveErrorLogs = Boolean(argv["configOptions.saveErrorLogs"]);
  configOptionsService().initialise(configOptions);
  configOptions = configOptionsService().get();
}

const filesToMigrateManually = [];
let totalFile = 0;
let filesMigrated = 0;
const main = (file) => {
  const fileName = path.basename(file);
  if (getFileExtension(fileName) !== "vue") {
    return;
  }
  try {
    console.log(chalk.yellowBright("started processing file - ", fileName));
    totalFile++;
    let codemodTransform = new Codemod();

    codemodTransform.initialiseFile(file, {
      transformedFolderLocation: configOptions.transformedFolderLocation,
      shouldTransformMainFile: !configOptions.dryRun,
    });
    console.log(chalk.greenBright("completed processing file - ", fileName));
    filesMigrated++;
  } catch (error) {
    if (configOptions.isDev) {
      console.log(error);
    }
    console.log(
      chalk.redBright(
        "\nCould not process file - ",
        fileName,
        ", Please migrate this file manually."
      )
    );
    console.log(chalk.redBright("File location - ", file, "\n"));
    // console.log(chalk.redBright(error.message));
    // console.log(chalk.redBright(error.stack));

    if (configOptions.saveErrorLogs) {
      filesToMigrateManually.push({
        fileName: file,
        errorMessage: error.message,
        errorStack: error.stack,
      });
    } else {
      filesToMigrateManually.push(file);
    }
  }
};

function startTransformation(baseFolderLocation) {
  if (!configOptions.projectLocation) {
    console.log(
      chalk.redBright("Please provide absolute path to project location")
    );
    return;
  }
  console.log(chalk.greenBright("Process initiated\n"));
  if (configOptions.transformedFolderLocation) {
    const folder = fs.readdirSync(configOptions.transformedFolderLocation);
    const subdirectoriesAndFiles = folder.filter((file) => {
      const fullPath = `${configOptions.transformedFolderLocation}/${file}`;
      return (
        fs.statSync(fullPath).isDirectory() || fs.statSync(fullPath).isFile()
      );
    });
    if (subdirectoriesAndFiles.length !== 0) {
      if (configOptions.emptyTransformFolder) {
        console.log(chalk.green("Deleting all files in transform folder"));
        deleteFilesInFolderSync(configOptions.transformedFolderLocation);
        console.log(
          chalk.green("All files deleted successfully in transform folder")
        );
      } else {
        console.log(chalk.redBright("Please empty the transform folder"));
        return;
      }
    }
  }
  if (fs.statSync(baseFolderLocation).isFile()) {
    main(baseFolderLocation);
  } else {
    readFilesRecursively(
      baseFolderLocation,
      { skipDir: ["node_modules"] },
      main
    );
  }

  console.log(chalk.greenBright("\nProcess completed"));
  console.log(
    chalk.magentaBright(`\nFiles processed - ${totalFile}
Files successfully migrated - ${filesMigrated}
Files to migrate manually - ${filesToMigrateManually.length}`)
  );
  if (filesToMigrateManually.length) {
    let logFileLocation;
    if (configOptions.saveErrorLogsFilePath) {
      logFileLocation = path.join(
        configOptions.saveErrorLogsFilePath,
        "files-to-migrate-manually.json"
      );
    } else {
      logFileLocation = path.join(
        homeDirectory,
        "files-to-migrate-manually.json"
      );
    }
    fs.writeFileSync(
      logFileLocation,
      JSON.stringify({ data: filesToMigrateManually })
    );
    console.log(
      chalk.greenBright(`\nList of all files that needs to be migrated manually ${logFileLocation}
          `)
    );
  }
}

if(Array.isArray(configOptions.projectLocation)) {
  configOptions.projectLocation.forEach(fileLocation => {
    startTransformation(fileLocation);
  })
} else {
  startTransformation(configOptions.projectLocation);
}
