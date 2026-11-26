import path from "node:path";
import { allowTitleNameformat } from "../config/file-config.js";

export function formatTitle(filename: string): string {
  if (allowTitleNameformat) {
    return path
      .basename(filename, path.extname(filename))
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  } else {
    return path.basename(filename, path.extname(filename));
  }
}
