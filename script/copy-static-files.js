import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, "..");

const foldersToCopy = [
  {
    source: path.join(projectRoot, "_docs"),
    destination: path.join(projectRoot, "dist", "_docs"),
  },
  {
    source: path.join(projectRoot, "assets"),
    destination: path.join(projectRoot, "dist", "assets"),
  },
];

async function copyStaticFiles() {
  try {
    for (const folder of foldersToCopy) {
      await fs.rm(folder.destination, {
        recursive: true,
        force: true,
      });
      await fs.cp(folder.source, folder.destination, {
        recursive: true,
      });
      console.log(`Copied: ${path.basename(folder.source)}`);
    }
    console.log("All static files copied successfully!");
  } catch (error) {
    console.error("Failed to copy static files:", error);
    process.exitCode = 1;
  }
}

await copyStaticFiles();
