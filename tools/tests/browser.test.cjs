/* ==========================================================================
   Browser-Tests für die Website Skills Lab e.V. (Playwright + Chromium)

   Prüft: Layout in 3 Breiten, JavaScript-Fehler, Barrierefreiheit (axe-core,
   hell und dunkel), Tastatur und Menü, Einwilligung/Karte, Formulare in drei
   Sprachen, IBAN-Prüfung, GiroCode (dekodiert mit jsQR), Termine, Sprachweiche,
   Betrieb über file://.

   Einrichtung (einmalig):  cd tools/tests && npm install
   Aufruf:                  node browser.test.cjs
   Screenshots:             tools/tests/output/
   ========================================================================== */
"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const vm = require("vm");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");
const jsQR = require("jsqr");
const { PNG } = require("pngjs");
const AXE_SOURCE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const ROOT = path.resolve(__dirname, "..", "..");
const OUT = path.join(__dirname, "output");
fs.mkdirSync(OUT, { recursive: true });

const site = JSON.parse(fs.readFileSync(path.join(ROOT, "data/site.json"), "utf8"));
const i18n = Object.fromEntries(["de", "en", "ru"].map((l) => [l, JSON.parse(fs.readFileSync(path.join(ROOT, `i18n/${l}.json`), "utf8"))]));
const PAGES = ["de", "en", "ru"].flatMap((l) => fs.readdirSync(path.join(ROOT, l)).filter((f) => f.endsWith(".html")).map((f) => `${l}/${f}`));
const SLUG = { de: { contact: "kontakt.html", donate: "spenden.html", membership: "mitglied-werden.html", dates: "termine.html", cookies: "cookie-einstellungen.html", statutes: "satzung.html" },
               en: { contact: "contact.html", donate: "donate.html", membership: "membership.html", dates: "dates.html", cookies: "cookie-settings.html", statutes: "statutes.html" },
               ru: { contact: "contact.html", donate: "donate.html", membership: "membership.html", dates: "dates.html", cookies: "cookie-settings.html", statutes: "statutes.html" } };

