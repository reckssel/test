# Checkliste – Website „Skills Lab e.V.“

Auftrag: Dreisprachige (DE/EN/RU), barrierefreie und DSGVO-konforme Vereinswebsite für
„Skills Lab e.V.“ mit Kursen, Terminen, Satzung, Beitragsordnung, Mitgliedsantrag,
Spenden (inkl. EPC-QR-Code), Kontakt und Newsletter. Reines HTML/CSS/JS, kein Build-Schritt.

Projektordner: `skills-lab/` · Stand: 2026-10-16

Legende: `- [ ]` offen · `- [x]` erledigt

---

## Phase 0 – Checkliste
- [x] Checkliste `skills-lab/CHECKLISTE.md` angelegt und auf den Auftrag zugeschnitten
- [x] Freigabe der Checkliste durch den Nutzer

## Phase 1 – Auftrag verstehen
- [x] Ziel, Zielgruppe, Inhalte, Funktionen, Stil und Einschränkungen in eigenen Worten zusammenfassen
- [x] Muss-Anforderungen als Liste festhalten (9 Seitenbereiche, 3 Sprachen, 4 Formulare, QR-Code, Cookie-Opt-in, WCAG 2.2 AA, SEO)
- [x] Ausdrücklich ausgeschlossene Punkte festhalten (Online-Zahlung, Terminbuchung, Shop, Server)
- [x] Annahmen dokumentieren (z. B. Hosting statisch, Vereinssitz, Bankdaten, Beträge, Schriftwahl, Umsetzung der Übersetzungen ohne Build-Schritt)
- [x] Offene Fragen nur stellen, wenn zwingend nötig
- [x] Ergebnis in `docs/00-auftrag.md` festgehalten (Zusatzdatei zur Nachvollziehbarkeit)
- [x] Zusammenfassung → **Stopp, Freigabe abwarten**
- [x] Freigabe Phase 1 durch den Nutzer

## Phase 2 – Recherche ähnlicher Webseiten
- [x] Nutzerwunsch: Schwerpunkt auf Webseiten aus dem **Odenwaldkreis**
- [x] Suchbegriffe festlegen (Bildungsverein, Volkshochschule, Workshop-Verein, Spendenseite e.V., mehrsprachige Vereinsseite)
- [x] Mindestens 5 ähnliche Webseiten auswählen (Mischung: Marktführer, kleinere Vereine, gelungenes Design)
- [x] Mindestens 1 Beispiel mit Kurs-/Terminübersicht (z. B. VHS)
- [x] Mindestens 1 Beispiel mit Spendenseite/Bankdaten bzw. GiroCode
- [x] Mindestens 1 mehrsprachiges Beispiel (idealerweise mit Russisch) → im Odenwaldkreis keine Vereinsseite gefunden, Lücke dokumentiert, Sparkasse Odenwaldkreis als Sprachmenü-Referenz
- [x] Jede Seite analysieren (7 Seiten) – soweit über Websuche möglich
- [ ] Design, Mobilansicht, Ladeeindruck per Seitenabruf prüfen → **blockiert**: Netzwerkrichtlinie erlaubt keinen Seitenabruf (nur Websuche); am 16.10.2026 in Phase 3 erneut geprüft, weiterhin gesperrt
- [x] Quellen (URLs) notieren; nicht abrufbare Seiten offen kennzeichnen (`docs/recherche-notizen.md`)
- [x] Rechtliche Kurzprüfung: Barrierefreiheitserklärung (BFSG/BITV) für Vereine, Zuwendungsbestätigung/vereinfachter Spendennachweis
- [x] Lösung für Spannungsfeld „kein Build-Schritt / Sprach-URLs / zentrale Übersetzungen“ → in Phase 4 verschoben
- [x] Technische Recherche: EPC-QR-Standard (GiroCode), IBAN-Prüfsumme (ISO 13616 / Mod 97), lokale QR-Bibliothek inkl. Lizenz, Schriften mit freier Lizenz
- [x] Zusammenfassung → **Stopp, Freigabe abwarten**
- [x] Freigabe Phase 2 durch den Nutzer

## Phase 3 – Recherche-Dokumentation
- [x] Nutzerwunsch erfasst: **deutlich schlichteres Design** als `beispiel-webseite/` (Abschnitt 6.3)
- [x] `skills-lab/docs/01-recherche.md` anlegen
- [x] Abschnitt 1: Zusammenfassung des Auftrags
- [x] Abschnitt 2: Vorgehen (Suchbegriffe, Auswahlkriterien)
- [x] Abschnitt 3: Analyse jeder einzelnen Webseite
- [x] Abschnitt 4: Vergleichstabelle
- [x] Abschnitt 5: Erkenntnisse (Muster, Best Practices, zu vermeidende Fehler)
- [x] Abschnitt 6: Ableitung für Skills Lab (übernehmen / anders machen / warum)
- [x] Zusammenfassung → **Stopp, Freigabe abwarten**
- [x] Freigabe Phase 3 durch den Nutzer

