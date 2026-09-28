# Recherche: Webseite für einen Verein im Odenwald

Stand: September 2026 · Umsetzung von `002_Anforderungen.md`

> **Hinweis:** Das hier ist eine Zusammenfassung aus öffentlich zugänglichen Quellen und
> **keine Rechtsberatung**. Für konkrete Fälle (z. B. Online-Shop, bezahlte Kurse, Abmahnung)
> lohnt sich eine Rückfrage beim eigenen Dachverband (Sportkreis, Landessportbund,
> Sängerkreis …) oder bei einem Anwalt.

Inhalt:

1. [Was eine Vereinswebseite in Deutschland rechtlich braucht](#1-was-eine-vereinswebseite-in-deutschland-rechtlich-braucht)
2. [Was Vereine im Odenwald auf ihren Webseiten haben](#2-was-vereine-im-odenwald-auf-ihren-webseiten-haben)
3. [Übersicht: Was Besucher wissen wollen](#3-übersicht-was-besucher-wissen-wollen)
4. [Vorschlag für eine Seitenstruktur](#4-vorschlag-für-eine-seitenstruktur)
5. [Quellen](#5-quellen)

---

## 1. Was eine Vereinswebseite in Deutschland rechtlich braucht

### 1.1 Pflicht für jede Vereinswebseite

| Punkt | Was genau | Rechtsgrundlage |
|---|---|---|
| **Impressum** | Von **jeder Unterseite** mit einem Klick erreichbar, Link klar als „Impressum“ beschriftet (z. B. im Footer). | § 5 Digitale-Dienste-Gesetz (DDG, hat 2024 das TMG abgelöst) |
| **Datenschutzerklärung** | Eigener Menüpunkt, nicht im Impressum verstecken. Erklärt, welche Daten wofür verarbeitet werden. | Art. 13 DSGVO |
| **Verschlüsselung (HTTPS)** | SSL-/TLS-Zertifikat, spätestens sobald es ein Formular gibt. Bei fast allen Hostern kostenlos. | Art. 32 DSGVO |
| **Vertrag mit dem Hoster (AVV)** | Auftragsverarbeitungsvertrag mit dem Webhoster/Baukasten-Anbieter abschließen (bei Jimdo, WordPress-Hostern, ClubDesk etc. meist per Klick im Kundenkonto). | Art. 28 DSGVO |
| **Einwilligung für nicht notwendige Cookies/Dienste** | Tracking, Statistik, eingebettete Fremdinhalte nur nach Einwilligung. Ohne solche Dienste braucht man **keinen** Cookie-Banner. | § 25 TDDDG (früher TTDSG), DSGVO |

#### Inhalt des Impressums bei einem e. V.

- Vollständiger Vereinsname laut Vereinsregister (inkl. „e. V.“)
- Postanschrift (Straße, Hausnummer, PLZ, Ort – kein Postfach)
- **Vertretungsberechtigter Vorstand** mit vollem Namen (wer vertretungsberechtigt ist, steht in der Satzung, meist § 26 BGB-Vorstand)
- E-Mail-Adresse **und** ein weiterer schneller Kontaktweg (in der Regel Telefonnummer)
- Registergericht und Vereinsregisternummer (z. B. „Amtsgericht Darmstadt, VR …“)
- Umsatzsteuer-ID, falls vorhanden
- **Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV** mit Name und Anschrift, sobald es News, Berichte o. Ä. gibt – bei einer Vereinsseite praktisch immer

#### Inhalt der Datenschutzerklärung (Mindestpunkte)

- Name und Kontakt des Verantwortlichen (der Verein)
- Datenschutzbeauftragter, falls vorhanden (Pflicht erst, wenn in der Regel mindestens 20 Personen ständig mit personenbezogenen Daten arbeiten, § 38 BDSG)
- Hosting / Server-Logfiles
- Kontaktformular bzw. E-Mail-Kontakt
- ggf. Mitgliedsantrag, Newsletter, Spenden, Anmeldungen
- Eingebundene Dienste (z. B. Karten, Videos, Social-Media-Links)
- Speicherdauer, Rechtsgrundlagen, Empfänger
- Betroffenenrechte (Auskunft, Löschung, Widerspruch …)
- Beschwerderecht bei der Aufsichtsbehörde. **Achtung Odenwald:** Die Region liegt in drei Bundesländern – zuständig ist die Behörde am Vereinssitz:
  - Hessen (Odenwaldkreis, Kreis Bergstraße, Darmstadt-Dieburg): Hessischer Beauftragter für Datenschutz und Informationsfreiheit (HBDI)
  - Bayern (Landkreis Miltenberg, „Bayerischer Odenwald“): Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
  - Baden-Württemberg (Neckar-Odenwald-Kreis, Rhein-Neckar-Kreis): LfDI Baden-Württemberg

Tipp: Generatoren (z. B. e-recht24, Datenschutz-Generator) und Muster der Landessportbünde liefern eine gute Grundlage – danach aber prüfen, ob wirklich nur das drinsteht, was die Seite auch nutzt.

### 1.2 Typische Stolperfallen (Abmahnrisiko)

- **Google Fonts** direkt von Google-Servern laden → löste 2022 eine Abmahnwelle aus, auch gegen Sportvereine. **Lösung:** Schriften lokal auf dem eigenen Server einbinden.
- **Google Maps / YouTube** direkt eingebettet → Daten fließen schon beim Seitenaufruf. **Lösung:** Zwei-Klick-Lösung (erst nach Klick laden), `youtube-nocookie.com`, oder einfach ein Bild der Karte mit Link auf Google Maps / OpenStreetMap.
- **Google Analytics & Co.** → nur mit Einwilligung. Für einen Verein meist unnötig; wenn Statistik gewünscht, datensparsame Alternative (z. B. Matomo ohne Cookies).
- **Social-Media-Plugins** (Facebook-„Gefällt mir“-Button usw.) → durch einfache Text-/Icon-Links ersetzen.
- **Fremde Bilder, Texte, Logos, Musik** → Urheberrecht. Nur eigene oder lizenzierte Inhalte, mit Bildnachweis.

### 1.3 Fotos und Personen auf der Webseite

- Fotos von Mitgliedern sind personenbezogene Daten. Mögliche Grundlagen: berechtigtes Interesse (Veranstaltungsbericht, Außendarstellung), eine Regelung in der **Satzung / Datenschutzordnung**, oder eine **schriftliche Einwilligung** (am sichersten, z. B. direkt im Mitgliedsantrag abfragen).
- **Kinder und Jugendliche:** Einwilligung der Erziehungsberechtigten; ab ca. 12–14 Jahren zusätzlich die des Kindes. Bei Jugendfotos lieber zurückhaltend sein (keine vollen Namen + Foto + Trainingszeit/-ort kombinieren).
- **Urheberrecht am Foto:** Der Fotograf muss der Veröffentlichung zustimmen (auch wenn es ein Mitglied ist).
- **Vorstand, Trainer, Ansprechpartner:** Beim gesetzlichen Vorstand ist die Nennung notwendig. Bei anderen Ehrenamtlichen mit Einwilligung – oder **Funktionsadressen** nutzen (`jugend@…`, `kasse@…`) statt privater Handynummern.
- Mitgliederlisten, Geburtstagslisten, Protokolle mit Namen gehören **nicht** öffentlich ins Netz → ggf. in einen passwortgeschützten Mitgliederbereich.

### 1.4 Nur wenn bestimmte Funktionen angeboten werden

| Funktion | Zusätzlich beachten |
|---|---|
| **Online-Mitgliedsantrag** | Nur nötige Daten abfragen, Datenschutzhinweis, SEPA-Lastschriftmandat korrekt (Gläubiger-ID, Mandatsreferenz), Einwilligung für Fotos gleich mit abfragen. |
| **Newsletter** | Double-Opt-In, Abmeldelink in jeder Mail, AVV mit dem Newsletter-Dienst. |
| **Online-Spenden** | Hinweis zur Gemeinnützigkeit und zur Zuwendungsbestätigung (Spendenquittung); bis 300 € reicht oft der vereinfachte Nachweis (Kontoauszug). |
| **Shop (Fanartikel), Ticketverkauf, bezahlte Kurse** | Das ist Handel mit Verbrauchern: Widerrufsbelehrung, AGB, Preisangaben inkl. MwSt.-Hinweis, Bestellbutton „zahlungspflichtig bestellen“. Hier kann auch das **Barrierefreiheitsstärkungsgesetz** greifen (siehe unten). |
| **Facebook-/Instagram-Seite** | Eigenes Impressum dort verlinken; der Verein ist mitverantwortlich für die Daten der Besucher (gemeinsame Verantwortung mit Meta). |

### 1.5 Barrierefreiheit (BFSG, seit 28.06.2025)

- Das **Barrierefreiheitsstärkungsgesetz** gilt für Dienstleistungen im elektronischen Geschäftsverkehr mit Verbrauchern – also Online-Shops, Buchungs- oder Bezahlfunktionen.
- **Reine Informationsseiten** eines Vereins (Termine, News, Kontakt) sind in der Regel **nicht** erfasst.
- **Kleinstunternehmen** (weniger als 10 Beschäftigte **und** höchstens 2 Mio. € Umsatz/Bilanzsumme) sind bei Dienstleistungen ausgenommen – das trifft auf fast alle Ortsvereine zu.
- **Empfehlung trotzdem:** barrierearm bauen – gut lesbare Schriftgröße, ausreichend Kontrast, Alternativtexte für Bilder, sinnvolle Überschriften, Bedienung per Tastatur, PDFs möglichst auch als Text. Das hilft auch älteren Mitgliedern und Handynutzern.

### 1.6 Technik & Organisation (keine Pflicht, aber dringend empfohlen)

- Eigene Domain auf den Verein (nicht auf eine Privatperson) registrieren, Zugangsdaten beim Vorstand hinterlegen.
- **Mobilfreundlich** (der Großteil der Besucher kommt übers Handy).
- Regelmäßige Updates (bei WordPress: Plugins/Themes), Backups.
- Zuständigkeit klären: Wer pflegt die Seite? Wer darf Inhalte freigeben?
- Veraltete Inhalte (Termine von 2019, alte Trainer) entfernen – das ist der häufigste Mangel bei Vereinsseiten.

---

## 2. Was Vereine im Odenwald auf ihren Webseiten haben

### 2.1 Betrachtete Vereine

Direkter Seitenabruf war aus der Recherche-Umgebung nicht möglich; die Auswertung beruht auf den
öffentlich indexierten Seiten und Menüpunkten (Suchmaschinen-Index, Stand September 2026).

| Verein | Ort / Region | Art |
|---|---|---|
| [Odenwaldklub e.V.](https://www.odenwaldklub.de/) | Dachverband, ~72 Ortsgruppen | Wander-/Heimatverein |
| [TSG Bad König 1863 e.V.](https://tsg-badkoenig.de/) | Bad König, Odenwaldkreis | Mehrsparten-Sportverein (~1.000 Mitgl.) |
| [TSV Günterfürst 1909 e.V.](https://tsv-guenterfuerst.de/) | Erbach-Günterfürst | Sportverein (~500 Mitgl.) |
| [SV Fürth 1925 DJK e.V.](https://www.svfuerth.de/home) | Fürth im Odenwald | Sportverein (Fußball, Tischtennis, Theater) |
| [Odenwald Hilft e.V.](https://odenwald-hilft.de/) | Erbach | Gemeinnütziger Hilfsverein |
| [Bayerischer Odenwald e.V.](https://www.bayerischer-odenwald.de/bayerischer-odenwald-ev) | Amorbach & Umgebung | Tourismus-/Förderverein |
| [Jugendfeuerwehr Odenwaldkreis](https://www.jf-odenwaldkreis.de/) | Odenwaldkreis | Jugendfeuerwehr (Kreisebene) |
| [Freiwillige Feuerwehr Buchen](https://www.feuerwehr-buchen.de/) | Buchen (Neckar-Odenwald-Kreis) | Feuerwehr mit Förderverein |
| [Sportkreis Odenwald](https://sportkreis-odenwald.de/) | Odenwaldkreis | Dachverband, 176 Vereine |

### 2.2 Welche Inhalte dort vorkommen

✔ = im Index nachweisbar · – = nicht gefunden (kann trotzdem vorhanden sein)

| Inhalt | Odenwald­klub | TSG Bad König | TSV Günter­fürst | SV Fürth | Odenwald Hilft | JF Odw.-Kreis / FF Buchen |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| News / Aktuelles / Berichte | – | – | ✔ | ✔ (News-Archiv) | ✔ | ✔ |
| Termine / Veranstaltungen | ✔ (Wanderplan als PDF) | – | ✔ | – | ✔ | ✔ |
| Abteilungen / Gruppen / Angebote | ✔ (Ortsgruppen, Arbeitskreise) | ✔ | ✔ | ✔ | ✔ (Aktionen) | ✔ (Jugendgruppen) |
| Trainings-/Übungszeiten | – | ✔ (Trainingskalender) | ✔ | – | – | – |
| Über uns / Verein | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Vorstand / Ansprechpartner | ✔ (je Ortsgruppe) | – | ✔ | – | ✔ | – |
| Chronik / Geschichte | – | – | ✔ | – | – | – |
| Mitglied werden / Beitritt | ✔ (Formular + Vorteile) | – | – | – | ✔ | – |
| Jugend-Bereich | – | – | ✔ | ✔ (Jugendberichte, Pinnwand) | – | ✔ |
| Galerie / Fotos | – | – | – | – | ✔ | – |
| Sponsoren / Förderer | – | – | – | – | ✔ | ✔ (Förderverein) |
| Einrichtungen (Heim, Halle, Platz) | ✔ (Wanderheime) | – | – | – | – | – |
| Einsatzberichte | – | – | – | – | – | ✔ |
| Kontakt | ✔ | ✔ (Formular) | ✔ | ✔ (E-Mail) | ✔ | ✔ |
| Impressum | – | ✔ | – | – | ✔ | – |

### 2.3 Zusammengefasst: Was fast alle haben

1. **Startseite mit aktuellen Meldungen** – Spielberichte, Rückblicke auf Feste, Ankündigungen.
2. **Angebot nach Abteilungen / Gruppen** – je Abteilung eigene Unterseite mit Beschreibung, Zeiten, Ansprechpartner.
3. **Termine** – als Liste, Kalender oder **PDF-Jahresplan** (Wanderplan beim Odenwaldklub).
4. **Trainings-/Proben-/Übungszeiten** mit Ort (Halle, Sportplatz, Gerätehaus).
5. **Verein / Über uns** – Vorstand, Chronik (viele Odenwälder Vereine sind über 100 Jahre alt – Gründungsjahr steht oft im Namen).
6. **Mitglied werden** – Beitrittsformular (oft PDF zum Ausdrucken), gute Gründe für eine Mitgliedschaft (z. B. Versicherungsschutz, Rabatte beim Odenwaldklub).
7. **Jugend** – eigener Bereich für Kinder/Jugendliche, oft mit eigenen Berichten.
8. **Kontakt + Impressum + Datenschutz.**

### 2.4 Was einige zusätzlich haben

- Downloads: Satzung, Beitragsordnung, Beitrittserklärung, Datenschutzhinweise
- Fotogalerie
- Sponsorenseite / Werbepartner, Förderverein
- Vermietung von Vereinsheim, Hütte oder Wanderheim
- Links zu Verbänden und Ergebnisdiensten (fussball.de, click-TT, Sportkreis)
- Mitmachen im Ehrenamt (Helfer gesucht)
- Spendenaufruf mit Bankverbindung

### 2.5 Häufige Schwächen, die auffallen

- Termine und News sind oft **veraltet** (letzte Meldung Jahre alt).
- Wichtige Infos stecken **nur in PDFs** (schlecht lesbar auf dem Handy, nicht barrierefrei).
- Kostenlose Baukasten-Adressen (`…jimdofree.com`) mit Fremdwerbung wirken wenig professionell.
- **Beiträge / Kosten** werden selten klar genannt – obwohl Interessenten genau das wissen wollen.
- Trainingszeiten stehen zwar da, aber **ohne Adresse** oder ohne Hinweis „Probetraining möglich?“.

---

## 3. Übersicht: Was Besucher wissen wollen

Sortiert nach Besuchergruppe; innerhalb jeder Gruppe nach Wichtigkeit.

### 3.1 Interessierte / mögliche neue Mitglieder
*„Passt das zu mir und wie fange ich an?“*

- Was bietet der Verein? (Sportarten, Gruppen, Chor, Wanderungen …)
- Für wen? Alter, Leistungsniveau, Anfänger willkommen?
- **Wann und wo?** Tag, Uhrzeit, genaue Adresse, Parken / ÖPNV
- **Kann ich einfach vorbeikommen / schnuppern?** Probetraining, Schnupperprobe, Gastwanderung
- **Was kostet es?** Mitgliedsbeitrag (Einzel, Familie, Kinder, Ermäßigung), Aufnahmegebühr, Zusatzkosten
- Was brauche ich? (Ausrüstung, Kleidung, Instrument, Vorkenntnisse)
- **Wer ist Ansprechpartner** für genau diese Gruppe? (Name, Funktionsmail, ggf. Telefon)
- Wie werde ich Mitglied? (Online-Antrag oder PDF, Kündigungsfristen)

### 3.2 Eltern
*„Ist mein Kind dort gut aufgehoben?“*

- Angebote nach Altersgruppen (Bambini, Jugend, Kinderfeuerwehr …)
- Trainer / Betreuer: Wer ist das? Qualifikation?
- **Kinderschutz:** Schutzkonzept, erweitertes Führungszeugnis der Betreuer, Ansprechperson
- Fahrten, Turniere, Freizeiten – wie läuft die Anmeldung?
- Fotos: Wie geht der Verein mit Bildern von Kindern um?
- Förderung: Hinweis auf Bildungs- und Teilhabepaket / Zuschüsse

### 3.3 Mitglieder
*„Was ist los und wo finde ich …?“*

- **Aktuelle Termine** (Training fällt aus, Hallenwechsel, Spielplan)
- Veranstaltungen, Feste, Jahreshauptversammlung (Einladung, Tagesordnung)
- Berichte und Fotos von Veranstaltungen
- **Downloads:** Satzung, Beitragsordnung, Formulare (Adressänderung, Kündigung, SEPA)
- Ansprechpartner im Vorstand (Kasse, Schriftführung, Abteilungsleitung)
- Ehrenamt: Wo werden Helfer gebraucht?
- ggf. geschützter Mitgliederbereich (Protokolle, interne Infos)

### 3.4 Besucher von Veranstaltungen / Zuschauer / Gäste
*„Wann ist das Fest und wie komme ich hin?“*

- Veranstaltungskalender (Kerb, Sommerfest, Konzerte, Wanderungen, Heimspiele)
- Datum, Uhrzeit, Ort mit Anfahrt, Eintritt, Anmeldung nötig?
- Spielpläne / Ergebnisse (Link zu fussball.de, click-TT …)
- Wanderpläne / Touren für Gäste (wichtig für den Tourismus im Odenwald)
- Vermietung: Vereinsheim, Hütte, Grillplatz – Preise, Belegungsplan, Kontakt

### 3.5 Sponsoren, Spender, Förderer
*„Lohnt sich die Unterstützung?“*

- Was macht der Verein, wie viele Mitglieder / Jugendliche?
- **Sponsoring-Möglichkeiten** (Banden, Trikots, Anhänger, Programmheft)
- Spendenkonto, Hinweis auf Gemeinnützigkeit und Spendenquittung
- Wofür wird das Geld verwendet? (aktuelles Projekt)
- Sichtbare Danke-Seite mit Logos der Unterstützer

### 3.6 Presse, Gemeinde, andere Vereine
*„Wen spreche ich an?“*

- Ansprechpartner Öffentlichkeitsarbeit / Vorstand
- Kurzporträt des Vereins, Gründungsjahr, Mitgliederzahl
- Logo / Pressefotos zum Download
- Links zu Dachverbänden (Sportkreis, Sängerkreis, Odenwaldklub, Kreisfeuerwehrverband)

### 3.7 Die 5 wichtigsten Fragen auf einen Blick

Wenn nur die Startseite gelesen wird, sollte sie diese Fragen beantworten:

1. **Was** ist das für ein Verein? (ein Satz)
2. **Was** kann ich hier machen? (Angebote)
3. **Wann und wo?** (Zeiten + Adresse)
4. **Was kostet es?**
5. **Wen frage ich?** (Kontakt)

---

## 4. Vorschlag für eine Seitenstruktur

```
Startseite
│  ├─ Kurz: Wer wir sind (1–2 Sätze) + Foto
│  ├─ Nächste Termine (3–5)
│  ├─ Neueste Meldungen (3)
│  └─ Buttons: „Probetraining / Mitmachen“ · „Kontakt“
│
├─ Angebote (je Abteilung / Gruppe eine Seite)
│     Beschreibung · Zielgruppe · Zeiten · Ort · Ansprechpartner · Fotos
│
├─ Termine & Veranstaltungen
│     Kalender / Liste · Jahresplan (auch als PDF) · Ergebnisse / Spielplan-Links
│
├─ Aktuelles (News & Berichte)
│
├─ Mitmachen
│     ├─ Mitglied werden (Beiträge, Antrag online + PDF)
│     ├─ Probetraining / Schnuppern
│     ├─ Ehrenamt & Helfer
│     └─ Jugend (inkl. Kinderschutz)
│
├─ Verein
│     ├─ Über uns & Chronik
│     ├─ Vorstand & Ansprechpartner
│     ├─ Vereinsheim / Anlage / Vermietung
│     ├─ Sponsoren & Förderer · Spenden
│     └─ Downloads (Satzung, Beitragsordnung, Formulare)
│
├─ Kontakt & Anfahrt (Adresse, Karte per Zwei-Klick, Funktionsadressen)
│
└─ Footer auf jeder Seite: Impressum · Datenschutz · (Barrierefreiheit) · Social-Media-Links
```

### Checkliste vor dem Livegang

- [ ] Impressum vollständig (Vorstand, Registergericht + VR-Nummer, E-Mail + Telefon, § 18 MStV)
- [ ] Datenschutzerklärung passt zu den tatsächlich genutzten Diensten; richtige Aufsichtsbehörde (HE / BY / BW)
- [ ] HTTPS aktiv
- [ ] AVV mit dem Hoster abgeschlossen
- [ ] Schriften lokal, keine direkt eingebetteten Google-Maps/YouTube-Inhalte, kein Tracking ohne Einwilligung
- [ ] Für alle Fotos: Rechte des Fotografen + Einwilligung der abgebildeten Personen (bei Kindern: Eltern)
- [ ] Funktions-E-Mail-Adressen statt privater Kontaktdaten
- [ ] Beiträge, Zeiten und Orte sind aktuell
- [ ] Auf dem Handy getestet, Bilder mit Alternativtext
- [ ] Zuständigkeit für die Pflege festgelegt

---

## 5. Quellen

**Rechtliches**

- [e-recht24: Rechtssichere Website für Vereine](https://www.e-recht24.de/datenschutz/13467-rechtssichere-website-fuer-vereine.html)
- [e-recht24: Impressum eingetragener Verein](https://www.e-recht24.de/impressum/6520-impressum-eingetragener-verein-ev.html)
- [ARAG: Impressum für Vereine](https://www.arag.de/vereinsversicherung/sicheres-impressum-fuer-vereine/)
- [Deutsches Ehrenamt: Impressumspflicht für Vereine](https://deutsches-ehrenamt.de/vereinsrecht-fuehrung/vereinsorganisation/impressumspflicht-von-vereinen/)
- [Muster-Impressum für einen e. V.](https://muster-impressum.de/vorlagen/musterimpressum-fuer-einen-eingetragenen-verein-e-v/)
- [Baker Tilly: Änderungen bei Datenschutz, Impressum, Barrierefreiheit](https://www.bakertilly.de/en/post/key-changes-regarding-data-protection-legal-notice-and-accessibility)
- [LfD Niedersachsen: Google Fonts lokal einbinden](https://www.lfd.niedersachsen.de/startseite/infothek/presseinformationen/abmahnungen-zu-datenschutzverstossen-auf-webseiten-vermeiden-google-fonts-lokal-einbinden-217509.html)
- [LSB Sachsen-Anhalt: Abmahnwelle wegen Google-Einbindung](https://www.lsb-sachsen-anhalt.de/aktuelles/detailansicht/abmahnwelle-wegen-fehlerhafter-einbindung-von-google)
- [KSB Wittenberg: Abmahnung wegen Google Maps auf der Vereinswebsite](https://www.ksb-wittenberg.de/aktuelles/abmahnung-wegen-google-maps-auf-der-vereinswebsite.html)
- [LfDI Baden-Württemberg: FAQ Veröffentlichung von Fotos für Vereine](https://www.baden-wuerttemberg.datenschutz.de/faq-veroeffentlichung-von-fotos-speziell-fuer-vereine/)
- [Datenschutz Saarland: Veröffentlichung von Fotoaufnahmen im Verein (PDF)](https://www.datenschutz.saarland.de/fileadmin/user_upload/uds/alle_Dateien_und_Ordner_bis_2025/themen/Veroeffentlichung-Fotos-Verein.pdf)
- [ARAG: Bildrechte im Sportverein](https://www.arag.de/vereinsversicherung/sportverein-bildrechte-dsgvo/)
- [ClubDesk: BFSG – digitale Barrierefreiheit für Vereine](https://www.clubdesk.de/de/vereinswissen/barrierefreiheitsstaerkungsgesetz-bfsg-und-bafg-digitale-barrierefreiheit-fuer-vereine)
- [Flick Gocke Schaumburg: BFSG – müssen gemeinnützige Organisationen handeln?](https://www.fgs.de/en/news-and-insights/blog/detail/barrierefreiheitsstaerkungsgesetz-bfsg-muessen-gemeinnuetzige-organisationen-jetzt-handeln)
- [Digital vereint (Bayern): Wann muss die Webseite barrierefrei sein?](https://digital-vereint.de/aktuelles/obacht-vor-panik-wann-muss-die-webseite-barrierefrei-sein/)

**Vereine im Odenwald**

- [Odenwaldklub e.V.](https://www.odenwaldklub.de/) · [Mitgliedschaft](https://www.odenwaldklub.de/mitgliedschaft/) · [Ortsgruppen](https://www.odenwaldklub.de/ortsgruppen/) · [Wanderheime](https://www.odenwaldklub.de/wanderheime/)
- [TSG Bad König 1863 e.V.](https://tsg-badkoenig.de/) · [Trainingskalender](https://tsg-badkoenig.de/trainingskalender)
- [TSV Günterfürst 1909 e.V.](https://tsv-guenterfuerst.de/) · [Verein](https://tsv-guenterfuerst.de/verein/) · [Chronik](https://tsv-guenterfuerst.de/verein/chronik/)
- [SV Fürth 1925 DJK e.V.](https://www.svfuerth.de/home) · [Verein](https://www.svfuerth.de/verein) · [Jugend-Pinnwand](https://www.svfuerth.de/jugendinfopinnwand)
- [Odenwald Hilft e.V.](https://odenwald-hilft.de/) · [Mitglied werden](https://odenwald-hilft.de/mitglied-werden)
- [Bayerischer Odenwald e.V.](https://www.bayerischer-odenwald.de/bayerischer-odenwald-ev)
- [Jugendfeuerwehr Odenwaldkreis](https://www.jf-odenwaldkreis.de/)
- [Freiwillige Feuerwehr Buchen (Odenwald)](https://www.feuerwehr-buchen.de/)
- [Sportkreis Odenwald – Vereinssuche](https://sportkreis-odenwald.de/index.php/vereine/vereinssuche)
- [Kreisverwaltung Odenwaldkreis – Ehrenamt und Vereine](https://www.odenwaldkreis.de/de/projekte/ehrenamt-und-vereine/)
