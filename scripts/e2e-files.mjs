// Usage: node scripts/e2e-files.mjs <workDir> — exports a PDF, re-uploads it, uploads a DOCX, checks results.
import { chromium } from "playwright";
import { execSync } from "node:child_process";
const dir = process.argv[2];
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
await ctx.addInitScript(() => localStorage.setItem("adapted-calm", "true"));
const p = await ctx.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.goto("http://localhost:3100", { waitUntil: "networkidle" });
await p.screenshot({ path: `${dir}/calm-hero.png` });
await p.locator("#studio").scrollIntoViewIfNeeded();
await p.waitForTimeout(1200);
const [dl] = await Promise.all([p.waitForEvent("download"), p.getByRole("button", { name: "Download PDF" }).click()]);
const pdfPath = `${dir}/${dl.suggestedFilename()}`;
await dl.saveAs(pdfPath);
console.log("pdf:", dl.suggestedFilename(), execSync(`wc -c < "${pdfPath}"`).toString().trim(), "bytes");

// Upload the PDF we just made
await p.locator('input[type=file]').setInputFiles(pdfPath);
await p.waitForTimeout(2500);
console.log("pdf upload status:", await p.locator("#source-status").innerText());
console.log("textarea starts:", JSON.stringify((await p.locator("#assignment-text").inputValue()).slice(0, 120)));

// Minimal DOCX
execSync(`python3 - <<'PY'
import zipfile
z = zipfile.ZipFile("${dir}/test.docx", "w")
z.writestr("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
z.writestr("_rels/.rels", '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
paras = ["The Civil War", "Read the passage, then answer the questions.", "The Civil War began in 1861 after decades of conflict over slavery and states rights.", "1. When did the Civil War begin?", "2. Explain two causes of the war."]
body = "".join('<w:p><w:r><w:t>%s</w:t></w:r></w:p>' % t for t in paras)
z.writestr("word/document.xml", '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>%s</w:body></w:document>' % body)
z.close()
PY`);
await p.locator('input[type=file]').setInputFiles(`${dir}/test.docx`);
await p.waitForTimeout(1500);
console.log("docx upload status:", await p.locator("#source-status").innerText());
const txt = await p.locator("#assignment-text").inputValue();
console.log("docx text:", JSON.stringify(txt));
await p.getByRole("button", { name: /^Adapt for/ }).click();
await p.waitForTimeout(2500);
console.log("result badge:", await p.locator("#studio").getByText(/Made without AI|Made just now by AI|Pre-made example/).first().innerText());
console.log("questions kept:", await p.locator("#studio dl > div", { hasText: "Questions kept" }).first().innerText().then((t) => t.replace(/\s+/g, " ")).catch(() => "n/a"));
console.log("page errors:", errors.length ? errors : "none");
await b.close();