/* Mini-Testrahmen ------------------------------------------------------------ */
const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? "✔" : "✘"} ${name}${!ok && detail ? " – " + detail : ""}`);
}

/* Statischer Server (ohne Abhängigkeiten) ------------------------------------ */
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml",
                ".png": "image/png", ".woff2": "font/woff2", ".pdf": "application/pdf", ".xml": "application/xml", ".txt": "text/plain", ".json": "application/json" };
function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (p.endsWith("/")) p += "index.html";
      const file = path.join(ROOT, p);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(fs.readFileSync(path.join(ROOT, "404.html")));
      }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

/* Hilfsfunktionen ------------------------------------------------------------ */
async function decodeQr(locator) {
  const png = PNG.sync.read(await locator.screenshot());
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return code ? code.data : null;
}
function epc(amount, text) {
  const b = site.bank;
  return ["BCD", "002", "1", "SCT", b.bic, b.holder, b.iban, amount ? "EUR" + amount.toFixed(2) : "", "", "", text || b.reference].join("\n");
}
async function stubEndpoint(page, formSelector) {
  const posts = [];
  await page.route("**/__form", async (route) => {
    posts.push(route.request().postData() || "");
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  });
  await page.evaluate((sel) => document.querySelector(sel).setAttribute("data-endpoint", "/__form"), formSelector);
  return posts;
}

/* Tests ---------------------------------------------------------------------- */
(async () => {
  const server = await serve();
  const BASE = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch();

  /* 1. Alle Seiten in drei Breiten: kein Überlauf, keine Fehler ------------- */
  for (const width of [360, 768, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const problems = [];
    for (const p of PAGES.concat(["index.html"])) {
      const page = await ctx.newPage();
      const errs = [];
      page.on("pageerror", (e) => errs.push(e.message));
      page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
      page.on("requestfailed", (r) => { if (!r.url().includes("openstreetmap")) errs.push("Request fehlgeschlagen: " + r.url()); });
      await page.goto(BASE + p, { waitUntil: "load" });
      await page.waitForTimeout(p === "index.html" ? 300 : 0);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      if (sw > width) problems.push(`${p}: horizontaler Überlauf (${sw}px)`);
      if (errs.length) problems.push(`${p}: ${errs.join(" | ")}`);
      if (["de/index.html", "de/spenden.html", "de/termine.html", "de/mitglied-werden.html", "ru/index.html", "de/satzung.html", "de/kontakt.html", "de/termin-2026-11-21-praesentieren.html"].includes(p)) {
        await page.screenshot({ path: path.join(OUT, `${p.replace("/", "_")}-${width}.png`), fullPage: true });
      }
      await page.close();
    }
    check(`Layout und Konsole: ${PAGES.length + 1} Seiten bei ${width}px`, problems.length === 0, problems.slice(0, 5).join("; "));
    await ctx.close();
  }

  /* 2. Barrierefreiheit mit axe-core (hell und dunkel) ---------------------- */
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript(() => { try { localStorage.setItem("sl-consent", JSON.stringify({ map: false, version: 1 })); } catch (e) {} });
    const violations = [];
    for (const p of PAGES) {
      const page = await ctx.newPage();
      await page.goto(BASE + p, { waitUntil: "load" });
      await page.addScriptTag({ content: AXE_SOURCE });
      const res = await page.evaluate(async () => {
        const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
        return r.violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length}×): ${v.nodes[0].target.join(" ")}`);
      });
      res.forEach((v) => violations.push(`${p}: ${v}`));
      await page.close();
    }
    fs.writeFileSync(path.join(OUT, `axe-${scheme}.txt`), violations.join("\n") || "keine Verstöße");
    check(`axe-core (WCAG 2.2 A/AA + Best Practices), ${scheme}: ${PAGES.length} Seiten`, violations.length === 0, violations.slice(0, 6).join("; "));
    await ctx.close();
  }

  /* 3. Tastatur, Skip-Link, Menü --------------------------------------------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "de/index.html");
    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => document.activeElement.className);
    check("Erster Tab-Stopp ist „Zum Inhalt springen“", first.includes("skip-link"), first);
    const skipVisible = await page.evaluate(() => document.activeElement.getBoundingClientRect().top >= 0);
    check("Skip-Link ist bei Fokus sichtbar", skipVisible);
    await page.keyboard.press("Enter");
    check("Skip-Link setzt Fokus auf <main>", (await page.evaluate(() => document.activeElement.id)) === "main");

    const navHidden = await page.locator("#main-nav").isHidden();
    const burgerName = await page.evaluate(() => document.querySelector(".menu-toggle").textContent.trim());
    await page.click(".menu-toggle");
    const expanded = await page.getAttribute(".menu-toggle", "aria-expanded");
    const navShown = await page.locator("#main-nav").isVisible();
    await page.keyboard.press("Escape");
    const closed = (await page.getAttribute(".menu-toggle", "aria-expanded")) === "false" && (await page.locator("#main-nav").isHidden());
    const focusBack = await page.evaluate(() => document.activeElement.classList.contains("menu-toggle"));
    check("Burger-Menü: zu → auf (aria-expanded) → Escape schließt, Fokus zurück; Button hat Namen „Menü“", navHidden && expanded === "true" && navShown && closed && focusBack && burgerName === "Menü", burgerName);

    // Fokusrahmen mit echter Tastaturbedienung messen: Tab → Skip-Link, Logo, Burger-Button
    await page.goto(BASE + "de/index.html");
    const ring = async () => page.evaluate(() => { const e = document.activeElement, st = getComputedStyle(e); return e.className + " " + st.outlineStyle + " " + st.outlineWidth; });
    await page.keyboard.press("Tab"); await page.keyboard.press("Tab"); await page.keyboard.press("Tab");
    const burgerRing = await ring();
    await page.keyboard.press("Enter"); // Menü öffnen
    await page.keyboard.press("Tab");   // erster Menüpunkt
    const linkRing = await ring();
    const fv = burgerRing + " | " + linkRing;
    check("Sichtbarer Fokusrahmen per Tastatur (Burger-Button, Menüpunkte)", /^menu-toggle solid [3-9]px \| .*solid [3-9]px$/.test(fv), fv);

    const small = await page.evaluate(() => Array.from(document.querySelectorAll("a.btn, button.btn, .lang-switch a, .main-nav a"))
      .filter((e) => e.offsetParent).map((e) => e.getBoundingClientRect()).filter((r) => r.height < 24 || r.width < 24).length);
    check("Zielgröße: Buttons/Navigation mindestens 24×24 px (WCAG 2.5.8)", small === 0, `${small} zu klein`);
    await ctx.close();

    const ctxM = await browser.newContext({ reducedMotion: "reduce" });
    const pm = await ctxM.newPage();
    await pm.goto(BASE + "de/index.html");
    const dur = await pm.evaluate(() => getComputedStyle(document.querySelector(".btn")).transitionDuration);
    check("prefers-reduced-motion schaltet Übergänge ab", dur === "0s", dur);
    await ctxM.close();
  }

  /* 4. Einwilligung und Karte -------------------------------------------------- */
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const osm = [];
    page.on("request", (r) => { if (r.url().includes("openstreetmap.org")) osm.push(r.url()); });
    await page.goto(BASE + "de/kontakt.html", { waitUntil: "load" });
    check("Banner erscheint beim ersten Besuch", await page.locator("#consent").isVisible());
    check("Ohne Einwilligung: kein Request an openstreetmap.org, kein iframe", osm.length === 0 && (await page.locator("[data-map] iframe").count()) === 0);
    await page.click('[data-consent="reject"]');
    check("„Nur notwendige“ schließt Banner, Karte bleibt aus", (await page.locator("#consent").isHidden()) && (await page.locator("[data-map] iframe").count()) === 0 && osm.length === 0);
    await page.reload();
    check("Entscheidung bleibt gespeichert (kein Banner nach Neuladen)", await page.locator("#consent").isHidden());
    await page.click("[data-map-load]");
    const src = await page.locator("[data-map] iframe").getAttribute("src");
    check("„Karte laden“ setzt OpenStreetMap-iframe ein", !!src && src.startsWith("https://www.openstreetmap.org/export/embed.html"), src);
    await page.goto(BASE + "de/cookie-einstellungen.html");
    const checked = await page.isChecked("#consent-map");
    await page.uncheck("#consent-map");
    await page.click('#consent-settings button[type="submit"]');
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("sl-consent")).map);
    check("Cookie-Einstellungen: zeigt Zustimmung und erlaubt Widerruf", checked === true && stored === false);
    await ctx.close();
  }

  /* 5. Formulare in drei Sprachen ---------------------------------------------- */
  for (const lang of ["de", "en", "ru"]) {
    const E = i18n[lang].forms.errors;
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => { try { localStorage.setItem("sl-consent", JSON.stringify({ map: false, version: 1 })); } catch (e) {} });
    const page = await ctx.newPage();
    await page.goto(BASE + `${lang}/${SLUG[lang].contact}`);
    await page.click('#form-contact button[type="submit"]');
    const summary = page.locator("#form-contact-summary");
    const items = await summary.locator("li").count();
    const focused = await page.evaluate(() => document.activeElement.id);
    const nameErr = await page.textContent("#contact-name-error");
    check(`[${lang}] Kontakt leer absenden → Fehlerübersicht mit 5 Einträgen, Fokus darauf, Meldung in Landessprache`,
      items === 5 && focused === "form-contact-summary" && nameErr === E.required, `${items} / ${focused} / ${nameErr}`);
    await page.fill("#contact-email", "nicht-gueltig");
    await page.locator("#contact-email").blur();
    check(`[${lang}] Ungültige E-Mail → Meldung „${E.email.slice(0, 30)}…“`, (await page.textContent("#contact-email-error")) === E.email);
    check(`[${lang}] aria-invalid gesetzt`, (await page.getAttribute("#contact-email", "aria-invalid")) === "true");

    // Versand über konfigurierten Endpunkt
    const posts = await stubEndpoint(page, "#form-contact");
    await page.fill("#contact-name", "Erika Muster");
    await page.fill("#contact-email", "erika@example.org");
    await page.selectOption("#contact-thema", "allgemein");
    await page.fill("#contact-nachricht", "Test");
    await page.check("#contact-datenschutz");
    await page.click('#form-contact button[type="submit"]');
    await page.waitForSelector("#form-contact-status .success-box");
    const ok = (await page.textContent("#form-contact-status")).includes(i18n[lang].forms.status.contact);
    check(`[${lang}] Kontakt mit Endpunkt: POST gesendet, Erfolgsmeldung`, ok && posts.length === 1 && posts[0].includes("erika@example.org") && !posts[0].includes('name="website"\r\n\r\nx'));

    // Honeypot
    await page.fill("#contact-website", "spam", { force: true });
    await page.fill("#contact-name", "Bot");
    await page.click('#form-contact button[type="submit"]');
    await page.waitForTimeout(200);
    check(`[${lang}] Honeypot ausgefüllt → kein Versand`, posts.length === 1);

    // Mitgliedsantrag: IBAN und SEPA-Bereich
    await page.goto(BASE + `${lang}/${SLUG[lang].membership}`);
    await page.fill("#membership-iban", "DE89 3704 0044 0532 0130 01");
    await page.locator("#membership-iban").blur();
    const ibanErr = await page.textContent("#membership-iban-error");
    await page.fill("#membership-iban", "de89370400440532013000");
    await page.locator("#membership-iban").blur();
    const ibanOk = await page.textContent("#membership-iban-error");
    const formatted = await page.inputValue("#membership-iban");
    check(`[${lang}] IBAN: falsche Prüfsumme erkannt, gültige akzeptiert und formatiert`, ibanErr === E.iban && ibanOk === "" && formatted === "DE89 3704 0044 0532 0130 00", `${ibanErr} | ${formatted}`);
    await page.fill("#membership-iban", "DE8937040044053201300");
    await page.locator("#membership-iban").blur();
    check(`[${lang}] IBAN: falsche Länge erkannt`, (await page.textContent("#membership-iban-error")) === E.iban_length);
    // Geburtsdatum als Tag · Monat · Jahr (drei Auswahllisten)
    await page.clock.setFixedTime(new Date("2026-10-19T10:00:00"));
    await page.goto(BASE + `${lang}/${SLUG[lang].membership}`);
    const bdErr = () => page.textContent("#membership-geburtsdatum-error");
    const sel = (part, v) => page.selectOption(`#membership-geburtsdatum-${part}`, v);
    // Gruppe verlassen wie im echten Gebrauch: Fokus ins Feld, dann hinaus
    const leave = async (part) => { await page.focus(`#membership-geburtsdatum-${part}`); await page.locator(`#membership-geburtsdatum-${part}`).blur(); };
    const yearOpts = await page.$$eval("#membership-geburtsdatum-jahr option", (o) => o.map((x) => x.value).filter(Boolean));
    check(`[${lang}] Jahr-Auswahl absteigend von 2026 bis 1900`, yearOpts[0] === "2026" && yearOpts[yearOpts.length - 1] === "1900" && yearOpts.length === 127);
    await sel("tag", "31");
    await leave("tag");
    check(`[${lang}] Geburtsdatum unvollständig → Hinweis „vollständig eingeben“`, (await bdErr()) === E.date_incomplete);
    await sel("monat", "02");
    await sel("jahr", "1985");
    await leave("jahr");
    const day30Disabled = await page.$eval('#membership-geburtsdatum-tag option[value="30"]', (o) => o.disabled);
    check(`[${lang}] 31.02. wird als ungültig erkannt, 30./31. Februar ausgegraut`, (await bdErr()) === E.date && day30Disabled);
    await sel("tag", "1");
    await sel("monat", "12");
    await sel("jahr", "2026");
    await leave("jahr");
    check(`[${lang}] Geburtsdatum in der Zukunft wird abgelehnt`, (await bdErr()) === E.birthdate);
    await sel("tag", "14");
    await sel("monat", "03");
    await sel("jahr", "1985");
    const age = await page.textContent("#membership-geburtsdatum-age");
    check(`[${lang}] Gültiges Geburtsdatum: Fehler weg, Alter wird angezeigt`, (await bdErr()) === "" && /41/.test(age) && (await page.getAttribute("#membership-geburtsdatum-tag", "aria-invalid")) === null, age);
    await page.check("#membership-zahlungsweise-transfer");
    const sepaHidden = await page.locator("#membership-sepa").isHidden();
    await page.click('#form-membership button[type="submit"]');
    const summaryText = await page.textContent("#form-membership-summary");
    check(`[${lang}] Überweisung gewählt → SEPA-Bereich ausgeblendet und nicht geprüft`, sepaHidden && !summaryText.includes("IBAN"));
    const options = await page.locator("#membership-mitgliedsart option").count();
    check(`[${lang}] Auswahl Mitgliedsart aus beitraege.json (5 + Platzhalter)`, options === 6, String(options));
    await ctx.close();
  }

  /* 6. GiroCode ---------------------------------------------------------------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
    await ctx.addInitScript(() => { try { localStorage.setItem("sl-consent", JSON.stringify({ map: false, version: 1 })); } catch (e) {} });
    const page = await ctx.newPage();
    await page.goto(BASE + "de/spenden.html");
    const code = page.locator('[data-giro="main"] [data-giro-code]');
    check("GiroCode 25 € (Voreinstellung) dekodiert korrekt", (await decodeQr(code)) === epc(25), JSON.stringify(await decodeQr(code)));
    await page.click('label[for="giro-amount-100"]');
    check("GiroCode 100 € nach Betragswahl", (await decodeQr(code)) === epc(100));
    await page.click('label[for="giro-amount-other"]');
    await page.fill("#giro-other", "12,50");
    check("GiroCode freier Betrag 12,50 €", (await decodeQr(code)) === epc(12.5));
    await page.fill("#giro-other", "0");
    const err = await page.textContent("#giro-other-error");
    check("Ungültiger Betrag → Fehlermeldung, Code ohne Betrag", err === i18n.de.forms.errors.amount && (await decodeQr(code)) === epc(null));
    const label = await code.getAttribute("aria-label");
    const textAlt = await page.textContent('[data-giro="main"] [data-giro-text]');
    check("GiroCode hat aria-label und Textalternative (IBAN, Empfänger)", label.includes("Skills Lab e.V.") && textAlt.includes("DE89 3704 0044 0532 0130 00"));
    const [download] = await Promise.all([page.waitForEvent("download"), page.click("[data-giro-download]")]);
    const dlPath = path.join(OUT, download.suggestedFilename());
    await download.saveAs(dlPath);
    check("GiroCode-Download als SVG", download.suggestedFilename().endsWith(".svg") && fs.readFileSync(dlPath, "utf8").includes("<svg"), download.suggestedFilename());

    // Spendenanfrage → Bestätigung mit GiroCode über den Betrag
    const posts = await stubEndpoint(page, "#form-donation");
    await page.fill("#donation-betrag", "50");
    await page.check("#donation-rhythmus-monthly");
    await page.fill("#donation-name", "Max Muster");
    await page.fill("#donation-email", "max@example.org");
    await page.check("#donation-bescheinigung");
    await page.click('#form-donation button[type="submit"]');
    const addrErr = await page.textContent("#donation-strasse-error");
    check("Spendenbescheinigung angehakt → Anschrift wird Pflicht", addrErr === i18n.de.forms.errors.required);
    await page.fill("#donation-strasse", "Weg 1");
    await page.fill("#donation-plz", "64711");
    await page.fill("#donation-ort", "Erbach");
    await page.check("#donation-datenschutz");
    await page.click('#form-donation button[type="submit"]');
    await page.waitForSelector("#donation-confirm:not([hidden])");
    const confirmQr = await decodeQr(page.locator('[data-giro="confirm"] [data-giro-code]'));
    check("Spendenanfrage: Bestätigung mit GiroCode 50 € und Verwendungszweck mit Namen", confirmQr === epc(50, "Spende Skills Lab Max Muster") && posts.length === 1, JSON.stringify(confirmQr));
    check("Bestätigung zeigt Dauerauftrags-Hinweis bei „monatlich“", await page.locator("[data-confirm-interval]").isVisible());
    await page.screenshot({ path: path.join(OUT, "spenden-bestaetigung.png"), fullPage: true });

    const copyBtn = page.locator('.copy-btn').nth(1);
    await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
    await copyBtn.click();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    check("Kopieren-Button kopiert IBAN ohne Leerzeichen", clip === site.bank.iban, clip);
    await ctx.close();
  }

  /* 7. Termine: vergangene ausblenden, Filter, Vorauswahl ---------------------- */
  {
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => { try { localStorage.setItem("sl-consent", JSON.stringify({ map: false, version: 1 })); } catch (e) {} });
    const page = await ctx.newPage();
    await page.clock.setFixedTime(new Date("2026-11-20T10:00:00"));
    await page.goto(BASE + "de/termine.html");
    const dates = await page.$$eval("#dates-table tbody:not([hidden]) tr[data-date]:not([hidden])", (rows) => rows.map((r) => r.dataset.date));
    check("Termine vor dem 20.11.2026 werden ausgeblendet", dates.length > 0 && dates.every((d) => d >= "2026-11-20"), dates.join(","));
    await page.selectOption("#filter-course", "digital-fit");
    const courses = await page.$$eval("#dates-table tbody:not([hidden]) tr[data-date]:not([hidden])", (rows) => rows.map((r) => r.dataset.course));
    const status = await page.textContent("#filter-status");
    check("Filter nach Kurs + Ansage der Anzahl", courses.length === 1 && courses[0] === "digital-fit" && status.includes("1"), `${courses} / ${status}`);
    await page.goto(BASE + "de/termine.html?kurs=praesentieren");
    check("Vorauswahl über ?kurs=", (await page.inputValue("#filter-course")) === "praesentieren");
    await page.goto(BASE + "de/index.html");
    const home = await page.$$eval("[data-upcoming] li:not([hidden])", (li) => li.map((l) => l.dataset.date));
    check("Startseite: 3 nächste Termine ab heute", home.length === 3 && home.every((d) => d >= "2026-11-20"), home.join(","));
    await page.goto(BASE + "de/kontakt.html?thema=kurs&termin=2026-11-21-praesentieren");
    const msg = await page.inputValue("#contact-nachricht");
    check("Kontaktformular wird aus Terminlink vorbelegt", (await page.inputValue("#contact-thema")) === "kurs" && msg.includes("Sicher präsentieren"), msg);
    await ctx.close();
  }

  /* 7b. Kalenderansicht und .ics-Dateien ---------------------------------------- */
  {
    const icsLinesOk = (txt) => txt.startsWith("BEGIN:VCALENDAR\r\n") && txt.trimEnd().endsWith("END:VCALENDAR") &&
      !/[^\r]\n/.test(txt) && txt.split("\r\n").every((l) => Buffer.byteLength(l, "utf8") <= 75);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
    await ctx.addInitScript(() => { try { localStorage.setItem("sl-consent", JSON.stringify({ map: false, version: 1 })); } catch (e) {} });
    const page = await ctx.newPage();
    await page.clock.setFixedTime(new Date("2026-11-20T10:00:00"));
    await page.goto(BASE + "de/termine.html");
    const visibleMonths = await page.$$eval(".cal-month:not([hidden])", (m) => m.map((x) => x.dataset.month));
    check("Kalender: aktueller Monat (Nov 2026) sichtbar, darunter die Terminliste",
      visibleMonths.join() === "2026-11" && (await page.locator("#dates-table").isVisible()) && (await page.isDisabled("[data-cal-prev]")) &&
      (await page.evaluate(() => document.getElementById("calendar-view").compareDocumentPosition(document.getElementById("list-view")) & Node.DOCUMENT_POSITION_FOLLOWING)) > 0);
    check("Kalender: heutiger Tag markiert", (await page.getAttribute('.mg-day[data-date="2026-11-20"]', "aria-current")) === "date");
    await page.click("[data-cal-next]");
    const next = await page.$$eval(".cal-month:not([hidden])", (m) => m.map((x) => x.dataset.month));
    check("Kalender: „Nächster Monat“ blättert und sagt den Monat an", next.join() === "2026-12" && (await page.textContent("#cal-status")) === "Dezember 2026");
    await page.click("[data-cal-prev]");
    const chip = page.locator('.cal-chip[data-event="2026-11-21-praesentieren"]');
    await chip.click();
    const dlgOpen = await page.locator("#event-dialog").isVisible();
    const dlgTitle = await page.textContent("#event-dialog-title");
    const icsHref = await page.getAttribute("#event-dialog .ics-btn", "href");
    check("Termin anklicken öffnet Detailfenster mit Kurs, Ort und Kalender-Button", dlgOpen && dlgTitle === "Sicher präsentieren" &&
      icsHref === "../kalender/de/termin-2026-11-21-praesentieren.ics" && (await page.textContent("#event-dialog")).includes("Vereinsraum"));
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#event-dialog .ics-btn")]);
    const dlPath = path.join(OUT, dl.suggestedFilename());
    await dl.saveAs(dlPath);
    const ics = fs.readFileSync(dlPath, "utf8");
    check("„In meinen Kalender“ lädt gültige .ics-Datei (CRLF, ≤75 Byte/Zeile, Zeitzone, Start/Ende)",
      dl.suggestedFilename() === "termin-2026-11-21-praesentieren.ics" && icsLinesOk(ics) &&
      ics.includes("DTSTART;TZID=Europe/Berlin:20261121T100000") && ics.includes("DTEND;TZID=Europe/Berlin:20261121T160000") &&
      ics.includes("BEGIN:VTIMEZONE") && (ics.match(/BEGIN:VEVENT/g) || []).length === 1, dl.suggestedFilename());
    await page.keyboard.press("Escape");
    const focusBack = await page.evaluate(() => document.activeElement.dataset.event);
    check("Escape schließt das Detailfenster, Fokus zurück auf den Termin", (await page.locator("#event-dialog").isHidden()) && focusBack === "2026-11-21-praesentieren");
    await page.selectOption("#filter-course", "ki-werkzeuge");
    const shownChips = await page.$$eval(".cal-chips li:not([hidden]) .cal-chip", (c) => c.map((x) => x.dataset.course));
    check("Kursfilter wirkt auch im Kalender", shownChips.length > 0 && shownChips.every((x) => x === "ki-werkzeuge"), shownChips.join());
    check("Liste unter dem Kalender: .ics-Button je Termin",
      (await page.locator("#dates-table tr[data-date] .ics-btn").count()) === 12 && (await page.locator("#calendar-view").isVisible()));

    // Sammeldateien und Sprachen
    const all = fs.readFileSync(path.join(ROOT, "kalender/de/alle-termine.ics"), "utf8");
    const ru = fs.readFileSync(path.join(ROOT, "kalender/ru/termin-2026-11-07-digital-fit.ics"), "utf8");
    const course = fs.readFileSync(path.join(ROOT, "kalender/en/kurs-praesentieren.ics"), "utf8");
    check("alle-termine.ics: 12 Termine, gültige Zeilen", (all.match(/BEGIN:VEVENT/g) || []).length === 12 && icsLinesOk(all));
    check("Kurs-Datei (EN) enthält genau die Termine des Kurses", (course.match(/BEGIN:VEVENT/g) || []).length === 2 && course.includes("SUMMARY:Presenting with confidence"));
    check("Russische .ics: kyrillischer Titel, korrekt gefaltet (UTF-8)", ru.includes("Цифровая грамотность") && icsLinesOk(ru));
    await page.goto(BASE + "de/angebote.html");
    check("Angebote: Kalender-Link für jeden Kurs", (await page.locator('a.ics-link[href^="../kalender/de/kurs-"]').count()) === 6);
    await ctx.close();
  }

  /* 7d. Eigene Seite je Termin ---------------------------------------------------- */
  {
    const EV = "2026-11-21-praesentieren";
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
    await ctx.addInitScript(() => { try { localStorage.setItem("sl-consent", JSON.stringify({ map: false, version: 1 })); } catch (e) {} });
    const page = await ctx.newPage();
    await page.clock.setFixedTime(new Date("2026-11-09T10:00:00"));
    const evFiles = ["de", "en", "ru"].map((l) => `${l}/termin-${EV}.html`);
    check("Terminseiten: je Termin und Sprache eine Seite (12 × 3)",
      ["de", "en", "ru"].every((l) => fs.readdirSync(path.join(ROOT, l)).filter((f) => f.startsWith("termin-")).length === 12) &&
      evFiles.every((f) => fs.existsSync(path.join(ROOT, f))));
    await page.goto(BASE + "de/termine.html");
    await page.click(`.cal-chip[data-event="${EV}"]`);
    await page.click("#event-dialog >> text=Alle Details");
    check("Kalender-Detailfenster → „Alle Details“ öffnet die Terminseite", page.url().endsWith(`de/termin-${EV}.html`), page.url());
    check("Terminseite: Überschrift, Datum, Ort, Brotkrumen",
      (await page.textContent("h1")) === "Sicher präsentieren" && (await page.textContent(".event-when")).includes("21.11.2026") &&
      (await page.textContent(".event-when")).includes("Vereinsraum") && (await page.locator(".breadcrumb a").count()) === 3);
    const cd = await page.textContent("[data-countdown]");
    check("Countdown nach heutigem Datum („In 12 Tagen“)", cd === "In 12 Tagen" && (await page.locator("[data-countdown]").isVisible()), cd);
    check("Kommender Termin: Anfrage-Button sichtbar, Hinweis „stattgefunden“ verborgen",
      (await page.locator("[data-event-request]").isVisible()) && (await page.locator("[data-event-past]").isHidden()) &&
      (await page.getAttribute("[data-event-request]", "href")) === `kontakt.html?thema=kurs&termin=${EV}`);
    check("Terminseite: .ics-Button verweist auf die Termindatei",
      (await page.getAttribute(".event-actions .ics-btn", "href")) === `../kalender/de/termin-${EV}.ics`);
    // Teilen ohne Web-Share-API: Link wird kopiert
    await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
    const shareTxt = await page.textContent("[data-share]");
    await page.click("[data-share]");
    await page.waitForTimeout(100);
    check("Teilen (ohne Teilen-Menü): „Link kopieren“ → „Link kopiert“", shareTxt === "Link kopieren" && (await page.textContent("[data-share]")) === "Link kopiert");
    const ld = JSON.parse(await page.textContent('script[type="application/ld+json"]'));
    check("Terminseite: strukturierte Daten (EducationEvent mit eigener URL)",
      ld["@graph"][0]["@type"] === "EducationEvent" && ld["@graph"][0].url.endsWith(`/de/termin-${EV}.html`));
    await page.click(".pager-link--next");
    check("Blättern: „Nächster Termin“ führt zum folgenden Termin", page.url().endsWith("de/termin-2026-11-26-ki-werkzeuge.html"), page.url());
    await page.clock.setFixedTime(new Date("2026-11-20T10:00:00"));
    await page.goto(BASE + `de/termin-${EV}.html`);
    check("Countdown einen Tag vorher: „Morgen“", (await page.textContent("[data-countdown]")) === "Morgen");
    await page.clock.setFixedTime(new Date("2026-12-01T10:00:00"));
    await page.goto(BASE + `de/termin-${EV}.html`);
    check("Vergangener Termin: Hinweis sichtbar, kein Anfrage-Button, kein Countdown",
      (await page.locator("[data-event-past]").isVisible()) && (await page.locator("[data-event-request]").isHidden()) && (await page.locator("[data-countdown]").isHidden()));
    await page.clock.setFixedTime(new Date("2026-10-28T10:00:00"));
    await page.goto(BASE + "ru/termin-2026-11-12-zeitmanagement.html");
    check("Russisch: Pluralform im Countdown (15 → „Через 15 дней“)", (await page.textContent("[data-countdown]")) === "Через 15 дней", await page.textContent("[data-countdown]"));
    await page.goto(BASE + "de/index.html");
    const homeLink = await page.getAttribute("[data-upcoming] li:not([hidden]) a.date-row-title", "href");
    await page.goto(BASE + "de/termine.html");
    const listLink = await page.getAttribute(`#termin-${EV} .col-course a`, "href");
    check("Startseite und Liste verlinken auf die Terminseiten", /^termin-.+\.html$/.test(homeLink) && listLink === `termin-${EV}.html`, `${homeLink} / ${listLink}`);
    const sm = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
    check("Sitemap enthält alle Terminseiten", (sm.match(/<loc>[^<]*\/termin-[^<]+<\/loc>/g) || []).length === 36);
    await ctx.close();
  }

  /* 7c. Handy-Ansicht ------------------------------------------------------------ */
  {
    for (const w of [320, 375]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 740 }, isMobile: true, hasTouch: true });
      await ctx.addInitScript(() => { try { localStorage.setItem("sl-consent", JSON.stringify({ map: false, version: 1 })); } catch (e) {} });
      const page = await ctx.newPage();
      const rows = [];
      for (const l of ["de", "en", "ru"]) {
        await page.goto(BASE + `${l}/index.html`);
        const closed = await page.evaluate(() => ({
          h: document.querySelector(".site-header").getBoundingClientRect().height,
          ctaHidden: !document.querySelector(".header-cta .btn").offsetParent,
          langHidden: !document.querySelector(".lang-switch a").offsetParent,
        }));
        await page.click(".menu-toggle");
        const open = await page.evaluate(() => {
          const visible = (sel) => Array.from(document.querySelectorAll(sel)).every((e) => e.offsetParent);
          return {
            expanded: document.querySelector(".menu-toggle").getAttribute("aria-expanded"),
            nav: visible(".main-nav a"), cta: visible(".header-cta .btn"),
            langLong: Array.from(document.querySelectorAll(".lang-switch .lang-long")).every((e) => e.getBoundingClientRect().width > 20),
            fits: document.documentElement.scrollWidth <= window.innerWidth,
          };
        });
        rows.push({ l, ...closed, ...open });
      }
      check(`Handy ${w}px: Burger-Menü – Kopfzeile schlank (≤ 80 px); Seiten, „Mitglied werden“, „Spenden“ und Sprachen (ausgeschrieben) im Menü (DE/EN/RU)`,
        rows.every((r) => r.h <= 80 && r.ctaHidden && r.langHidden && r.expanded === "true" && r.nav && r.cta && r.langLong && r.fits), JSON.stringify(rows));
      if (w === 375) {
        await page.clock.setFixedTime(new Date("2026-11-12T10:00:00"));
        await page.goto(BASE + "de/termine.html");
        const nav = await page.evaluate(() => ({
          status: document.getElementById("cal-status").textContent,
          titleHidden: document.querySelector(".cal-month:not([hidden]) .cal-month-title").getBoundingClientRect().width <= 1,
          btnName: document.querySelector("[data-cal-next]").textContent.trim(),
        }));
        check("Handy: Kalender-Navigation „‹ November 2026 ›“, Buttons behalten ihren Namen", nav.status === "November 2026" && nav.titleHidden && nav.btnName.includes("Nächster Monat"), JSON.stringify(nav));
        await page.tap('.cal-chip[data-event="2026-11-21-praesentieren"]');
        const sheet = await page.evaluate(() => {
          const r = document.getElementById("event-dialog").getBoundingClientRect();
          const b = document.querySelector("#event-dialog .ics-btn").getBoundingClientRect();
          return { bottom: Math.round(window.innerHeight - r.bottom), width: Math.round(r.width), btn: Math.round(b.width) };
        });
        check("Handy: Termin antippen öffnet Panel von unten mit breiten Buttons", sheet.bottom <= 1 && sheet.width === 375 && sheet.btn > 250, JSON.stringify(sheet));
        await page.goto(BASE + "de/index.html");
        const heroBtn = await page.evaluate(() => document.querySelector(".hero .btn").getBoundingClientRect().width);
        check("Handy: Hauptbuttons auf volle Breite", heroBtn > 300, String(heroBtn));
      }
      await ctx.close();
    }
  }

  /* 7d. Laptop: Header oben groß, beim Scrollen klein ------------------------------ */
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(() => { try { localStorage.setItem("sl-consent", JSON.stringify({ map: false, version: 1 })); } catch (e) {} });
    const page = await ctx.newPage();
    const state = () => page.evaluate(() => ({
      h: Math.round(document.querySelector(".site-header").getBoundingClientRect().height),
      compact: document.querySelector(".site-header").classList.contains("is-compact"),
      h1Doc: Math.round(document.querySelector("h1").getBoundingClientRect().top + window.scrollY),
    }));
    await page.goto(BASE + "de/index.html");
    await page.waitForTimeout(300);
    const top = await state();
    await page.mouse.wheel(0, 400); await page.waitForTimeout(400);
    const down = await state();
    await page.mouse.wheel(0, -2000); await page.waitForTimeout(400);
    const back = await state();
    check("Laptop: Header oben groß (zweizeilig), beim Scrollen klein, oben wieder groß – Inhalt springt nicht",
      top.h > 130 && !top.compact && down.compact && down.h <= 70 && !back.compact && back.h === top.h && top.h1Doc === down.h1Doc,
      JSON.stringify({ top, down, back }));
    await page.goto(BASE + "de/termine.html#termin-2026-12-03-englisch-beruf");
    await page.waitForTimeout(400);
    const anchorPos = await page.evaluate(() => ({
      row: document.getElementById("termin-2026-12-03-englisch-beruf").getBoundingClientRect().top,
      hb: document.querySelector(".site-header").getBoundingClientRect().bottom,
    }));
    check("Laptop: Sprungziel (#termin-…) wird nicht vom Header verdeckt", anchorPos.row >= anchorPos.hb && anchorPos.row < anchorPos.hb + 60, JSON.stringify(anchorPos));
    await ctx.close();

    // Veraltetes/fehlendes main.js (z. B. aus dem Browser-Cache): Header muss die schmale, „sticky“ Leiste bleiben
    const stale = await browser.newContext({ viewport: { width: 1870, height: 920 } });
    const sp = await stale.newPage();
    await sp.route(/js\/main\.js/, (route) => route.fulfill({ status: 200, contentType: "text/javascript", body: "/* alt */" }));
    await sp.goto(BASE + "de/angebote.html");
    await sp.mouse.wheel(0, 700); await sp.waitForTimeout(300);
    const st = await sp.evaluate(() => {
      const h = document.querySelector(".site-header"), r = h.getBoundingClientRect();
      return { pos: getComputedStyle(h).position, h: Math.round(r.height), top: Math.round(r.top) };
    });
    check("Laptop: mit veraltetem main.js bleibt der Header die schmale Leiste (nichts verdeckt)", st.pos === "sticky" && st.h <= 80 && st.top === 0, JSON.stringify(st));
    await stale.close();
    const links = await (async () => { const c2 = await browser.newContext(); const p2 = await c2.newPage(); await p2.goto(BASE + "de/index.html");
      const r = await p2.evaluate(() => [...document.querySelectorAll('link[rel="stylesheet"], script[src]')].map((e) => e.getAttribute("href") || e.getAttribute("src"))); await c2.close(); return r; })();
    check("CSS und JavaScript mit Versionsnummer (?v=…) gegen veraltete Browser-Caches", links.length >= 2 && links.every((u) => /\?v=[0-9a-f]{10}$/.test(u)), links.join(" "));

    const m = await browser.newContext({ viewport: { width: 375, height: 740 } });
    const mp = await m.newPage();
    await mp.goto(BASE + "de/index.html");
    await mp.mouse.wheel(0, 600); await mp.waitForTimeout(300);
    const mobile = await mp.evaluate(() => ({ pos: getComputedStyle(document.querySelector(".site-header")).position,
      compact: document.querySelector(".site-header").classList.contains("is-compact") }));
    check("Handy: Header unverändert (nicht fixiert, kein Schrumpfen)", mobile.pos === "static" && !mobile.compact, JSON.stringify(mobile));
    await m.close();
  }

  /* 8. Sprachweiche und Sprachumschalter --------------------------------------- */
  for (const [locale, expected] of [["en-GB", "en/index.html"], ["ru-RU", "ru/index.html"], ["fr-FR", "de/index.html"]]) {
    const ctx = await browser.newContext({ locale });
    const page = await ctx.newPage();
    await page.goto(BASE + "index.html");
    await page.waitForURL("**/" + expected);
    check(`Sprachweiche: Browser ${locale} → ${expected}`, page.url().endsWith(expected));
    await ctx.close();
  }
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(BASE + "de/spenden.html");
    await page.click('.lang-switch a[data-lang="en"]');
    check("Sprachumschalter führt zur entsprechenden Seite (spenden → donate)", page.url().endsWith("en/donate.html"));
    await page.goto(BASE + "index.html");
    await page.waitForURL("**/en/index.html");
    check("Gewählte Sprache wird gemerkt (Sprachweiche → en)", page.url().endsWith("en/index.html"));
    const notice = await page.goto(BASE + "en/statutes.html").then(() => page.textContent(".notice:nth-of-type(2)"));
    check("EN-Satzung: Hinweis „German version is legally binding“", /legally binding version is the German/.test(notice || ""), notice);
    await ctx.close();
  }

  /* 9. Betrieb ohne Server (file://) ------------------------------------------- */
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(e.message));
    await page.goto(pathToFileURL(path.join(ROOT, "de/spenden.html")).href);
    const js = await page.evaluate(() => document.documentElement.classList.contains("js") && !!window.SkillsLab && !!window.SkillsLab.girocode);
    const qr = await decodeQr(page.locator('[data-giro="main"] [data-giro-code]'));
    await page.evaluate(() => document.fonts.ready);
    const font = await page.evaluate(() => Array.from(document.fonts).some((f) => f.family.includes("Inter") && f.status === "loaded"));
    check("file://: Skripte laufen, GiroCode wird erzeugt", js && qr === epc(25) && errs.length === 0, errs.join("; "));
    check("file://: lokale Schrift Inter wird geladen", font);
    await page.goto(pathToFileURL(path.join(ROOT, "ru/index.html")).href);
    await page.evaluate(() => document.fonts.ready);
    const cyr = await page.evaluate(() => Array.from(document.fonts).some((f) => f.status === "loaded" && /U\+0?400-0?45F/i.test(f.unicodeRange)));
    check("Kyrillischer Schriftschnitt wird auf russischen Seiten geladen", cyr);
    await ctx.close();
  }

  /* 9b. Ohne JavaScript (progressive Verbesserung) ----------------------------- */
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 360, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "de/index.html");
    const navVisible = await page.locator("#main-nav").isVisible();
    const toggleHidden = await page.locator(".menu-toggle").isHidden();
    const bannerHidden = await page.locator("#consent").isHidden();
    check("Ohne JS: Navigation sichtbar, Menü-Button und Banner ausgeblendet", navVisible && toggleHidden && bannerHidden);
    await page.goto(BASE + "de/spenden.html");
    const bankVisible = await page.locator("#bank-iban").isVisible();
    const noscript = (await page.locator("noscript + *, .notice").filter({ hasText: "JavaScript" }).count()) > 0 && (await page.locator('[data-giro="main"]').isHidden());
    const action = await page.getAttribute("#form-donation", "action");
    check("Ohne JS: Bankdaten lesbar, Hinweis statt GiroCode, Formular mit mailto-Action", bankVisible && noscript && action.startsWith("mailto:"));
    await page.goto(BASE + "de/termine.html");
    const rows = await page.locator("#dates-table tbody:not([hidden]) tr[data-date]:not([hidden])").count();
    check("Ohne JS: Terminliste vollständig lesbar (Stand des Builds)", rows > 0, String(rows));
    await ctx.close();
  }

  /* 10. IBAN-Modul als Einheitstest ------------------------------------------- */
  {
    const sandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/iban.js"), "utf8"), sandbox);
    const v = sandbox.window.SkillsLab.iban.validate;
    const valid = ["DE89370400440532013000", "GB82 WEST 1234 5698 7654 32", "AT611904300234573201", "NL91ABNA0417164300", "FR1420041010050500013M02606", "CH9300762011623852957"];
    const invalid = [["DE89370400440532013001", "iban"], ["DE8937040044053201300", "iban_length"], ["XX89370400440532013000", "iban_country"], ["", "iban"], ["DE89 3704 0044 0532 0130 0X", "iban"]];
    const okValid = valid.every((i) => v(i).valid);
    const okInvalid = invalid.every(([i, e]) => !v(i).valid && v(i).error === e);
    check(`IBAN-Modul: ${valid.length} gültige und ${invalid.length} ungültige Beispiele richtig erkannt`, okValid && okInvalid);
  }

  await browser.close();
  server.close();

  const failed = results.filter((r) => !r.ok);
  const summary = `\n${results.length - failed.length} von ${results.length} Prüfungen bestanden.`;
  console.log(summary);
  fs.writeFileSync(path.join(OUT, "ergebnis.txt"), results.map((r) => `${r.ok ? "OK  " : "FAIL"} ${r.name}${!r.ok && r.detail ? " – " + r.detail : ""}`).join("\n") + summary + "\n");
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
