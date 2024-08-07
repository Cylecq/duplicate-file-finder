#!/usr/bin/env node

import { promises as fs } from 'fs';
import crypto from 'crypto';
import path from 'path';
import readline from 'readline';

// Function to get file hash
const getFileHash = async (filePath) => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(fileBuffer);
    return hashSum.digest("hex");
  } catch (err) {
    console.error(`Failed to read file ${filePath}:`, err);
    return null;
  }
};

// Function to scan a directory and get all files
const scanDirectory = async (dir) => {
  const files = [];
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...await scanDirectory(fullPath));
      } else if (item.isFile()) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    console.error(`Failed to read directory ${dir}:`, err);
  }

  return files;
};

// Function to find duplicates
const findDuplicates = async (directories) => {
  const fileHashMap = new Map();

  for (const dir of directories) {
    const files = await scanDirectory(dir);

    for (const file of files) {
      const hash = await getFileHash(file);

      if (hash) {
        if (fileHashMap.has(hash)) {
          fileHashMap.get(hash).push(file);
        } else {
          fileHashMap.set(hash, [file]);
        }
      }
    }
  }

  return Array.from(fileHashMap.values()).filter(files => files.length > 1);
};

// Function to prompt user for directories
const promptForDirectories = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Enter directories to scan, separated by commas: ", (input) => {
      const directories = input.split(',').map(dir => dir.trim());
      rl.close();
      resolve(directories);
    });
  });
};

// Function to prompt user for deletion option
const promptForDeletion = () => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question("Do you want to enable file deletion after the scan? (yes/no): ", (input) => {
      const enableDeletion = input.trim().toLowerCase() === 'yes';
      rl.close();
      resolve(enableDeletion);
    });
  });
};

// Function to prompt user for which files to delete
const promptForFileDeletion = (files) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("\nDuplicate group:");
    files.forEach((file, index) => {
      console.log(`${index + 1}: ${file}`);
    });
    rl.question("Enter the numbers of the files to delete, separated by commas (or leave blank to keep all): ", (input) => {
      const fileNumbers = input.split(',').map(num => parseInt(num.trim(), 10) - 1).filter(num => !isNaN(num));
      rl.close();
      resolve(fileNumbers.map(num => files[num]));
    });
  });
};

// Function to delete files
const deleteFiles = async (files) => {
  for (const file of files) {
    try {
      await fs.unlink(file);
      console.log(`Deleted file: ${file}`);
    } catch (err) {
      console.error(`Failed to delete file ${file}:`, err);
    }
  }
};

// Main function
const main = async () => {
  try {
    const directories = await promptForDirectories();
    console.log("Scanning directories:", directories);

    const enableDeletion = await promptForDeletion();
    const duplicates = await findDuplicates(directories);

    if (duplicates.length === 0) {
      console.log("No duplicate files found.");
    } else {
      if (!enableDeletion) {
        console.log("\nDuplicate files found:");
        duplicates.forEach((files) => {
          console.log("\nDuplicate group:");
          files.forEach(file => {
            console.log(` - ${file}`);
          });
        });
      }

      for (const files of duplicates) {
        if (enableDeletion) {
          const filesToDelete = await promptForFileDeletion(files);
          await deleteFiles(filesToDelete);
        }
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

main();