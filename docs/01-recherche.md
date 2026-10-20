# Recherche: Webseiten im Odenwaldkreis als Vorbild für „Skills Lab e.V.“

Stand: 2026-10-16 · Phase 3 · Grundlage: `docs/00-auftrag.md`, Rohnotizen in `docs/recherche-notizen.md`

> **Methodischer Hinweis (bitte zuerst lesen):** In der Arbeitsumgebung war das direkte Abrufen
> von Webseiten gesperrt (Netzwerkrichtlinie, Fehler „ENOTFOUND“ bzw. „403 CONNECT“, zuletzt
> erneut geprüft am 16.10.2026). Alle Aussagen über die untersuchten Seiten stammen deshalb aus
> **Suchmaschinen-Ergebnissen**, also aus Titeln, Textausschnitten und indexierten Unterseiten.
> **Design, Typografie, Farben, mobile Darstellung und Ladezeit konnte ich nicht selbst sehen.**
> Diese Kriterien sind in jeder Analyse als **„nicht geprüft“** markiert. Ich habe nichts
> geschätzt oder erfunden. Die Gestaltungsrichtung leitet sich deshalb aus dem Nutzerwunsch
> („deutlich schlichter als der bisherige Entwurf“), den Anforderungen und anerkannten
> Gestaltungsregeln ab, nicht aus den Vorbildseiten (siehe Abschnitt 6.3).

---

## Inhalt

