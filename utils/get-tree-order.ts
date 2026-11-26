import fs from "node:fs/promises";
import path from "node:path";
import { metaFile } from "../config/file-config.js";

export async function getTreeOrder({
  folderPath,
}: {
  folderPath: string;
}): Promise<string[]> {
  try {
    const metaPath = path.join(folderPath, metaFile);
    const content = await fs.readFile(metaPath, "utf-8");
    const meta = JSON.parse(content);
    return Array.isArray(meta.order) ? meta.order : [];
  } catch {
    return [];
  }
}
