#!/usr/bin/env python3
"""
Statische Prüfung aller erzeugten HTML-Seiten (nur Python-Standardbibliothek):

  - interne Links und Ressourcen existieren (inkl. Anker #id)
  - genau eine <h1>, lang-Attribut, <title>, Meta-Description, canonical, hreflang
  - IDs pro Seite eindeutig, aria-describedby/aria-controls/for verweisen auf vorhandene IDs
  - jedes <img> hat alt, jede Tabelle hat <caption> und <th>
  - keine externen Skripte, Stylesheets oder Schriften

Aufruf:  python3 tools/tests/check_static.py
"""
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[2]


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.dup_ids = set(), set()
        self.links, self.refs = [], []
        self.h1 = 0
        self.lang = None
        self.title = False
        self.meta = {}
        self.link_rels = []
        self.imgs_without_alt = 0
        self.tables = self.captions = self.ths = 0
        self.external = []
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            (self.dup_ids if a["id"] in self.ids else self.ids).add(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "h1":
            self.h1 += 1
        if tag == "title":
            self._in_title = True
        if tag == "meta" and a.get("name"):
            self.meta[a["name"]] = a.get("content", "")
        if tag == "link":
            self.link_rels.append((a.get("rel"), a.get("hreflang"), a.get("href")))
            if a.get("rel") == "stylesheet" and a.get("href", "").startswith("http"):
                self.external.append(a["href"])
        if tag == "script" and a.get("src", "").startswith("http"):
            self.external.append(a["src"])
        if tag == "a" and "href" in a:
            self.links.append(a["href"])
        if tag in ("link", "script", "img") and (a.get("href") or a.get("src")):
            if tag != "link" or a.get("rel") in ("stylesheet", "icon"):
                self.links.append(a.get("href") or a.get("src"))
        if tag == "img" and "alt" not in a:
            self.imgs_without_alt += 1
        if tag == "table":
            self.tables += 1
        if tag == "caption":
            self.captions += 1
        if tag == "th":
            self.ths += 1
        for attr in ("aria-describedby", "aria-controls", "aria-labelledby"):
            if attr in a:
                self.refs += [(attr, r) for r in a[attr].split()]
        if tag == "label" and "for" in a:
            self.refs.append(("for", a["for"]))

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title and data.strip():
            self.title = True


def parse(path):
    p = Page()
    p.feed(path.read_text(encoding="utf-8"))
    return p


def main():
    files = sorted(list(ROOT.glob("de/*.html")) + list(ROOT.glob("en/*.html")) + list(ROOT.glob("ru/*.html"))
                   + [ROOT / "index.html"])
    parsed = {f: parse(f) for f in files}
    errors = []
    checked_links = 0
    for f, p in parsed.items():
        rel = f.relative_to(ROOT)
        is_lang_page = rel.parts[0] in ("de", "en", "ru")
        if p.h1 != 1:
            errors.append(f"{rel}: {p.h1} <h1> statt genau einer")
        if not p.lang:
            errors.append(f"{rel}: lang-Attribut fehlt")
        elif is_lang_page and p.lang != rel.parts[0]:
            errors.append(f"{rel}: lang='{p.lang}' passt nicht zum Ordner")
        if not p.title:
            errors.append(f"{rel}: <title> fehlt oder leer")
        if not p.meta.get("description"):
            errors.append(f"{rel}: Meta-Description fehlt")
        if not any(r[0] == "canonical" for r in p.link_rels):
            errors.append(f"{rel}: canonical fehlt")
        hreflangs = {r[1] for r in p.link_rels if r[0] == "alternate"}
        if not {"de", "en", "ru", "x-default"} <= hreflangs:
            errors.append(f"{rel}: hreflang unvollständig ({sorted(h for h in hreflangs if h)})")
        if p.dup_ids:
            errors.append(f"{rel}: doppelte IDs {sorted(p.dup_ids)}")
        for attr, ref in p.refs:
            if ref not in p.ids:
                errors.append(f"{rel}: {attr}='{ref}' verweist auf keine vorhandene ID")
        if p.imgs_without_alt:
            errors.append(f"{rel}: {p.imgs_without_alt} Bild(er) ohne alt")
        if p.tables and (p.captions < p.tables or not p.ths):
            errors.append(f"{rel}: Tabelle ohne <caption> oder <th>")
        if p.external:
            errors.append(f"{rel}: externe Ressourcen {p.external}")
        for href in p.links:
            u = urlparse(href)
            if u.scheme in ("http", "https", "mailto", "tel", "data", "blob") or href.startswith("javascript:"):
                continue
            checked_links += 1
            target = (f.parent / unquote(u.path)).resolve() if u.path else f
            if not target.exists():
                errors.append(f"{rel}: toter Link {href}")
                continue
            if u.fragment and u.fragment != "top" and target.suffix == ".html":
                tp = parsed.get(target) or parse(target)
                if u.fragment not in tp.ids:
                    errors.append(f"{rel}: Anker #{u.fragment} fehlt in {target.relative_to(ROOT)}")
            if u.fragment == "top" and "top" not in (parsed.get(target) or parse(target)).ids:
                errors.append(f"{rel}: Anker #top fehlt")
    print(f"{len(files)} Seiten, {checked_links} interne Links/Ressourcen geprüft.")
    if errors:
        print(f"{len(errors)} Fehler:")
        for e in errors:
            print("  - " + e)
        sys.exit(1)
    print("Keine Fehler.")


if __name__ == "__main__":
    main()
