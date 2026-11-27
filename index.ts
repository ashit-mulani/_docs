import http, { OutgoingHttpHeaders } from "node:http";
import { URL } from "node:url";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { getFileContent } from "./utils/get-file-content.js";
import { buildMenuTree } from "./utils/build-menu-tree.js";
import { renderHtml } from "./utils/html-renderer.js";
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const assetsPath = path.resolve(currentDir, "assets");

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(
      req.url || "/",
      `http://${req.headers.host || "localhost"}`,
    );

    const reqPath = decodeURIComponent(url.pathname);

    // Static assets
    if (reqPath.startsWith("/_") || reqPath === "/favicon.ico") {
      const filePath = path.resolve(assetsPath, reqPath.replace(/^\/+/, ""));
      if (!filePath.startsWith(assetsPath + path.sep)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      const content = await fs.readFile(filePath);

      const headers: OutgoingHttpHeaders = {};

      if (filePath.endsWith(".ico")) {
        headers["Content-Type"] = "image/x-icon";
      } else if (filePath.endsWith(".css")) {
        headers["Content-Type"] = "text/css";
      } else if (filePath.endsWith(".js")) {
        headers["Content-Type"] = "text/javascript";
      } else if (filePath.endsWith(".png")) {
        headers["Content-Type"] = "image/png";
      } else if (filePath.endsWith(".svg")) {
        headers["Content-Type"] = "image/svg+xml";
      }

      res.writeHead(200, headers);
      res.end(content);
      return;
    }

    // Documentation
    const menuTree = await buildMenuTree();

    const content = await getFileContent({
      reqPath,
    });

    const cssContent = await getFileContent({
      reqPath,
      forFile: "css",
    });

    const html = await renderHtml({
      menuTree,
      content,
      currentSlug: reqPath,
      cssContent,
    });

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });

    res.end(html);
  } catch (error) {
    console.error("Server error:", error);

    res.writeHead(500);
    res.end("Internal server error");
  }
});

const port = process.env.PORT || 9000;

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
