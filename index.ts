import http from "node:http";
import { URL } from "node:url";
import { getFileContent } from "./utils/get-file-content.js";
import { buildMenuTree } from "./utils/build-menu-tree.js";
import { renderHtml } from "./utils/html-renderer.js";
import path from "node:path";
import fs from "node:fs/promises";

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const reqPath = decodeURIComponent(url.pathname);
  if (reqPath == "/favicon.ico") {
    res.writeHead(204);
    res.end("");
    return;
  }
  if (reqPath === "/_index.css") {
    const cssPath = path.resolve(process.cwd(), "public", "_index.css");
    const css = await fs.readFile(cssPath, "utf-8");
    res.writeHead(200, {
      "Content-Type": "text/css; charset=utf-8",
    });
    res.end(css);
    return;
  }
  const menuTree = await buildMenuTree();
  const content = await getFileContent({
    reqPath,
  });
  const html = await renderHtml({
    menuTree,
    content,
    currentSlug: reqPath,
  });
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
  });
  res.end(html);
  return;
});

const port = process.env.PORT || 9000;

server.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