## Phase 4 – Konzept
- [x] `skills-lab/docs/02-konzept.md` anlegen
- [x] Sitemap für alle 3 Sprachen (/de, /en, /ru) inkl. Rechtsseiten
- [x] Inhalte pro Seite (Startseite, Über uns, Angebote, Termine, Verein mit Satzung & Beitragsordnung, Mitglied werden, Spenden, Kontakt, Impressum, Datenschutz, Cookie-Einstellungen, Barrierefreiheit)
- [x] Designrichtung **deutlich schlichter** als `beispiel-webseite/` (eine Schrift, weißer Grund, eine Primärfarbe, keine Karten-/Schatten-Optik): Primärfarbe, Akzentfarbe, Neutraltöne (mit Kontrastwerten), Schriften (lokal), Abstände, Dark Mode
- [x] Text-Logo „Skills Lab“ als SVG skizzieren
- [x] Spannungsfeld „kein Build-Schritt / Sprach-URLs / zentrale Übersetzungen“ entscheiden
- [x] Technologieentscheidung mit Begründung (Vanilla HTML/CSS/JS, Übersetzungsstrategie ohne Build-Schritt, zentrale JSON-Daten für Beiträge/Angebote/Termine)
- [x] Formular-Architektur: konfigurierbarer Endpunkt, mailto-Fallback, Honeypot, Validierung, Double-Opt-in-Vorbereitung
- [x] Erweiterbarkeit: Platz für PayPal/Stripe/SEPA, Terminbuchung, Shop
- [x] Datenschutzkonzept: Cookie-Opt-in, Karte erst nach Zustimmung, keine externen Dienste
- [x] Ableitung aus der Recherche nachvollziehbar belegen
- [x] Kontraste der Farbpalette berechnet (alle Text ≥ 4,5 : 1, Bedienelemente ≥ 3 : 1)
- [x] Testplan für Phase 5 festgelegt
- [x] Zusammenfassung → **Stopp, Freigabe abwarten**
- [x] Freigabe Phase 4 durch den Nutzer

## Phase 5 – Webseite erstellen
Voraussetzung: Phasen 3 und 4 freigegeben.

### Grundgerüst
- [x] Ordnerstruktur: `index.html`, `/css`, `/js`, `/assets`, `/data`, `/de`, `/en`, `/ru`, `/downloads`
- [x] `index.html` als Sprachweiche (Weiterleitung auf /de, Fallback-Links), `404.html`
- [x] Pflegeskript `tools/build.py` (i18n + data → 45 statische Seiten, Sitemap), Prüfung auf fehlende Übersetzungsschlüssel
- [x] Zentrale Übersetzungsstruktur (alle Texte, Formulare, Fehlermeldungen)
- [x] Text-Logo als SVG (Pfade, `tools/make_logo.py`), Favicon, Open-Graph-Bild
- [x] Lokale Schriften (woff2) inkl. Lizenzdatei

### Design & Komponenten
- [x] CSS-Variablen (Farben, Typografie, Abstände), Light- und Dark-Mode
- [x] Wiederverwendbare Komponenten: Header mit Sprachumschalter und CTAs „Spenden“ / „Mitglied werden“, Navigation (mobil mit Menü-Button), Footer mit Rechtslinks, Buttons, Karten, Tabellen, Formulare, Hinweisboxen
- [x] Skip-Link, sichtbare Fokuszustände, `prefers-reduced-motion`, dezente Animationen
- [x] Responsive Tabellen (Beiträge, Termine) mit korrekten `<th>`/`scope`

### Seiten (je in DE, EN, RU)
- [x] Startseite (Hero, Angebotsübersicht, Über-uns-Teaser, nächste Termine, Mitgliedschaft/Spenden-Hinweis, Newsletter)
- [x] Über uns (Mission, Werte, Team-Platzhalter, Arbeitsweise)
- [x] Angebote (4–6 Kurse/Workshops, Mitgliederermäßigung)
- [x] Termine (Liste mit Datum, Uhrzeit, Kurs, Ort, freien Plätzen)
- [x] Verein (Vorstellung, Satzung mit Inhaltsverzeichnis/Ankern, Beitragsordnung mit Tabelle, Stand/Datum, Platzhalterhinweis, Hinweis „verbindlich ist die deutsche Fassung“ in EN/RU)
- [x] Mitglied werden (Vorteile, Beitragsübersicht, Mitgliedsantrag inkl. optionalem SEPA-Mandat)
- [x] Spenden (Text, Bankdaten mit Kopieren-Buttons, Betragsauswahl, Live-QR-Code als SVG mit Download und Textalternative, Spendenformular, Bestätigung mit Überweisungsdaten und QR)
- [x] Kontakt (Formular, Kontaktdaten, OpenStreetMap erst nach Zustimmung)
- [x] Impressum (Vereinsangaben)
- [x] Datenschutzerklärung (inkl. Mitglieds- und Spenderdaten, Aufbewahrung)
- [x] Cookie-Einstellungen
- [x] Barrierefreiheitserklärung

