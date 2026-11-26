import http from "node:http";
import { URL } from "node:url";
import { getFileContent } from "./utils/get-file-content.js";

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const reqPath = decodeURIComponent(url.pathname);
  if (reqPath == "/favicon.ico") {
    res.end("");
  }
  const content = await getFileContent({
    reqPath,
  });
  res.end(JSON.stringify(content));
});

const port = process.env.PORT || 9000;

server.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