1. [Zusammenfassung des Auftrags](#1-zusammenfassung-des-auftrags)
2. [Vorgehen](#2-vorgehen)
3. [Analyse der einzelnen Webseiten](#3-analyse-der-einzelnen-webseiten)
4. [Vergleichstabelle](#4-vergleichstabelle)
5. [Erkenntnisse](#5-erkenntnisse)
6. [Ableitung für die eigene Webseite](#6-ableitung-für-die-eigene-webseite)
7. [Anhang: Technische und rechtliche Recherche](#7-anhang-technische-und-rechtliche-recherche)
8. [Quellen](#8-quellen)

---

## 1. Zusammenfassung des Auftrags

**Skills Lab e.V.** ist ein gemeinnütziger Verein mit Kursen und Workshops, etwa zu Kommunikation,
Präsentation, digitalen Kompetenzen, Zeitmanagement und Sprachen. Er braucht eine Website, die

- über **Angebote, Termine, Verein, Satzung und Beiträge** informiert,
- **Kontakt, Newsletter, Mitgliedsantrag und Spendenanfrage** ermöglicht,
- Spenden per **Überweisung mit GiroCode (EPC-QR)** erleichtert, der im Browser erzeugt wird,
- **dreisprachig** ist (Deutsch verbindlich, dazu Englisch und Russisch), mit eigenen URLs,
- **barrierefrei (WCAG 2.2 AA)** und **datenschutzfreundlich** ist (keine externen Dienste, Karte nur nach Zustimmung),
- als **reines HTML/CSS/JS ohne Build-Schritt** auf jedem einfachen Webspace läuft.

Zielgruppe sind Menschen aller Altersgruppen und Vorkenntnisse: Interessierte, Teilnehmende,
Mitglieder, Spenderinnen und Spender. **Neue Vorgabe aus Phase 3:** Das Design soll
**deutlich schlichter** sein als der bisherige Entwurf in `beispiel-webseite/`.

Auf Wunsch des Nutzers konzentriert sich die Recherche auf **Webseiten aus dem Odenwaldkreis**.

## 2. Vorgehen

### 2.1 Suchbegriffe

| Thema | Suchbegriffe |
|---|---|
| Kursanbieter | „Volkshochschule Odenwaldkreis Kurse Erbach“, „vhs Odenwaldkreis Programm Online-Anmeldung“, „vhs-odenwald.de Kurse Filter Barrierefreiheit Newsletter“ |
| Bildungsvereine | „Verein Odenwaldkreis Workshops Kurse e.V. Michelstadt Erbach Bildung“, „Musikschule Odenwald e.V. Unterricht Kurse Anmeldung“, „Musikschule Odenwald Gebührenordnung Satzung“ |
| Kleine Vereine | „Repair Café Michelstadt Erbach Odenwald Verein“, „Nachbarschaftshilfe Michelstadt e.V. Angebote Mitglied“ |
| Spenden und Mitgliedschaft | „Odenwaldkreis Verein Spenden e.V.“, „AWO Odenwald Mitglied werden Spenden“, „Odenwald hilft e.V.“, „Kinderschutzbund Odenwaldkreis Spenden“ |
| Große Verbände | „DRK Kreisverband Odenwaldkreis Mitmachen Spenden Kurse Erste Hilfe“ |
| Ehrenamt | „Ehrenamtsagentur Freiwilligenzentrum Odenwaldkreis“ |
| Mehrsprachigkeit | „Odenwaldkreis Webseite mehrsprachig English Русский Verein“, „Odenwaldkreis Integration Verein mehrsprachig“ |

### 2.2 Auswahlkriterien

1. **Region:** Sitz oder Wirkungsgebiet im Odenwaldkreis (Erbach, Michelstadt, Reichelsheim, Höchst …).
2. **Funktionale Nähe:** Die Seite hat mindestens eine Funktion, die auch Skills Lab braucht: Kurse und Termine, Mitgliedschaft und Beiträge, Spenden, Satzung, Kontakt.
3. **Mischung:** große Anbieter (vhs, DRK), mittlere Vereine (Musikschule, AWO), kleine Vereine (Nachbarschaftshilfe, Odenwald hilft).
4. **Ausgeschlossen:** Vereine außerhalb des Kreises, auch wenn sie ähnliche Namen tragen (z. B. VHS Buchen im Neckar-Odenwald-Kreis, Kinderschutzbund Neckar-Odenwald, AWO Erbach an der Donau). Für den Kinderschutzbund Odenwaldkreis habe ich keine eigene Webseite gefunden.

### 2.3 Erfasste Kriterien je Seite

Zweck und Zielgruppe · Aufbau und Navigation · Inhalte und Sektionen · Design · Funktionen und
Interaktionen · Stärken und Schwächen · Mobile Darstellung und Ladeeindruck.

## 3. Analyse der einzelnen Webseiten

### 3.1 vhs Odenwaldkreis: der größte Kursanbieter im Kreis

**URL:** https://vhs-odenwald.de/ · Kurse: https://vhs-odenwald.de/kurse

| Kriterium | Befund |
|---|---|
| Zweck und Zielgruppe | Öffentliche Weiterbildung für alle Altersgruppen; eigene Bereiche wie „junge vhs“, Sprachen, Gesundheit, Integration, Bildungsurlaub |
| Aufbau und Navigation | Hauptnavigation nach Fachbereichen; zentrale Kurssuche mit Ergebnisliste |
| Inhalte und Sektionen | Kurslisten mit Titel, Startdatum, Ort, Kursnummer; Allgemeine Geschäftsbedingungen mit Anmelde- und Zahlungsregeln (u. a. Ratenzahlung bei höheren Kursgebühren) |
| Funktionen | Filter nach **Ort, Wochentag und Tageszeit**, „Filter leeren“; **Platzstatus** direkt in der Liste („Plätze frei“, „Anmeldung auf Warteliste“); Online-Anmeldung; zusätzlich Anmeldung per Telefon, E-Mail, schriftlich |
| Barrierefreiheit | Laut Suchergebnis weist die Seite darauf hin, bei der Gestaltung auf Barrierefreiheit geachtet zu haben |
| Stärken | Schnell zum passenden Kurs; Platzstatus erspart Rückfragen; mehrere Anmeldewege |
| Schwächen (soweit erkennbar) | Zahlreiche alte Kursstände im Suchindex; technische Kurs-URLs mit vielen Parametern (schlecht teilbar); kein Newsletter gefunden |
| Design | **nicht geprüft** |
| Mobil und Ladeeindruck | **nicht geprüft** |

### 3.2 Musikschule Odenwald e.V.: Bildungsangebot in Vereinsform

**URL:** https://www.musikschule-odenwald.de/ · Trägerverein: https://www.musikschule-odenwald.de/ueber-uns/traegerverein

| Kriterium | Befund |
|---|---|
| Zweck und Zielgruppe | Musikalische Bildung vom Babyalter bis zu Erwachsenen; Mitglied im Verband deutscher Musikschulen; mehrere Standorte im Kreis |
| Aufbau und Navigation | Bereiche „Unterricht“ (Unterseiten nach Stufe bzw. Instrument) und „Über uns“ mit eigener Seite „Trägerverein“ |
| Inhalte und Sektionen | Angebote nach Lebensphase (Musikgarten, Grundstufe, Instrumentenkarussell ab 6 Jahren, Instrumental- und Gesangsunterricht); Hinweise auf Wartelisten |
| Funktionen | **Vereinssatzung als PDF-Download**; Anmeldung über das Büro (keine Online-Anmeldung gefunden); Verweise auf Instagram und YouTube |
| Stärken | Angebote klar nach Alter und Niveau gegliedert, Einsteiger finden schnell ihren Platz; Vereinsstruktur und Vorstand transparent |
| Schwächen (soweit erkennbar) | Kein Online-Formular; Gebührenordnung über die Suche nicht auffindbar |
| Design | **nicht geprüft** |
| Mobil und Ladeeindruck | **nicht geprüft** |

### 3.3 Nachbarschaftshilfe Michelstadt e.V.: kleiner Verein mit Baukastensystem

**URL:** https://www.nhv-michelstadt.de/ (auch erreichbar unter https://nhv-michelstadt.clubdesk.de/)

| Kriterium | Befund |
|---|---|
| Zweck und Zielgruppe | Alltagshilfe (Begleitung, Einkauf, Technikhilfe, Lernbegleitung), Reparatur Café, Nachbarschaftscafé; Hilfesuchende und Helfende in Michelstadt |
| Aufbau und Navigation | Willkommen, Verein, Angebote/Projekte, Reparatur-Anmeldung, Impressum |
| Inhalte und Sektionen | Feste Termine in Alltagssprache („jeden 1. Dienstag im Monat, 15–18 Uhr“); Bürozeiten; **Mitgliedsbeitrag offen genannt (12 € pro Jahr)**; laut älterer Meldung Beitragsbefreiung für Schüler, Auszubildende, Studierende |
| Funktionen | **Online-Anmeldeformular** fürs Reparatur Café; Formular zu Reparaturordnung und Haftungsausschluss; Link zum Beitritt |
| Technik | Vereinsbaukasten ClubDesk |
| Stärken | Sehr niedrige Hürde: Was, wann, wo und wie viel sieht man sofort; verständliche Sprache |
| Schwächen (soweit erkennbar) | Gleicher Inhalt unter zwei Domains (doppelte Inhalte für Suchmaschinen); Abhängigkeit vom Baukastenanbieter |
| Design | **nicht geprüft** |
| Mobil und Ladeeindruck | **nicht geprüft** |

### 3.4 AWO Kreisverband Odenwaldkreis e.V.: Spenden und Mitgliedschaft zusammen

**URL:** https://www.awo-odenwald.de/ · https://www.awo-odenwald.de/spenden-mitglied-werden

| Kriterium | Befund |
|---|---|
| Zweck und Zielgruppe | Wohlfahrtsverband mit Ortsvereinen; Hilfesuchende, Mitglieder, Spender, Ehrenamtliche |
| Aufbau und Navigation | Kombinierte Seite „Mitglied werden/Spenden“; eigene Unterseiten für Ortsvereine |
| Inhalte und Sektionen | **Spendenkonto mit IBAN und BIC direkt auf der Seite**; Mitgliedschaft über die Ortsvereine |
| Funktionen | Zusätzlich Spendenprofil auf der externen Plattform betterplace.org |
| Stärken | Bankdaten ohne Umweg; „Unterstützen“ an einem Ort gebündelt |
| Schwächen (soweit erkennbar) | Seite laut Suchindex-Metadaten etwa vier Jahre nicht aktualisiert; kein Online-Antrag gefunden; externe Plattform mit veralteten Projekten verwirrt |
| Design | **nicht geprüft** |
| Mobil und Ladeeindruck | **nicht geprüft** |

### 3.5 Odenwald hilft e.V.: kleiner Spendenverein in Erbach

**URL:** https://odenwald-hilft.de/ · Mitmachen: https://odenwald-hilft.de/mitmachen

| Kriterium | Befund |
|---|---|
| Zweck und Zielgruppe | Sammelt Sach- und Geldspenden und gibt sie kostenlos an Bedürftige im Kreis weiter; 2020 als Initiative entstanden, seit 2022 eingetragener Verein |
| Aufbau und Navigation | Willkommen, Mitmachen, Ehrenamt, „Wir im Odenwaldkreis“, Beiträge/Blog |
| Inhalte und Sektionen | **Konkrete Bedarfsliste** (z. B. Kühlgeräte, Anhänger); Ausgabezeiten; Hinweis „Spendenquittung möglich“; Gründungsgeschichte; Berichte über Spendenübergaben |
| Funktionen | Kontakt per Telefon und E-Mail |
| Stärken | Sehr greifbar: Man sieht, was gebraucht wird und wo die Hilfe ankommt; regionale Verankerung schafft Vertrauen |
| Schwächen (soweit erkennbar) | Keine Bankverbindung in den Suchergebnissen; Spenden laufen über persönlichen Kontakt statt über die Seite |
| Design | **nicht geprüft** |
| Mobil und Ladeeindruck | **nicht geprüft** |

### 3.6 DRK-Kreisverband Odenwaldkreis e.V.: großer Verband mit Kurskalender

**URL:** https://drk-odenwaldkreis.de/ · Kurse: https://drk-odenwaldkreis.de/dienstleistung/erste-hilfe-ausbildung/ · Termine: https://drk-odenwaldkreis.de/events/categories/erste-hilfe-kurs/

| Kriterium | Befund |
|---|---|
| Zweck und Zielgruppe | Erste-Hilfe-Ausbildung, Blutspende, Ehrenamt, Secondhand-Läden, Rettungsdienst; breite Bevölkerung |
| Aufbau und Navigation | Dienstleistungen, Veranstaltungen, Mitmachen, Spenden; **eigene Seiten je Veranstaltungsort** |
| Inhalte und Sektionen | Kursseite mit **Umfang (9 Unterrichtseinheiten), Preis (50 €) und Zielgruppen**; Termine mit Datum und Ort (Erbach, Reichelsheim); Ehrenamt ausdrücklich „ohne Vorkenntnisse“ |
| Funktionen | Veranstaltungskalender mit Kategorien und Orten; Mitmach-Aufruf mit direktem Telefon- und E-Mail-Kontakt; Spendenbereich in der Navigation |
| Technik | Das URL-Muster (`/events/categories/`, `/locations/`) deutet auf ein CMS mit Veranstaltungs-Erweiterung hin. **Vermutung, nicht geprüft** |
| Stärken | Kurse mit allen Entscheidungsdaten; niedrigschwelliger Einstieg ins Ehrenamt |
| Schwächen (soweit erkennbar) | Veraltete Meldungen (Corona-Zeit) weiterhin indexiert |
| Design | **nicht geprüft** |
| Mobil und Ladeeindruck | **nicht geprüft** |

### 3.7 Ergänzend: „Gemeinsam freiwillig im Odenwaldkreis“ (Ehrenamtsagentur des Kreises)

**URL:** https://www.freiwillig-im-odenwaldkreis.de/

Kein Verein, sondern eine Stabsstelle der Kreisverwaltung. Ich führe sie nur ergänzend auf, weil sie zeigt, wie
Mitmach-Projekte als Liste mit klarem Aktionszeitraum dargestellt werden (Aktionstage an zwei
Samstagen im September 2025, Projektübersicht). Design, Mobilansicht und Ladeeindruck sind **nicht geprüft**.

### 3.8 Mehrsprachigkeit im Odenwaldkreis

Ich habe **keine Vereinsseite im Odenwaldkreis mit englischer oder russischer Fassung** gefunden.
Das einzige regionale Beispiel mit Sprachmenü ist die Sparkasse Odenwaldkreis
(https://www.sparkasse-odenwaldkreis.de/de/home.html), mit Deutsch, Englisch, Französisch,
Polnisch, Türkisch und Tschechisch, ohne Russisch. Sie ist kein Verein und dient nur als
Hinweis, dass Sprachpfade wie `/de/` in der Region bereits üblich sind.

## 4. Vergleichstabelle

Legende: ● vorhanden · ○ nicht vorhanden bzw. nicht gefunden · – nicht zutreffend · ? nicht geprüft

| Merkmal | vhs Odenwaldkreis | Musikschule Odenwald e.V. | Nachbarschaftshilfe Michelstadt e.V. | AWO Odenwald e.V. | Odenwald hilft e.V. | DRK Odenwaldkreis e.V. |
|---|---|---|---|---|---|---|
| Größe | groß | mittel | klein | mittel | klein | groß |
| Kursübersicht | ● | ● | ● (Projekte) | ○ | – | ● |
| Kurs mit Dauer, Preis, Zielgruppe | ● | teilweise | teilweise | – | – | ● |
| Terminliste/Kalender | ● | ○ | ● (feste Termine) | ○ | ● (Ausgabezeiten) | ● |
| Freie Plätze sichtbar | ● | ○ (Warteliste-Hinweis) | ○ | – | – | ? |
| Filter/Suche | ● | ○ | ○ | ○ | ○ | ● (Kategorien, Orte) |
| Online-Anmeldung/-Formular | ● | ○ | ● | ○ | ○ | ? |
| Beitrag offen genannt | – | ? | ● | ○ | ? | ? |
| Satzung online | ? | ● (PDF) | ? | ? | ? | ? |
| Online-Mitgliedsantrag | – | ○ | Link zum Beitritt | ○ | ○ | ? |
| Bankdaten sichtbar | – | ? | ? | ● | ○ | ? |
| QR-Code für Überweisung | ○ | ○ | ○ | ○ | ○ | ○ |
| Hinweis Spendenbescheinigung | – | ? | ? | ? | ● | ? |
| Konkrete Spendenverwendung | – | ? | ? | ○ | ● | ? |
| Mehrsprachig | ○ | ○ | ○ | ○ | ○ | ○ |
| Newsletter | ○ | ? | ? | ? | ? | ? |
| Erkennbar veraltete Inhalte | ja | ? | ja (zwei Domains) | ja | nein | ja |
| Design | ? | ? | ? | ? | ? | ? |
| Mobil/Ladezeit | ? | ? | ? | ? | ? | ? |

„○ nicht gefunden“ bedeutet: In den Suchergebnissen nicht nachweisbar. Es heißt nicht sicher, dass die Funktion fehlt.

## 5. Erkenntnisse

### 5.1 Gemeinsame Muster

1. **Der Kurs ist die wichtigste Einheit.** Gute Kursseiten (vhs, DRK) nennen alles, was man zum Entscheiden braucht: Titel, Dauer bzw. Umfang, Preis, Zielgruppe, Ort, Termin, freie Plätze.
2. **Termine in Alltagssprache** („jeden 1. Dienstag im Monat“) senken die Hürde bei kleinen Vereinen.
3. **Gliederung nach Zielgruppe bzw. Niveau** hilft Einsteigern (Musikschule: nach Lebensphase).
4. **„Unterstützen“ wird gebündelt** (AWO: Mitglied werden und Spenden auf einer Seite).
5. **Konkretheit schafft Vertrauen** (Odenwald hilft: Bedarfsliste und Berichte über Übergaben).

### 5.2 Best Practices zum Übernehmen

- Platzstatus direkt in der Terminliste (vhs)
- Kurskarte mit Dauer, Format, Zielgruppe und Preis (DRK)
- Mitgliedsbeitrag offen und ohne Klick nennen (Nachbarschaftshilfe)
- Satzung als PDF und zusätzlich lesbar auf der Seite (Musikschule: PDF; wir machen beides)
- Bankdaten direkt sichtbar (AWO)
- Spendenverwendung konkret benennen (Odenwald hilft)
- Mehrere Kontaktwege anbieten (vhs: online, Telefon, E-Mail, persönlich)

### 5.3 Fehler, die ich vermeiden will

| Beobachteter Fehler | Gegenmaßnahme bei Skills Lab |
|---|---|
| Veraltete Inhalte bleiben sichtbar und indexiert (vhs, AWO, DRK) | Termine kommen aus **einer** Datendatei; vergangene Termine blendet das Skript automatisch aus; „Stand“-Datum auf Satzung und Beitragsordnung |
| Gleicher Inhalt unter zwei Domains (Nachbarschaftshilfe) | Eine Domain, `canonical`-Tag auf jeder Seite |
| Kryptische, parametrisierte URLs (vhs) | Sprechende Pfade wie `/de/angebote/` |
| Spenden nur über persönlichen Kontakt oder externe Plattform (Odenwald hilft, AWO) | Bankdaten, Kopieren-Buttons und GiroCode direkt auf der Seite, ohne Drittanbieter |
| Kein Online-Antrag (Musikschule, AWO) | Mitgliedsantrag als Formular, mit optionalem SEPA-Mandat |
| Nur Deutsch (alle) | DE/EN/RU mit eigenen URLs und `hreflang` |
| Abhängigkeit von Baukasten oder Plattform | Statische Dateien, laufen auf jedem Webspace |

### 5.4 Marktlücke

**Keine** der untersuchten Seiten im Kreis bietet einen **QR-Code zum Überweisen**, eine
**russische Sprachfassung** oder eine **Barrierefreiheitserklärung** (soweit über die Suche
nachweisbar). Skills Lab kann sich mit diesen drei Punkten klar abheben.

## 6. Ableitung für die eigene Webseite

### 6.1 Was ich übernehme

| Übernahme | Vorbild | Umsetzung bei Skills Lab |
|---|---|---|
| Kurs mit allen Entscheidungsdaten | DRK, vhs | Kurskarte: Titel, Kurzbeschreibung, Dauer, Format (vor Ort/online), Zielgruppe, Niveau, Preis bzw. Mitgliederpreis |
| Platzstatus | vhs | Spalte „Freie Plätze“ in der Terminliste, dazu Text („3 Plätze frei“, „ausgebucht“); nicht nur über Farbe |
| Einfacher Filter | vhs | **Ein** schlichter Filter nach Kurs bzw. Format. Mehr braucht ein kleiner Verein nicht |
| Gliederung nach Niveau | Musikschule | Kennzeichnung „Einsteiger“, „Fortgeschrittene“, „alle“ |
| Beitrag offen nennen | Nachbarschaftshilfe | Beitragstabelle aus `data/` auf „Verein“ **und** „Mitglied werden“ |
| Satzung als PDF | Musikschule | PDF und zusätzlich HTML-Fassung mit Inhaltsverzeichnis |
| Bankdaten sichtbar | AWO | Dazu Kopieren-Buttons und GiroCode |
| Konkrete Spendenverwendung | Odenwald hilft | Kurze Liste „Was Ihre Spende bewirkt“ (Platzhalter mit Beispielen) |
| Mehrere Kontaktwege | vhs | Formular, E-Mail, Telefon, Adresse, Karte nach Zustimmung |

### 6.2 Was ich anders mache und warum

| Anders | Warum |
|---|---|
| **Dreisprachig** (DE/EN/RU), deutsche Fassung verbindlich | Auftrag; im Kreis bisher von keinem Verein angeboten |
| **GiroCode lokal im Browser** | Weniger Tippfehler beim Überweisen; keine Datenübertragung an Dritte |
| **Keine Online-Zahlung, keine Buchung** in Version 1 | Auftrag; außerdem fällt die Seite damit voraussichtlich nicht unter das BFSG (siehe 7.4). Die Architektur bleibt erweiterbar |
| **Keine externen Plattformen** (kein betterplace, keine eingebetteten sozialen Medien) | Datenschutz, keine Cookies, kein Banner-Zwang außer für die Karte |
| **Vergangene Termine automatisch ausblenden** | Vermeidet den häufigsten Fehler der Vorbilder (veraltete Inhalte) |
| **Statische Seiten statt Baukasten** | Unabhängigkeit, Geschwindigkeit, kostengünstiges Hosting |

### 6.3 Gestaltungsrichtung: „deutlich schlichter als vorher“

Die Vorbildseiten konnte ich mir nicht ansehen. Die Gestaltungsrichtung leite ich deshalb aus dem
Nutzerwunsch und aus einem Vergleich mit dem bisherigen Entwurf (`beispiel-webseite/`) ab:

| Bisheriger Entwurf (`beispiel-webseite/site.html`) | Neue Richtung für Skills Lab |
|---|---|
| Zwei Schriftfamilien (Barlow Condensed für Überschriften, Source Sans 3 für Text) | **Eine** Schriftfamilie mit Kyrillisch (Manrope oder Inter), Hierarchie nur über Größe und Strichstärke |
| Getönte Hintergrundflächen (`--bg #f4f6f2`, `--surface-2`) | **Weißer** Hintergrund, Flächen nur durch feine Linien getrennt |
| Zwei kräftige Farben (Tannengrün und Sandstein) plus Hinweisfarbe | **Eine** Primärfarbe (tiefes Blau oder Petrol) für Links und Buttons, Akzent **nur** für die beiden Header-Buttons und Platzhalter-Hinweise |
| Farbig hinterlegte und gestrichelt unterstrichene Platzhalter überall | Platzhalter im Text **unauffällig** in eckigen Klammern; eine zentrale Liste in der Dokumentation |
| Karten mit Flächen und Rahmen | Möglichst **keine Karten-Optik**: Listen mit Trennlinien, viel Weißraum |
| — | Keine Schatten, keine Verläufe, keine Bilder als Pflicht; Animationen nur als kurze Übergänge (Fokus, Menü) |

Die konkreten Farbwerte, Kontraste und Schriftgrößen lege ich im Konzept (Phase 4) fest und prüfe sie gegen WCAG 2.2 AA.

### 6.4 Konsequenzen für das Konzept (Phase 4)

1. Sitemap mit Sprachpfaden `/de/`, `/en/`, `/ru/` und sprechenden Unterseiten
2. Zentrale Daten: Beiträge, Angebote, Termine, Vereins- und Bankdaten an **einer** Stelle
3. Lösung für „kein Build-Schritt + zentrale Übersetzungen + Sprach-URLs“ (siehe `00-auftrag.md`, Abschnitt 8)
4. Formulare mit austauschbarem Endpunkt, Honeypot, IBAN-Prüfung
5. Schlichtes Designsystem nach 6.3

## 7. Anhang: Technische und rechtliche Recherche

### 7.1 EPC-QR-Code (GiroCode)

- Zeilenweiser Textinhalt mit fester Reihenfolge: `BCD` · Version `002` · Zeichensatz `1` (UTF-8) · `SCT` · BIC (bei Version 002 im EWR optional) · Name des Empfängers (höchstens 70 Zeichen) · IBAN · Betrag im Format `EUR12.50` (optional) · Purpose-Code (optional) · strukturierte Referenz **oder** unstrukturierter Verwendungszweck (höchstens 140 Zeichen) · Hinweis an den Nutzer (optional)
- Insgesamt höchstens 331 Byte; Fehlerkorrekturstufe **M**
- Einschränkung: Das Originaldokument des European Payments Council (EPC069-12) war nicht abrufbar. Die Angaben beruhen auf mehreren übereinstimmenden Sekundärquellen

### 7.2 QR-Bibliothek

- **Project Nayuki „QR Code generator library“**: MIT-Lizenz, ohne Abhängigkeiten, JavaScript-Version mit SVG-Ausgabe, Fehlerkorrekturstufe wählbar
- Alternative: `qrcode-generator` (Kazuhiko Arase), MIT, Version 2.0.4 (Angabe aus der npm-Registry, geprüft)

### 7.3 IBAN-Prüfung (ISO 13616 / ISO 7064 Mod 97-10)

Ablauf: Länge je Land prüfen → die ersten vier Zeichen ans Ende stellen → Buchstaben in Zahlen
umwandeln (A=10 … Z=35) → der Rest bei Division durch 97 muss **1** sein. In JavaScript wird
stückweise gerechnet, weil normale Zahlen ab etwa 15 Stellen ungenau werden. Die Prüfung erkennt
Tippfehler, belegt aber nicht, dass das Konto existiert.

### 7.4 Barrierefreiheitsstärkungsgesetz (BFSG)

Das Gesetz gilt **nicht pauschal** für Vereine. Maßgeblich ist, ob über die Seite
Verbraucherdienstleistungen mit Vertragsabschluss angeboten werden (z. B. Online-Buchung,
Ticketverkauf, Online-Kurse). Für Kleinstunternehmen (weniger als 10 Beschäftigte, höchstens
2 Mio. € Umsatz, Ehrenamtliche zählen nicht) gibt es bei Dienstleistungen eine Ausnahme. Die
Quellen bewerten Mitgliedsbeiträge uneinheitlich.
→ Skills Lab Version 1 ohne Buchung und Zahlung: Die Erklärung zur Barrierefreiheit ist
**freiwillig**, wird aber angeboten. Bei späterer Buchung oder Zahlung muss das neu geprüft werden.
**Keine Rechtsberatung.**

### 7.5 Spendenbescheinigung

Bis **300 € je Einzelspende** reicht als Nachweis der Kontoauszug **zusammen mit** einem Beleg des
Vereins (steuerbegünstigter Zweck, Freistellungsangaben, Angabe Spende oder Mitgliedsbeitrag;
§ 50 Abs. 4 EStDV). Über 300 € ist eine Zuwendungsbestätigung nach amtlichem Muster nötig.
→ Hinweis auf der Spendenseite plus Platzhalter-PDF „vereinfachter Spendennachweis“.

### 7.6 Satzung

Eine gemeinnützige Satzung muss die Festlegungen der **Anlage 1 zu § 60 AO** inhaltlich
enthalten: ausschließlicher und unmittelbarer Zweck, Selbstlosigkeit, Mittelverwendung,
Begünstigungsverbot, Vermögensbindung bei Auflösung. Wörtlich übernehmen muss man das Muster
nicht. Empfohlen wird, den Entwurf vorab mit dem Finanzamt abzustimmen.
→ Die Platzhaltersatzung enthält diese Punkte in eigener Formulierung, mit deutlichem Prüfhinweis.

### 7.7 Schriften

Manrope (SIL OFL 1.1, variable Strichstärke 200–800, Kyrillisch) und Inter (SIL OFL 1.1,
Kyrillisch und Kursivschnitte) sind beide geeignet und über npm (`@fontsource/…`) lokal
einbindbar. Die Auswahl treffe ich im Konzept.

## 8. Quellen

Alle Seiten wurden am 16.10.2026 über die Websuche ausgewertet. **Keine der Seiten konnte direkt abgerufen werden.**

**Untersuchte Webseiten (Odenwaldkreis)**
- vhs Odenwaldkreis: https://vhs-odenwald.de/ · https://vhs-odenwald.de/kurse · https://vhs-odenwald.de/kurse/junge-vhs · https://vhs-odenwald.de/index.php?id=100
- Musikschule Odenwald e.V.: https://www.musikschule-odenwald.de/unterricht · https://www.musikschule-odenwald.de/unterricht/grundstufe · https://www.musikschule-odenwald.de/ueber-uns/traegerverein
- Nachbarschaftshilfe Michelstadt e.V.: https://www.nhv-michelstadt.de/ · https://nhv-michelstadt.clubdesk.de/verein · https://nhv-michelstadt.de/reparaturanmeldung
- AWO Kreisverband Odenwaldkreis e.V.: https://www.awo-odenwald.de/spenden-mitglied-werden · https://www.betterplace.org/de/organisations/32824-arbeiterwohlfahrt-kreisverband-odenwald-e-v
- Odenwald hilft e.V.: https://odenwald-hilft.de/ · https://odenwald-hilft.de/mitmachen · https://www.erbach.de/strukturierte-daten/vereine/odenwald-hilft-e-v/
- DRK-Kreisverband Odenwaldkreis e.V.: https://drk-odenwaldkreis.de/ · https://drk-odenwaldkreis.de/dienstleistung/erste-hilfe-ausbildung/ · https://drk-odenwaldkreis.de/events/categories/erste-hilfe-kurs/
- Gemeinsam freiwillig im Odenwaldkreis: https://www.freiwillig-im-odenwaldkreis.de/ · https://hessen.de/presse/pressearchiv/projekt-der-ehrenamtsagentur-des-odenwaldkreises-gefoerdert
- Sparkasse Odenwaldkreis (Sprachmenü): https://www.sparkasse-odenwaldkreis.de/de/home.html

**Ergänzende Presse/Portale**
- https://blog-odenwaldkreis.sparkasseblog.de/das-repaircafe-in-michelstadt-ein-besonderes-projekt-der-nachbarschaftshilfe/
- https://www.odw-journal.de/volkshochschule-bietet-vielfaeltiges-programm/
- https://www.ehrenamtssuche-hessen.de/organisationen/nachbarschaftshilfe-michelstadt-e-v-19314

**Technik**
- GiroCode: https://de.wikipedia.org/wiki/Girocode · https://girocodegenerator.com/en/wissen/epc-standard · https://hilfe.microtech.de/04_moduluebergreifend/weitere%20funktionen/glgirocodebarcodeformat/ · https://sammelmappe.org/girocode-epc-qr-code-aufbau-beispiel/
- QR-Bibliothek: https://www.nayuki.io/page/qr-code-generator-library · https://github.com/nayuki/QR-Code-generator · npm `qrcode-generator`
- IBAN: https://dev.to/rosariov25/how-to-validate-an-iban-mod-97-check-digit-explained-1436 · https://gocardless.com/de/handbuch/artikel/iban-pruefziffer-berechnen-so-gehts
- Schriften: https://fontalternatives.com/compare/inter-vs-manrope/ · https://openfontlicense.org/ofl-fonts/ · npm `@fontsource/manrope`

**Recht**
- BFSG: https://www.clubdesk.de/de/vereinswissen/barrierefreiheitsstaerkungsgesetz-bfsg-und-bafg-digitale-barrierefreiheit-fuer-vereine · https://www.soziokultur-niedersachsen.de/aktuelles/news/artikel/sind-barrierefreie-webseiten-auch-fuer-vereine-pflicht.html · https://digital-vereint.de/aktuelles/obacht-vor-panik-wann-muss-die-webseite-barrierefrei-sein/ · https://www.lsb-berlin.de/aktuelles/news/details/digitale-barrierefreiheit-wird-pflicht-auch-fuer-vereine
- Spendennachweis: https://www.boell.de/de/2021/01/19/vereinfachter-spendennachweis-ohne-spendenquittung · https://www.verbandsbuero.de/spendenquittung-im-verein-300-euro-grenze/ · https://hochschulgesellschaft-brs.de/wp-content/uploads/2022/09/Vereinfachter_Zuwendungsnachweis_bis_EUR_300.pdf
- Mustersatzung: https://www.finanzamt.bayern.de/Informationen/Steuerinfos/Zielgruppen/Vereine/Mustersatzung-fuer-einen-Verein.pdf · https://www.ofd.niedersachsen.de/download/37244/Mustersatzung_Vereine.pdf · https://www.nwb-experten-blog.de/gemeinnuetzigkeit-musterklauseln-in-der-satzung-sind-pflicht