### Daten & Logik
- [x] `data/beitraege.json` → Beitragstabelle und Auswahlfeld Mitgliedsart
- [x] `data/angebote.json` und `data/termine.json`
- [x] `data/config.json` bzw. JS-Konfiguration (Formular-Endpunkte, Bankdaten, Vereinsdaten)
- [x] Formularvalidierung mehrsprachig, IBAN-Prüfsumme, Honeypot, Endpunkt/mailto-Fallback
- [x] Newsletter mit vorbereitetem Double-Opt-in
- [x] EPC-QR-Code (GiroCode) clientseitig mit lokaler, lizenzierter Bibliothek, SVG-Download (Abweichung vom Konzept: `qrcode-generator` (MIT) statt Nayuki, da Nayuki kein offizielles npm-Paket hat – im Konzept als Ausweichlösung vorgesehen)
- [x] Kopieren-Buttons (Clipboard API mit Fallback)
- [x] Cookie-Banner mit Opt-in, Einstellungen änderbar
- [x] Erweiterungspunkte für Zahlungsanbieter vorbereitet (Schnittstelle, ohne Aktivierung)

### SEO & Dateien
- [x] Title, Meta-Description, Open-Graph-Tags auf jeder Seite
- [x] `hreflang`-Tags und korrektes `lang`-Attribut
- [x] schema.org-Markup (NGO)
- [x] `sitemap.xml`, `robots.txt`
- [x] PDF-Platzhalter in `/downloads` (Satzung, Beitragsordnung)

### Tests
- [x] Alle internen Links und Anker prüfen (automatisiert)
- [x] Layout in Breiten 360 / 768 / 1280 px prüfen (Screenshots per Playwright)
- [x] Formulare: Pflichtfelder, Fehlermeldungen je Sprache, IBAN-Prüfung, Honeypot
- [x] QR-Code: Inhalt nach EPC-Standard prüfen (Dekodierung, soweit möglich)
- [x] Tastaturbedienung, Fokus, Kontraste, Cookie-Banner, Karte erst nach Zustimmung
- [x] Konsole frei von JS-Fehlern, HTML-Validität grob prüfen
- [x] Funktionieren ohne lokalen Server klären (file:// vs. HTTP, wegen JSON-Laden) und dokumentieren
- [x] Gefundene Fehler beheben (Überlauf RU-Vereinsseite, `dl`-Struktur Bankdaten, „Label in Name“ bei Warteliste, Betragsfeld mit Komma, Menü-Button auf Desktop, fehlendes iban.js auf Spendenseite, Ausrichtung Textspalten, mailto-Betreff kodieren)
- [x] Ergebnis: Build-Prüfung ok · statische Prüfung 46 Seiten/1741 Links ohne Fehler · Browser-Tests 76/76 bestanden · axe-core hell/dunkel 0 Verstöße
- [x] Zusammenfassung → **Stopp, Freigabe abwarten**
- [x] Freigabe Phase 5 durch den Nutzer

## Phase 6 – Dokumentation der Webseite
- [x] `skills-lab/docs/03-dokumentation.md` mit allen 12 Abschnitten:
  - [x] 1 Überblick
  - [x] 2 Technologie-Stack
  - [x] 3 Projektstruktur
  - [x] 4 Seiten und Komponenten
  - [x] 5 Design-System
  - [x] 6 Funktionen und Logik
  - [x] 7 Einrichtung und Start (lokal, Veröffentlichen, Formular-Endpunkte: Formspree / eigenes PHP inkl. DSGVO-Folgen)
  - [x] 8 Inhalte pflegen (Übersetzungen, Beiträge, Termine, Angebote, Logo, PDFs)
  - [x] 9 Tests und Qualität (echte Ergebnisse)
  - [x] 10 Bekannte Einschränkungen und Ideen
  - [x] 11 Entscheidungsprotokoll mit Bezug zur Recherche
  - [x] 12 Quellen und Lizenzhinweise
- [x] Vollständige Platzhalterliste (Adresse, Telefon, E-Mail, Logo, Bankdaten, Beiträge, Satzung, Registernummer, Vorstand, rechtliche Texte, Gemeinnützigkeit …)
- [x] Kurzer Überblick über Designentscheidungen und Kurzanleitung (Ausgabeformat des Auftrags)
- [x] Gesamtfazit: was erstellt wurde, wo die Dateien liegen, Annahmen, was offen bleibt
- [x] Zusätzlich: `README.md`, getestetes PHP-Beispiel `tools/examples/formular.php`
- [x] Abschlussprüfung: alle Punkte erledigt – **Ausnahme:** Sichtprüfung der Vorbildseiten (Phase 2) bleibt wegen gesperrten Netzwerkzugriffs offen und ist dokumentiert
- [x] **Stopp, Abschluss**

## Laufend
- [x] Nach jeder Phase committen und auf Branch `versuch2` pushen (Phasen 0–6)
