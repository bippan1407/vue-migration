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

const { argv } = yargs;

const projectLocation = argv["projectLocation"];
const transformedFolderLocation = argv["transformFolder"];
let dryRun = argv["dryRun"];
let emptyTransformFolder = argv["emptyTransformFolder"];
let saveErrorLogs = argv["saveErrorLogs"];

if (dryRun === "false") {
  dryRun = false;
} else {
  dryRun = true;
}

if (emptyTransformFolder === "true") {
  emptyTransformFolder = true;
} else {
  emptyTransformFolder = false;
}

if (saveErrorLogs === "true") {
  saveErrorLogs = true;
} else {
  saveErrorLogs = false;
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
      transformedFolderLocation,
      shouldTransformMainFile: !dryRun,
    });
    console.log(chalk.greenBright("completed processing file - ", fileName));
    filesMigrated++;
  } catch (error) {
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

    if (saveErrorLogs) {
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
  if (!projectLocation) {
    console.log(
      chalk.redBright("Please provide absolute path to project location")
    );
    return;
  }
  console.log(chalk.greenBright("Process initiated\n"));
  if (transformedFolderLocation) {
    const folder = fs.readdirSync(transformedFolderLocation);
    const subdirectoriesAndFiles = folder.filter((file) => {
      const fullPath = `${transformedFolderLocation}/${file}`;
      return (
        fs.statSync(fullPath).isDirectory() || fs.statSync(fullPath).isFile()
      );
    });
    if (subdirectoriesAndFiles.length !== 0) {
      if (emptyTransformFolder) {
        console.log(chalk.green("Deleting all files in transform folder"));
        deleteFilesInFolderSync(transformedFolderLocation);
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
    readFilesRecursively(baseFolderLocation, main);
  }

  console.log(chalk.greenBright("\nProcess completed"));
  console.log(
    chalk.magentaBright(`\nFiles processed - ${totalFile}
Files successfully migrated - ${filesMigrated}
Files to migrate manually - ${filesToMigrateManually.length}`)
  );
  if (filesToMigrateManually.length) {
    const logFileLocation = path.join(
      homeDirectory,
      "files-to-migrate-manually.json"
    );
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

startTransformation(projectLocation);
