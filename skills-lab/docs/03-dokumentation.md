# Dokumentation: Website „Skills Lab e.V.“

Stand: 2026-10-16 · Phase 6 · Grundlage: `00-auftrag.md`, `01-recherche.md`, `02-konzept.md`

Diese Dokumentation soll es ermöglichen, die Website zu verstehen, zu betreiben und weiterzuentwickeln,
auch ohne Vorwissen über ihre Entstehung.

---

## Auf einen Blick

| Frage | Antwort |
|---|---|
| Was ist das? | Statische, dreisprachige Vereinswebsite (DE/EN/RU) mit 45 Seiten, Formularen und Spenden-GiroCode |
| Was brauche ich zum Betrieb? | Einen beliebigen Webspace, der Dateien ausliefert. Keine Datenbank, kein Server-Code |
| Was brauche ich zum Ändern von Texten? | Einen Texteditor und Python 3 (für `python3 tools/build.py`) |
| Wo stehen die Texte? | `i18n/de.json`, `i18n/en.json`, `i18n/ru.json` |
| Wo stehen Beiträge, Kurse, Termine, Bank- und Vereinsdaten? | `data/beitraege.json`, `data/angebote.json`, `data/termine.json`, `data/site.json` |
| Was muss vor dem Start ersetzt werden? | Alle Platzhalter, siehe [Anhang A](#anhang-a-liste-aller-platzhalter) |
| Wie wurde getestet? | 76 automatische Browser-Tests, statische Prüfung, axe-core. Alle bestanden, siehe [Abschnitt 9](#9-tests-und-qualität) |

### Kurzüberblick der Designentscheidungen

- **Stil:** deutlich schlichter als der frühere Entwurf (`beispiel-webseite/`). Weißer Grund, eine Schrift, eine Primärfarbe, Linien statt Kästen, keine Schatten, keine Verläufe, keine Pflicht-Fotos.
- **Farben:** Petrol `#0e5466` (Links, Buttons, Fokus), warmes Terrakotta `#a8461b` nur für „Spenden“ und Markierungen, dazu Neutraltöne. Dunkelmodus mit eigenen, ebenfalls geprüften Werten.
- **Schrift:** Inter (SIL OFL), lokal eingebunden, mit lateinischen und kyrillischen Zeichen.
- **Struktur:** 15 Seiten pro Sprache, Header mit Sprachumschalter und den Buttons „Mitglied werden“ und „Spenden“, Footer mit allen Rechtslinks.

---

## Inhalt

1. [Überblick](#1-überblick)
2. [Technologie-Stack](#2-technologie-stack)
3. [Projektstruktur](#3-projektstruktur)
4. [Seiten und Komponenten](#4-seiten-und-komponenten)
5. [Design-System](#5-design-system)
6. [Funktionen und Logik](#6-funktionen-und-logik)
7. [Einrichtung und Start](#7-einrichtung-und-start)
8. [Inhalte pflegen](#8-inhalte-pflegen)
9. [Tests und Qualität](#9-tests-und-qualität)
10. [Bekannte Einschränkungen und Ideen für die Zukunft](#10-bekannte-einschränkungen-und-ideen-für-die-zukunft)
11. [Entscheidungsprotokoll](#11-entscheidungsprotokoll)
12. [Quellen](#12-quellen)
- [Anhang A: Liste aller Platzhalter](#anhang-a-liste-aller-platzhalter)

---

## 1. Überblick

### 1.1 Zweck

Die Website stellt den gemeinnützigen Verein **Skills Lab e.V.** vor, der Kurse und Workshops
anbietet (Kommunikation, Präsentieren, digitale Kompetenzen, Zeitmanagement, Sprachen). Sie
informiert über Angebote, Termine, Satzung und Beiträge und ermöglicht Kontakt,
Newsletter-Anmeldung, Mitgliedsantrag und Spenden. Eine **Zahlung findet nicht** über die Website
statt.

### 1.2 Zielgruppe

Menschen aller Altersgruppen und Vorkenntnisse: Interessierte, Teilnehmende, Mitglieder,
Spenderinnen und Spender. Dazu englisch- und russischsprachige Menschen im Odenwaldkreis.

### 1.3 Funktionsumfang

| Bereich | Umfang |
|---|---|
| Sprachen | Deutsch (verbindlich), Englisch, Russisch; eigene URLs `/de/`, `/en/`, `/ru/`; Sprachweiche nach Browsersprache |
| Seiten | Startseite, Über uns, Angebote, Termine, Verein, Satzung, Beitragsordnung, Mitglied werden, Spenden, Kontakt, Impressum, Datenschutz, Cookie-Einstellungen, Barrierefreiheit, Newsletter bestätigt |
| Formulare | Kontakt, Newsletter (Double-Opt-in vorbereitet), Mitgliedsantrag (mit optionalem SEPA-Mandat), Spendenanfrage |
| Spenden | Bankdaten mit Kopieren-Buttons, GiroCode (EPC-QR) live im Browser, SVG-Download, Bestätigung mit Code für den gewählten Betrag |
| Termine | Tabelle mit freien Plätzen, Filter nach Kurs, vergangene Termine werden automatisch ausgeblendet, „Anfragen“ füllt das Kontaktformular vor |
| Datenschutz | Keine Cookies, kein Tracking, keine externen Schriften oder Skripte; OpenStreetMap-Karte nur nach Einwilligung |
| Barrierefreiheit | Ziel WCAG 2.2 AA; automatisch geprüft, ohne Befund |
| SEO | Title, Description, Open Graph, canonical, hreflang, schema.org (NGO, EducationEvent), `sitemap.xml`, `robots.txt` |
| Downloads | Satzung, Beitragsordnung, Vorlage „vereinfachter Spendennachweis“ (PDF, Platzhalter) |

**Nicht enthalten** (bewusst, laut Auftrag): Online-Zahlung, Terminbuchung, Shop. Die Erweiterungspunkte sind vorbereitet ([Abschnitt 10](#10-bekannte-einschränkungen-und-ideen-für-die-zukunft)).

## 2. Technologie-Stack

| Technik | Einsatz | Begründung |
|---|---|---|
| **HTML5** (statisch, fertig erzeugt) | Alle 45 Seiten | Läuft auf jedem Webspace und per Doppelklick; gut für Suchmaschinen; funktioniert auch ohne JavaScript |
| **CSS** (eine Datei, CSS-Variablen) | Design-System, Hell/Dunkel, Druck | Kein Framework nötig; Farben und Abstände an einer Stelle |
| **JavaScript** (klassische Skripte mit `defer`, keine Module) | Menü, Formulare, GiroCode, Einwilligung, Termine | Chrome blockiert ES-Module bei `file://`; so funktioniert die Seite auch lokal |
| **qrcode-generator 2.0.4** (Kazuhiko Arase, MIT), lokal | GiroCode | Kleine Bibliothek ohne Abhängigkeiten, mit UTF-8-Unterstützung. Eigentlich war Nayuki geplant; das gibt es aber nicht als offizielles npm-Paket ([E7](#11-entscheidungsprotokoll)) |
| **Inter** (SIL OFL 1.1), lokal als woff2 | Schrift | Neutral und gut lesbar, mit Kyrillisch; keine Verbindung zu Google |
| **Python 3** (nur Standardbibliothek) | Pflegeskript `tools/build.py` | Erzeugt die Seiten aus zentralen Daten; auf Linux und macOS vorinstalliert |
| **Playwright + Chromium** (nur Entwicklung) | PDFs, Vorschaubild, Browser-Tests | Gleiche Quelle für HTML und PDF; realistische Tests |
| **axe-core 4.14** (MPL 2.0, nur Entwicklung) | Barrierefreiheitsprüfung | Etabliertes Prüfwerkzeug |
| **jsQR, pngjs** (nur Entwicklung) | GiroCode im Test dekodieren | Beweist, dass der Code den richtigen Inhalt hat |
| **fonttools** (nur Entwicklung, optional) | Logo-Schrift in Pfade umwandeln | Logo sieht überall gleich aus |

**Zum Betrieb wird nur der Inhalt des Ordners `skills-lab/` gebraucht, ohne `tools/` und `docs/`.**

## 3. Projektstruktur

```
skills-lab/
├── index.html                   Sprachweiche: leitet nach gespeicherter Wahl bzw. Browsersprache auf /de, /en oder /ru
├── 404.html                     Fehlerseite (alle drei Sprachen; nutzt absolute Pfade → Website muss im Domain-Root liegen)
├── robots.txt                   Erlaubt alles, verweist auf die Sitemap
├── sitemap.xml                  42 URLs (ohne „Newsletter bestätigt“) mit hreflang-Alternativen
├── README.md                    Kurzanleitung mit Verweis auf diese Dokumentation
├── CHECKLISTE.md                Arbeits-Checkliste des Projekts
├── .gitignore                   Schließt Test-Abhängigkeiten und Testausgaben aus
│
├── de/  en/  ru/                je 15 fertige HTML-Seiten (ERZEUGT – nicht von Hand bearbeiten, siehe Abschnitt 8)
│
├── css/
│   └── style.css                Gesamtes Styling: Schriften, Tokens, Basis, Header, Bausteine, Seiten, Footer, Banner, Druck
│
├── js/
│   ├── main.js                  Für alle Seiten: Seitendaten, Menü, Theme, Sprache merken, Einwilligung, Karte, Kopieren, Drucken, Termine
│   ├── forms.js                 Formulare: Validierung, Fehlerübersicht, bedingte Felder, Honeypot, Versand (Endpunkt/mailto), Vorbelegung
│   ├── iban.js                  IBAN-Prüfung (Länge je Land + Mod 97) und Formatierung
│   ├── girocode.js              EPC-Datensatz, QR-SVG, Textalternative, Download, Betragswahl
│   ├── payments.js              Erweiterungspunkt für Zahlungswege (Version 1: nur Überweisung/GiroCode)
│   └── vendor/
│       ├── qrcode.js            QR-Bibliothek qrcode-generator 2.0.4 (unverändert)
│       └── LICENSE-qrcode.txt   MIT-Lizenz der Bibliothek
│
├── assets/
│   ├── logo.svg                 Text-Logo (Pfade) für helle Hintergründe
│   ├── logo-dark.svg            Text-Logo für dunkle Hintergründe
│   ├── favicon.svg              Browser-Symbol
│   ├── og-image.png             Vorschaubild 1200 × 630 beim Teilen
│   └── fonts/                   Inter (latin, latin-ext, cyrillic, cyrillic-ext) + OFL.txt (Lizenz)
│
├── data/                        ZENTRALE DATEN (hier pflegen)
│   ├── site.json                Basis-URL, Vereinsdaten, Kontakt, Bankdaten, Karte, Formular-Endpunkte, Dokumentstände, Spendenbeträge
│   ├── beitraege.json           Mitgliedsarten und Beiträge (einzige Quelle für Tabelle und Auswahlfeld)
│   ├── angebote.json            Kurse mit Texten in drei Sprachen, Format, Niveau, Preisen
│   └── termine.json             Orte und Termine (Datum, Zeit, Kurs, Plätze)
│
├── i18n/                        ALLE TEXTE (hier pflegen)
│   ├── de.json                  Deutsch (Referenz; bestimmt die Schlüssel)
│   ├── en.json                  Englisch (gleiche Schlüssel)
│   └── ru.json                  Russisch (gleiche Schlüssel)
│
├── downloads/                   PDFs (ERZEUGT mit tools/make_assets.cjs)
│   ├── satzung.pdf
│   ├── beitragsordnung.pdf
│   └── spendennachweis-vorlage.pdf
│
├── tools/                       NUR FÜR DIE PFLEGE – nicht hochladen
│   ├── build.py                 Pflegeskript: prüft Übersetzungen und Daten, erzeugt Seiten, index.html, 404.html, Sitemap, robots.txt
│   ├── make_logo.py             Erzeugt Logo/Favicon als SVG-Pfade (benötigt fonttools + brotli)
│   ├── make_assets.cjs          Erzeugt PDFs und og-image.png mit Chromium
│   ├── templates/
│   │   ├── layout.html          Grundgerüst jeder Seite (Head, Header, Main, Footer, Skripte)
│   │   ├── spendennachweis.html Vorlage für das Spendennachweis-PDF
│   │   └── og-image.html        Vorlage für das Vorschaubild
│   ├── examples/
│   │   └── formular.php         Beispiel-Empfänger für die Formulare (eigenes PHP-Skript)
│   └── tests/
│       ├── package.json         Test-Abhängigkeiten (Playwright, axe-core, jsQR, pngjs)
│       ├── check_static.py      Statische Prüfung (Links, Anker, IDs, Meta-Angaben, externe Ressourcen)
│       └── browser.test.cjs     76 Browser-Tests
│
└── docs/
    ├── 00-auftrag.md            Auftragsverständnis und Annahmen (Phase 1)
    ├── recherche-notizen.md     Rohnotizen der Recherche (Phase 2)
    ├── 01-recherche.md          Recherche-Dokumentation (Phase 3)
    ├── 02-konzept.md            Konzept (Phase 4)
    └── 03-dokumentation.md      Diese Datei (Phase 6)
```

## 4. Seiten und Komponenten

### 4.1 Gemeinsamer Aufbau jeder Seite (`tools/templates/layout.html`)

1. **`<head>`**: Titel („Seite · Skills Lab e.V.“), Description, canonical, hreflang (de/en/ru/x-default), Open Graph, Favicon, Stylesheet, ein kurzes Inline-Skript (setzt `.js` und die gespeicherte Darstellung, bevor die Seite gezeichnet wird), ggf. schema.org-JSON-LD.
2. **Skip-Link** „Zum Inhalt springen“.
3. **Header**: Logo (Link zur Startseite) · Menü-Button (nur mobil, nur mit JavaScript) · Hauptnavigation (Über uns, Angebote, Termine, Verein, Kontakt) · Sprachumschalter (DE | EN | RU, führt zur gleichen Seite in der anderen Sprache) · Buttons „Mitglied werden“ (Umriss) und „Spenden“ (Akzentfarbe).
4. **`<main id="main">`**: Seiteninhalt.
5. **Footer**: Kurzvorstellung und Adresse · Links zum Verein · Rechtslinks (Impressum, Datenschutz, Cookie-Einstellungen, Barrierefreiheit) · Copyright · Platzhalter-Hinweis · Umschalter Hell/Dunkel/System.
6. **Einwilligungs-Banner** (versteckt, erscheint nur beim ersten Besuch mit JavaScript).
7. **Seitendaten** als eingebettetes JSON (`<script type="application/json" id="site-data">`): Sprache, Fehlermeldungen, Statusmeldungen, ggf. Bankdaten. Dadurch braucht das JavaScript kein `fetch()` und funktioniert auch bei `file://`.
8. **Skripte**: immer `main.js`, je nach Seite zusätzlich `forms.js`, `iban.js`, `vendor/qrcode.js`, `girocode.js`, `payments.js`.

### 4.2 Die Seiten

| Seite (DE / EN+RU) | Inhalt | Erzeugt von (`build.py`) |
|---|---|---|
| `index.html` | Hero mit Nutzenversprechen und zwei Buttons · 6 Kurse kompakt · 3 nächste Termine (live gefiltert) · Über-uns-Teaser · Mitglied werden / Spenden · Newsletter-Formular | `page_home` |
| `ueber-uns.html` / `about.html` | Mission · 4 Werte · Arbeitsweise · Team (Initialen-Platzhalter) · Mitmach-Aufruf | `page_about` |
| `angebote.html` / `courses.html` | Ermäßigungshinweis · 6 Kurse mit Text, Dauer, Format, Niveau, Zielgruppe, Preis/Mitgliederpreis · Links „Termine“ und „Anfragen“ · Workshop für Gruppen | `page_courses` |
| `termine.html` / `dates.html` | Anmelde-Hinweis · Filter (nur mit JS) · Tabelle (Datum, Uhrzeit, Kurs, Ort, freie Plätze, Anfragen/Warteliste) · schema.org EducationEvent | `page_dates` |
| `verein.html` / `association.html` | Unternavigation · Fakten (Name, Sitz, Register, Zweck, Gemeinnützigkeit, Vorstand) · Satzung und Beitragsordnung mit Stand, Online-Link und PDF · Gründungsgeschichte (Platzhalter) | `page_association` |
| `satzung.html` / `statutes.html` | Prüfhinweis · Übersetzungshinweis (EN/RU) · Fassung und Beschlussdatum · PDF und Drucken · Inhaltsverzeichnis · 14 Paragraphen mit nummerierten Absätzen und „Nach oben“ | `legal_doc_page` |
| `beitragsordnung.html` / `fees.html` | wie Satzung, mit 8 Paragraphen; in § 1 die Beitragstabelle aus `beitraege.json` | `legal_doc_page` + `fees_table` |
| `mitglied-werden.html` / `membership.html` | 4 Vorteile · Beitragstabelle · Mitgliedsantrag (persönliche Angaben, Mitgliedsart, Zahlungsweise, SEPA-Mandat, Einverständnis) | `page_membership` |
| `spenden.html` / `donate.html` | Wirkung der Spende · Bankdaten mit Kopieren · GiroCode mit Betragswahl, Textalternative, Download · Spendenbescheinigung (300-€-Regel) · Spendenanfrage mit Bestätigung und GiroCode | `page_donate` |
| `kontakt.html` / `contact.html` | Kontaktformular · Adresse, E-Mail, Telefon · Karte nach Einwilligung · Link zu OpenStreetMap | `page_contact` |
| `impressum.html` / `legal-notice.html` | Angaben nach § 5 DDG, Vorstand, Register, Gemeinnützigkeit, § 18 MStV, Haftung für Links, Lizenzen | `simple_legal_page` |
| `datenschutz.html` / `privacy.html` | 14 Abschnitte inkl. Mitglieds-, SEPA- und Spenderdaten, Aufbewahrung, Karte, Rechte, Beschwerde (HBDI) | `simple_legal_page` |
| `cookie-einstellungen.html` / `cookie-settings.html` | Erklärung (keine Cookies) · Schalter „Karte laden“ · Speichern/Widerruf | `page_cookies` |
| `barrierefreiheit.html` / `accessibility.html` | Freiwillige Erklärung: Ziel, Stand, Umsetzung, bekannte Einschränkungen, Kontakt | `simple_legal_page` |
| `newsletter-bestaetigt.html` / `newsletter-confirmed.html` | Zielseite für den Bestätigungslink des Newsletter-Dienstes | `page_newsletter_confirmed` |

### 4.3 Wiederverwendbare Bausteine

| Baustein | HTML/CSS | Verwendung |
|---|---|---|
| Button | `.btn`, `.btn--outline`, `.btn--accent`, `.btn--small`, `.btn--text` | Alle Aktionen; mindestens 44 px hoch |
| Hinweis | `.notice`, `.notice--accent` | Platzhalter-, Übersetzungs- und Info-Hinweise (linke Linie, dezente Fläche) |
| Zeilenliste | `.rows`, `.rows--compact` | Kurse, Termine, Werte, Vorteile (Trennlinien statt Karten) |
| Kurs | `.course` + `.facts` | Text links, Eckdaten rechts (mobil untereinander) |
| Eckdaten | `.facts` (`<dl>`) | Kurs-, Vereins- und Kontaktdaten |
| Tabelle | `.data-table`, `.data-table--stack` | Beiträge, Termine; mobil als Blöcke mit Beschriftung, Rollen per `role` abgesichert |
| Formularfeld | `.field`, `.check`, `.error-text`, `.error-summary` | Alle Formulare (erzeugt mit `field()`, `select()`, `checkbox()`, `radios()` in `build.py`) |
| Kopierzeile | `.copy-list`, `.copy-row`, `.copy-btn` | Bankdaten |
| GiroCode | `.giro`, `[data-giro-code]`, `[data-giro-text]` | Spendenseite, Bestätigung |
| Auswahl-Buttons | `.choice` (echte Radiobuttons) | Spendenbetrag |
| Inhaltsverzeichnis | `.toc` | Satzung, Beitragsordnung, Datenschutz |
| Unternavigation | `.subnav` | Verein → Satzung → Beitragsordnung |
| Banner | `.consent` | Einwilligung zur Karte |
| Karte | `.map-box`, `[data-map]` | Kontaktseite |

## 5. Design-System

Alle Werte stehen als CSS-Variablen am Anfang von `css/style.css`.

### 5.1 Farben

| Variable | Hell | Dunkel | Verwendung | Kontrast (hell / dunkel) |
|---|---|---|---|---|
| `--c-bg` | `#ffffff` | `#111416` | Hintergrund | – |
| `--c-subtle` | `#f5f7f8` | `#181c1f` | Hinweisflächen | – |
| `--c-text` | `#1b1f23` | `#e6e9ec` | Text | 16,6 : 1 / 15,2 : 1 |
| `--c-muted` | `#57606a` | `#a2abb3` | Nebentext | 6,4 : 1 / 7,9 : 1 |
| `--c-line` | `#d8dde3` | `#2c3237` | Trennlinien (dekorativ) | – |
| `--c-border` | `#8a939b` | `#6b747c` | Rahmen der Eingabefelder | 3,1 : 1 / 3,9 : 1 |
| `--c-primary` | `#0e5466` | `#6cc3d5` | Links, Buttons, Fokus | 8,5 : 1 / 9,2 : 1 |
| `--c-accent` | `#a8461b` | `#f0a070` | Spenden-Button, Markierungen | 5,9 : 1 / 8,8 : 1 |
| `--c-error` | `#b42318` | `#ff8a80` | Fehlermeldungen | – (immer mit Text und Symbol) |
| `--c-success` | `#1e6b3a` | `#7fd49b` | Erfolgsmeldungen | – |

Der Dunkelmodus folgt der Systemeinstellung (`prefers-color-scheme`). Mit dem Umschalter im
Footer lässt er sich überstimmen (`data-theme` am `<html>`, gespeichert in `localStorage`).
**Der GiroCode bleibt immer schwarz auf weiß**, damit Banking-Apps ihn zuverlässig lesen.

### 5.2 Typografie

| Element | Variable | Größe | Gewicht |
|---|---|---|---|
| Fließtext | `--fs-body` | 17 px (1,0625 rem), Zeilenhöhe 1,6 | 400 |
| Klein | `--fs-small` | 14 px | 400 |
| h1 | `--fs-h1` | 32 → 44 px (fließend) | 700 |
| h2 | `--fs-h2` | 24 → 30 px | 700 |
| h3 / `.h3` | `--fs-h3` | 18 → 20 px | 600 |

Schrift: `Inter` mit Fallback `system-ui`. Die woff2-Dateien werden nach Bedarf geladen
(`unicode-range`), auf russischen Seiten zusätzlich der kyrillische Schnitt.

### 5.3 Abstände und Raster

- Abstände `--s-1` … `--s-9` = 4, 8, 12, 16, 24, 32, 48, 64, 96 px
- Inhaltsbreite `--container` 72 rem, Textspalte `--measure` 68 Zeichen, Seitenrand `--gutter` 16 px (ab 600 px: 32 px)
- Breakpoints: 600 px (Tablet), 900 px (Desktop-Navigation, fixierter Header)
- Radius `--radius` 4 px nur an Buttons und Eingabefeldern
- Bewegung: nur Übergänge von 150 ms; bei „Bewegung reduzieren“ ganz abgeschaltet

### 5.4 Logo

Die Wortmarke „Skills Lab“ ist in Inter 700 gesetzt, davor steht ein kleines Akzent-Quadrat. Die Schrift ist in Pfade
umgewandelt (`tools/make_logo.py`), damit das Logo überall gleich aussieht. Im Header wird
das Logo inline eingesetzt und übernimmt die Farben aus den Variablen. So passt es sich dem Dunkelmodus an.
**Logo austauschen:** siehe [Abschnitt 8.6](#86-logo-austauschen).

## 6. Funktionen und Logik

### 6.1 Seitenerzeugung (`tools/build.py`)

1. Lädt `data/*.json` und `i18n/*.json`.
2. **Prüft**:
   - ob alle Sprachdateien dieselben Schlüssel haben,
   - ob es leere Texte gibt,
   - ob Kurs- und Ort-Verweise in den Terminen stimmen,
   - ob Datum und Platzzahlen plausibel sind,
   - ob die Prüfsumme der IBAN in `site.json` gültig ist.

   Bei einem Fehler bricht das Skript mit einer verständlichen Meldung ab.
3. Erzeugt für jede Sprache und Seite das HTML aus `layout.html` und der jeweiligen Seitenfunktion.
4. **Ersetzt Platzhalter in Texten:**
   - `{p:seite}` → Link zur Seite in der aktuellen Sprache, z. B. `{p:privacy}` → `datenschutz.html`
   - `{site:pfad}` → Wert aus `site.json`, z. B. `{site:org.email}`
   - `{address}`, `{board}`, `{email_link}`, `{fee_min}`, `{year}`, `{de_link}` → fertige Bausteine
5. Prüft danach, ob noch Vorlagen- oder Text-Platzhalter übrig sind. Falls ja, bricht es ab.
6. Schreibt zusätzlich `index.html` (Sprachweiche), `404.html`, `sitemap.xml` und `robots.txt`.

Datumsformate je Sprache: `Sa, 14.11.2026` · `Sat 14 Nov 2026` · `сб, 14.11.2026`. Beträge: `60 €` · `€60` · `60 €`.

### 6.2 Formulare (`js/forms.js`)

| Schritt | Verhalten |
|---|---|
| Ohne JavaScript | Native Browserprüfung (`required`, `type="email"`); das Formular geht per `mailto:` (bzw. an den Endpunkt) |
| Mit JavaScript | `novalidate`; eigene Meldungen in der Seitensprache aus den Seitendaten |
| Prüfzeitpunkt | Beim Verlassen eines Feldes und beim Absenden; Fehler verschwinden beim Korrigieren sofort |
| Fehleranzeige | Text unter dem Feld (`aria-describedby`), `aria-invalid="true"`, Fehlerübersicht oben mit Links zu den Feldern, Fokus auf der Übersicht |
| Prüfregeln (`data-validate`) | `email` (Muster), `zip` (3–10 Zeichen), `birthdate` (gültig und nicht in der Zukunft), `iban` (siehe 6.3), `amount` (1–10.000 €, Komma oder Punkt) |
| Bedingte Pflicht | `data-required-if="zahlungsweise=sepa"` bzw. `data-required-if="bescheinigung"` |
| Bedingte Bereiche | `data-show-if="zahlungsweise=sepa"`: Bereich wird ein-/ausgeblendet, Felder darin deaktiviert (werden dann weder geprüft noch gesendet) |
| Honeypot | Verstecktes Feld `website`. Ist es ausgefüllt, erscheint eine Erfolgsmeldung, gesendet wird nichts |
| Versand mit Endpunkt | `fetch` POST (`FormData` + `_subject`), `Accept: application/json`; Erfolg bei HTTP 2xx, sonst Fehlermeldung mit E-Mail-Adresse |
| Versand ohne Endpunkt | Vorausgefüllte `mailto:`-Nachricht („Beschriftung: Wert“ je Zeile) + Hinweis, dass sich das E-Mail-Programm öffnet |
| Spendenanfrage | Nach Erfolg zeigt `payments.js` die Bestätigung mit Bankdaten und GiroCode für Betrag und Namen |
| Vorbelegung | `kontakt.html?thema=kurs&termin=<id>` bzw. `&kurs=<id>` setzt das Thema und einen Nachrichtenanfang |

### 6.3 IBAN-Prüfung (`js/iban.js`)

Erst wird die Eingabe bereinigt (Leerzeichen entfernt, Großbuchstaben). Dann folgen drei Schritte:
1. Ist der Ländercode einer der 37 SEPA-Länder?
2. Hat die IBAN die Länge, die für dieses Land gilt?
3. Ergibt die Mod-97-Prüfung den Rest 1? Gerechnet wird in Blöcken zu je 7 Ziffern, weil JavaScript so große Zahlen sonst nicht genau darstellt.

Jeder Fehlerfall hat eine eigene Meldung. Nach dem Verlassen des Feldes wird die IBAN in
Vierergruppen formatiert. **Die Prüfung belegt nicht, dass das Konto existiert.**

### 6.4 GiroCode (`js/girocode.js`)

- **Datensatz** (Zeilen mit `\n` verbunden):
  `BCD` · `002` · `1` (UTF-8) · `SCT` · BIC · Name (max. 70) · IBAN · `EUR25.00` oder leer · Purpose (leer) · Referenz (leer) · Verwendungszweck (max. 140). Mehr als 331 Byte sind nicht erlaubt.
- **QR-Code:** Er wird mit `qrcode-generator` erzeugt, mit Fehlerkorrektur M, Byte-Modus (UTF-8) und 4 Modulen Ruhezone. Ausgegeben wird er als SVG mit einem einzigen Pfad.
- **Barrierefreiheit:** Der Container hat `role="img"` und ein `aria-label`, z. B. „GiroCode für eine Überweisung über 25 € an Skills Lab e.V.“. Daneben stehen alle Daten als Text in einem `<dl>` mit `aria-live`.
- **Betragswahl:** 10, 25, 50 oder 100 € (änderbar in `site.json` → `donation_amounts`) oder ein anderer Betrag. Bei einer ungültigen Eingabe erscheint eine Fehlermeldung, und der Code entsteht ohne Betrag. Das erlaubt der Standard.
- **Download:** Der Code wird als Blob gespeichert, der Dateiname lautet z. B. `skills-lab-girocode-25eur.svg`.
- **Einschränkung:** Der Purpose-Code (z. B. für „Wohltätigkeit“) ist leer gelassen, weil ich den Wert nicht an der Originalquelle prüfen konnte.

### 6.5 Einwilligung und Karte (`js/main.js`)

- **Speicherung:** Die Entscheidung wird in `localStorage` gespeichert, als `sl-consent = {"map": true|false, "date": "…", "version": 1}`.
- **Banner:** Er erscheint, solange keine Entscheidung vorliegt. Die beiden Buttons sind gleich gestaltet. Solange der Banner sichtbar ist, bekommt die Seite unten einen Abstand, damit nichts verdeckt wird (WCAG 2.4.11).
- **Karte:** Sie wird erst mit Einwilligung als iframe von `openstreetmap.org/export/embed.html` eingesetzt. Mit „Karte laden“ auf der Kontaktseite gibt man die Einwilligung direkt.
- **Widerruf:** Auf der Seite „Cookie-Einstellungen“. Die Karte verschwindet dann beim nächsten Laden der Seite.
- **Version:** Erhöht man die Version (`CONSENT_VERSION` in `main.js`), wird erneut gefragt. Das ist sinnvoll, wenn neue externe Dienste hinzukommen.

### 6.6 Termine

- **Beim Build:** Termine vor `site.json` → `build_date` erhalten das Attribut `hidden`.
- **Im Browser:** `main.js` blendet alle Termine vor dem **heutigen** Datum aus, auch ohne neuen Build.
- **Startseite:** Sie zeigt die nächsten 3 kommenden Termine. Gibt es keine, erscheint ein Hinweistext.
- **Filter:** Er wählt nach Kurs aus und sagt die Anzahl an (`role="status"`). Mit `?kurs=<id>` ist ein Kurs vorausgewählt.
- **Freie Plätze:** Als Text, z. B. „4 von 10 frei“. Bei höchstens 3 freien Plätzen heißt es „nur noch n frei“ (Akzentfarbe), bei 0 „ausgebucht“ und der Link heißt „Warteliste“.

### 6.7 Weitere Funktionen

- **Sprache merken:** `sl-lang` wird gesetzt, sobald eine Seite aufgerufen oder ein Sprachlink geklickt wird. Die Sprachweiche verwendet es zuerst, danach die Browsersprache, sonst Deutsch.
- **Mobiles Menü:** Der Button steuert `aria-expanded`. Escape schließt das Menü und setzt den Fokus zurück auf den Button. Ohne JavaScript ist die Navigation immer sichtbar.
- **Kopieren:** Über die Clipboard API, mit Ausweichlösung über ein unsichtbares Textfeld. Die Bestätigung „Kopiert“ ist sichtbar und wird auch angesagt.
- **Drucken:** Der Button auf Satzung und Beitragsordnung ruft `window.print()` auf. Das Druck-CSS blendet Header, Footer und Buttons aus.

## 7. Einrichtung und Start

### 7.1 Lokal ansehen

**Variante A, ohne alles:** `skills-lab/index.html` oder z. B. `skills-lab/de/index.html` per Doppelklick öffnen. Getestet: Skripte, Schrift und GiroCode funktionieren auch über `file://`.

**Variante B, mit lokalem Server** (realistischer, z. B. für die Sprachweiche):
```bash
cd skills-lab
python3 -m http.server 8000
# Browser: http://localhost:8000/
```

### 7.2 Veröffentlichen

1. **Platzhalter ersetzen** ([Anhang A](#anhang-a-liste-aller-platzhalter)). Mindestens nötig: `data/site.json` (Basis-URL, Vereins- und Bankdaten), die Rechtstexte in `i18n/*.json` und die Beiträge.
2. `python3 tools/build.py` ausführen. Bei geänderter Satzung, Beitragsordnung oder Logo zusätzlich die PDFs und das Vorschaubild neu erzeugen (siehe 7.4).
3. **Hochladen** in das Wurzelverzeichnis der Domain:
   `index.html`, `404.html`, `robots.txt`, `sitemap.xml`, `de/`, `en/`, `ru/`, `css/`, `js/`, `assets/`, `downloads/`.
   **Nicht nötig:** `tools/`, `docs/`, `data/`, `i18n/`, `CHECKLISTE.md`, `README.md`. Die Daten stecken bereits in den Seiten. Hochladen schadet nicht, macht die Rohdaten aber öffentlich lesbar.
4. **HTTPS** beim Hoster aktivieren (bei fast allen kostenlos), weil die Seite Formulare hat.
5. **404-Seite** beim Hoster einstellen. Viele Hoster erkennen `404.html` automatisch, bei Apache geht es über `.htaccess`: `ErrorDocument 404 /404.html`.
6. **Auftragsverarbeitungsvertrag** (AVV) mit dem Hoster abschließen und den Hoster in der Datenschutzerklärung eintragen.
7. Nach dem Start die Sitemap in der Google Search Console bzw. bei Bing Webmaster Tools einreichen (optional).

**Hosting-Möglichkeiten** (Beispiele, keine Empfehlung einzelner Anbieter):
- klassischer Webspace bei einem deutschen Hoster: einfach, Server in Deutschland, AVV meist per Klick
- GitHub Pages oder Netlify: kostenlos für statische Seiten, Serverstandort und AVV beachten
- Die ältere Recherche `../003_Recherche_Vereinswebseite.md`, Abschnitt 5, enthält weitere Ideen fürs Hosting.

**Wichtig:** Die Seite erwartet, im Wurzelverzeichnis der Domain zu liegen (`https://www.verein.de/`).
In einem Unterordner funktionieren alle Seiten ebenfalls, weil die Links relativ sind. Nur die
`404.html` und die absoluten URLs in Sitemap, canonical und Open Graph müssen dann angepasst werden: `base_url` in `site.json`.

### 7.3 Formular-Versand einrichten

Ohne Einrichtung arbeiten alle Formulare mit dem **mailto-Fallback**. Das funktioniert immer,
setzt aber ein eingerichtetes E-Mail-Programm voraus und wirkt weniger komfortabel. Für einen
direkten Versand trägt man in `data/site.json` → `forms` eine URL ein, für alle Formulare
gleich oder je Formular verschieden, und führt den Build erneut aus.

| Option | So geht’s | DSGVO-Konsequenzen |
|---|---|---|
| **mailto (Standard)** | nichts tun | Kein Dienstleister. Die Daten gehen über den E-Mail-Anbieter der Nutzerin oder des Nutzers an das Vereinspostfach. In der Datenschutzerklärung beschrieben (Abschnitt 10) |
| **Eigenes PHP-Skript** | `tools/examples/formular.php` anpassen (Empfänger, Absender), auf den Webspace laden, URL eintragen | Daten bleiben beim eigenen Hoster (AVV vorhanden). Postfach-Zugriff und Löschfristen regeln. Das Skript wurde lokal getestet (gültige Anfrage, ungültige E-Mail, fehlende Einwilligung, Honeypot, falsche Methode, Kopfzeilen-Injektion im Betreff); der echte Mailversand hängt vom Hoster ab |
| **Formular-Dienst** (z. B. Formspree) | Formular beim Dienst anlegen, die angezeigte URL eintragen | Der Dienst ist Auftragsverarbeiter: **AVV/DPA abschließen**. Bei Anbietern außerhalb der EU (Formspree sitzt in den USA) muss die Drittlandübermittlung abgesichert sein, z. B. durch eine Zertifizierung unter dem EU-US Data Privacy Framework oder durch Standardvertragsklauseln. Das ist im Einzelfall zu prüfen. Den Dienst in der Datenschutzerklärung (Abschnitt 10) eintragen |
| **Newsletter-Dienst** | Anmeldeformular des Dienstes als Endpunkt eintragen oder dessen Formular einbetten; als Ziel des Bestätigungslinks `newsletter-bestaetigt.html` angeben | Double-Opt-in und Abmeldung übernimmt der Dienst. AVV nötig; europäische Anbieter sind einfacher. In der Datenschutzerklärung (Abschnitt 6) eintragen |

Der Versand per Endpunkt erwartet eine Antwort mit HTTP 2xx. Ob JSON zurückkommt, ist egal.
Mitgeschickt werden alle Felder sowie `_subject`. Das Honeypot-Feld `website` wird nicht
gesendet, weil der Versand bei einem ausgefüllten Honeypot vorher abbricht.

### 7.4 Werkzeuge für die Pflege (optional)

```bash
# Seiten neu erzeugen (immer nach Änderungen an data/ oder i18n/)
python3 tools/build.py

# Nur prüfen, nichts schreiben
python3 tools/build.py --check

# PDFs (Satzung, Beitragsordnung, Spendennachweis) und Vorschaubild neu erzeugen
cd tools/tests && npm install        # einmalig, installiert u. a. Playwright
cd ../.. && node tools/make_assets.cjs
# Falls Playwright noch keinen Browser hat: npx playwright install chromium (im Ordner tools/tests)

# Logo neu erzeugen (nach Änderung in tools/make_logo.py)
pip install fonttools brotli          # einmalig
python3 tools/make_logo.py && python3 tools/build.py

# Alle Tests
cd tools/tests && npm test
```

**Reihenfolge nach einer Satzungsänderung:**
1. Text in `i18n/de.json` ändern, die Übersetzungen in `en.json` und `ru.json` ebenfalls.
2. `build.py` ausführen.
3. `make_assets.cjs` ausführen, denn das PDF entsteht aus `de/satzung.html`.

## 8. Inhalte pflegen

**Grundregel:** Die Dateien in `de/`, `en/` und `ru/` nie von Hand ändern. Sie werden bei
jedem Build überschrieben. Stattdessen `data/` oder `i18n/` bearbeiten und `python3 tools/build.py`
ausführen.

### 8.1 Texte ändern

- Alle Texte stehen in `i18n/de.json`, `en.json` und `ru.json`, unter **denselben Schlüsseln**, z. B. `pages.home.h1`.
- Die Texte dürfen einfaches HTML enthalten (`<strong>`, `<a href='…'>`, `<br>`). **Attribute bitte in einfachen Anführungszeichen** schreiben, sonst muss man in JSON escapen.
- Links auf eigene Seiten immer als `{p:seiten-id}` schreiben, z. B. `{p:privacy}`. Dann stimmen sie in jeder Sprache.
- Fehlt in einer Sprache ein Schlüssel oder ist ein Text leer, meldet der Build das mit Pfad und bricht ab.
- JSON-Syntax beachten: Kommas zwischen Einträgen, keine Kommentare. Ein JSON-fähiger Editor (z. B. VS Code) zeigt Fehler sofort an.

### 8.2 Beiträge ändern

In `data/beitraege.json`: `amount` (Euro pro Jahr), `min` (`true` = „ab“-Betrag), `label` und `note`
je Sprache. Neue Mitgliedsart: einen Block mit neuer `id` kopieren. Danach den Build ausführen. Tabelle
und Auswahlfeld im Antrag werden automatisch angepasst. **Die Beitragsordnung (§ 1) verweist
auf die Tabelle; die übrigen Paragraphen sind Text in `i18n/*.json`.**

### 8.3 Kurse ändern oder ergänzen

In `data/angebote.json` einen Kurs kopieren und Folgendes anpassen:
- `id`: Kleinbuchstaben und Bindestriche; wird für Anker und Filter verwendet
- `format`: `onsite`, `online` oder `hybrid`
- `level`: `beginner`, `all` oder `advanced`
- `price` und `member_price`
- alle Texte je Sprache

### 8.4 Termine pflegen

In `data/termine.json` → `events`:
```json
{ "id": "2027-04-10-kommunikation", "date": "2027-04-10", "start": "09:30", "end": "12:30",
  "course": "kommunikation", "location": "vereinsraum", "seats_total": 12, "seats_free": 12 }
```
`course` muss eine `id` aus `angebote.json` sein, `location` ein Schlüssel aus `locations`.
Freie Plätze bitte aktuell halten (Build ausführen). **Vergangene Termine verschwinden im Browser von selbst**,
ein Aufräumen ist nur gelegentlich nötig. Außerdem `build_date` in `site.json` auf das aktuelle Datum setzen.
Es bestimmt, was ohne JavaScript und in den schema.org-Daten als „kommend“ gilt.

### 8.5 Vereins-, Kontakt- und Bankdaten

Alles in `data/site.json`: `org` (Name, Anschrift, E-Mail, Telefon, Register, Vorstand,
Finanzamt, Gläubiger-ID, Aufsichtsbehörde), `bank` (Inhaber, IBAN ohne Leerzeichen, BIC, Bank,
Verwendungszweck), `map` (Koordinaten der Adresse), `documents` (Fassung und Beschlussdatum der
Satzung und Beitragsordnung). Der Build prüft die IBAN-Prüfsumme.
**Bankdaten auch in `tools/templates/spendennachweis.html` anpassen** und `make_assets.cjs` ausführen.

### 8.6 Logo austauschen

- **Einfach:** Eigenes Logo als `assets/logo.svg` speichern (mit einem `<path>`, optional einem `<rect>`). Der Build übernimmt es in den Header und färbt den Pfad in der Primärfarbe. Bei komplexen, mehrfarbigen Logos die Funktion `logo_inline()` in `build.py` so ändern, dass sie das SVG unverändert einsetzt oder `<img src="../assets/logo.svg" alt="">` verwendet.
- **Wortmarke ändern:** `TEXT`, Farben oder Größen in `tools/make_logo.py` anpassen und das Skript ausführen.
- Danach den Build ausführen und `make_assets.cjs` für das Vorschaubild.

### 8.7 Bilder ergänzen

Die Seite kommt bewusst ohne Fotos aus. Wer Bilder ergänzt, beachtet:
- als WebP oder AVIF speichern, höchstens etwa 1600 px breit, unter 200 KB
- unter `assets/` ablegen
- mit `alt`-Text, `width`/`height` und `loading="lazy"` einbinden
- **Nutzungsrechte und Einwilligung abgebildeter Personen klären**

Bilder werden in der Seitenfunktion in `build.py` eingefügt. Die Texte dazu, auch den Alt-Text, schreibt man in `i18n/*.json`.

### 8.8 Neue Seite anlegen

1. Eintrag in `PAGES` in `build.py` mit Dateinamen je Sprache.
2. Texte unter `pages.<id>` in allen drei Sprachdateien anlegen, mindestens `title`, `description` und `h1`.
3. Eine Funktion `page_<id>(c)` schreiben und in `RENDER` eintragen.
4. Optional: in `MAIN_NAV`, `FOOTER_ASSOC` oder `FOOTER_LEGAL` aufnehmen; dafür in `nav.<id>` einen Text anlegen.
5. Den Build ausführen, die Tests laufen lassen.

### 8.9 Weitere Sprache

1. `i18n/<code>.json` als Kopie von `en.json` anlegen und übersetzen.
2. `<code>` in `site.json` → `languages` eintragen.
3. In `build.py` → `PAGES` Dateinamen für die Sprache ergänzen.
4. In `data/*.json` Texte für die Sprache ergänzen.

Der Build meldet alles, was noch fehlt.

## 9. Tests und Qualität

### 9.1 Durchgeführte Prüfungen (16.10.2026)

| Prüfung | Werkzeug | Ergebnis |
|---|---|---|
| Übersetzungen vollständig, Daten plausibel, IBAN gültig | `tools/build.py --check` | **bestanden** |
| Interne Links, Anker, Ressourcen; genau eine h1; lang; title; description; canonical; hreflang; eindeutige IDs; gültige ARIA-/for-Verweise; Tabellen mit caption/th; keine externen Ressourcen | `tools/tests/check_static.py` | **46 Seiten, 1.741 Links, 0 Fehler** |
| Browser-Tests (Details unten) | `tools/tests/browser.test.cjs` (Playwright, Chromium) | **76 von 76 bestanden** |
| Barrierefreiheit WCAG 2.0/2.1/2.2 A+AA + Best Practices, hell und dunkel, alle 45 Seiten | axe-core 4.14 | **0 Verstöße** |
| PHP-Beispielskript | `php -l` + lokale Anfragen mit `curl` | 6 Fälle wie erwartet |
| Sichtprüfung | Screenshots bei 360/375, 768, 1280 px | Layout geprüft, gefundene Fehler behoben |

**Die 76 Browser-Tests umfassen:**
- **Layout:** alle 46 Seiten in 360, 768 und 1280 px Breite ohne horizontales Scrollen und ohne Konsolenfehler.
- **Tastatur:** Skip-Link als erster Tab-Stopp und sichtbar, Fokus auf `<main>`. Mobiles Menü mit `aria-expanded` und Escape. Sichtbarer Fokusrahmen, Zielgrößen ≥ 24 px, „Bewegung reduzieren“.
- **Einwilligung:** Banner, **kein Request an openstreetmap.org ohne Einwilligung**, Ablehnung, gespeicherte Entscheidung, „Karte laden“, Widerruf in den Cookie-Einstellungen.
- **Formulare in DE, EN und RU:**
  - leere Absendung mit 5 Fehlern, Fokus auf der Übersicht, Meldungen in der Landessprache
  - ungültige E-Mail und `aria-invalid`
  - Versand an den Endpunkt, Honeypot
  - IBAN: Prüfsumme, Länge, Formatierung
  - Geburtsdatum in der Zukunft
  - SEPA-Bereich bei Überweisung ausgeblendet
  - Mitgliedsarten aus den Daten
- **GiroCode:** Der Code wird **mit jsQR dekodiert und Zeichen für Zeichen verglichen**: bei 25 €, 100 €, 12,50 € und einem ungültigen Betrag. Dazu Textalternative, SVG-Download, Spendenanfrage mit Pflicht-Anschrift bei Bescheinigung, Bestätigungs-Code über 50 € mit Namen im Verwendungszweck, Hinweis auf einen Dauerauftrag, Kopieren der IBAN.
- **Termine:** vergangene ausblenden bei simuliertem Datum, Filter mit Ansage, Vorauswahl über die URL, 3 Termine auf der Startseite, Vorbelegung des Kontaktformulars.
- **Sprachen:** Sprachweiche für en-GB, ru-RU und fr-FR, Sprachumschalter, gespeicherte Sprache, Übersetzungshinweis auf der englischen Satzung.
- **Betrieb:** `file://` mit Skripten, GiroCode und Schrift, kyrillischer Schnitt auf russischen Seiten. Ohne JavaScript: Navigation, Bankdaten, mailto-Formular und Terminliste.
- **Einheitstest:** IBAN-Modul mit 6 gültigen und 5 ungültigen Beispielen.

**Während der Tests gefundene und behobene Fehler:**
- Horizontaler Überlauf auf der russischen Vereinsseite bei 360 px
- Falsche `<dl>`-Struktur bei den Bankdaten
- Der zugängliche Name des Links „Warteliste“ passte nicht zum sichtbaren Text (WCAG 2.5.3)
- Das Betragsfeld ließ kein Komma zu
- Der Menü-Button war auf dem Desktop sichtbar
- `iban.js` fehlte auf der Spendenseite
- Abschnitte mit Textspalte waren nicht bündig ausgerichtet
- Der Betreff in der mailto-Adresse war nicht kodiert

### 9.2 Was nicht geprüft wurde

- **Andere Browser:** Getestet wurde nur mit Chromium. Firefox und Safari (insbesondere iOS) sind nicht automatisch getestet. Die Seite nutzt nur verbreitete Standards, eine Sichtprüfung dort wird trotzdem empfohlen.
- **Screenreader:** Echte Screenreader (NVDA, VoiceOver, TalkBack) und eine Prüfung durch Menschen mit Behinderung fehlen noch.
- **Banking-Apps:** Der GiroCode ist nur per Dekodierung geprüft, nicht mit einer echten Banking-App.
- **HTML-Validator:** Der W3C-Validator wurde nicht eingesetzt, weil die Umgebung keinen Netzzugriff hatte. Die Wohlgeformtheit prüft nur das Python-Skript.
- **Echter Versand:** E-Mail-Versand über den Hoster, Formspree oder einen Newsletter-Dienst ist nicht getestet.
- **Übersetzungen:** EN und RU wurden von keinem Muttersprachler geprüft.
- **Rechtstexte:** Sie sind nicht juristisch geprüft.

### 9.3 Tests selbst ausführen

```bash
cd skills-lab/tools/tests
npm install          # einmalig
npm test             # build --check + statische Prüfung + Browser-Tests
# Ergebnisse und Screenshots: tools/tests/output/ (ergebnis.txt, axe-light.txt, axe-dark.txt, *.png)
```

## 10. Bekannte Einschränkungen und Ideen für die Zukunft

### 10.1 Einschränkungen

| Einschränkung | Auswirkung | Abhilfe |
|---|---|---|
| Alle Inhalte sind Platzhalter | Nicht veröffentlichungsreif | Anhang A abarbeiten |
| Rechtstexte ungeprüft | Rechtsrisiko | Prüfung durch Fachleute, z. B. Dachverband oder Anwalt |
| Übersetzungen ungeprüft | Mögliche Fehler in EN/RU | Muttersprachler gegenlesen lassen |
| Ohne Formular-Endpunkt nur mailto | Weniger komfortabel; manche Nutzer haben kein E-Mail-Programm | Abschnitt 7.3 |
| Double-Opt-in nur vorbereitet | Newsletter erst mit einem Dienst nutzbar | Newsletter-Dienst einrichten |
| Freie Plätze sind statisch | Müssen von Hand gepflegt werden | Später ein Buchungssystem anbinden (siehe unten) |
| `404.html` mit absoluten Pfaden | Funktioniert nur im Domain-Root | Pfade anpassen, falls in einem Unterordner gehostet |
| PDFs nur auf Deutsch, Barrierefreiheit nicht geprüft | Nur die deutsche Fassung ist verbindlich | HTML-Fassung ist barrierefrei; PDFs bei Bedarf mit einem PDF-Prüfwerkzeug (z. B. PAC) prüfen |
| Purpose-Code im GiroCode leer | Kein Nachteil für die Überweisung | Optional ergänzen, nachdem der Wert in EPC069-12 geprüft wurde |
| Kurse vermutlich auf Deutsch | Für EN/RU-Leser relevant | Hinweis steht auf den EN/RU-Kursseiten; Sprachunterstützung nennen |
| Sichtprüfung der Vorbildseiten fehlt (Phase 2/3) | Gestaltung nicht an Vorbildern gespiegelt | Netzwerkzugriff erweitern und die Prüfung nachholen |

### 10.2 Erweiterungen (vorbereitet)

- **Online-Spenden (PayPal, Stripe, SEPA-Lastschrift):**
  1. In `js/payments.js` einen Anbieter registrieren:
     ```js
     SkillsLab.payments.register({
       id: "paypal",
       label: "PayPal",
       isAvailable: function () { return true; },
       start: function (donation) { /* Weiterleitung oder Widget des Anbieters */ }
     });
     ```
  2. In `site.json` → `payments.donation_providers` ergänzen, z. B. `["transfer", "paypal"]`.
  3. Datenschutzerklärung, Einwilligung (externe Skripte!) und die Bewertung nach dem **BFSG** neu prüfen. Online-Zahlungen können die Barrierefreiheitspflicht auslösen (`01-recherche.md`, 7.4).
- **Beiträge online zahlen:** `site.json` → `payments.membership_methods` steuert die Optionen der Zahlungsweise im Antrag.
- **Terminbuchung:** `site.json` → `booking.url` ist vorgesehen. Die stabile Termin-`id` lässt sich an ein Buchungssystem übergeben. Dazu den Link in `page_dates()` anpassen.
- **Shop:** neue Seite nach Abschnitt 8.8, Navigationseintrag; Zahlungsanbieter wie oben.

### 10.3 Ideen

- Termine als iCal-Datei (`.ics`) zum Herunterladen, vom Build erzeugt
- „Kurs in einfacher Sprache“-Kennzeichnung und eine Seite in Leichter Sprache
- Weitere Sprachen, z. B. Ukrainisch oder Türkisch, die in der Region verbreitet sind
- Automatischer Build und Tests per GitHub Actions bei jeder Änderung an `data/` oder `i18n/`
- Kleines Pflege-Werkzeug (Formular), das `termine.json` schreibt, für Vorstandsmitglieder ohne JSON-Kenntnisse

## 11. Entscheidungsprotokoll

| Nr. | Entscheidung | Begründung | Bezug |
|---|---|---|---|
| E1 | Eigener Projektordner `skills-lab/` | Trennung von früherem Entwurf und älterer Recherche | `00-auftrag.md` A1 |
| E2 | Recherche-Schwerpunkt Odenwaldkreis | Wunsch des Nutzers | `01-recherche.md` 2 |
| E3 | Design „deutlich schlichter“: eine Schrift, weißer Grund, eine Primärfarbe, Linien statt Karten | Wunsch des Nutzers; Abgrenzung zu `beispiel-webseite/` | `01-recherche.md` 6.3 |
| E4 | Kurse mit allen Entscheidungsdaten, freie Plätze als Text | Best Practice DRK und vhs Odenwaldkreis | `01-recherche.md` 5.2, 6.1 |
| E5 | Beitrag offen nennen, Bankdaten sichtbar, Spendenwirkung konkret | Best Practice Nachbarschaftshilfe Michelstadt, AWO, Odenwald hilft | `01-recherche.md` 6.1 |
| E6 | Vergangene Termine automatisch ausblenden, `canonical`, sprechende URLs | Gegenmaßnahmen zu beobachteten Fehlern (veraltete Inhalte, doppelte Domains, Parameter-URLs) | `01-recherche.md` 5.3 |
| E7 | QR-Bibliothek `qrcode-generator` statt Nayuki | Nayuki ohne offizielles npm-Paket; im Konzept als Ausweichlösung vorgesehen; MIT, UTF-8, ohne Abhängigkeiten | `02-konzept.md` 5.2 |
| E8 | Zentrale Daten + Pflegeskript → statische Seiten | Löst den Widerspruch „kein Build-Schritt / zentrale Texte / Sprach-URLs“; Seite läuft ohne Skript | `02-konzept.md` 5.1 |
| E9 | Klassische Skripte, eingebettete Seitendaten statt `fetch` | Funktioniert über `file://` (getestet) | `02-konzept.md` 5.2 |
| E10 | Flache `.html`-Dateien, englische Pfade für EN/RU | `file://`-tauglich, keine kyrillischen URLs | `02-konzept.md` 2.2 |
| E11 | Inter statt Manrope | Ruhiger, Kursivschnitte, gute kyrillische Glyphen | `02-konzept.md` A19 |
| E12 | Header nur ab 900 px fixiert | Mobil kein verdeckter Fokus (WCAG 2.4.11) | `02-konzept.md` 10 |
| E13 | Einwilligung nur für die Karte, keine Cookies | Einziger externer Dienst; `localStorage` nur für Notwendiges | `02-konzept.md` 9 |
| E14 | GiroCode immer schwarz auf weiß, ohne Purpose-Code | Lesbarkeit in Banking-Apps; Purpose-Wert nicht an der Originalquelle prüfbar | `01-recherche.md` 7.1 |
| E15 | Barrierefreiheitserklärung freiwillig | BFSG gilt ohne Online-Buchung/-Zahlung voraussichtlich nicht | `01-recherche.md` 7.4 |
| E16 | Satzung mit Pflichtklauseln nach Anlage 1 zu § 60 AO in eigener Formulierung | Gemeinnützigkeit; keine Übernahme fremder Texte | `01-recherche.md` 7.6 |
| E17 | Spendenseite mit 300-€-Regel und Vorlage für vereinfachten Nachweis | Häufige Frage von Spendern | `01-recherche.md` 7.5 |
| E18 | Betragsfelder als Text mit `inputmode="decimal"` | `type="number"` lehnt deutsches Komma ab (im Test gefunden) | Abschnitt 9.1 |
| E19 | PDFs aus den HTML-Seiten per Chromium | Eine Quelle für Web und PDF | `02-konzept.md` 5.2 |
| E20 | PHP-Beispiel statt nur Beschreibung | Konkrete, getestete Grundlage für den eigenen Versand | Abschnitt 7.3 |

## 12. Quellen

### 12.1 Recherchierte Webseiten (Odenwaldkreis)

Ausgewertet über die Websuche am 16.10.2026. **Ein direkter Abruf war in der Arbeitsumgebung nicht möglich** (siehe `01-recherche.md`).

- vhs Odenwaldkreis: https://vhs-odenwald.de/
- Musikschule Odenwald e.V.: https://www.musikschule-odenwald.de/
- Nachbarschaftshilfe Michelstadt e.V.: https://www.nhv-michelstadt.de/
- AWO Kreisverband Odenwaldkreis e.V.: https://www.awo-odenwald.de/spenden-mitglied-werden
- Odenwald hilft e.V.: https://odenwald-hilft.de/
- DRK-Kreisverband Odenwaldkreis e.V.: https://drk-odenwaldkreis.de/
- Gemeinsam freiwillig im Odenwaldkreis: https://www.freiwillig-im-odenwaldkreis.de/
- Sparkasse Odenwaldkreis (Sprachmenü): https://www.sparkasse-odenwaldkreis.de/de/home.html

Vollständige Quellenliste mit Unterseiten: `01-recherche.md`, Abschnitt 8.

### 12.2 Technik und Recht (Recherche)

- GiroCode/EPC-QR: https://de.wikipedia.org/wiki/Girocode · https://girocodegenerator.com/en/wissen/epc-standard
- IBAN-Prüfung: https://gocardless.com/de/handbuch/artikel/iban-pruefziffer-berechnen-so-gehts
- BFSG und Vereine: https://www.clubdesk.de/de/vereinswissen/barrierefreiheitsstaerkungsgesetz-bfsg-und-bafg-digitale-barrierefreiheit-fuer-vereine
- Vereinfachter Spendennachweis: https://www.verbandsbuero.de/spendenquittung-im-verein-300-euro-grenze/
- Mustersatzung (Anlage 1 zu § 60 AO): https://www.finanzamt.bayern.de/Informationen/Steuerinfos/Zielgruppen/Vereine/Mustersatzung-fuer-einen-Verein.pdf

### 12.3 Verwendete Ressourcen und Lizenzen

| Ressource | Version | Lizenz | Verwendung | Datei |
|---|---|---|---|---|
| Inter (The Inter Project Authors) | über `@fontsource-variable/inter` 5.3.0 | SIL Open Font License 1.1 | Schrift (ausgeliefert) | `assets/fonts/OFL.txt` |
| qrcode-generator (Kazuhiko Arase) | 2.0.4 | MIT | GiroCode (ausgeliefert) | `js/vendor/LICENSE-qrcode.txt` |
| Playwright (Microsoft) | 1.56.1 | Apache 2.0 | Tests, PDFs (nur Entwicklung) | – |
| axe-core (Deque) | 4.14.0 | MPL 2.0 | Tests (nur Entwicklung) | – |
| jsQR | 1.4.0 | Apache 2.0 | Tests (nur Entwicklung) | – |
| pngjs | 7.0.0 | MIT | Tests (nur Entwicklung) | – |
| fonttools, brotli | 4.x | MIT | Logo-Erzeugung (nur Entwicklung) | – |
| OpenStreetMap-Karte | – | Kartendaten © OpenStreetMap-Mitwirkende, ODbL | Externe Einbettung nach Einwilligung | – |

**Alle Texte, Kursbeispiele, die Satzung, die Beitragsordnung und die Rechtstexte wurden für dieses Projekt
neu verfasst.** Es wurden keine Texte fremder Webseiten übernommen und keine Fotos verwendet. Das „QR Code“-Warenzeichen gehört der DENSO WAVE INCORPORATED.

---

## Anhang A: Liste aller Platzhalter

Platzhalter stehen in **[eckigen Klammern]**. Nach dem Ersetzen jeweils `python3 tools/build.py`
ausführen. Mit `grep -rn "\[" i18n data tools/templates` lassen sich übrige Stellen finden.

### A.1 Vereins- und Kontaktdaten (`data/site.json`)

| Platzhalter | Feld | Wo sichtbar |
|---|---|---|
| `https://www.example.org` | `base_url` | canonical, hreflang, Open Graph, Sitemap, robots.txt, schema.org |
| `[Musterstraße 1]`, PLZ/Ort (`64711`, `Erbach (Odenwald)` sind Annahmen) | `org.street`, `org.zip`, `org.city` | Footer, Kontakt, Impressum, Datenschutz, schema.org |
| `[info@example.org]` | `org.email` | überall, mailto-Fallback der Formulare |
| `[+49 6062 000000]`, `[06062 000000]` | `org.phone`, `org.phone_display` | Footer, Kontakt, Impressum |
| `[Amtsgericht Darmstadt]`, `[VR 0000]` | `org.register_court`, `org.register_number` | Verein, Impressum |
| `[Vorname Nachname]` ×3 | `org.board` | Verein, Impressum |
| `[Vorname Nachname], Anschrift wie oben` | `org.content_responsible` | Impressum (§ 18 MStV) |
| `[Finanzamt Michelstadt]`, `[TT.MM.JJJJ]`, `[000/000/00000]` | `org.tax_office`, `org.tax_notice_date`, `org.tax_number` | Verein, Impressum, Spenden |
| `[DE00ZZZ00000000000]` | `org.creditor_id` | SEPA-Mandat im Antrag |
| Aufsichtsbehörde HBDI | `org.supervisory_authority` | Datenschutz (nur bei Sitz außerhalb Hessens ändern) |
| Koordinaten (Zentrum Erbach) | `map.lat`, `map.lon` | Karte, OpenStreetMap-Link |
| `[TT.MM.JJJJ]`, `Entwurf 2026-10` | `documents.*` | Satzung, Beitragsordnung, Verein |
| leer = mailto | `forms.*` | Formularversand (Abschnitt 7.3) |

### A.2 Bankverbindung (`data/site.json` → `bank` und `tools/templates/spendennachweis.html`)

| Platzhalter | Hinweis |
|---|---|
| IBAN `DE89 3704 0044 0532 0130 00`, BIC `COBADEFFXXX` | **Öffentliches Testbeispiel, kein Vereinskonto!** Unbedingt ersetzen |
| `[Name der Bank]` | auch in der Datenschutzerklärung (Abschnitt 8) |
| Kontoinhaber `Skills Lab e.V.`, Verwendungszweck `Spende Skills Lab` | prüfen |
| Hinweis „Beispiel-Bankverbindung“ | `i18n/*.json` → `pages.donate.bank_placeholder`: nach dem Ersetzen entfernen oder umformulieren (dann auch die Ausgabe in `page_donate()` in `build.py` anpassen) |

### A.3 Beiträge und Preise

| Platzhalter | Datei |
|---|---|
| Beiträge 60 / 30 / 90 / ab 120 / ab 300 € | `data/beitraege.json` |
| Kurspreise und Mitgliederpreise | `data/angebote.json` |
| Hinweise „Platzhalter“ unter Tabellen und Preisen | `i18n/*.json` → `pages.fees.amounts_placeholder`, `pages.courses.prices_placeholder` |
| Spendenbeispiele 25/50/100 € und Wirkung | `i18n/*.json` → `pages.donate.impact`, `impact_placeholder`; Betragsvorschläge in `site.json` → `donation_amounts` |

### A.4 Inhalte (`i18n/*.json`, in allen drei Sprachen)

| Platzhalter | Schlüssel |
|---|---|
| Kurse, Termine, Orte (erfundene Beispiele) | `data/angebote.json`, `data/termine.json` |
| Team: `[Vorname Nachname]`, Rollen, Initialen | `pages.about.team`, `team_text` |
| „Barrierearme Räume … [bitte prüfen]“ | `pages.about.work_items` |
| Gründungsgeschichte | `pages.association.history_text` |
| Telefonzeiten | `pages.contact.phone_times` |
| Footer-Hinweis „Diese Website enthält Platzhalter“ | `common.footer_placeholder`, nach dem Ersetzen entfernen oder umformulieren (dann auch `footer()` in `build.py`) |

### A.5 Rechtliche Texte (alle in `i18n/*.json`, rechtlich prüfen lassen)

| Dokument | Platzhalter / zu prüfen |
|---|---|
| **Satzung** (`pages.statutes`) | Sitz; Vermögensanfall `[Bezeichnung einer juristischen Person …]`; alle Regelungen vom Verein zu beschließen; mit dem Finanzamt abstimmen |
| **Beitragsordnung** (`pages.fees`) | Fälligkeit, Eintritt, Mahnung `[Platzhalter – vom Verein festzulegen]`, Inkrafttreten (`documents.fees_date`) |
| **Impressum** (`pages.imprint`) | alle Angaben aus A.1; Abschnitte vollständig? |
| **Datenschutz** (`pages.privacy`) | Hoster `[Name und Anschrift des Hosters]`, Logfile-Dauer `[7]`, Löschfrist Anfragen `[12]`, Newsletter-Dienst, Bank, Formular-Dienst, Aufbewahrungsfristen, Datenschutzbeauftragter, Stand `[TT.MM.JJJJ]` |
| **SEPA-Mandat** (`pages.membership.mandate_text`) | Mustertext, Gläubiger-ID, Mandatsreferenz |
| **Spendenbescheinigung** (`pages.donate.tax_text`, `tools/templates/spendennachweis.html`) | Freistellungsangaben, Wortlaut, Steuerberatung |
| **Barrierefreiheitserklärung** (`pages.accessibility`) | Stand und Prüfumfang nach eigener Prüfung aktualisieren |
| Hinweis-Kästen „Platzhaltertext“ | `common.placeholder_legal`, nach der rechtlichen Prüfung entfernen oder umformulieren (dann auch die Aufrufe von `notice(c.t("common.placeholder_legal"), …)` in `build.py`) |

### A.6 Grafiken

| Platzhalter | Datei |
|---|---|
| Text-Logo „Skills Lab“ | `assets/logo.svg`, `assets/logo-dark.svg`, `assets/favicon.svg` (Abschnitt 8.6) |
| Vorschaubild | `assets/og-image.png` (aus `tools/templates/og-image.html`) |
| PDFs | `downloads/*.pdf`, nach jeder Änderung neu erzeugen (`node tools/make_assets.cjs`) |
