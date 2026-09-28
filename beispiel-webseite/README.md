# Beispiel-Webseite: TSV Lindenbrunn 1908 e.V.

Eine Beispiel-Webseite für einen **erfundenen** Sportverein im Odenwald. Sie setzt die Ergebnisse aus
[`../003_Recherche_Vereinswebseite.md`](../003_Recherche_Vereinswebseite.md) um. Alle Namen, Adressen,
Nummern und Bankdaten sind Platzhalter.

## Ansehen

`index.html` im Browser öffnen. Es ist kein Server und kein Build-Werkzeug nötig.

## Was aus der Recherche umgesetzt ist

| Recherche | Auf der Seite |
|---|---|
| Die 5 Fragen auf der Startseite (Was, Wo, Kosten, Kontakt) | Faktenleiste unter dem Einstieg |
| Angebote mit Zeiten, Ort, Ausrüstung, Ansprechpartner, Probetraining | *Angebote*: eine Karte pro Abteilung, dazu Anlagen und Vermietung des Vereinsheims |
| Termine, Trainingsausfälle | *Termine* mit Ausfall-Hinweis ganz oben |
| Beiträge klar nennen | *Mitmachen*: Beitragstabelle, Kündigungsfrist, Hinweis auf das Bildungs- und Teilhabepaket |
| Online-Mitgliedsantrag | Formular mit SEPA-Mandat und **freiwilliger, nicht vorausgewählter** Foto-Einwilligung |
| Kinderschutz, Ehrenamt | Kästen auf *Mitmachen* |
| Vorstand, Chronik, Downloads, Sponsoren, Spenden | *Verein* |
| Funktionsadressen statt privater Telefonnummern | überall |
| Impressum nach § 5 DDG und § 18 Abs. 2 MStV | *Impressum*, verlinkt im Footer jeder Seite |
| Datenschutzerklärung, Aufsichtsbehörde Hessen | *Datenschutz* |
| Kein Cookie-Banner nötig | keine Cookies, kein Tracking, **Schriften lokal** in `fonts/` |
| Karte nur per Zwei-Klick | Kontaktseite: Karte wird erst nach Klick geladen (hier nur angedeutet) |
| Social Media ohne Plugins | Footer: nur Text-Hinweise |
| Barrierearm | Kontrast, Tastaturbedienung, Hell- und Dunkelmodus, mobil nutzbar, Erklärung zur Barrierefreiheit |

## Dateien

- `site.html`: Quelltext der Seite (Fragment, wird auch als Vorschau veröffentlicht)
- `build.py`: erzeugt daraus `index.html` und ersetzt dabei Google Fonts durch die lokalen Schriften
- `index.html`: fertige Seite
- `fonts/`: Barlow Condensed und Source Sans 3 (SIL Open Font License)

Nach Änderungen an `site.html`: `python3 build.py`

## Was für einen echten Einsatz noch fehlt

- Echte Inhalte, Fotos (mit Einwilligungen) und PDF-Dateien für die Downloads
- Formulare brauchen ein Backend oder einen Formular-Dienst (mit Vertrag zur Auftragsverarbeitung).
  Die Beispiel-Formulare verschicken nichts.
- Echte Karte (z. B. OpenStreetMap-Einbettung) hinter dem Zwei-Klick-Button
- Impressum und Datenschutzerklärung an die tatsächlichen Daten und Dienste anpassen und prüfen lassen
- Einzelne HTML-Seiten oder ein CMS, wenn mehrere Leute die Seite pflegen sollen
