# Phase 1 – Auftragsverständnis „Skills Lab e.V.“

Stand: 2026-10-16 · Grundlage: Prompt des Nutzers (Rolle Webdesigner/Frontend-Entwickler)

Dieses Dokument hält fest, wie ich den Auftrag verstanden habe und welche Annahmen ich treffe.
Es ist die Grundlage für Recherche (Phase 2) und Konzept (Phase 4).

---

## 1. Ziel in eigenen Worten

Der gemeinnützige Verein **Skills Lab e.V.** bietet Kurse und Workshops an, zum Beispiel zu
Kommunikation, digitalen Kompetenzen oder Sprachen. Er braucht eine **eigene, sofort
einsetzbare Website**. Sie soll

- **informieren**: Angebote, Termine, Verein, Satzung, Beiträge,
- **Kontakt ermöglichen**: Kontaktformular, Newsletter, Mitgliedsantrag, Spendenanfrage,
- **Unterstützung erleichtern**: Mitglied werden, Spenden per Überweisung mit QR-Code.

Die Seite kommt **ohne Server und ohne Build-Schritt** aus (reines HTML/CSS/JS), ist
**dreisprachig** (DE/EN/RU) und von Anfang an **barrierefrei (WCAG 2.2 AA)** und
**datenschutzfreundlich** (keine externen Dienste, Opt-in für die Karte).

## 2. Zielgruppe

| Gruppe | Was sie auf der Seite will |
|---|---|
| Interessierte und Neugierige | Schnell verstehen, was Skills Lab ist und ob etwas für sie dabei ist |
| Teilnehmende | Kurs finden, Termin, Ort, freie Plätze, Kontakt für die Anmeldung |
| Mitglieder und solche, die es werden wollen | Vorteile, Beiträge, Satzung, Antrag |
| Spenderinnen und Spender | Wofür das Geld verwendet wird, Bankdaten, QR-Code, Spendenbescheinigung |
| Russischsprachige und internationale Besucher | Alle Inhalte in ihrer Sprache, mit Hinweis auf die verbindliche deutsche Fassung |

Querschnitt: alle Altersgruppen, alle Vorkenntnisse. Daraus folgen einfache Sprache, große
Klickflächen, gut lesbare Schrift, klare Navigation und wenige Klicks bis zum Ziel.

## 3. Inhalte und Seiten (Muss)

1. **Startseite**: Hero mit Nutzenversprechen und CTA, Angebote, Über-uns-Teaser, nächste Termine, Mitgliedschaft/Spenden, Newsletter
2. **Über uns**: Mission, Werte, Team (Platzhalter), Arbeitsweise
3. **Angebote**: 4–6 erfundene, realistische Kurse/Workshops (Titel, Kurzbeschreibung, Dauer, Format, Zielgruppe, Mitgliederermäßigung)
4. **Termine**: Beispieltermine (Datum, Uhrzeit, Kurs, Ort, freie Plätze)
5. **Verein**: Vorstellung (e.V., Zweck, Gemeinnützigkeit, Registernummer, Vorstand als Platzhalter), **Satzung** (Paragraphen, Inhaltsverzeichnis, Anker, druckfreundlich, PDF), **Beitragsordnung** (Tabelle aus zentraler Datenstruktur, Fälligkeit, Zahlungsweise, Ein-/Austritt, Ermäßigung, Verzug, PDF), jeweils mit Stand/Datum und Platzhalterhinweis
6. **Mitglied werden**: Vorteile, Beitragsübersicht, Mitgliedsantrag mit optionalem SEPA-Mandat
7. **Spenden**: Text, Bankdaten mit Kopieren-Buttons, **EPC-QR-Code (GiroCode)** live im Browser mit Betragsauswahl, SVG-Download, Textalternative, Spendenformular mit Bestätigung
8. **Kontakt**: Formular, Kontaktdaten, OpenStreetMap erst nach Zustimmung
9. **Rechtliches**: Impressum, Datenschutzerklärung, Cookie-Einstellungen, Barrierefreiheitserklärung

Alles in **Deutsch, Englisch und Russisch**, mit eigenen URLs (`/de`, `/en`, `/ru`), `hreflang`
und korrektem `lang`-Attribut. Der Sprachumschalter sitzt gut sichtbar im Header.

## 4. Funktionen (Muss)

- 4 Formulare: Kontakt, Newsletter (Double-Opt-in vorbereitet), Mitgliedsantrag, Spendenanfrage
- Clientseitige Validierung mit Fehlermeldungen in der jeweiligen Sprache, **IBAN-Prüfsumme**, Honeypot
- Versand über einen **konfigurierbaren Endpunkt**, sonst mailto-Fallback
- Cookie-Banner mit Opt-in, Einstellungen später änderbar
- Beitragstabelle und Auswahlfeld „Mitgliedsart“ aus **einer** zentralen Datenquelle
- QR-Code mit einer **lokalen** JS-Bibliothek, ohne externe Dienste
- Header-CTAs „Spenden“ und „Mitglied werden“, optional Dark Mode
- SEO: Title, Description, Open Graph, sitemap.xml, robots.txt, schema.org (NGO)

## 5. Stil

Modern, minimalistisch, elegant. Viel Weißraum, klare und lokal eingebundene Schriften, dezente
Animationen (abschaltbar über `prefers-reduced-motion`). Eine Primärfarbe (tiefes Blau oder
Petrol), ein warmer Akzent, dazu Neutraltöne, alles als CSS-Variablen. Mobile-first.
Text-Logo „Skills Lab“ als austauschbares SVG.

## 6. Ausdrücklich nicht Teil dieser Version

