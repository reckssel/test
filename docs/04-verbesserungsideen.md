# Verbesserungsideen für die Website „Skills Lab e.V.“

Stand: 21.10.2026 · Vorschläge von Claude, noch nichts davon ist umgesetzt.
Sortiert nach Aufwand: zuerst schnelle Verbesserungen, dann mittlere, dann größere Projekte.
Bei jeder Idee steht, was sie bringt und was dafür nötig ist.

---

## A. Schnell umsetzbar (je etwa eine Stunde bis ein halber Tag)

### 1. Platzhalter-Warnung im Build
**Problem:** Viele Angaben stehen noch in [eckigen Klammern], zum Beispiel Adresse, Vorstand, Register und Finanzamt. Man übersieht leicht eine Stelle.
**Idee:** `tools/build.py --check` listet alle noch vorhandenen Platzhalter mit Datei und Schlüssel auf. Mit einem Schalter `--streng` bricht der Build sogar ab, solange noch Platzhalter da sind. So geht nichts versehentlich live.
**Nutzen:** Sicherheit vor dem echten Start, vor allem beim Impressum (rechtlich wichtig).

### 2. Häufige Fragen (FAQ)
**Idee:** Eine kurze Seite oder ein Abschnitt auf „Angebote“ mit aufklappbaren Fragen (`<details>`), zum Beispiel:
- Muss ich Mitglied sein?
- Was kostet ein Kurs?
- Gibt es Ermäßigungen?
- Was passiert, wenn ich absagen muss?
- Ist der Raum barrierefrei?

Dazu strukturierte Daten (`FAQPage`) für Suchmaschinen.
**Nutzen:** Weniger Rückfragen per E-Mail. Hilft Menschen, die sich nicht trauen anzurufen.

### 3. Kurs-Finder auf der Angebotsseite
**Idee:** Kleine Filter über der Kursliste nach Format (vor Ort, online, hybrid) und Niveau. Das funktioniert genauso wie der vorhandene Kursfilter auf der Terminseite. Ohne JavaScript bleibt einfach die ganze Liste sichtbar.
**Nutzen:** Schneller zum passenden Kurs, besonders wenn das Angebot wächst.

### 4. „Nächster Termin“ direkt beim Kurs
**Idee:** Auf der Angebotsseite steht bei jedem Kurs der nächste Termin mit Link zur neuen Terminseite, zum Beispiel „Nächster Termin: Sa, 21.11.2026 · 4 Plätze frei“.
**Nutzen:** Ein Klick weniger bis zur Anmeldung.

### 5. Hinweis auf die Barrierefreiheit des Kursraums
**Idee:** In `data/termine.json` → `locations` Angaben zum Ort ergänzen und auf jeder Terminseite unter „Ort und Anfahrt“ anzeigen:
- stufenloser Zugang
- WC
- Parkplätze
- nächste Bushaltestelle (zum Beispiel Linien der VRN/OREG im Odenwaldkreis)

**Nutzen:** Wichtig für ältere Menschen und Menschen mit Behinderung. Passt zum Anspruch der Seite.

---

## B. Mittlerer Aufwand (etwa ein bis drei Tage)

### 6. Automatischer Build und Tests mit GitHub Actions
**Problem:**
- `build_date` in `site.json` muss man von Hand anpassen.
- Ohne JavaScript erscheinen vergangene Termine sonst noch als „kommend“.
- Die Tests laufen nur, wenn jemand daran denkt.

**Idee:** Zwei Workflows.
1. **Bei jedem Pull Request:** Build ausführen, dann `check_static.py` und die Browser-Tests. Ein roter Haken heißt: nicht mergen.
2. **Täglich nachts:** Build mit dem heutigen Datum, dann Veröffentlichung auf GitHub Pages. Vergangene Termine verschwinden dadurch auch ohne JavaScript, und die .ics-Abos bleiben aktuell.

**Nutzen:** Weniger Handarbeit, weniger Fehler.

### 7. Echten Formularversand einrichten
**Problem:** Die Formulare öffnen zurzeit das E-Mail-Programm (`mailto`). Das klappt nicht bei allen, zum Beispiel am Handy ohne eingerichtete Mail-App.
**Idee:** In `data/site.json` → `forms` eine Adresse für den Versand eintragen.
- Am datenschutzfreundlichsten ist das eigene PHP-Skript (`tools/examples/formular.php`) beim eigenen Webhoster mit Server in Deutschland.
- Alternativ geht ein externer Dienst, dann aber mit Auftragsverarbeitungsvertrag und Ergänzung der Datenschutzerklärung.

**Nutzen:** Anfragen kommen zuverlässig an.

