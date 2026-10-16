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
- [ ] Freigabe Phase 4 durch den Nutzer

## Phase 5 – Webseite erstellen
Voraussetzung: Phasen 3 und 4 freigegeben.

### Grundgerüst
- [ ] Ordnerstruktur: `index.html`, `/css`, `/js`, `/assets`, `/data`, `/de`, `/en`, `/ru`, `/downloads`
- [ ] `index.html` als Sprachweiche (Weiterleitung auf /de, Fallback-Links), `404.html`
- [ ] Pflegeskript `tools/build.py` (i18n + data → 45 statische Seiten, Sitemap), Prüfung auf fehlende Übersetzungsschlüssel
- [ ] Zentrale Übersetzungsstruktur (alle Texte, Formulare, Fehlermeldungen)
- [ ] Text-Logo als SVG, Favicon
- [ ] Lokale Schriften (woff2) inkl. Lizenzdatei

### Design & Komponenten
- [ ] CSS-Variablen (Farben, Typografie, Abstände), Light- und Dark-Mode
- [ ] Wiederverwendbare Komponenten: Header mit Sprachumschalter und CTAs „Spenden“ / „Mitglied werden“, Navigation (mobil mit Menü-Button), Footer mit Rechtslinks, Buttons, Karten, Tabellen, Formulare, Hinweisboxen
- [ ] Skip-Link, sichtbare Fokuszustände, `prefers-reduced-motion`, dezente Animationen
- [ ] Responsive Tabellen (Beiträge, Termine) mit korrekten `<th>`/`scope`

### Seiten (je in DE, EN, RU)
- [ ] Startseite (Hero, Angebotsübersicht, Über-uns-Teaser, nächste Termine, Mitgliedschaft/Spenden-Hinweis, Newsletter)
- [ ] Über uns (Mission, Werte, Team-Platzhalter, Arbeitsweise)
- [ ] Angebote (4–6 Kurse/Workshops, Mitgliederermäßigung)
- [ ] Termine (Liste mit Datum, Uhrzeit, Kurs, Ort, freien Plätzen)
- [ ] Verein (Vorstellung, Satzung mit Inhaltsverzeichnis/Ankern, Beitragsordnung mit Tabelle, Stand/Datum, Platzhalterhinweis, Hinweis „verbindlich ist die deutsche Fassung“ in EN/RU)
- [ ] Mitglied werden (Vorteile, Beitragsübersicht, Mitgliedsantrag inkl. optionalem SEPA-Mandat)
- [ ] Spenden (Text, Bankdaten mit Kopieren-Buttons, Betragsauswahl, Live-QR-Code als SVG mit Download und Textalternative, Spendenformular, Bestätigung mit Überweisungsdaten und QR)
- [ ] Kontakt (Formular, Kontaktdaten, OpenStreetMap erst nach Zustimmung)
- [ ] Impressum (Vereinsangaben)
- [ ] Datenschutzerklärung (inkl. Mitglieds- und Spenderdaten, Aufbewahrung)
- [ ] Cookie-Einstellungen
- [ ] Barrierefreiheitserklärung

### Daten & Logik
- [ ] `data/beitraege.json` → Beitragstabelle und Auswahlfeld Mitgliedsart
- [ ] `data/angebote.json` und `data/termine.json` (oder gleichwertig zentral)
- [ ] `data/config.json` bzw. JS-Konfiguration (Formular-Endpunkte, Bankdaten, Vereinsdaten)
- [ ] Formularvalidierung mehrsprachig, IBAN-Prüfsumme, Honeypot, Endpunkt/mailto-Fallback
- [ ] Newsletter mit vorbereitetem Double-Opt-in
- [ ] EPC-QR-Code (GiroCode) clientseitig mit lokaler, lizenzierter Bibliothek, SVG-Download
- [ ] Kopieren-Buttons (Clipboard API mit Fallback)
- [ ] Cookie-Banner mit Opt-in, Einstellungen änderbar
- [ ] Erweiterungspunkte für Zahlungsanbieter vorbereitet (Schnittstelle, ohne Aktivierung)

### SEO & Dateien
- [ ] Title, Meta-Description, Open-Graph-Tags auf jeder Seite
- [ ] `hreflang`-Tags und korrektes `lang`-Attribut
- [ ] schema.org-Markup (NGO)
- [ ] `sitemap.xml`, `robots.txt`
- [ ] PDF-Platzhalter in `/downloads` (Satzung, Beitragsordnung)

### Tests
- [ ] Alle internen Links und Anker prüfen (automatisiert)
- [ ] Layout in Breiten 360 / 768 / 1280 px prüfen (Screenshots per Playwright)
- [ ] Formulare: Pflichtfelder, Fehlermeldungen je Sprache, IBAN-Prüfung, Honeypot
- [ ] QR-Code: Inhalt nach EPC-Standard prüfen (Dekodierung, soweit möglich)
- [ ] Tastaturbedienung, Fokus, Kontraste, Cookie-Banner, Karte erst nach Zustimmung
- [ ] Konsole frei von JS-Fehlern, HTML-Validität grob prüfen
- [ ] Funktionieren ohne lokalen Server klären (file:// vs. HTTP, wegen JSON-Laden) und dokumentieren
- [ ] Gefundene Fehler beheben
- [ ] Zusammenfassung → **Stopp, Freigabe abwarten**

## Phase 6 – Dokumentation der Webseite
- [ ] `skills-lab/docs/03-dokumentation.md` mit allen 12 Abschnitten:
  - [ ] 1 Überblick
  - [ ] 2 Technologie-Stack
  - [ ] 3 Projektstruktur
  - [ ] 4 Seiten und Komponenten
  - [ ] 5 Design-System
  - [ ] 6 Funktionen und Logik
  - [ ] 7 Einrichtung und Start (lokal, Veröffentlichen, Formular-Endpunkte: Formspree / eigenes PHP inkl. DSGVO-Folgen)
  - [ ] 8 Inhalte pflegen (Übersetzungen, Beiträge, Termine, Angebote, Logo, PDFs)
  - [ ] 9 Tests und Qualität (echte Ergebnisse)
  - [ ] 10 Bekannte Einschränkungen und Ideen
  - [ ] 11 Entscheidungsprotokoll mit Bezug zur Recherche
  - [ ] 12 Quellen und Lizenzhinweise
- [ ] Vollständige Platzhalterliste (Adresse, Telefon, E-Mail, Logo, Bankdaten, Beiträge, Satzung, Registernummer, Vorstand, rechtliche Texte, Gemeinnützigkeit …)
- [ ] Kurzer Überblick über Designentscheidungen und Kurzanleitung (Ausgabeformat des Auftrags)
- [ ] Gesamtfazit: was erstellt wurde, wo die Dateien liegen, Annahmen, was offen bleibt
- [ ] Abschlussprüfung: kein Punkt dieser Checkliste offen
- [ ] **Stopp, Abschluss**

## Laufend
- [ ] Nach jeder Phase committen und auf Branch `versuch2` pushen
