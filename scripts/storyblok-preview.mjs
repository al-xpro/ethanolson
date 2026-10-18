// Serves the production build on https://localhost:3010, the Visual Editor's preview
// location. Draft mode needs a production server (in development, Next.js sets its cookie
// with SameSite=Lax, which the Visual Editor's iframe doesn't send) and HTTPS.
//
//   npm run preview:storyblok
//
// The certificate comes from mkcert, trusted by your browser (brew install mkcert, then
// mkcert -install once).
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";

const key = "certificates/localhost-key.pem";
const cert = "certificates/localhost.pem";
if (!existsSync(cert)) {
  mkdirSync("certificates", { recursive: true });
  execFileSync("mkcert", ["-key-file", key, "-cert-file", cert, "localhost"], { stdio: "inherit" });
}

const site = spawn("npx", ["next", "start", "-p", "3000"], { stdio: "inherit" });

https
  .createServer({ key: readFileSync(key), cert: readFileSync(cert) }, (request, response) => {
    const upstream = http.request(
      {
        host: "localhost",
        port: 3000,
        path: request.url,
        method: request.method,
        headers: { ...request.headers, "x-forwarded-proto": "https" },
      },
      (reply) => {
        response.writeHead(reply.statusCode ?? 502, reply.headers);
        reply.pipe(response);
      }
    );
    upstream.on("error", () => {
      response.writeHead(502);
      response.end("The site is still starting: reload in a moment.");
    });
    request.pipe(upstream);
  })
  .listen(3010, () => console.log("Storyblok preview: https://localhost:3010"));

const stop = () => {
  site.kill();
  process.exit();
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