### 8. Inhalte ohne Programmierkenntnisse pflegen
**Idee:** Ein Git-basiertes Redaktionssystem wie Decap CMS. Damit können Vereinsmitglieder im Browser Termine, Kurse und Texte in einem Formular ändern. Gespeichert wird weiterhin in `data/*.json` und `i18n/*.json`, und die Seite bleibt statisch, schnell und sicher.
**Voraussetzung:** Idee 6 (automatischer Build), damit Änderungen ohne Kommandozeile live gehen.
**Nutzen:** Der Verein ist nicht auf eine einzelne technikaffine Person angewiesen.

### 9. Programmheft als PDF und zum Ausdrucken
**Idee:** Beim Build wird automatisch ein „Kursprogramm Winter 2026/27“ als PDF erzeugt, mit allen Kursen und Terminen sowie QR-Codes zu den Terminseiten. Das vorhandene Werkzeug `tools/make_assets.cjs` erzeugt schon PDFs.
**Nutzen:** Zum Auslegen in Rathaus, Bücherei, Volksbank und Arztpraxen. Gerade im ländlichen Odenwald erreicht Papier viele Menschen, die selten online sind.

### 10. Fotos und Gesichter
**Idee:** Echte Fotos aus Kursen (nur mit schriftlicher Einwilligung der abgebildeten Personen), vom Vereinsraum und vom Vorstand. Technisch: moderne Formate (WebP/AVIF), passende Größen je Bildschirm (`srcset`), Lazy Loading und Alternativtexte.
**Nutzen:** Schafft Vertrauen. Die Seite wirkt zurzeit sehr textlastig.

---

## C. Größere Projekte (mehrere Tage, teils mit Entscheidungen im Verein)

### 11. Online-Anmeldung mit automatischer Platzzählung
**Problem:** Die freien Plätze werden von Hand in `termine.json` gepflegt.
**Idee:** Anmeldung mit Bestätigungs-E-Mail. Die Plätze werden automatisch heruntergezählt, und bei vollem Kurs geht es auf die Warteliste mit Nachrücken. In `site.json` ist dafür schon der Platz `booking` vorgesehen.
**Möglichkeiten:**
- ein fertiges, DSGVO-konformes Buchungssystem aus Deutschland einbinden;
- oder ein kleines eigenes Skript auf dem Vereins-Webspace.

**Zu klären:** Datenschutz, Absage-Regeln, wer Wartelisten betreut.

### 12. Weitere Sprachen
**Idee:** Die Seite ist schon dreisprachig aufgebaut. Eine neue Sprache braucht nur eine weitere Datei `i18n/xx.json`. Für den Odenwaldkreis kämen zum Beispiel Ukrainisch und Türkisch in Frage.
- Für Arabisch müsste das Layout zusätzlich Schreibrichtung rechts-nach-links unterstützen (`dir="rtl"`).
- Übersetzungen sollten von Muttersprachlern geprüft werden.

**Nutzen:** Erreicht Zugewanderte, eine wichtige Zielgruppe für Sprach- und Berufskurse.

### 13. Seiten in Leichter Sprache
**Idee:** Eine Seite „Leichte Sprache“ mit den wichtigsten Infos: Wer sind wir? Was bieten wir an? Wie melde ich mich an? Die Texte sollten nach den Regeln des Netzwerks Leichte Sprache geschrieben und am besten von einer Prüfgruppe gelesen sein.
**Nutzen:** Barrierefreiheit über die technische WCAG-Konformität hinaus. Passt gut zu einem Bildungsverein.

### 14. „Was mit Ihrer Spende passiert“
**Idee:** Auf der Spendenseite konkrete Beispiele aus dem Verein, etwa: „50 € = ein Kursplatz für eine Person mit wenig Geld“. Dazu eventuell ein Spendenziel mit Fortschrittsbalken, aber nur mit echten Zahlen, die der Verein selbst pflegt.
**Nutzen:** Konkrete Beispiele motivieren mehr als ein allgemeiner Spendenaufruf.

### 15. Eigene Domain
**Idee:** Statt `reckssel.github.io/test` eine eigene Adresse wie `skillslab-odenwald.de`. GitHub Pages unterstützt eigene Domains mit kostenlosem HTTPS. In `site.json` nur `base_url` ändern und neu bauen.
**Nutzen:** Wirkt seriöser, ist leichter zu merken und passt zu E-Mail-Adressen des Vereins.

---

## Meine Empfehlung für die Reihenfolge

1. **Vor dem echten Start:** Platzhalter ersetzen (mit Idee 1 prüfen), eigene Domain (15) und Formularversand (7).
2. **Danach:** automatischer Build (6), FAQ (2) und nächster Termin beim Kurs (4).
3. **Wenn der Verein wächst:** Pflege ohne Code (8), Programmheft (9) und Online-Anmeldung (11).
