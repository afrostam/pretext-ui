// Injects the server-rendered landing page into dist/index.html so crawlers
// (and visitors before JS loads) get real content instead of an empty <div>.
// Also writes sitemap.xml with today's date.
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const SITE_URL = "https://afrostam.github.io/pretext-ui/";

const { render } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href);
const indexPath = `${root}dist/index.html`;
const html = await readFile(indexPath, "utf8");
const placeholder = '<div id="root"></div>';
if (!html.includes(placeholder)) throw new Error("prerender: #root placeholder not found");
await writeFile(indexPath, html.replace(placeholder, `<div id="root">${render()}</div>`));

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  `${root}dist/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}</loc><lastmod>${today}</lastmod></url>
</urlset>
`
);

await rm(`${root}dist-ssr`, { recursive: true, force: true });
console.log("prerender: injected HTML and wrote sitemap.xml");
