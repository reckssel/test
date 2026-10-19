# Checkliste 2 – Website „Skills Lab e.V.“ auf GitHub Pages ansehen

Auftrag (Folgeauftrag): „Passe bitte die Ordnerstruktur an, dass ich mir das in Pages anschauen kann.“
Ziel: Die fertige Website aus `skills-lab/` soll über **GitHub Pages** im Browser erreichbar sein
(voraussichtlich unter `https://reckssel.github.io/test/`).

Repository: `reckssel/test` · Branch: `versuch2` · Stand: 2026-10-19
Legende: `- [ ]` offen · `- [x]` erledigt

---

## Phase 0 – Checkliste
- [x] Neue Checkliste `skills-lab/CHECKLISTE-2.md` angelegt (Checkliste 1 bleibt als Nachweis des ersten Auftrags unverändert)
- [ ] Freigabe der Checkliste durch den Nutzer

## Phase 1 – Auftrag verstehen
- [ ] Ziel in eigenen Worten festhalten (Website über GitHub Pages ansehen, nichts am Inhalt ändern)
- [ ] Ausgangslage prüfen: Standard-Branch des Repos, Sichtbarkeit (öffentlich/privat – Pages bei privaten Repos nur mit bezahltem GitHub-Plan), vorhandene Dateien im Repo-Wurzelverzeichnis (`002_…`, `003_…`, `beispiel-webseite/`)
- [ ] Einschränkung festhalten: GitHub Pages veröffentlicht nur aus dem **Wurzelverzeichnis** oder aus **`/docs`** eines Branches – oder über einen **GitHub-Actions-Workflow**; ein Unterordner wie `skills-lab/` geht nicht direkt
- [ ] Mögliche Wege gegenüberstellen und einen empfehlen:
  - [ ] A: Website-Dateien ins Repo-Wurzelverzeichnis verschieben
  - [ ] B: Fertige Website zusätzlich nach `/docs` im Wurzelverzeichnis ausgeben
  - [ ] C: Ordnerstruktur behalten, Veröffentlichung von `skills-lab/` per GitHub-Actions-Workflow
- [ ] Annahmen dokumentieren (Branch für Pages, URL mit Unterpfad `/test/`)
- [ ] Rückfrage nur, wenn die Entscheidung beim Nutzer liegt (z. B. ob ältere Dateien verschoben werden dürfen)
- [ ] Zusammenfassung → **Stopp, Freigabe abwarten**

## Phase 2 – Recherche
- [ ] Aktuelle GitHub-Dokumentation zu Pages recherchieren: Veröffentlichungsquellen (Branch/Ordner, Actions), Projektseiten-URL mit Unterpfad, `.nojekyll`, 404-Seiten, Pages bei privaten Repos, Einrichtung in den Repository-Einstellungen
- [ ] Falls Weg C: offizieller Starter-Workflow für statische Seiten (`actions/upload-pages-artifact`, `actions/deploy-pages`) – aktuelle Versionen prüfen
- [ ] Prüfen, welche Stellen der Website einen Unterpfad nicht vertragen (bekannt: `404.html` mit absoluten Pfaden, `base_url` = `example.org`)
- [ ] Quellen (URLs) notieren; nicht abrufbare Seiten offen kennzeichnen
- [ ] Zusammenfassung → **Stopp, Freigabe abwarten**

## Phase 3 – Recherche-Dokumentation
- [ ] `skills-lab/docs/04-recherche-pages.md` anlegen: Auftrag, Vorgehen, Ergebnisse, Vergleich der Wege A/B/C (Tabelle), Erkenntnisse, Ableitung
- [ ] Zusammenfassung → **Stopp, Freigabe abwarten**

## Phase 4 – Konzept
- [ ] `skills-lab/docs/05-konzept-pages.md` anlegen: gewählter Weg mit Begründung, neue Ordnerstruktur (Baum), betroffene Dateien
- [ ] Anpassungen der Website für den Unterpfad festlegen:
  - [ ] `data/site.json` → `base_url` (z. B. `https://reckssel.github.io/test`)
  - [ ] `404.html`: Pfade so erzeugen, dass sie unter `/test/` funktionieren
  - [ ] `sitemap.xml`, `robots.txt`, canonical, hreflang, Open Graph, schema.org werden über den Build automatisch angepasst
  - [ ] `.nojekyll` anlegen
- [ ] Festlegen, was **nicht** veröffentlicht wird (`tools/`, `docs/`, `data/`, `i18n/`, Testausgaben)
- [ ] Anleitung für den Nutzer skizzieren: Pages in den Repository-Einstellungen aktivieren (das kann ich nicht für dich tun)
- [ ] Zusammenfassung → **Stopp, Freigabe abwarten**

## Phase 5 – Umsetzung
Voraussetzung: Phasen 3 und 4 freigegeben.
- [ ] Ordnerstruktur nach Konzept anpassen (mit `git mv`, damit die Historie erhalten bleibt)
- [ ] Pfade in Pflegeskripten und Tests anpassen (`tools/build.py`, `tools/make_assets.cjs`, `tools/tests/*`), falls sich Orte ändern
- [ ] `base_url` setzen, Build ausführen (`python3 tools/build.py`)
- [ ] `404.html` für Unterpfad anpassen; `.nojekyll`
- [ ] Falls Weg C: Workflow `.github/workflows/pages.yml` anlegen
- [ ] Tests: `build.py --check`, `check_static.py`, Browser-Tests (76) – alle grün
- [ ] Zusätzlicher Test: Website unter einem Unterpfad `/test/` lokal ausliefern und prüfen (Links, CSS, Skripte, Sprachweiche, 404)
- [ ] Commit und Push auf `versuch2`
- [ ] Zusammenfassung → **Stopp, Freigabe abwarten**

## Phase 6 – Dokumentation
- [ ] `docs/03-dokumentation.md` aktualisieren: Projektstruktur, Abschnitt „Veröffentlichen“ (GitHub Pages Schritt für Schritt), Entscheidungsprotokoll, Platzhalterliste (`base_url`)
- [ ] `README.md` aktualisieren (Link zur Pages-Adresse)
- [ ] Schritt-für-Schritt-Anleitung für dich: Pages aktivieren, Adresse aufrufen, typische Fehler (404, privates Repo, Branch-Auswahl)
- [ ] Gesamtfazit: was geändert wurde, wo die Dateien liegen, Annahmen, was offen bleibt
- [ ] Abschlussprüfung: kein Punkt dieser Checkliste offen
- [ ] **Stopp, Abschluss**

## Laufend
- [ ] Nach jeder Phase committen und auf Branch `versuch2` pushen
