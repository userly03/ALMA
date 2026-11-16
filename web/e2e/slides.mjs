// Genera docs/submit/ALMA-demo-slides.pdf (7 diapositivas) desde docs/submit/slides/index.html: node e2e/slides.mjs
import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.goto(new URL("../../docs/submit/slides/index.html", import.meta.url).href, { waitUntil: "load" });
await p.pdf({ path: new URL("../../docs/submit/ALMA-demo-slides.pdf", import.meta.url).pathname, width: "1280px", height: "720px", printBackground: true, preferCSSPageSize: true });
await b.close(); console.log("ok");
