# Konzept: Website „Skills Lab e.V.“

Stand: 2026-10-16 · Phase 4 · Grundlage: `00-auftrag.md`, `01-recherche.md`

Querverweise wie **[R 6.1]** beziehen sich auf Abschnitte der Recherche (`01-recherche.md`),
**[A 8]** auf das Auftragsverständnis (`00-auftrag.md`).

---

## Inhalt

1. [Leitidee](#1-leitidee)
2. [Sitemap und URLs](#2-sitemap-und-urls)
3. [Inhalte pro Seite](#3-inhalte-pro-seite)
4. [Designrichtung](#4-designrichtung)
5. [Technologieentscheidung](#5-technologieentscheidung)
6. [Daten und Übersetzungen](#6-daten-und-übersetzungen)
7. [Formulare](#7-formulare)
8. [Spenden und GiroCode](#8-spenden-und-girocode)
9. [Datenschutz und Einwilligung](#9-datenschutz-und-einwilligung)
10. [Barrierefreiheit](#10-barrierefreiheit)
11. [SEO](#11-seo)
12. [Erweiterbarkeit](#12-erweiterbarkeit)
13. [Ordnerstruktur](#13-ordnerstruktur)
14. [Testplan für Phase 5](#14-testplan-für-phase-5)
15. [Neue Annahmen](#15-neue-annahmen)
16. [Rückverfolgung: Recherche → Konzept](#16-rückverfolgung-recherche--konzept)

---

## 1. Leitidee

**„Ruhig, klar, sofort verständlich.“** Die Seite tritt hinter die Inhalte zurück. Wer zum ersten
Mal kommt, soll in wenigen Sekunden wissen: *Was bietet Skills Lab, wann, wo, für wen, was
kostet es, wie mache ich mit?* Das Design ist **deutlich schlichter** als der bisherige Entwurf
in `beispiel-webseite/` [R 6.3].

## 2. Sitemap und URLs

### 2.1 Seiten je Sprache (14)

| # | Seite | Deutsch `/de/` | Englisch `/en/` | Russisch `/ru/` |
|---|---|---|---|---|
| 1 | Startseite | `index.html` | `index.html` | `index.html` |
| 2 | Über uns | `ueber-uns.html` | `about.html` | `about.html` |
| 3 | Angebote | `angebote.html` | `courses.html` | `courses.html` |
| 4 | Termine | `termine.html` | `dates.html` | `dates.html` |
| 5 | Verein | `verein.html` | `association.html` | `association.html` |
| 5a | Satzung | `satzung.html` | `statutes.html` | `statutes.html` |
| 5b | Beitragsordnung | `beitragsordnung.html` | `fees.html` | `fees.html` |
| 6 | Mitglied werden | `mitglied-werden.html` | `membership.html` | `membership.html` |
| 7 | Spenden | `spenden.html` | `donate.html` | `donate.html` |
| 8 | Kontakt | `kontakt.html` | `contact.html` | `contact.html` |
| 9a | Impressum | `impressum.html` | `legal-notice.html` | `legal-notice.html` |
| 9b | Datenschutz | `datenschutz.html` | `privacy.html` | `privacy.html` |
| 9c | Cookie-Einstellungen | `cookie-einstellungen.html` | `cookie-settings.html` | `cookie-settings.html` |
| 9d | Barrierefreiheit | `barrierefreiheit.html` | `accessibility.html` | `accessibility.html` |
| + | Newsletter bestätigt (Ziel des Double-Opt-in-Links) | `newsletter-bestaetigt.html` | `newsletter-confirmed.html` | `newsletter-confirmed.html` |

Insgesamt 15 Seiten × 3 Sprachen = **45 HTML-Seiten**, dazu `index.html` (Sprachweiche) und `404.html` im Wurzelverzeichnis.

### 2.2 URL-Entscheidungen

- **Flache `.html`-Dateien statt Ordner mit `index.html`.** Die Seite funktioniert damit gleich
  beim Öffnen per Doppelklick (`file://`) und auf jedem Webserver. Ordner-URLs würden lokal nur
  ein Verzeichnislisting zeigen.
- **Deutsche Pfade für `/de/`, englische Pfade für `/en/` und `/ru/`.** Kyrillische URLs würden
  beim Teilen zu unlesbaren `%D0%…`-Ketten.
- **Alle internen Links relativ** (`../en/about.html`). Die Seite läuft damit auch in einem
  Unterordner oder unter GitHub Pages mit Projektpfad.
- Sprechende, kurze Pfade statt Parameter-URLs [R 5.3: vhs].

### 2.3 Sprachweiche `/index.html`

- Liest die Browsersprache: `ru*` → `/ru/`, `en*` → `/en/`, sonst `/de/`. Eine einmal gewählte
  Sprache wird gespeichert (`localStorage`) und hat Vorrang.
- Ohne JavaScript: sichtbare Links zu allen drei Sprachen sowie `<meta http-equiv="refresh">` auf `/de/`.
- `hreflang="x-default"` zeigt auf diese Seite.

### 2.4 Navigation

- **Hauptnavigation (5):** Über uns · Angebote · Termine · Verein · Kontakt
  plus Sprachumschalter `DE | EN | RU`
- **Zwei Header-Buttons:** „Mitglied werden“ (Umriss in Primärfarbe) und „Spenden“ (gefüllt in Akzentfarbe)
- **Satzung und Beitragsordnung** sind Unterseiten von „Verein“, dort verlinkt und in einer lokalen Unternavigation.
- **Footer:** Kurzadresse, Kontakt, Links zu Impressum · Datenschutz · Cookie-Einstellungen ·
  Barrierefreiheit, Umschalter für den Dark Mode, Hinweis „Platzhalter-Inhalte“.
- **Mobil (< 900 px):** Menü-Button „Menü“ (Text, nicht nur Symbol) öffnet die Navigation als
  Liste. Die zwei Buttons und der Sprachumschalter bleiben **immer sichtbar** in der Kopfzeile.

## 3. Inhalte pro Seite

Alle Texte gibt es in DE, EN und RU. In EN und RU steht auf Satzung, Beitragsordnung, Impressum
und Datenschutz ein Hinweis: *„Verbindlich ist die deutsche Fassung. Diese Übersetzung dient
nur der Information.“* mit Link zur deutschen Seite.

| Seite | Inhalte |
|---|---|
| **Startseite** | Hero: Überschrift mit Nutzenversprechen („Neues lernen. Gemeinsam. Für alle.“), ein Satz Erklärung, Buttons „Angebote ansehen“ und „Nächste Termine“ · Angebote: die 6 Kurse als kompakte Liste (Titel, ein Satz, Format) · Über-uns-Teaser (2–3 Sätze, Link) · Nächste 3 Termine (aus den Termindaten) · Zweispaltiger Block „Mitglied werden“ / „Spenden“ · Newsletter-Formular |
| **Über uns** | Mission · 4 Werte (offen, praxisnah, gemeinsam, gemeinnützig) · Arbeitsweise (kleine Gruppen, ehrenamtliche Kursleitungen, faire Preise, Mitglieder ermäßigt) · Team: 4 Platzhalter mit Initialen statt Fotos (Name, Rolle) |
| **Angebote** | Einleitung · 6 Kurse, je mit Titel, Kurzbeschreibung, Dauer, Format (vor Ort/online), Niveau, Zielgruppe, Preis und Mitgliederpreis, Link „Termine zu diesem Kurs“ [R 6.1: DRK, Musikschule] · Hinweis auf die Mitgliederermäßigung · „Kurs für Ihre Gruppe anfragen“ → Kontakt |
| **Termine** | Tabelle: Datum · Uhrzeit · Kurs · Ort/Format · Freie Plätze (als Text, z. B. „3 von 12 frei“, „ausgebucht“) [R 6.1: vhs] · Filter nach Kurs · vergangene Termine werden ausgeblendet [R 5.3] · „Anfragen“-Link je Termin → Kontaktformular mit vorausgewähltem Thema und Termin · Hinweis: keine Online-Buchung, Anmeldung per Anfrage |
| **Verein** | Name „Skills Lab e.V.“, Zweck, Gemeinnützigkeit (Platzhalter: Finanzamt, Datum des Freistellungsbescheids), Registergericht und VR-Nummer (Platzhalter), Vorstand (Platzhalter) · Kurzporträt · Links zu Satzung und Beitragsordnung mit Stand und PDF |
| **Satzung** | Prüfhinweis-Box · Stand und Datum der Beschlussfassung · Inhaltsverzeichnis mit Ankern · 14 Paragraphen (§ 1 Name, Sitz, Geschäftsjahr · § 2 Zweck · § 3 Gemeinnützigkeit · § 4 Mittelverwendung · § 5 Mitgliedschaft · § 6 Beendigung der Mitgliedschaft · § 7 Beiträge · § 8 Organe · § 9 Mitgliederversammlung · § 10 Vorstand · § 11 Kassenprüfung · § 12 Datenschutz · § 13 Satzungsänderung · § 14 Auflösung und Vermögensbindung), inhaltlich mit den Pflichtfestlegungen der Anlage 1 zu § 60 AO [R 7.6] · „Nach oben“-Links · PDF-Download · Druckansicht |
| **Beitragsordnung** | Prüfhinweis · Stand · **Beitragstabelle aus `data/beitraege.json`** (Einzel, ermäßigt, Familie, Fördermitglied, Firmenmitglied) · Fälligkeit · Zahlungsweise (SEPA-Lastschrift oder Überweisung) · Eintritt im laufenden Jahr (anteilig) · Austritt · Ermäßigung auf Antrag · Verzug/Mahnung · PDF |
| **Mitglied werden** | 4 Vorteile · Beitragsübersicht (gleiche Datenquelle) · **Mitgliedsantrag** (siehe 7.2) |
| **Spenden** | Einladender Text · „Was Ihre Spende bewirkt“ (3 Beispiele, Platzhalter) [R 6.1: Odenwald hilft] · Bankverbindung mit Kopieren-Buttons [R 6.1: AWO] · Betragswahl 10/25/50/100/frei → **GiroCode live** · Hinweis zu Gemeinnützigkeit und Spendennachweis (300-€-Regel) [R 7.5] · Spendenformular (siehe 7.4) |
| **Kontakt** | Formular · Kontaktdaten (Platzhalter) · Adresse · Karte nach Einwilligung (siehe 9) · Link „Route bei OpenStreetMap öffnen“ (normaler Link, ohne Einbettung) |
| **Impressum** | Vereinsname, Anschrift, vertretungsberechtigter Vorstand, Kontakt, Registergericht, Registernummer, Verantwortlich nach § 18 Abs. 2 MStV, Prüfhinweis |
| **Datenschutz** | Verantwortlicher, Hosting/Logfiles, Kontaktformular, Newsletter (Double-Opt-in), Mitgliedsantrag und Mitgliederdaten, SEPA-Daten, Spenderdaten und Aufbewahrung der Spendenbelege (steuerliche Fristen), Formular-Dienstleister (falls genutzt), Karte (OpenStreetMap nach Einwilligung), lokale Speicherung (`localStorage`), Rechte, Beschwerde bei der Aufsichtsbehörde (Hessen, siehe A14), Prüfhinweis |
| **Cookie-Einstellungen** | Erklärung: Es gibt keine Cookies, nur lokale Speicherung · Schalter „Karte (OpenStreetMap)“ · Speichern · Widerruf |
| **Barrierefreiheit** | Freiwillige Erklärung [R 7.4] · Stand der Vereinbarkeit (WCAG 2.2 AA angestrebt) · bekannte Einschränkungen (Karte, PDFs) · Feedback-Kontakt · Datum |
| **Newsletter bestätigt** | Danke-Text; dient als Zielseite für den Bestätigungslink des späteren Newsletter-Dienstes |

### 3.1 Beispielinhalte (Platzhalter)

**Angebote (6):**

| Kurs | Format | Dauer | Niveau |
|---|---|---|---|
| Klar kommunizieren im Alltag und Beruf | vor Ort | 2 × 3 Std. | Einsteiger |
| Sicher präsentieren | vor Ort | 1 Tag (6 Std.) | alle |
| Digital fit: Smartphone und Internet | vor Ort | 4 × 2 Std. | Einsteiger, auch ältere Menschen |
| Zeit- und Selbstmanagement | online | 3 × 90 Min. | alle |
| Englisch für den Beruf | online | 8 × 90 Min. | Fortgeschrittene (ab B1) |
| KI-Werkzeuge verstehen und nutzen | hybrid | 2 × 2,5 Std. | Einsteiger |

Preise sind Platzhalter (z. B. 40 €, für Mitglieder 25 €).
**Termine:** ca. 12 Beispieltermine zwischen November 2026 und März 2027 [A 6].
**Beiträge (Platzhalter, pro Jahr):** Einzel 60 € · ermäßigt 30 € · Familie 90 € · Fördermitglied ab 120 € · Firmenmitglied ab 300 €.

## 4. Designrichtung

### 4.1 Grundsätze („schlicht“)

1. **Weißer Grund, schwarzer Text, eine Farbe.** Die Primärfarbe trägt Links, Buttons und Fokus.
   Die Akzentfarbe gibt es nur für den Spenden-Button und für kleine Markierungen.
2. **Eine Schrift (Inter).** Hierarchie entsteht nur über Größe und Strichstärke (400/600/700).
3. **Linien statt Kästen.** Listen und Tabellen werden mit 1-px-Trennlinien gegliedert, nicht mit
   Karten. Keine Schatten, keine Verläufe, keine Hintergrundbilder.
4. **Großzügiger Weißraum, schmale Textspalte** (max. 68 Zeichen pro Zeile).
5. **Keine Pflicht-Bilder.** Fotos braucht die Seite nicht. Wo später Bilder kommen, gibt es Alt-Texte.
6. **Bewegung minimal:** nur Übergänge von 150 ms bei Hover und Fokus und beim Öffnen des Menüs.
   Bei `prefers-reduced-motion: reduce` gibt es gar keine.

### 4.2 Farben (CSS-Variablen) mit geprüften Kontrasten

Kontraste nach WCAG-Formel berechnet (Skript in Phase 4, Werte gerundet):

**Hell (Standard)**

| Variable | Wert | Verwendung | Kontrast |
|---|---|---|---|
| `--c-bg` | `#ffffff` | Hintergrund | – |
| `--c-subtle` | `#f5f7f8` | sehr dezente Fläche (Formular-Info, Tabellenkopf) | – |
| `--c-text` | `#1b1f23` | Fließtext | 16,6 : 1 |
| `--c-muted` | `#57606a` | Nebentexte | 6,4 : 1 |
| `--c-line` | `#d8dde3` | Trennlinien (dekorativ) | – |
| `--c-border` | `#8a939b` | Rahmen von Eingabefeldern | 3,1 : 1 (≥ 3 : 1 für UI-Elemente) |
| `--c-primary` | `#0e5466` (Petrol) | Links, Buttons, Fokus | 8,5 : 1; Weiß darauf 8,5 : 1 |
| `--c-primary-strong` | `#0a3f4d` | Hover | Weiß darauf 11,5 : 1 |
| `--c-accent` | `#a8461b` (warmes Terrakotta) | Spenden-Button, Markierungen | 5,9 : 1; Weiß darauf 5,9 : 1 |

**Dunkel (`prefers-color-scheme: dark` oder Umschalter)**

| Variable | Wert | Kontrast |
|---|---|---|
| `--c-bg` | `#111416` | – |
| `--c-subtle` | `#181c1f` | – |
| `--c-text` | `#e6e9ec` | 15,2 : 1 |
| `--c-muted` | `#a2abb3` | 7,9 : 1 |
| `--c-line` | `#2c3237` | – |
| `--c-border` | `#6b747c` | 3,9 : 1 |
| `--c-primary` | `#6cc3d5` | 9,2 : 1 (dunkler Text auf Button 9,2 : 1) |
| `--c-accent` | `#f0a070` | 8,8 : 1 |

Fehler und Erfolg werden **nie nur über Farbe** angezeigt (immer mit Text und Symbol).
Fehlerrot `#b42318` (hell) bzw. `#ff8a80` (dunkel). Die Kontraste prüfe ich in Phase 5 mit axe-core.

### 4.3 Typografie

- **Schrift:** Inter (SIL OFL 1.1), variabel, **lokal** als woff2 mit den Teilmengen Latin,
  Latin-Ext und Kyrillisch (`@fontsource-variable/inter` 5.3.0). Fallback: `system-ui, sans-serif`.
- **Größen** (fließend über `clamp`, mobil → Desktop):

| Element | Größe | Gewicht | Zeilenhöhe |
|---|---|---|---|
| Fließtext | 1,0625 rem (17 px) | 400 | 1,6 |
| Klein | 0,875 rem | 400 | 1,5 |
| h1 | 2 → 2,75 rem | 700 | 1,15 |
| h2 | 1,5 → 1,875 rem | 700 | 1,2 |
| h3 | 1,125 → 1,25 rem | 600 | 1,3 |

- Satzung, Beitragsordnung und Rechtstexte: gleiche Schrift, Paragraphenüberschriften h2, Absätze nummeriert (1), (2) …

### 4.4 Abstände und Raster

- Abstandsskala: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 px (`--s-1` … `--s-9`)
- Inhaltsbreite: max. 72 rem; Textspalte max. 68 ch; Seitenränder mobil 16 px, ab Tablet 32 px
- Breakpoints: 600 px (Tablet), 900 px (Desktop-Navigation), 1200 px (breit)
- Radius 4 px nur für Buttons und Eingabefelder; sonst eckig

### 4.5 Wiederverwendbare Bausteine

`button` (primär, Umriss, Akzent, Text-Link) · `notice` (Hinweis mit linker Linie, z. B.
Platzhalter- und Übersetzungshinweis) · `list-rows` (Liste mit Trennlinien für Kurse und Termine) ·
`data-table` (responsive Tabelle) · `field` (Label, Eingabe, Hilfe, Fehler) · `copy-field`
(Wert und Kopieren-Button) · `toc` (Inhaltsverzeichnis) · `consent-banner` · `map-placeholder`.

### 4.6 Logo

Text-Logo **„Skills Lab“** als SVG: Wortmarke in Inter 700, Primärfarbe, davor ein kleines
Akzent-Quadrat (8 × 8) als einziges grafisches Element. Zwei Dateien:
`assets/logo.svg` (hell) und `assets/logo-dark.svg` (dunkel). Im Header wird das Logo **inline**
eingesetzt, damit es die lokale Schrift nutzt. Zum Austauschen genügt es, die SVG-Datei bzw. das
Inline-Element in der Vorlage zu ersetzen. Die Schrift wird im SVG in Pfade umgewandelt, damit
das Logo auch als `<img>` und im Open-Graph-Bild gleich aussieht.

### 4.7 Dark Mode

Automatisch nach Systemeinstellung. Ein Umschalter im Footer (Hell / Dunkel / System) speichert die
Wahl in `localStorage`. Damit beim Laden nichts aufflackert, setzt ein kurzes Inline-Skript im
`<head>` das Attribut `data-theme`, bevor die Seite gezeichnet wird.

## 5. Technologieentscheidung

### 5.1 Entscheidung

**Reines HTML, CSS und JavaScript. Die Seite braucht keinen Build-Schritt, um zu laufen.** Die 45
fertigen HTML-Seiten liegen im Repository. Ein Server, Node.js oder Frameworks sind nicht nötig.

**Spannungsfeld gelöst [A 8.1]:** Texte und Daten werden **zentral** in `i18n/` und `data/`
gepflegt. Ein **Pflegeskript** (`tools/build.py`, Python 3, nur Standardbibliothek) erzeugt
daraus die statischen Seiten. Es ist ein Werkzeug für die **Pflege**, kein Build-Schritt für den
Betrieb: Wer nur hochlädt, braucht es nie. Wer einen Text ändert, führt einmal
`python3 tools/build.py` aus.

| Option | Bewertung | Ergebnis |
|---|---|---|
| A: Texte per JavaScript zur Laufzeit aus einer zentralen Datei einsetzen | Pflege einfach, aber leere Seiten ohne JavaScript, schlechter für Suchmaschinen, `fetch` scheitert bei `file://` | verworfen |
| B: 45 Seiten von Hand, Texte in jeder Datei | Läuft überall, aber Texte und Beträge an 45 Stellen → Widerspruch zum Auftrag „zentral pflegbar“ | verworfen |
| **C: Zentrale Daten + Pflegeskript → fertige statische Seiten im Repo** | Läuft überall, mit und ohne JavaScript, gut für SEO; Beträge und Texte an genau einer Stelle; Skript optional und ohne Abhängigkeiten | **gewählt** |

### 5.2 Weitere Technik-Entscheidungen

| Entscheidung | Begründung |
|---|---|
| **Klassische Skripte mit `defer`, keine ES-Module** | Chrome blockiert Module bei `file://`. Die Seite soll auch per Doppelklick funktionieren |
| **Seitendaten als eingebettetes JSON** (`<script type="application/json" id="page-data">`) statt `fetch()` | Funktioniert bei `file://` [A 8.2]; enthält nur, was die Seite braucht (Fehlermeldungen, Bankdaten, Formular-Endpunkte) |
| **Progressive Verbesserung** | Inhalte, Tabellen und Formulare funktionieren ohne JavaScript (Formulare dann mit `mailto:` bzw. nativer Browser-Prüfung). JavaScript ergänzt Filter, Prüfung, GiroCode, Kopieren, Theme und Einwilligung |
| **QR-Bibliothek: Nayuki „QR Code generator“ (MIT), lokal unter `js/vendor/`** | Ohne Abhängigkeiten, SVG-Ausgabe, Fehlerkorrektur M wählbar [R 7.2]. Die Datei wird aus dem offiziellen npm- bzw. GitHub-Paket übernommen, der Lizenztext liegt bei. Falls die Nayuki-JS-Datei nicht als npm-Paket verfügbar ist, nehme ich `qrcode-generator` (MIT) |
| **Python fürs Pflegeskript** | Auf Linux und macOS vorinstalliert, unter Windows leicht zu installieren; keine `npm install`-Kette |
| **PDFs aus den HTML-Seiten** | Das Pflegeskript bzw. ein Hilfsskript druckt Satzung und Beitragsordnung über Chromium (Druck-CSS) als PDF. Die fertigen PDFs liegen in `/downloads`. Gleiche Inhalte, nur eine Quelle |

## 6. Daten und Übersetzungen

### 6.1 Zentrale Dateien

| Datei | Inhalt | Wird verwendet für |
|---|---|---|
| `data/site.json` | Basis-URL, Vereinsdaten (Name, Anschrift, Register, Vorstand, Gemeinnützigkeit), Kontakt, **Bankdaten**, Kartenkoordinaten, Formular-Endpunkte, Stand-Daten | Impressum, Footer, Kontakt, Spenden, GiroCode, Formulare, schema.org |
| `data/beitraege.json` | Mitgliedsarten mit `id`, Betrag, „ab“-Kennzeichen, Intervall, Bezeichnung und Erläuterung je Sprache | Beitragstabelle (Beitragsordnung, Mitglied werden), Auswahlfeld im Antrag |
| `data/angebote.json` | Kurse mit `id`, Dauer, Format, Niveau, Preis, Mitgliederpreis, Texten je Sprache | Angebote, Startseite, Termin-Kursnamen, Filter |
| `data/termine.json` | Termine mit Datum, Uhrzeit, `angebot`-ID, Ort, Plätzen gesamt/frei | Termine, Startseite („nächste Termine“) |
| `i18n/de.json`, `i18n/en.json`, `i18n/ru.json` | **Alle** Texte: Navigation, Seitentexte, Meta-Angaben, Formularbeschriftungen, Fehlermeldungen, Rechtstexte, Satzung, Beitragsordnung | Alle Seiten |

- Alle drei Sprachdateien haben **dieselben Schlüssel**. Das Pflegeskript bricht mit einer
  verständlichen Meldung ab, wenn in einer Sprache ein Schlüssel fehlt.
- Beträge stehen **nur** in `data/beitraege.json` bzw. `data/angebote.json`. Formatiert werden sie
  je Sprache (`60 €` / `€60` / `60 €`) über eine Formatierungsfunktion im Pflegeskript.

### 6.2 Pflege-Ablauf

1. Text oder Betrag in `i18n/*.json` bzw. `data/*.json` ändern
2. `python3 tools/build.py` ausführen
3. Geänderte Dateien hochladen

**Termine:** Vergangene Termine blendet das JavaScript im Browser automatisch aus. Ohne neuen
Build-Lauf veraltet die Seite also nicht sichtbar [R 5.3].

## 7. Formulare

### 7.1 Gemeinsame Architektur

- **Endpunkt konfigurierbar** in `data/site.json` → `forms.endpoint` (eine URL für alle) oder je
  Formular (`forms.contact`, `forms.membership` …).
  - **Gesetzt:** Versand per `fetch` (POST, `FormData`, `Accept: application/json`). Das ist kompatibel
    mit Formspree-ähnlichen Diensten und einem eigenen PHP-Skript.
  - **Leer:** **mailto-Fallback**. Ein vorausgefülltes E-Mail-Fenster mit den Formularinhalten öffnet
    sich, die Nutzerin oder der Nutzer schickt die Mail selbst ab. Vorher erscheint ein Hinweis, dass
    sich das Mailprogramm öffnet.
- **Honeypot:** verstecktes Feld `website` (per CSS versteckt, `tabindex="-1"`,
  `autocomplete="off"`, `aria-hidden`). Ist es ausgefüllt, wird nicht gesendet, aber Erfolg angezeigt.
- **Validierung:** HTML-Attribute (`required`, `type="email"`, `pattern`) als Grundlage. JavaScript
  ersetzt die Browser-Meldungen (`novalidate`) durch eigene Meldungen in der Seitensprache:
  - Fehlertext direkt am Feld (`aria-describedby`, `aria-invalid="true"`)
  - Beim Absenden eine **Fehlerübersicht** oben im Formular, die den Fokus erhält, mit Links zu den Feldern
  - Geprüft wird beim Verlassen des Feldes und beim Absenden, nicht bei jedem Tastendruck
- **IBAN-Prüfung:** Länge je Land (SEPA-Länder) + Mod-97 [R 7.3], Eingabe mit oder ohne
  Leerzeichen, Anzeige in Vierergruppen
- **Pflicht-Einwilligungen** als nicht vorausgewählte Checkboxen mit Link zur Datenschutzerklärung
- **Nach dem Senden:** Erfolgsmeldung in einem Bereich mit `role="status"`, Fokus auf die Meldung, Formular wird geleert

### 7.2 Mitgliedsantrag

Vorname*, Nachname*, Straße und Hausnummer*, PLZ*, Ort*, E-Mail*, Telefon (optional),
Geburtsdatum* (Datumsfeld), Mitgliedsart* (Optionen aus `beitraege.json`, mit Betrag),
Zahlungsweise* (SEPA-Lastschrift / Überweisung).
**Bei SEPA eingeblendet:** Kontoinhaber*, IBAN* (mit Prüfung), Mandatstext (Platzhalter,
Gläubiger-ID `[DE00ZZZ…]`), Checkbox „Ich erteile das SEPA-Lastschriftmandat“*.
Checkboxen: „Ich erkenne Satzung und Beitragsordnung an“* (mit Links), Datenschutz-Einwilligung*.
Hinweis: *Keine Zahlung online. Ihr Antrag geht an den Vorstand, wir melden uns.*

### 7.3 Kontakt

Name*, E-Mail*, Thema* (Kursanfrage · Workshop buchen · Mitgliedschaft · Spenden · Allgemeine
Frage · Sonstiges), Nachricht*, Datenschutz*. Über URL-Parameter vorbelegbar
(`?thema=kursanfrage&termin=2026-11-14-kommunikation`), für die Links von der Terminseite.

### 7.4 Spendenanfrage

Betrag* (übernommen aus der Betragswahl), einmalig/regelmäßig* (bei regelmäßig: monatlich,
vierteljährlich, jährlich), Name*, E-Mail*, Anschrift (optional, für die Zuwendungsbestätigung;
Pflicht, wenn die Checkbox „Spendenbescheinigung“ gesetzt ist), Nachricht (optional),
Checkbox „Ich möchte eine Spendenbescheinigung“, Datenschutz*.
**Nach dem Senden:** Bestätigung mit Bankdaten, Betrag, Verwendungszweck („Spende [Name]“) und
**GiroCode für genau diesen Betrag**.

### 7.5 Newsletter

E-Mail*, Einwilligung* („Ich möchte den Newsletter erhalten und kann mich jederzeit abmelden“).
Text nach dem Senden: *„Fast geschafft: Bitte bestätigen Sie Ihre Anmeldung über den Link in der
E-Mail, die wir Ihnen gesendet haben.“* Den eigentlichen Versand der Bestätigungsmail muss der
spätere Dienst übernehmen [A 8.3]. Seine Zielseite ist `newsletter-bestaetigt.html`.

## 8. Spenden und GiroCode

- **Datenquelle:** `data/site.json` → `bank` (Inhaber, IBAN, BIC, Bank, Verwendungszweck)
- **Betragswahl:** Optionsgruppe 10 / 25 / 50 / 100 € / „anderer Betrag“ (Zahlenfeld 1–10.000 €) als echte Radiobuttons, per Tastatur bedienbar
- **Inhalt des GiroCodes** [R 7.1]:
  ```
  BCD
  002
  1
  SCT
  <BIC>
  Skills Lab e.V.
  <IBAN ohne Leerzeichen>
  EUR25.00
  <leer: kein Purpose-Code>
  <leer: keine strukturierte Referenz>
  Spende Skills Lab
  ```
  Einen Purpose-Code lasse ich weg, weil ich den Codewert nicht an der Originalquelle prüfen konnte.
  Er ist optional. Bei „anderer Betrag“ ohne gültige Eingabe entsteht der Code **ohne Betrag**,
  das erlaubt der Standard.
- **Darstellung:** SVG, Fehlerkorrektur M, Ruhezone 4 Module, schwarz auf weiß (auch im Dark Mode,
  sonst lesen Banking-Apps ihn nicht zuverlässig), Größe ca. 200 px
- **Barrierefreiheit:** `role="img"` mit `aria-label` („GiroCode für eine Überweisung über 25 € an
  Skills Lab e.V.“) und daneben die **Textalternative**: IBAN, Betrag, Empfänger, Zweck in
  Klartext. Änderungen werden über `aria-live="polite"` angesagt.
- **Download:** Button „GiroCode als SVG speichern“ (Blob, Dateiname `skills-lab-girocode-25eur.svg`)
- **Kopieren-Buttons** pro Feld (Clipboard API, Fallback über ein markiertes Textfeld), Bestätigung „Kopiert“ per `aria-live`
- **Hinweis:** Die Beispiel-IBAN ist ein öffentlich bekanntes Testbeispiel mit gültiger Prüfsumme und **kein echtes Vereinskonto** [A 4]

## 9. Datenschutz und Einwilligung

- **Keine Cookies, kein Tracking, keine externen Schriften, Skripte oder Dienste.**
- **Lokale Speicherung** (`localStorage`): Sprache, Theme, Einwilligung. Das ist technisch
  notwendig bzw. vom Nutzer gewählt und in der Datenschutzerklärung erklärt.
- **Einziger externer Inhalt: die OpenStreetMap-Karte** (`openstreetmap.org/export/embed.html`,
  iframe). Sie wird **erst nach Einwilligung** geladen, weil dabei die IP-Adresse an die
  OpenStreetMap Foundation übertragen wird.
- **Einwilligungs-Banner** beim ersten Besuch, unten, nicht blockierend:
  „Nur notwendige“ und „Karte erlauben“ als **gleichwertige** Buttons, dazu ein Link „Einstellungen“.
  Speicherung: `{ "map": true|false, "date": "…", "version": 1 }`.
- **Auf der Kontaktseite:** Platzhalter mit Erklärung und Button „Karte laden“. Ein Klick lädt die
  Karte und speichert die Einwilligung. Widerruf ist jederzeit über „Cookie-Einstellungen“ im
  Footer möglich.
- **Formular-Dienstleister:** Mögliche Optionen (Formspree, eigenes PHP-Skript, Newsletter-Anbieter)
  und ihre DSGVO-Folgen (Auftragsverarbeitungsvertrag, Drittland-Übermittlung bei US-Anbietern)
  beschreibt `03-dokumentation.md`.

## 10. Barrierefreiheit (WCAG 2.2 AA)

| Anforderung | Umsetzung |
|---|---|
| Struktur | `header`, `nav` (mit `aria-label`), `main`, `footer`; eine `h1` pro Seite; logische Überschriften |
| Skip-Link | „Zum Inhalt springen“ als erstes Element, sichtbar bei Fokus |
| Sprache | `lang` am `html`; Sprachumschalter-Links mit `lang` und `hreflang` („Deutsch“, „English“, „Русский“ in der jeweils eigenen Sprache); aktuelle Sprache mit `aria-current` |
| Navigation | aktuelle Seite mit `aria-current="page"`; Menü-Button mit `aria-expanded`/`aria-controls`; Escape schließt das Menü |
| Fokus | Gut sichtbarer Rahmen (3 px Primärfarbe, 2 px Abstand) bei `:focus-visible`; `scroll-padding-top`, damit der feste Header nichts verdeckt (2.4.11) |
| Kontraste | siehe 4.2, alle ≥ 4,5 : 1 für Text, ≥ 3 : 1 für Bedienelemente |
| Zielgröße | Bedienelemente mindestens 44 × 44 px (übertrifft die 24 px aus 2.5.8) |
| Tabellen | `caption`, `th scope="col"` bzw. `scope="row"`; mobil wird jede Zeile als Block mit vorangestellten Beschriftungen gezeigt (`data-label`), die Tabellensemantik bleibt dabei erhalten (`display` wird nur für schmale Bildschirme geändert, mit ARIA-Rollen abgesichert) |
| Formulare | sichtbare Labels, Pflichtfeld-Kennzeichnung als Text, Fehlertexte, Fehlerübersicht, `autocomplete`-Attribute (1.3.5) |
| Bewegung | `prefers-reduced-motion` schaltet alle Übergänge ab |
| Zoom/Reflow | bis 400 % ohne horizontales Scrollen (320 px Breite) |
| Bilder/SVG | Alt-Texte bzw. `aria-label`; dekorative SVGs mit `aria-hidden="true"` |

## 11. SEO

- Jede Seite: `<title>` („Seite · Skills Lab e.V.“), `meta description` (eigene je Seite und
  Sprache), `canonical`, `hreflang` für `de`, `en`, `ru` und `x-default`
- Open Graph: `og:title`, `og:description`, `og:type`, `og:url`, `og:locale` (+ `og:locale:alternate`),
  `og:image` → `assets/og-image.png` (1200 × 630, schlicht: Logo auf Weiß)
- **schema.org** als JSON-LD auf jeder Startseite: `NGO` mit Name, URL, Logo, Adresse, Kontakt,
  `sameAs` leer. Auf der Terminseite zusätzlich `EducationEvent`-Einträge für die Termine
  (gut für die Darstellung in Suchmaschinen, mit Platzhalter-Ort)
- `sitemap.xml` mit allen 45 Seiten und `xhtml:link`-Alternativen; `robots.txt` mit Verweis auf die Sitemap
- **Basis-URL** ist ein Platzhalter (`https://www.example.org`) in `data/site.json`. Nach dem Ändern einmal `tools/build.py` ausführen.

## 12. Erweiterbarkeit

| Später | Vorbereitet durch |
|---|---|
| **PayPal / Stripe / SEPA-Lastschrift für Spenden** | `js/payments.js` mit einer kleinen Anbieter-Registry: `registerProvider({ id, label, isAvailable(), start(donation) })`. In Version 1 ist nur `transfer` (Überweisung/GiroCode) registriert. Neue Anbieter erscheinen automatisch als Option in der Spendenbestätigung. Hinweis: Online-Zahlung kann die BFSG-Bewertung ändern [R 7.4] |
| **Online-Zahlung von Beiträgen** | Gleiche Registry; das Feld „Zahlungsweise“ im Antrag liest seine Optionen aus `data/site.json` |
| **Terminbuchung** | Jeder Termin hat eine stabile `id`; der „Anfragen“-Link kann später auf ein Buchungssystem zeigen (`data/site.json` → `booking.url`, leer = Kontaktformular) |
| **Shop** | Eigener Navigationspunkt per Eintrag in `i18n/*.json` → `nav`; Seitenvorlage wiederverwendbar |
| **Weitere Sprache** | Neue Datei `i18n/xx.json` + Eintrag in `data/site.json` → `languages`; das Pflegeskript erzeugt `/xx/` |

## 13. Ordnerstruktur

```
skills-lab/
├── CHECKLISTE.md
├── index.html                 Sprachweiche
├── 404.html
├── robots.txt
├── sitemap.xml
├── de/  en/  ru/              je 15 fertige Seiten (erzeugt)
├── css/
│   └── style.css              Variablen, Basis, Bausteine, Seiten, Druck
├── js/
│   ├── main.js                Menü, Theme, Sprache merken, Einwilligung, Karte, Kopieren, Terminfilter
│   ├── forms.js               Validierung, Honeypot, Versand, mailto-Fallback
│   ├── iban.js                IBAN-Prüfung und -Formatierung
│   ├── girocode.js            EPC-Datensatz, SVG, Download
│   ├── payments.js            Anbieter-Registry (Erweiterungspunkt)
│   └── vendor/qrcodegen.js    QR-Bibliothek (MIT) + LICENSE
├── assets/
│   ├── logo.svg, logo-dark.svg, favicon.svg, og-image.png
│   └── fonts/                 Inter variable woff2 (latin, latin-ext, cyrillic) + OFL.txt
├── data/
│   ├── site.json, beitraege.json, angebote.json, termine.json
├── i18n/
│   ├── de.json, en.json, ru.json
├── downloads/
│   ├── satzung.pdf, beitragsordnung.pdf, spendennachweis-vorlage.pdf (Platzhalter)
├── tools/
│   ├── build.py               Pflegeskript: i18n + data → Seiten, Sitemap
│   ├── templates/             HTML-Vorlagen (Layout, Seiten)
│   └── tests/                 Prüfskripte (Links, Übersetzungen, IBAN, GiroCode, Screenshots, axe)
└── docs/
    ├── 00-auftrag.md, 01-recherche.md, recherche-notizen.md
    ├── 02-konzept.md
    └── 03-dokumentation.md
```

## 14. Testplan für Phase 5

| Test | Werkzeug | Erfolgskriterium |
|---|---|---|
| Übersetzungen vollständig | `tools/build.py` | gleiche Schlüssel in DE/EN/RU, keine leeren Werte |
| Interne Links und Anker | Python-Skript über alle HTML-Dateien | 0 tote Links, 0 fehlende Anker |
| HTML-Grundprüfung | Python `html.parser` | wohlgeformt, eine `h1`, `lang`, `title`, `description` je Seite |
| IBAN-Prüfung | Node/Browser-Test mit gültigen und ungültigen IBANs | korrekte Ergebnisse |
| GiroCode | Datensatz gegen Feldregeln; Dekodierung des SVG, falls ein Decoder verfügbar ist (z. B. `zbarimg`), sonst offen dokumentiert | Inhalt entspricht der Vorgabe |
| Layout 360 / 768 / 1280 px | Playwright + Chromium, Screenshots | kein horizontales Scrollen, nichts abgeschnitten |
| Barrierefreiheit | axe-core (lokal über npm) in Chromium | 0 Verstöße der Stufen A/AA |
| Tastatur | Playwright: Tab-Reihenfolge, Skip-Link, Menü, Escape | alles erreichbar, Fokus sichtbar |
| Formulare | Playwright: Pflichtfelder leer, falsche E-Mail, falsche IBAN, Honeypot | richtige Meldungen in DE/EN/RU |
| Einwilligung/Karte | Playwright: Netzwerk-Requests ohne Einwilligung | **kein** Request an openstreetmap.org vor der Zustimmung |
| `file://` | Playwright öffnet `de/index.html` direkt | Seite und Skripte funktionieren |
| Konsole | Playwright | keine JavaScript-Fehler |

## 15. Neue Annahmen

| # | Annahme | Begründung |
|---|---|---|
| A14 | Sitz des Vereins im **Odenwaldkreis**. Platzhalteranschrift `[Musterstraße 1], 64711 Erbach (Odenwald)`, Registergericht `[Amtsgericht Darmstadt]`, Aufsichtsbehörde Hessen (HBDI) | Recherchefokus Odenwaldkreis; Registergericht und Behörde bleiben als Platzhalter markiert und sind zu prüfen |
| A15 | Kartenausschnitt auf das Zentrum von Erbach, bis eine echte Adresse eingetragen ist | Folgt aus A14 |
| A16 | Beispiel-IBAN `DE89 3704 0044 0532 0130 00` (bekanntes Testbeispiel mit gültiger Prüfsumme), BIC `COBADEFFXXX` | Testbarkeit [A 4]; ausdrücklich kein Vereinskonto |
| A17 | Basis-URL `https://www.example.org` | Echte Domain noch unbekannt |
| A18 | Team-Platzhalter mit Initialen statt Fotos | Keine lizenzierten Fotos vorhanden; passt zum schlichten Design |
| A19 | Inter statt Manrope | Neutraler und ruhiger („schlicht“), Kursivschnitte, gute kyrillische Glyphen |

## 16. Rückverfolgung: Recherche → Konzept

| Erkenntnis aus der Recherche | Umsetzung im Konzept |
|---|---|
| Kurse mit allen Entscheidungsdaten [R 5.1, 6.1: DRK, vhs] | 3: Angebote mit Dauer, Format, Niveau, Zielgruppe, Preis |
| Platzstatus in der Liste [R 6.1: vhs] | 3: Termine mit „x von y frei“ |
| Gliederung nach Niveau [R 6.1: Musikschule] | 3.1: Niveau je Kurs |
| Beitrag offen nennen [R 6.1: Nachbarschaftshilfe] | 6.1: `beitraege.json` → Tabelle auf zwei Seiten |
| Satzung als PDF [R 6.1: Musikschule] | 3, 5.2: HTML und PDF aus einer Quelle |
| Bankdaten sichtbar [R 6.1: AWO] | 8: Bankdaten, Kopieren, GiroCode |
| Spendenverwendung konkret [R 6.1: Odenwald hilft] | 3: „Was Ihre Spende bewirkt“ |
| Mehrere Kontaktwege [R 6.1: vhs] | 3: Formular, E-Mail, Telefon, Adresse, Karte |
| Veraltete Inhalte [R 5.3] | 6.2: vergangene Termine automatisch ausblenden; Stand-Daten |
| Doppelte Domains [R 5.3] | 11: `canonical` |
| Parameter-URLs [R 5.3] | 2.2: sprechende Pfade |
| Externe Plattformen [R 5.3] | 9: keine externen Dienste außer Karte nach Einwilligung |
| Marktlücke QR, Russisch, Barrierefreiheit [R 5.4] | 8, 2, 10 |
| BFSG nicht pauschal [R 7.4] | 3: freiwillige Erklärung; 12: Hinweis bei Erweiterung |
| 300-€-Regel [R 7.5] | 3: Hinweis + Vorlage auf der Spendenseite |
| Anlage 1 zu § 60 AO [R 7.6] | 3: Satzung mit Pflichtklauseln |
| „Deutlich schlichter“ [R 6.3] | 4: eine Schrift, weißer Grund, eine Farbe, Linien statt Karten |
