import fs from "fs";
import path from "path";

const indexPath = path.resolve(".next/server/app/index.html");
if (!fs.existsSync(indexPath)) {
  console.log("index.html not found, run npm run build first");
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf8");
const matches = [...html.matchAll(/src="([^"]+\.js)"/g)];
const scripts = matches.map((m) => m[1]);

console.log("Home scripts found:", scripts.length);
let totalBytes = 0;
for (const s of scripts) {
  // s is like /_next/static/chunks/...
  const localRel = s.replace(/^\/_next\//, ".next/");
  const p = path.resolve(localRel);
  if (fs.existsSync(p)) {
    const size = fs.statSync(p).size;
    console.log(`  ${path.basename(p)}: ${size} bytes`);
    totalBytes += size;
  }
}
console.log(`TOTAL HOME JS: ${totalBytes} bytes (${(totalBytes / 1024).toFixed(2)} KB)`);
