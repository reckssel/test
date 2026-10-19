/* ==========================================================================
   Erzeugt mit Chromium (Playwright):
     downloads/satzung.pdf                 aus de/satzung.html (Druckansicht)
     downloads/beitragsordnung.pdf         aus de/beitragsordnung.html
     downloads/spendennachweis-vorlage.pdf aus tools/templates/spendennachweis.html
     assets/og-image.png                   aus tools/templates/og-image.html

   Nur nötig, wenn sich Satzung, Beitragsordnung, Vorlage oder Logo ändern.
   Voraussetzung: einmalig „npm install“ in tools/tests (installiert Playwright).
   Aufruf (im Hauptverzeichnis des Repositorys):  node tools/make_assets.cjs
   ========================================================================== */
const path = require("path");
const { pathToFileURL } = require("url");

function loadPlaywright() {
  const candidates = [path.join(__dirname, "tests", "node_modules", "playwright"), "playwright"];
  for (const c of candidates) {
    try { return require(c); } catch (e) { /* nächster Versuch */ }
  }
  throw new Error("Playwright nicht gefunden – bitte in tools/tests „npm install“ ausführen.");
}

const ROOT = path.resolve(__dirname, "..");
const file = (rel) => pathToFileURL(path.join(ROOT, rel)).href;

(async () => {
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const pdfs = [
    ["de/satzung.html", "downloads/satzung.pdf", "Satzung des Skills Lab e.V."],
    ["de/beitragsordnung.html", "downloads/beitragsordnung.pdf", "Beitragsordnung des Skills Lab e.V."],
    ["tools/templates/spendennachweis.html", "downloads/spendennachweis-vorlage.pdf", "Vereinfachter Spendennachweis (Vorlage)"],
  ];
  for (const [src, out, title] of pdfs) {
    await page.goto(file(src), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print", colorScheme: "light" });
    await page.pdf({
      path: path.join(ROOT, out),
      format: "A4",
      margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size:8px;width:100%;padding:0 20mm;color:#555">${title} – Platzhaltertext, vom Verein zu beschließen und rechtlich zu prüfen</div>`,
      footerTemplate: '<div style="font-size:8px;width:100%;padding:0 20mm;color:#555;text-align:right">Seite <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      printBackground: false,
      tagged: true,
      outline: true,
    });
    console.log("erzeugt:", out);
  }

  await page.emulateMedia({ media: "screen", colorScheme: "light" });
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto(file("tools/templates/og-image.html"), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(ROOT, "assets/og-image.png"), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log("erzeugt: assets/og-image.png");

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
