# Webseiten-Entwurf: Skills Lab e.V.

Entwurf für die Webseite von **Skills Lab e.V.**, einer offenen Werkstatt im Odenwald. Der Entwurf setzt
die Ergebnisse aus [`../003_Recherche_Vereinswebseite.md`](../003_Recherche_Vereinswebseite.md) um.

Das Konzept (Werkbereiche, Repair-Café, Tüftel-Club, Termine, Texte) ist ein Vorschlag. Alles, was der
Verein noch mit echten Angaben füllen muss, ist auf der Seite **farbig hinterlegt und gestrichelt
unterstrichen** und steht in `[eckigen Klammern]`, z. B. `[Straße Nr.]`, `[Vorname Nachname]`,
`VR [Nummer]`, `[IBAN]`, `info@[domain].de`, Beitragshöhen und Zeiten.

## Ansehen

`index.html` im Browser öffnen. Es ist kein Server und kein Build-Werkzeug nötig.

## Was aus der Recherche umgesetzt ist

| Recherche | Auf der Seite |
|---|---|
| Die wichtigsten Fragen auf der Startseite (Was, Wo, Kosten, Wann) | Faktenleiste unter dem Einstieg |
| Angebote mit Zeiten, Ausstattung, Mitbringen, Kontakt, Schnuppern | *Werkstatt*: eine Karte pro Werkbereich, dazu Räume, Werkstattordnung, Workshops für Gruppen |
| Termine, Ausfälle | *Termine* mit Ausfall-Hinweis ganz oben |
| Beiträge klar nennen | *Mitmachen*: Beitragstabelle, Kündigungsfrist, Materialkosten |
| Online-Mitgliedsantrag | Formular mit SEPA-Mandat und **freiwilliger, nicht vorausgewählter** Foto-Einwilligung |
| Kinderschutz, Ehrenamt | Kästen auf *Mitmachen* (Tüftel-Club, Mentoren gesucht) |
| Vorstand, Chronik, Downloads, Förderer, Spenden | *Verein*, inkl. Sachspenden |
| Funktionsadressen statt privater Telefonnummern | überall |
| Impressum nach § 5 DDG und § 18 Abs. 2 MStV | *Impressum*, verlinkt im Footer jeder Seite |
| Datenschutzerklärung, Aufsichtsbehörde je nach Bundesland | *Datenschutz* |
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

- Alle Platzhalter füllen, echte Fotos (mit Einwilligungen) und PDF-Dateien für die Downloads
- Formulare brauchen ein Backend oder einen Formular-Dienst (mit Vertrag zur Auftragsverarbeitung).
  Die Formulare im Entwurf verschicken nichts.
- Echte Karte (z. B. OpenStreetMap-Einbettung) hinter dem Zwei-Klick-Button
- Impressum und Datenschutzerklärung an die tatsächlichen Daten und Dienste anpassen und prüfen lassen
- Einzelne HTML-Seiten oder ein CMS, wenn mehrere Leute die Seite pflegen sollen
