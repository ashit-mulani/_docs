import fs from "node:fs/promises";
import path from "node:path";

const source = path.resolve("_docs");
const destination = path.resolve("dist/_docs");

async function copyDocs() {
  try {
    await fs.rm(destination, {
      recursive: true,
      force: true,
    });

    await fs.cp(source, destination, {
      recursive: true,
    });

    console.log("Documentation copied successfully!");
  } catch (error) {
    console.error("Failed to copy documentation:", error);
    process.exitCode = 1;
  }
}

copyDocs();
