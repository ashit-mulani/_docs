import path from "node:path";
import { docsPath } from "../config/docs-path-config.js";
import fs from "node:fs/promises";

export async function getFileContent({
  reqPath,
  forFile,
}: {
  reqPath: string;
  forFile?: "css";
}) {
  try {
    let filePath = path.resolve(docsPath, reqPath.replace(/^\/+/, ""));
    if (forFile == "css") {
      filePath = path.join(filePath, "_index.css");
    } else {
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        filePath = path.join(filePath, "_index.md");
      } else {
      }
    }
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    return "";
  }
}
