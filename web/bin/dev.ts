import { statSync } from "fs";
import * as path from "path";
import './build';

const PROJECT_ROOT = path.resolve(import.meta.dir, '..');
const PUBLIC_DIR = path.resolve(PROJECT_ROOT, "public");
const BUILD_DIR = path.resolve(PROJECT_ROOT, "build");

function serveFromDir(config: {
  directory: string;
  path: string;
}): Response | null {
  let basePath = path.join(config.directory, config.path);
  const suffixes = ["", ".html", "index.html"];

  for (const suffix of suffixes) {
    try {
      const pathWithSuffix = path.join(basePath, suffix);
      const stat = statSync(pathWithSuffix);
      if (stat && stat.isFile()) {
        return new Response(Bun.file(pathWithSuffix));
      }
    } catch (err) {}
  }

  return null;
}

function serveFile(reqPath: string) {
  const publicResponse = serveFromDir({
    directory: PUBLIC_DIR,
    path: reqPath,
  });
  if (publicResponse) return publicResponse;

  const buildResponse = serveFromDir({ directory: BUILD_DIR, path: reqPath });
  if (buildResponse) return buildResponse;
}

function serveIndexHtml(reqPath: string) {
  if (!path.extname(reqPath)) {
    return serveFile('/index.html')
  }
}

const server = Bun.serve({
  port: process.env.PORT || 1235,

  fetch(request) {
    let reqPath = new URL(request.url).pathname;
    console.log(request.method, reqPath);
    if (reqPath === "/") reqPath = "/index.html";

    return serveFile(reqPath) || serveIndexHtml(reqPath) || new Response("File not found", {
      status: 404,
    });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
