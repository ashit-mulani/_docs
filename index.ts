import http, { OutgoingHttpHeaders } from "node:http";
import { URL } from "node:url";
import { getFileContent } from "./utils/get-file-content.js";
import { buildMenuTree } from "./utils/build-menu-tree.js";
import { renderHtml } from "./utils/html-renderer.js";
import path from "node:path";
import fs from "node:fs/promises";

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const reqPath = decodeURIComponent(url.pathname);
    if (reqPath.startsWith("/_") || reqPath == "/favicon.ico") {
      const filePath = path.resolve(
        process.cwd(),
        "assets",
        reqPath.replace(/^\//, ""),
      );
      const content = await fs.readFile(filePath);
      const headers: OutgoingHttpHeaders = {};
      if (filePath.endsWith(".ico")) headers["Content-Type"] = "image/x-icon";
      res.writeHead(200, headers);
      res.end(content);
      return;
    }
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
    res.writeHead(500);
    res.end("Internal server error");
  }
});

const port = process.env.PORT || 9000;

server.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