- Online-Zahlung (PayPal, Stripe, SEPA-Abwicklung): nur architektonisch vorbereiten
- Terminbuchung, Shop: nur vorbereiten
- Eigener Server oder Backend: Formulare zeigen nur auf einen austauschbaren Endpunkt
- Tracking oder externe Dienste (Fonts, QR, Analytics)

## 7. Annahmen

| # | Annahme | Begründung |
|---|---|---|
| A1 | Projektordner ist `skills-lab/` im Repo, Branch `versuch2` | Trennung von der älteren Odenwald-Recherche und `beispiel-webseite/` |
| A2 | Hosting ist statisch: beliebiger Webspace, GitHub Pages, Netlify o. Ä. Die Seite liegt im Wurzelverzeichnis der Domain | Prompt: kein Server; absolute Pfade wie `/de/` setzen die Domain-Wurzel voraus, das muss ich im Konzept berücksichtigen bzw. relative Pfade nutzen |
| A3 | Alle Vereins-, Kontakt- und Bankdaten sind **Platzhalter** (z. B. „Musterstraße 1, 12345 Musterstadt“) und klar gekennzeichnet | Prompt: Kontakte und Bankdaten als Platzhalter |
| A4 | Für die Platzhalter-IBAN nehme ich eine **formal gültige Beispiel-IBAN** (korrekte Prüfsumme), damit Validierung und QR-Code testbar sind. Sie wird deutlich als Beispiel markiert | Sonst würden IBAN-Prüfung und GiroCode im Test scheitern |
| A5 | Beiträge sind Platzhalterwerte in Euro pro Jahr (z. B. Einzel, ermäßigt, Familie, Förder, Firma) und klar gekennzeichnet | Prompt: Beträge als Platzhalter |
| A6 | Beispieltermine liegen in der Zukunft, ab November 2026 | Heute ist der 16.10.2026. Vergangene Termine wirken unprofessionell |
| A7 | Die englischen und russischen Texte übersetze ich selbst. Vor der Veröffentlichung sollten Muttersprachler sie prüfen, das wird dokumentiert | Qualitätssicherung; Russisch ist besonders fehleranfällig |
| A8 | Die Satzung ist eine **Mustersatzung als Platzhalter**, angelehnt an typische gemeinnützige Satzungen (Mustersatzung nach Anlage 1 zu § 60 AO). Sie ist **keine Rechtsberatung** | Prompt: realistische Mustersatzung mit Prüfhinweis |
| A9 | Die PDF-Downloads sind Platzhalter-PDFs, die ich selbst erzeuge und die auf den Platzhaltercharakter hinweisen | Prompt: PDF-Platzhalterdatei |
| A10 | Die Barrierefreiheitserklärung ist freiwillig. Vereinsseiten fallen in der Regel nicht unter BITV bzw. BFSG, solange keine entsprechenden Dienstleistungen angeboten werden. Das prüfe ich in Phase 2 | Prompt fordert die Erklärung trotzdem; Rechtsgrundlage wird recherchiert |
| A11 | Ein Cookie-Banner ist nur wegen der Karte nötig. Notwendige Daten (Sprache, Zustimmung, Theme) speichere ich in `localStorage` | Ohne Fremdinhalte wäre kein Banner nötig; die Karte ist der Opt-in-Fall |
| A12 | Dark Mode wird umgesetzt: automatisch per System, zusätzlich mit Umschalter | „Optional“ im Prompt, mit CSS-Variablen geringer Aufwand |
| A13 | Schriften: eine frei lizenzierte Schrift (SIL OFL) mit **kyrillischem Zeichensatz**, lokal als woff2 | Russisch braucht Kyrillisch. Viele Schriften haben das nicht |

## 8. Spannungsfelder (werden im Konzept entschieden)

1. **„Kein Build-Schritt“ vs. „eigene URLs pro Sprache“ vs. „alle Übersetzungen zentral in einer Datei“**
   Statische HTML-Seiten pro Sprache sind gut für SEO und funktionieren ohne JavaScript, aber
   dann stehen die Texte in vielen Dateien. Rendert JavaScript die Texte aus einer zentralen
   Datei, ist die Pflege einfach, aber SEO und Funktion ohne JS leiden.
   Mögliche Lösungen, im Konzept abzuwägen:
   - fertig erzeugte, statische HTML-Seiten im Repo plus ein *optionales* Hilfsskript, das sie
     aus der zentralen Übersetzungsdatei neu erzeugt (die Seite läuft dann ohne Build, das
     Skript dient nur der Pflege),
   - oder statische Seiten mit Struktur und JS-Übersetzung aus einer zentralen Datei.
2. **JSON-Daten vs. Öffnen per Doppelklick (`file://`)**: Browser blockieren `fetch()` auf
   lokale JSON-Dateien. Lösung im Konzept, z. B. Daten als `.js` statt `.json`, oder Hinweis
   auf einen lokalen Testserver.
3. **Double-Opt-in ohne Server**: Den Bestätigungsmail-Versand kann eine statische Seite nicht
   leisten. Ich bereite ihn nur vor (Bestätigungsseite, Hinweistext, Endpunkt) und dokumentiere
   Anbieter-Optionen.
4. **Ausgabeformat „vollständiger Code aller Dateien“**: Der Code wird als Dateien ins Repo
   geliefert, nicht als Chat-Ausgabe. Überblick, Anleitung und Platzhalterliste stehen in
   `docs/03-dokumentation.md`.

## 9. Offene Fragen an den Nutzer

Keine zwingenden. Alle Lücken sind über die Annahmen A1–A13 abgedeckt. Wünsche zu den
Annahmen (z. B. ein konkreter Vereinsort oder eine Farbe) kann der Nutzer jederzeit nennen.
