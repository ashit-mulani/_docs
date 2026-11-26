import fs from "node:fs/promises";
import path from "node:path";
import { docsPath } from "../config/docs-path-config.js";
import { indexFile, metaFile } from "../config/file-config.js";
import { getTreeOrder } from "./get-tree-order.js";
import { formatTitle } from "./format-title.js";

export interface MenuItemType {
  title: string;
  slug: string;
  type: "file" | "folder";
  children?: MenuItemType[];
}

export async function buildMenuTree(
  currentPath: string = docsPath,
): Promise<MenuItemType[]> {
  try {
    const tree: MenuItemType[] = [];
    const entries = await fs.readdir(currentPath, {
      withFileTypes: true,
    });
    const order = await getTreeOrder({
      folderPath: currentPath,
    });
    if (order && order.length) {
      entries.sort((a, b) => {
        const getOrderIndex = (name: string) => {
          const extension = path.extname(name);
          const nameWithoutExtension = path.basename(name, extension);
          const index = order.findIndex(
            (item) =>
              item.toLowerCase() === name.toLowerCase() ||
              item.toLowerCase() === nameWithoutExtension.toLowerCase(),
          );
          return index;
        };
        const indexA = getOrderIndex(a.name);
        const indexB = getOrderIndex(b.name);
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.name.localeCompare(b.name);
      });
    }
    for (const entry of entries) {
      if (entry.name.startsWith("_") || entry.name === metaFile) {
        continue;
      }
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        const children = await buildMenuTree(fullPath);
        tree.push({
          title: formatTitle(entry.name),
          slug:
            "/" + path.relative(docsPath, fullPath).split(path.sep).join("/"),
          type: "folder",
          children,
        });
      } else if (entry.isFile()) {
        if (entry.name.startsWith(indexFile)) {
          continue;
        }
        const relativePath = path.relative(docsPath, fullPath);
        tree.push({
          title: formatTitle(entry.name),
          slug: "/" + relativePath.split(path.sep).join("/"),
          type: "file",
        });
      }
    }
    return tree;
  } catch (error) {
    return [];
  }
}
