# Skills Lab e.V. – Website

Dreisprachige (DE/EN/RU), barrierefreie und datenschutzfreundliche Vereinswebsite.
Reines HTML, CSS und JavaScript, läuft ohne Server.

**Online ansehen (GitHub Pages):** https://reckssel.github.io/test/ – einmalig einschalten unter *Settings → Pages → Deploy from a branch → `versuch2` / `(root)` → Save*.

- **Ansehen:** `index.html` oder `de/index.html` im Browser öffnen
- **Texte ändern:** `i18n/*.json` · **Beiträge, Kurse, Termine, Bankdaten:** `data/*.json` · danach `python3 tools/build.py`
- **Vor der Veröffentlichung:** alle Platzhalter in `[eckigen Klammern]` ersetzen (Liste: `docs/03-dokumentation.md`, Anhang A)
- **Tests:** `cd tools/tests && npm install && npm test`

Ausführliche Dokumentation: [`docs/03-dokumentation.md`](docs/03-dokumentation.md) ·
Recherche: [`docs/01-recherche.md`](docs/01-recherche.md) · Konzept: [`docs/02-konzept.md`](docs/02-konzept.md)
