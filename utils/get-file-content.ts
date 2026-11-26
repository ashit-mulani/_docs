import path from "node:path";
import { docsPath } from "../config/docs-path-config.js";
import fs from "node:fs/promises";

export async function getFileContent({ reqPath }: { reqPath: string }) {
  try {
    let filePath = path.resolve(docsPath, reqPath.replace(/^\/+/, ""));
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, "_index.md");
    } else {
      console.log("file", filePath);
    }
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    return "";
  }
}
