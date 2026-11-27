import path from "node:path";
import { fileURLToPath } from "node:url";
const currentDir = path.dirname(fileURLToPath(import.meta.url));
export const docsPath = path.resolve(currentDir, "../_docs");
