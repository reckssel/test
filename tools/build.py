#!/usr/bin/env python3
"""
Pflegeskript für die Website „Skills Lab e.V.“

Erzeugt aus den zentralen Daten (data/*.json) und Übersetzungen (i18n/*.json)
die fertigen, statischen HTML-Seiten in /de, /en und /ru sowie index.html,
404.html, sitemap.xml und robots.txt.

Die Website selbst braucht dieses Skript NICHT, um zu laufen – es wird nur
benötigt, wenn Texte, Beträge, Kurse oder Termine geändert werden.

Aufruf (Python 3.8+, nur Standardbibliothek):

    python3 tools/build.py            # alles erzeugen
    python3 tools/build.py --check    # nur Übersetzungen und Daten prüfen
"""

import datetime as dt
import html
import json
import re
from urllib.parse import quote, urlparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATES = ROOT / "tools" / "templates"

# --------------------------------------------------------------------------
# Seitenliste: ID, Dateiname je Sprache, Skripte, Aufnahme in die Sitemap
# --------------------------------------------------------------------------
PAGES = [
    ("home",                 {"de": "index.html",                 "en": "index.html",                 "ru": "index.html"}),
    ("about",                {"de": "ueber-uns.html",             "en": "about.html",                 "ru": "about.html"}),
    ("courses",              {"de": "angebote.html",              "en": "courses.html",               "ru": "courses.html"}),
    ("dates",                {"de": "termine.html",               "en": "dates.html",                 "ru": "dates.html"}),
    ("association",          {"de": "verein.html",                "en": "association.html",           "ru": "association.html"}),
    ("statutes",             {"de": "satzung.html",               "en": "statutes.html",              "ru": "statutes.html"}),
    ("fees",                 {"de": "beitragsordnung.html",       "en": "fees.html",                  "ru": "fees.html"}),
    ("membership",           {"de": "mitglied-werden.html",       "en": "membership.html",            "ru": "membership.html"}),
    ("donate",               {"de": "spenden.html",               "en": "donate.html",                "ru": "donate.html"}),
    ("contact",              {"de": "kontakt.html",               "en": "contact.html",               "ru": "contact.html"}),
    ("imprint",              {"de": "impressum.html",             "en": "legal-notice.html",          "ru": "legal-notice.html"}),
    ("privacy",              {"de": "datenschutz.html",           "en": "privacy.html",               "ru": "privacy.html"}),
    ("cookies",              {"de": "cookie-einstellungen.html",  "en": "cookie-settings.html",       "ru": "cookie-settings.html"}),
    ("accessibility",        {"de": "barrierefreiheit.html",      "en": "accessibility.html",         "ru": "accessibility.html"}),
    ("newsletter_confirmed", {"de": "newsletter-bestaetigt.html", "en": "newsletter-confirmed.html",  "ru": "newsletter-confirmed.html"}),
]
SLUGS = {pid: slugs for pid, slugs in PAGES}

MAIN_NAV = ["about", "courses", "dates", "association", "contact"]
FOOTER_ASSOC = ["about", "association", "statutes", "fees", "membership", "donate"]
FOOTER_LEGAL = ["imprint", "privacy", "cookies", "accessibility"]
TRANSLATED_LEGAL = {"statutes", "fees", "imprint", "privacy"}  # Hinweis „verbindlich ist Deutsch“
PAGE_SCRIPTS = {
    "home": ["forms"],
    "membership": ["iban", "forms"],
    "donate": ["vendor/qrcode", "iban", "girocode", "payments", "forms"],  # Reihenfolge wichtig
    "contact": ["forms"],
}
ASSOC_SUBNAV = ["association", "statutes", "fees"]
HOME_DATES = 3  # Anzahl „Nächste Termine“ auf der Startseite


# --------------------------------------------------------------------------
# Laden und Prüfen
# --------------------------------------------------------------------------
def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def key_paths(obj, prefix=""):
    """Alle Schlüsselpfade eines verschachtelten Objekts (Listen nach Länge)."""
    paths = set()
    if isinstance(obj, dict):
        for k, v in obj.items():
            p = f"{prefix}.{k}" if prefix else k
            paths.add(p)
            paths |= key_paths(v, p)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            p = f"{prefix}[{i}]"
            paths.add(p)
            paths |= key_paths(v, p)
    return paths


def check_translations(i18n):
    """Alle Sprachen müssen dieselben Schlüssel haben (Ausnahme: leere Hinweise im Deutschen)."""
    errors = []
    base = key_paths(i18n["de"])
    for lang, data in i18n.items():
        if lang == "de":
            continue
        paths = key_paths(data)
        for missing in sorted(base - paths):
            errors.append(f"[{lang}] fehlt: {missing}")
        for extra in sorted(paths - base):
            errors.append(f"[{lang}] zusätzlich (nicht im Deutschen): {extra}")

    def walk(obj, lang, prefix=""):
        if isinstance(obj, dict):
            for k, v in obj.items():
                walk(v, lang, f"{prefix}.{k}" if prefix else k)
        elif isinstance(obj, list):
            for i, v in enumerate(obj):
                walk(v, lang, f"{prefix}[{i}]")
        elif isinstance(obj, str) and not obj.strip():
            # Im Deutschen dürfen Übersetzungshinweise leer sein
            if not (lang == "de" and prefix in ("common.translation_notice", "common.binding_german")):
                errors.append(f"[{lang}] leerer Text: {prefix}")

    for lang, data in i18n.items():
        walk(data, lang)
    return errors


def check_data(site, fees, courses, events, i18n):
    errors = []
    langs = site["languages"]
    for t in fees["types"]:
        for lang in langs:
            if not t["label"].get(lang) or not t["note"].get(lang):
                errors.append(f"beitraege.json: '{t['id']}' ohne Text für {lang}")
    course_ids = {c["id"] for c in courses["courses"]}
    for c in courses["courses"]:
        for field in ("title", "text", "duration", "audience"):
            for lang in langs:
                if not c[field].get(lang):
                    errors.append(f"angebote.json: '{c['id']}'.{field} ohne Text für {lang}")
    for e in events["events"]:
        if e["course"] not in course_ids:
            errors.append(f"termine.json: '{e['id']}' verweist auf unbekannten Kurs '{e['course']}'")
        if e["location"] not in events["locations"]:
            errors.append(f"termine.json: '{e['id']}' verweist auf unbekannten Ort '{e['location']}'")
        try:
            dt.date.fromisoformat(e["date"])
        except ValueError:
            errors.append(f"termine.json: '{e['id']}' hat ein ungültiges Datum")
        if not 0 <= e["seats_free"] <= e["seats_total"]:
            errors.append(f"termine.json: '{e['id']}' hat unplausible Platzzahlen")
    if not iban_valid(site["bank"]["iban"]):
        errors.append("site.json: bank.iban hat keine gültige Prüfsumme")
    return errors


def iban_valid(iban):
    s = re.sub(r"\s+", "", iban).upper()
    if not re.fullmatch(r"[A-Z]{2}\d{2}[A-Z0-9]{10,30}", s):
        return False
    s = s[4:] + s[:4]
    num = "".join(str(int(ch, 36)) for ch in s)
    return int(num) % 97 == 1


# --------------------------------------------------------------------------
# Hilfsfunktionen
# --------------------------------------------------------------------------
def esc(s):
    return html.escape(str(s), quote=True)


def dig(obj, path):
    for part in path.split("."):
        obj = obj[part]
    return obj


def iban_groups(iban):
    s = re.sub(r"\s+", "", iban)
    return " ".join(s[i:i + 4] for i in range(0, len(s), 4))


class Ctx:
    """Alles, was beim Erzeugen einer Seite in einer Sprache gebraucht wird."""

    def __init__(self, b, lang, page):
        self.b = b
        self.lang = lang
        self.page = page
        self.T = b.i18n[lang]

    # Texte -----------------------------------------------------------------
    def t(self, path):
        return dig(self.T, path)

    def p(self, path, **extra):
        """Text holen und Platzhalter ersetzen."""
        return self.fill(self.t(path), **extra)

    def fill(self, text, **extra):
        site = self.b.site

        def repl(m):
            kind, val = m.group(1), m.group(2)
            if kind == "p":
                return self.url(val)
            if kind == "de":
                return self.url(val, "de")
            if kind == "site":
                return esc(dig(site, val))
            return m.group(0)

        text = re.sub(r"\{(p|de|site):([A-Za-z0-9_.]+)\}", repl, text)
        tokens = {
            "year": str(dt.date.fromisoformat(site["build_date"]).year),
            "address": self.address_html(),
            "board": self.board_html(),
            "email_link": f"<a href='mailto:{esc(site['org']['email'])}'>{esc(site['org']['email'])}</a>",
            "fee_min": self.money(min(t["amount"] for t in self.b.fees["types"])),
            "de_link": self.url(self.page, "de"),
        }
        tokens.update(extra)
        for k, v in tokens.items():
            text = text.replace("{" + k + "}", str(v))
        return text

    # Adressen und Links -----------------------------------------------------
    def url(self, page_id, lang=None):
        lang = lang or self.lang
        slug = SLUGS[page_id][lang]
        return slug if lang == self.lang else f"../{lang}/{slug}"

    def address_html(self):
        o = self.b.site["org"]
        return f"{esc(o['name'])}<br>{esc(o['street'])}<br>{esc(o['zip'])} {esc(o['city'])}"

    def board_html(self):
        roles = self.t("pages.association.roles")
        items = "".join(f"<li>{esc(roles[m['role']])}: {esc(m['name'])}</li>" for m in self.b.site["org"]["board"])
        return f"<ul>{items}</ul>"

    # Formatierung ----------------------------------------------------------
    def money(self, n):
        txt = f"{n:,}".replace(",", " " if self.lang == "ru" else ("." if self.lang == "de" else ","))
        return self.t("common.money_pattern").replace("{n}", txt)

    def date(self, iso):
        d = dt.date.fromisoformat(iso)
        return (self.t("common.date_pattern")
                .replace("{wd}", self.t("common.weekdays")[d.weekday()])
                .replace("{d}", f"{d.day:02d}" if self.lang != "en" else str(d.day))
                .replace("{m}", f"{d.month:02d}")
                .replace("{mon}", self.t("common.months")[d.month - 1])
                .replace("{y}", str(d.year)))

    def time(self, start, end):
        return self.t("common.time_pattern").replace("{start}", start).replace("{end}", end)

    def course(self, cid):
        return next(c for c in self.b.courses["courses"] if c["id"] == cid)


# --------------------------------------------------------------------------
# Wiederverwendbare Bausteine
# --------------------------------------------------------------------------
def notice(content, accent=False):
    cls = "notice notice--accent" if accent else "notice"
    return f'<div class="{cls}"><p>{content}</p></div>'


def page_head(c, h1=None, lead=None):
    h1 = h1 or c.t(f"pages.{c.page}.h1")
    lead_html = f'<p class="lead">{lead}</p>' if lead else ""
    return f'<div class="container page-head"><h1>{h1}</h1>{lead_html}</div>'


def subnav(c):
    items = []
    for pid in ASSOC_SUBNAV:
        cur = ' aria-current="page"' if pid == c.page else ""
        items.append(f'<li><a href="{c.url(pid)}"{cur}>{esc(c.t("nav." + pid))}</a></li>')
    return f'<ul class="subnav" aria-label="{esc(c.t("nav.association"))}">{"".join(items)}</ul>'


def label_html(c, text, required):
    req = ' <span class="req" aria-hidden="true">*</span>' if required else ""
    return f"{text}{req}"


def field(c, form, name, label, type_="text", required=False, autocomplete=None, hint=None,
          extra="", value=None, validate=None, inputmode=None):
    fid = f"{form}-{name}"
    described = []
    hint_html = ""
    if hint:
        hint_html = f'<span class="hint" id="{fid}-hint">{hint}</span>'
        described.append(f"{fid}-hint")
    described.append(f"{fid}-error")
    attrs = [f'id="{fid}"', f'name="{name}"']
    if type_ != "textarea":
        attrs.append(f'type="{type_}"')
    if required:
        attrs.append("required")
    if autocomplete:
        attrs.append(f'autocomplete="{autocomplete}"')
    if validate:
        attrs.append(f'data-validate="{validate}"')
    if inputmode:
        attrs.append(f'inputmode="{inputmode}"')
    if value is not None and type_ != "textarea":
        attrs.append(f'value="{esc(value)}"')
    attrs.append(f'aria-describedby="{" ".join(described)}"')
    if extra:
        attrs.append(extra)
    a = " ".join(attrs)
    control = f"<textarea {a}></textarea>" if type_ == "textarea" else f"<input {a}>"
    return (f'<div class="field"><label for="{fid}">{label_html(c, label, required)}</label>'
            f'{hint_html}{control}<span class="error-text" id="{fid}-error"></span></div>')


def select(c, form, name, label, options, required=False, placeholder=None, extra=""):
    fid = f"{form}-{name}"
    opts = []
    if placeholder:
        opts.append(f'<option value="">{esc(placeholder)}</option>')
    for value, text in options:
        opts.append(f'<option value="{esc(value)}">{esc(text)}</option>')
    req = " required" if required else ""
    return (f'<div class="field"><label for="{fid}">{label_html(c, label, required)}</label>'
            f'<select id="{fid}" name="{name}"{req} aria-describedby="{fid}-error" {extra}>{"".join(opts)}</select>'
            f'<span class="error-text" id="{fid}-error"></span></div>')


def checkbox(c, form, name, label_html_text, required=False, extra=""):
    fid = f"{form}-{name}"
    req = " required" if required else ""
    star = ' <span class="req" aria-hidden="true">*</span>' if required else ""
    return (f'<div class="check"><input type="checkbox" id="{fid}" name="{name}" value="{esc(c.t("forms.yes"))}"{req} '
            f'aria-describedby="{fid}-error" {extra}><label for="{fid}">{label_html_text}{star}</label>'
            f'<span class="error-text" id="{fid}-error"></span></div>')


def date_group(c, form, name, legend, required=False, autocomplete_prefix="bday", first_year=1900):
    """Datum als drei Auswahllisten (Tag · Monat · Jahr) statt <input type="date"> – angenehmer für Geburtsdaten,
    unabhängig vom Browser und gut per Tastatur und Screenreader bedienbar.
    Jahre absteigend vom Jahr des Builds bis first_year (Tastatur: „1985“ tippen springt direkt dorthin)."""
    fid = f"{form}-{name}"
    req = " required" if required else ""
    last_year = dt.date.fromisoformat(c.b.site["build_date"]).year
    days = "".join(f'<option value="{d}">{d}</option>' for d in range(1, 32))
    months = "".join(f'<option value="{i + 1:02d}">{esc(m)}</option>' for i, m in enumerate(c.t("common.months_long")))
    years = "".join(f'<option value="{y}">{y}</option>' for y in range(last_year, first_year - 1, -1))

    def part(key, label, options):
        return (f'<div class="date-part date-part--{key}"><label for="{fid}-{label}">{esc(c.t("forms." + key))}</label>'
                f'<select id="{fid}-{label}" name="{name}_{label}" autocomplete="{autocomplete_prefix}-{key}" data-date-part="{key}"{req}>'
                f'<option value="">–</option>{options}</select></div>')

    return (f'<fieldset class="field date-group" data-date-group="{name}" aria-describedby="{fid}-hint {fid}-error">'
            f'<legend class="label">{label_html(c, legend, required)}</legend>'
            f'<span class="hint" id="{fid}-hint">{esc(c.t("forms.birthdate_hint"))}</span>'
            f'<div class="date-parts">'
            + part("day", "tag", days)
            + part("month", "monat", months)
            + part("year", "jahr", years)
            + f'</div>'
            f'<span class="date-age small muted" id="{fid}-age" aria-live="polite"></span>'
            f'<span class="error-text" id="{fid}-error"></span></fieldset>')


def radios(c, form, name, legend, options, required=False, checked=None, cls="", extra=""):
    items = []
    for value, text in options:
        rid = f"{form}-{name}-{value}"
        chk = " checked" if value == checked else ""
        req = " required" if required else ""
        items.append(f'<div class="check"><input type="radio" id="{rid}" name="{name}" value="{esc(value)}"{chk}{req} {extra}>'
                     f'<label for="{rid}">{esc(text)}</label></div>')
    return (f'<fieldset class="field {cls}" aria-describedby="{form}-{name}-error"><legend class="label">{label_html(c, legend, required)}</legend>'
            f'{"".join(items)}<span class="error-text" id="{form}-{name}-error"></span></fieldset>')


def form_open(c, form_id, extra_cls=""):
    site = c.b.site
    endpoint = site["forms"].get(form_id, "")
    if endpoint:
        action = esc(endpoint)
        enc = ""
    else:
        subject = c.t("forms.mail_subject").replace("{form}", c.t(f"forms.form_names.{form_id}"))
        action = esc(f"mailto:{site['org']['email']}?subject={quote(subject)}")
        enc = ' enctype="text/plain"'
    return (f'<form class="form {extra_cls}" id="form-{form_id}" data-form="{form_id}" data-endpoint="{esc(endpoint)}" '
            f'action="{action}" method="post"{enc}>'
            f'<div class="error-summary" id="form-{form_id}-summary" tabindex="-1" hidden></div>'
            f'<p class="small muted">{esc(c.t("forms.required_note"))}</p>')


def honeypot(c, form):
    return (f'<div class="hp" aria-hidden="true"><label for="{form}-website">{esc(c.t("forms.honeypot"))}</label>'
            f'<input type="text" id="{form}-website" name="website" tabindex="-1" autocomplete="off"></div>')


def form_close(c, form_id, submit_key):
    return (f'<button type="submit" class="btn">{esc(c.t("forms." + submit_key))}</button>'
            f'<div class="form-status" id="form-{form_id}-status" role="status" aria-live="polite"></div></form>')


def privacy_check(c, form, key="forms.privacy_consent"):
    return checkbox(c, form, "datenschutz", c.p(key), required=True)


def fees_table(c, caption_key="pages.fees.table_caption"):
    rows = []
    for t in c.b.fees["types"]:
        amount = c.money(t["amount"])
        if t["min"]:
            amount = f'{esc(c.t("common.from"))} {amount}'
        rows.append(
            f'<tr role="row"><th scope="row" role="rowheader">{esc(t["label"][c.lang])}</th>'
            f'<td class="num" role="cell" data-label="{esc(c.t("pages.fees.col_amount"))}">{amount}</td>'
            f'<td role="cell" data-label="{esc(c.t("pages.fees.col_note"))}">{esc(t["note"][c.lang])}</td></tr>')
    head = (f'<thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">{esc(c.t("pages.fees.col_type"))}</th>'
            f'<th scope="col" role="columnheader" class="num">{esc(c.t("pages.fees.col_amount"))}</th>'
            f'<th scope="col" role="columnheader">{esc(c.t("pages.fees.col_note"))}</th></tr></thead>')
    return (f'<div class="table-wrap"><table class="data-table data-table--stack" role="table">'
            f'<caption>{esc(c.t(caption_key))}</caption>{head}<tbody role="rowgroup">{"".join(rows)}</tbody></table>'
            f'<p class="small muted">{esc(c.t("pages.fees.amounts_placeholder"))}</p></div>')


def seats_html(c, e):
    n, m = e["seats_free"], e["seats_total"]
    if n == 0:
        return f'<span class="seats--none">{esc(c.t("common.seats.none"))}</span>'
    if n <= 3:
        return f'<span class="seats--few">{esc(c.t("common.seats.few").replace("{n}", str(n)))}</span>'
    return esc(c.t("common.seats.free").replace("{n}", str(n)).replace("{m}", str(m)))


def upcoming(b):
    today = b.site["build_date"]
    return sorted((e for e in b.events["events"] if e["date"] >= today), key=lambda e: (e["date"], e["start"]))


def legal_sections(c, sections, numbered=False, with_table=False):
    out = []
    for s in sections:
        paras = [c.fill(p) for p in s["paras"]]
        if numbered and len(paras) > 1:
            body = '<ol class="paras">' + "".join(f"<li>{p}</li>" for p in paras) + "</ol>"
        else:
            body = "".join(f"<div class='para'>{p}</div>" if p.startswith("<ul") else f"<p>{p}</p>" for p in paras)
        if with_table and s.get("table"):
            body += fees_table(c)
        out.append(f'<section id="{s["id"]}" aria-labelledby="{s["id"]}-h"><h2 id="{s["id"]}-h">{esc(s["title"])}</h2>{body}'
                   f'<p class="back-top"><a href="#top">{esc(c.t("common.back_to_top"))}</a></p></section>')
    return "".join(out)


def toc(c, sections):
    items = "".join(f'<li><a href="#{s["id"]}">{esc(s["title"])}</a></li>' for s in sections)
    return (f'<nav class="toc" aria-labelledby="toc-h"><h2 id="toc-h">{esc(c.t("common.toc"))}</h2>'
            f'<ol>{items}</ol></nav>')


def translation_note(c):
    if c.lang == "de":
        return ""
    return notice(c.p("common.translation_notice"))


# --------------------------------------------------------------------------
# Kopf, Fuß, Einwilligung
# --------------------------------------------------------------------------
def header(c):
    langs = []
    for lang in c.b.site["languages"]:
        T = c.b.i18n[lang]["meta"]
        cur = ' aria-current="true"' if lang == c.lang else ""
        langs.append(f'<li><a href="{c.url(c.page, lang) if lang != c.lang else SLUGS[c.page][lang]}" lang="{lang}" hreflang="{lang}" '
                     f'data-lang="{lang}"{cur}><span aria-hidden="true">{T["short"]}</span>'
                     f'<span class="visually-hidden">{esc(T["name"])}</span></a></li>')
    nav = []
    for pid in MAIN_NAV:
        cur = ' aria-current="page"' if pid == c.page or (pid == "association" and c.page in ("statutes", "fees")) else ""
        nav.append(f'<li><a href="{c.url(pid)}"{cur}>{esc(c.t("nav." + pid))}</a></li>')
    member_cur = ' aria-current="page"' if c.page == "membership" else ""
    donate_cur = ' aria-current="page"' if c.page == "donate" else ""
    return f'''<header class="site-header" id="top">
<div class="container header-inner">
<a class="logo" href="{c.url("home")}" aria-label="{esc(c.t("common.home_link"))}">{logo_inline()}</a>
<button type="button" class="btn btn--outline btn--small menu-toggle" aria-expanded="false" aria-controls="main-nav" data-label-open="{esc(c.t("common.menu"))}" data-label-close="{esc(c.t("common.menu_close"))}">{esc(c.t("common.menu"))}</button>
<nav id="main-nav" class="main-nav" aria-label="{esc(c.t("common.nav_label"))}" data-open="false"><ul>{"".join(nav)}</ul></nav>
<div class="header-actions">
<nav aria-label="{esc(c.t("common.lang_label"))}"><ul class="lang-switch">{"".join(langs)}</ul></nav>
<div class="header-cta">
<a class="btn btn--outline btn--small" href="{c.url("membership")}"{member_cur}>{esc(c.t("common.cta_member"))}</a>
<a class="btn btn--accent btn--small" href="{c.url("donate")}"{donate_cur}>{esc(c.t("common.cta_donate"))}</a>
</div>
</div>
</div>
</header>'''


def logo_inline():
    """Text-Logo inline aus assets/logo.svg (Pfade), Farben über CSS-Variablen (hell/dunkel).
    Neues Logo: assets/logo.svg ersetzen (oder tools/make_logo.py anpassen) und Build erneut ausführen."""
    svg = (ROOT / "assets" / "logo.svg").read_text(encoding="utf-8")
    view_box = re.search(r'viewBox="([^"]+)"', svg).group(1)
    w, h = view_box.split()[2:]
    rect = re.search(r"<rect [^>]*?/>", svg)
    rect = re.sub(r'\sfill="[^"]*"', ' style="fill:var(--c-accent)"', rect.group(0)) if rect else ""
    path = re.search(r"<path [^>]*?/>", svg).group(0)
    path = re.sub(r'\sfill="[^"]*"', ' style="fill:var(--c-primary)"', path)
    height = 28
    width = round(float(w) * height / float(h))
    return (f'<svg aria-hidden="true" focusable="false" viewBox="{view_box}" width="{width}" height="{height}">'
            f'{rect}{path}</svg>')


def footer(c):
    o = c.b.site["org"]
    assoc = "".join(f'<li><a href="{c.url(p)}">{esc(c.t("nav." + p))}</a></li>' for p in FOOTER_ASSOC)
    legal = "".join(f'<li><a href="{c.url(p)}">{esc(c.t("nav." + p))}</a></li>' for p in FOOTER_LEGAL)
    return f'''<footer class="site-footer">
<div class="container">
<div class="footer-grid">
<div>
<h2>{esc(c.t("common.footer_contact"))}</h2>
<p>{esc(c.t("common.footer_about"))}</p>
<address>{c.address_html()}<br><a href="mailto:{esc(o["email"])}">{esc(o["email"])}</a><br>{esc(o["phone_display"])}</address>
</div>
<div><h2>{esc(c.t("common.footer_association"))}</h2><ul>{assoc}</ul></div>
<div><h2>{esc(c.t("common.footer_legal"))}</h2><ul>{legal}</ul></div>
</div>
<div class="footer-bottom">
<p>{esc(c.p("common.copyright"))}<br>{esc(c.t("common.footer_placeholder"))}</p>
<div class="theme-switch"><label for="theme-select">{esc(c.t("common.theme_label"))}</label>
<select id="theme-select"><option value="system">{esc(c.t("common.theme_system"))}</option><option value="light">{esc(c.t("common.theme_light"))}</option><option value="dark">{esc(c.t("common.theme_dark"))}</option></select></div>
</div>
</div>
</footer>'''


def consent_banner(c):
    return f'''<div class="consent" id="consent" role="region" aria-labelledby="consent-title" hidden>
<div class="container consent-inner">
<div><h2 id="consent-title">{esc(c.t("consent.title"))}</h2><p>{c.p("consent.text")}</p></div>
<div class="btn-row"><button type="button" class="btn" data-consent="reject">{esc(c.t("consent.reject"))}</button>
<button type="button" class="btn" data-consent="accept">{esc(c.t("consent.accept"))}</button></div>
</div>
</div>'''


# --------------------------------------------------------------------------
# Seiten
# --------------------------------------------------------------------------
def course_meta_line(c, co):
    return f'{esc(c.t("common.formats." + co["format"]))} · {esc(co["duration"][c.lang])} · {esc(c.t("common.levels." + co["level"]))}'


def cal_badge(c, iso, start=None):
    """Datum als Kalenderblatt (Monat, Tag, Wochentag). Für Screenreader steht das volle Datum als Text daneben."""
    d = dt.date.fromisoformat(iso)
    stamp = f"{iso}T{start}" if start else iso
    return (f'<time class="cal-wrap" datetime="{stamp}"><span class="cal" aria-hidden="true">'
            f'<span class="cal-m">{esc(c.t("common.months_badge")[d.month - 1])}</span>'
            f'<span class="cal-d">{d.day}</span>'
            f'<span class="cal-w">{esc(c.t("common.weekdays")[d.weekday()])}</span></span>'
            f'<span class="visually-hidden">{esc(c.date(iso))}</span></time>')


def seats_bar(e):
    """Schmaler Füllbalken: Anteil der freien Plätze (rein dekorativ, Text steht daneben)."""
    free = round(100 * e["seats_free"] / e["seats_total"]) if e["seats_total"] else 0
    state = "none" if e["seats_free"] == 0 else ("few" if e["seats_free"] <= 3 else "ok")
    return f'<span class="seats-bar seats-bar--{state}" aria-hidden="true"><span style="width:{free}%"></span></span>'


def date_rows(c, events, limit=None):
    items = []
    for i, e in enumerate(events):
        co = c.course(e["course"])
        hidden = " hidden" if limit is not None and i >= limit else ""
        items.append(
            f'<li class="date-row" data-date="{e["date"]}"{hidden}>'
            f'{cal_badge(c, e["date"], e["start"])}'
            f'<div class="date-row-main"><a class="date-row-title" href="{c.url("courses")}#kurs-{co["id"]}">{esc(co["title"][c.lang])}</a>'
            f'<span class="small muted">{esc(c.time(e["start"], e["end"]))} · {esc(c.b.events["locations"][e["location"]][c.lang])}</span></div>'
            f'<span class="date-row-seats small">{seats_bar(e)}{seats_html(c, e)}</span></li>')
    return "".join(items)


def page_home(c):
    T = "pages.home."
    courses = "".join(
        f'<li><h3><a href="{c.url("courses")}#kurs-{co["id"]}">{esc(co["title"][c.lang])}</a></h3>'
        f'<p class="small muted">{course_meta_line(c, co)}</p></li>' for co in c.b.courses["courses"])
    ev = upcoming(c.b)
    empty_hidden = "" if not ev else " hidden"
    return f'''<div class="container hero">
<h1>{esc(c.t(T + "h1"))}</h1>
<p class="lead">{esc(c.t(T + "lead"))}</p>
<div class="btn-row"><a class="btn" href="{c.url("courses")}">{esc(c.t(T + "cta_courses"))}</a>
<a class="btn btn--outline" href="{c.url("dates")}">{esc(c.t(T + "cta_dates"))}</a></div>
</div>
<section class="section" aria-labelledby="h-courses"><div class="container">
<div class="section-head"><h2 id="h-courses">{esc(c.t(T + "courses_h2"))}</h2><a href="{c.url("courses")}">{esc(c.t(T + "courses_all"))}</a></div>
<ul class="rows rows--compact">{courses}</ul>
</div></section>
<section class="section" aria-labelledby="h-dates"><div class="container">
<div class="section-head"><h2 id="h-dates">{esc(c.t(T + "dates_h2"))}</h2><a href="{c.url("dates")}">{esc(c.t(T + "dates_all"))}</a></div>
<ul class="rows rows--compact" data-upcoming="{HOME_DATES}">{date_rows(c, ev, HOME_DATES)}</ul>
<p class="no-results" data-upcoming-empty{empty_hidden}>{esc(c.t(T + "dates_empty"))}</p>
</div></section>
<section class="section" aria-labelledby="h-about"><div class="container grid-2 grid-2--wide-left">
<div><h2 id="h-about">{esc(c.t(T + "about_h2"))}</h2><p class="prose">{esc(c.t(T + "about_text"))}</p>
<p><a href="{c.url("about")}">{esc(c.t(T + "about_link"))}</a></p></div>
</div></section>
<section class="section" aria-label="{esc(c.t(T + "member_h2"))} / {esc(c.t(T + "donate_h2"))}"><div class="container support">
<div><h2>{esc(c.t(T + "member_h2"))}</h2><p>{esc(c.p(T + "member_text"))}</p>
<a class="btn btn--outline" href="{c.url("membership")}">{esc(c.t(T + "member_btn"))}</a></div>
<div><h2>{esc(c.t(T + "donate_h2"))}</h2><p>{esc(c.t(T + "donate_text"))}</p>
<a class="btn btn--accent" href="{c.url("donate")}">{esc(c.t(T + "donate_btn"))}</a></div>
</div></section>
<section class="section" aria-labelledby="h-news"><div class="container">
<h2 id="h-news">{esc(c.t(T + "newsletter_h2"))}</h2>
<p class="prose">{esc(c.t(T + "newsletter_text"))}</p>
{newsletter_form(c)}
</div></section>'''


def newsletter_form(c):
    f = "newsletter"
    return (form_open(c, f)
            + field(c, f, "email", c.t("forms.email"), "email", True, "email", validate="email")
            + checkbox(c, f, "einwilligung", c.p("forms.newsletter_consent"), required=True)
            + honeypot(c, f)
            + form_close(c, f, "submit_newsletter"))


def page_about(c):
    T = "pages.about."
    values = "".join(f'<li><h3>{esc(v["t"])}</h3><p>{esc(v["d"])}</p></li>' for v in c.t(T + "values"))
    work = "".join(f"<li>{esc(w)}</li>" for w in c.t(T + "work_items"))
    team = "".join(f'<li><span class="initials" aria-hidden="true">{esc(m["initials"])}</span>'
                   f'<p><strong>{esc(m["name"])}</strong><br><span class="muted">{esc(m["role"])}</span></p></li>'
                   for m in c.t(T + "team"))
    return f'''{page_head(c, lead=esc(c.t(T + "lead")))}
<section class="section" aria-labelledby="h-mission"><div class="container prose">
<h2 id="h-mission">{esc(c.t(T + "mission_h2"))}</h2><p>{esc(c.t(T + "mission_text"))}</p></div></section>
<section class="section" aria-labelledby="h-values"><div class="container">
<h2 id="h-values">{esc(c.t(T + "values_h2"))}</h2><ul class="rows prose">{values}</ul></div></section>
<section class="section" aria-labelledby="h-work"><div class="container prose">
<h2 id="h-work">{esc(c.t(T + "work_h2"))}</h2><ul>{work}</ul></div></section>
<section class="section" aria-labelledby="h-team"><div class="container">
<h2 id="h-team">{esc(c.t(T + "team_h2"))}</h2><p class="prose muted">{esc(c.t(T + "team_text"))}</p>
<ul class="people">{team}</ul></div></section>
<section class="section"><div class="container prose">
<p>{esc(c.t(T + "cta_text"))}</p><a class="btn btn--outline" href="{c.url("contact")}">{esc(c.t(T + "cta_btn"))}</a></div></section>'''


def page_courses(c):
    T = "pages.courses."
    F = "common.facts."
    items = []
    for co in c.b.courses["courses"]:
        price = (f'{c.money(co["price"])} · {c.money(co["member_price"])} {esc(c.t(F + "member_price"))}')
        items.append(f'''<li id="kurs-{co["id"]}" class="course">
<div><h2 class="h3">{esc(co["title"][c.lang])}</h2><p>{esc(co["text"][c.lang])}</p>
<p class="small"><a href="{c.url("dates")}?kurs={co["id"]}">{esc(c.t(T + "dates_link"))}</a> · <a href="{c.url("contact")}?thema=kurs&amp;kurs={co["id"]}">{esc(c.t(T + "request_link"))}</a></p></div>
<dl class="facts">
<dt>{esc(c.t(F + "duration"))}</dt><dd>{esc(co["duration"][c.lang])}</dd>
<dt>{esc(c.t(F + "format"))}</dt><dd>{esc(c.t("common.formats." + co["format"]))}</dd>
<dt>{esc(c.t(F + "level"))}</dt><dd>{esc(c.t("common.levels." + co["level"]))}</dd>
<dt>{esc(c.t(F + "audience"))}</dt><dd>{esc(co["audience"][c.lang])}</dd>
<dt>{esc(c.t(F + "price"))}</dt><dd>{price}</dd>
</dl></li>''')
    return f'''{page_head(c, lead=esc(c.t(T + "lead")))}
<div class="container">
{notice(c.p(T + "member_note"))}
<ul class="rows">{"".join(items)}</ul>
<p class="small muted">{esc(c.t(T + "prices_placeholder"))}</p>
</div>
<section class="section" aria-labelledby="h-group"><div class="container prose">
<h2 id="h-group">{esc(c.t(T + "group_h2"))}</h2><p>{esc(c.t(T + "group_text"))}</p>
<a class="btn btn--outline" href="{c.url("contact")}?thema=workshop">{esc(c.t(T + "group_btn"))}</a></div></section>'''


def page_dates(c):
    T = "pages.dates."
    events = sorted(c.b.events["events"], key=lambda e: (e["date"], e["start"]))
    # Termine nach Monat gruppieren: je Monat ein <tbody> mit Überschriftszeile
    groups = {}
    for e in events:
        groups.setdefault(e["date"][:7], []).append(e)
    bodies = []
    for month, evs in groups.items():
        y, m = month.split("-")
        title = f'{c.t("common.months_long")[int(m) - 1]} {y}'
        all_past = all(e["date"] < c.b.site["build_date"] for e in evs)
        rows = [f'<tr role="row" class="month-row"><th colspan="6" scope="rowgroup" role="rowheader" id="monat-{month}">{esc(title)}</th></tr>']
        for e in evs:
            co = c.course(e["course"])
            past = " hidden" if e["date"] < c.b.site["build_date"] else ""
            visible = c.t(T + ("waitlist" if e["seats_free"] == 0 else "request"))
            # Zugänglicher Name beginnt mit dem sichtbaren Text (WCAG 2.5.3 „Label in Name“)
            label = (c.t(T + "request_label").replace("{action}", visible)
                     .replace("{course}", co["title"][c.lang]).replace("{date}", c.date(e["date"])))
            action = (f'<a class="btn btn--outline btn--small" href="{c.url("contact")}?thema=kurs&amp;termin={e["id"]}" aria-label="{esc(label)}">'
                      f'{esc(visible)}</a>')
            rows.append(
                f'<tr role="row" data-date="{e["date"]}" data-course="{co["id"]}"{past}>'
                f'<th scope="row" role="rowheader" class="col-date">{cal_badge(c, e["date"])}</th>'
                f'<td role="cell" class="col-time" data-label="{esc(c.t(T + "col_time"))}">{esc(c.time(e["start"], e["end"]))}</td>'
                f'<td role="cell" class="col-course" data-label="{esc(c.t(T + "col_course"))}"><a href="{c.url("courses")}#kurs-{co["id"]}">{esc(co["title"][c.lang])}</a></td>'
                f'<td role="cell" class="col-place" data-label="{esc(c.t(T + "col_place"))}">{esc(c.b.events["locations"][e["location"]][c.lang])}</td>'
                f'<td role="cell" class="col-seats" data-label="{esc(c.t(T + "col_seats"))}">{seats_bar(e)}{seats_html(c, e)}</td>'
                f'<td role="cell" class="col-action">{action}</td></tr>')
        hidden = " hidden" if all_past else ""
        bodies.append(f'<tbody role="rowgroup" data-month="{month}"{hidden}>{"".join(rows)}</tbody>')
    options = "".join(f'<option value="{co["id"]}">{esc(co["title"][c.lang])}</option>' for co in c.b.courses["courses"])
    head = "".join(f'<th scope="col" role="columnheader" class="col-{k}">{esc(c.t(T + "col_" + k))}</th>'
                   for k in ("date", "time", "course", "place", "seats", "action"))
    return f'''{page_head(c, lead=esc(c.t(T + "lead")))}
<div class="container">
{notice(c.t(T + "note"))}
<div class="filter" data-js-only hidden>
<div class="field"><label for="filter-course">{esc(c.t(T + "filter_label"))}</label>
<select id="filter-course" data-filter="course"><option value="">{esc(c.t(T + "filter_all"))}</option>{options}</select></div>
<p class="small muted" id="filter-status" role="status" aria-live="polite"></p>
</div>
<div class="table-wrap"><table class="data-table data-table--stack dates-table" role="table" id="dates-table">
<caption class="visually-hidden">{esc(c.t(T + "table_caption"))}</caption>
<thead role="rowgroup"><tr role="row">{head}</tr></thead>
{"".join(bodies)}</table>
<p class="no-results" id="dates-empty" hidden>{esc(c.t(T + "no_results"))}</p></div>
</div>'''


def page_association(c):
    T = "pages.association."
    o = c.b.site["org"]
    d = c.b.site["documents"]
    roles = c.t(T + "roles")
    board = "<br>".join(f'{esc(roles[m["role"]])}: {esc(m["name"])}' for m in o["board"])
    docs = []
    for pid, text_key, pdf, date_key, ver_key in (("statutes", "docs_statutes", "satzung.pdf", "statutes_date", "statutes_version"),
                                                 ("fees", "docs_fees", "beitragsordnung.pdf", "fees_date", "fees_version")):
        docs.append(f'''<li><h3>{esc(c.t("nav." + pid))}</h3><p>{esc(c.t(T + text_key))}</p>
<p class="small muted">{esc(c.t("common.version_label"))}: {esc(d[ver_key])} · {esc(c.t("common.decided_label"))} {esc(d[date_key])}</p>
<p class="btn-row"><a class="btn btn--outline btn--small" href="{c.url(pid)}">{esc(c.t(T + "read"))}</a>
<a class="btn btn--text btn--small" href="../downloads/{pdf}" download hreflang="de">{esc(c.t("common.download_pdf"))} <span class="small muted">({esc(c.t("common.pdf_size"))})</span></a></p></li>''')
    return f'''{page_head(c, lead=esc(c.t(T + "lead")))}
<div class="container">{subnav(c)}</div>
<section class="section" aria-labelledby="h-facts"><div class="container">
<h2 id="h-facts">{esc(c.t(T + "facts_h2"))}</h2>
<dl class="facts" style="font-size:1rem">
<dt>{esc(c.t(T + "f_name"))}</dt><dd>{esc(o["name"])}</dd>
<dt>{esc(c.t(T + "f_seat"))}</dt><dd>{esc(o["city"])}</dd>
<dt>{esc(c.t(T + "f_register"))}</dt><dd>{esc(o["register_court"])}, {esc(o["register_number"])}</dd>
<dt>{esc(c.t(T + "f_purpose"))}</dt><dd>{esc(c.t(T + "purpose_text"))}</dd>
<dt>{esc(c.t(T + "f_nonprofit"))}</dt><dd>{c.p(T + "nonprofit_text")}</dd>
<dt>{esc(c.t(T + "f_board"))}</dt><dd>{board}</dd>
</dl></div></section>
<section class="section" aria-labelledby="h-docs"><div class="container">
<h2 id="h-docs">{esc(c.t(T + "docs_h2"))}</h2>
<ul class="rows prose">{"".join(docs)}</ul></div></section>
<section class="section" aria-labelledby="h-history"><div class="container prose">
<h2 id="h-history">{esc(c.t(T + "history_h2"))}</h2><p>{esc(c.t(T + "history_text"))}</p></div></section>'''


def legal_doc_page(c, pid, pdf, date_key, ver_key, numbered=True):
    T = f"pages.{pid}."
    d = c.b.site["documents"]
    sections = c.t(T + "sections")
    intro = f'<p class="prose">{esc(c.t(T + "intro"))}</p>' if "intro" in c.t(f"pages.{pid}") else ""
    return f'''<div class="container">{subnav(c)}</div>
{page_head(c)}
<div class="container">
{notice(c.t("common.placeholder_legal"), accent=True)}
{translation_note(c)}
<p class="doc-meta"><span>{esc(c.t("common.version_label"))}: {esc(d[ver_key])}</span><span>{esc(c.t("common.decided_label"))} {esc(d[date_key])}</span></p>
<p class="btn-row no-print"><a class="btn btn--outline btn--small" href="../downloads/{pdf}" download hreflang="de">{esc(c.t("common.download_pdf"))}</a>
<button type="button" class="btn btn--text btn--small" data-print hidden>{esc(c.t("common.print"))}</button></p>
{intro}
{toc(c, sections)}
<div class="legal">{legal_sections(c, sections, numbered=numbered, with_table=True)}</div>
</div>'''


def page_statutes(c):
    return legal_doc_page(c, "statutes", "satzung.pdf", "statutes_date", "statutes_version")


def page_fees(c):
    return legal_doc_page(c, "fees", "beitragsordnung.pdf", "fees_date", "fees_version")


def page_membership(c):
    T = "pages.membership."
    f = "membership"
    benefits = "".join(f'<li><h3>{esc(v["t"])}</h3><p>{esc(v["d"])}</p></li>' for v in c.t(T + "benefits"))
    types = [(t["id"], f'{t["label"][c.lang]} – {(c.t("common.from") + " ") if t["min"] else ""}{c.money(t["amount"])} {c.t("common.per_year")}')
             for t in c.b.fees["types"]]
    methods = [(m, c.t(T + "payment." + m)) for m in c.b.site["payments"]["membership_methods"]]
    form = (form_open(c, f)
            + f'<fieldset><legend>{esc(c.t(T + "personal_legend"))}</legend>'
            + '<div class="field-row field-row--2">'
            + field(c, f, "vorname", c.t("forms.first_name"), required=True, autocomplete="given-name")
            + field(c, f, "nachname", c.t("forms.last_name"), required=True, autocomplete="family-name")
            + "</div>"
            + field(c, f, "strasse", c.t("forms.street"), required=True, autocomplete="street-address")
            + '<div class="field-row field-row--zip">'
            + field(c, f, "plz", c.t("forms.zip"), required=True, autocomplete="postal-code", validate="zip", inputmode="numeric")
            + field(c, f, "ort", c.t("forms.city"), required=True, autocomplete="address-level2")
            + "</div>"
            + '<div class="field-row field-row--2">'
            + field(c, f, "email", c.t("forms.email"), "email", True, "email", validate="email")
            + field(c, f, "telefon", f'{c.t("forms.phone")} <span class="req">({esc(c.t("common.optional"))})</span>', "tel", False, "tel")
            + "</div>"
            + date_group(c, f, "geburtsdatum", c.t("forms.birthdate"), required=True)
            + "</fieldset>"
            + f'<fieldset><legend>{esc(c.t(T + "membership_legend"))}</legend>'
            + select(c, f, "mitgliedsart", c.t(T + "f_type"), types, True, c.t("forms.topic_choose"))
            + radios(c, f, "zahlungsweise", c.t(T + "f_payment"), methods, True, "sepa", extra='data-toggle="sepa"')
            + "</fieldset>"
            + f'<fieldset id="{f}-sepa" data-show-if="zahlungsweise=sepa"><legend>{esc(c.t(T + "sepa_legend"))}</legend>'
            + f'<p class="small muted">{esc(c.t(T + "sepa_hint"))}</p>'
            + field(c, f, "kontoinhaber", c.t(T + "f_holder"), autocomplete="name", extra='data-required-if="zahlungsweise=sepa"')
            + field(c, f, "iban", c.t(T + "f_iban"), hint=esc(c.t(T + "iban_hint")), validate="iban", extra='data-required-if="zahlungsweise=sepa" spellcheck="false" autocapitalize="characters"')
            + f'<p class="small">{c.p(T + "mandate_text")}</p>'
            + checkbox(c, f, "sepa_mandat", esc(c.t(T + "mandate_consent")), extra='data-required-if="zahlungsweise=sepa"')
            + "</fieldset>"
            + f'<fieldset><legend>{esc(c.t(T + "consents_legend"))}</legend>'
            + checkbox(c, f, "satzung", c.p(T + "statutes_consent"), required=True)
            + checkbox(c, f, "datenschutz", c.p(T + "privacy_consent"), required=True)
            + "</fieldset>"
            + notice(c.t(T + "no_payment"))
            + honeypot(c, f)
            + form_close(c, f, "submit_membership"))
    return f'''{page_head(c, lead=esc(c.t(T + "lead")))}
<section class="section" aria-labelledby="h-benefits"><div class="container">
<h2 id="h-benefits">{esc(c.t(T + "benefits_h2"))}</h2><ul class="rows prose">{benefits}</ul></div></section>
<section class="section" aria-labelledby="h-fees"><div class="container">
<h2 id="h-fees">{esc(c.t(T + "fees_h2"))}</h2>{fees_table(c)}
<p><a href="{c.url("fees")}">{esc(c.t(T + "fees_link"))}</a></p></div></section>
<section class="section" aria-labelledby="h-form"><div class="container">
<h2 id="h-form">{esc(c.t(T + "form_h2"))}</h2><p class="prose">{esc(c.t(T + "form_intro"))}</p>
{form}</div></section>'''


def bank_list(c, id_prefix="bank"):
    T = "pages.donate."
    bank = c.b.site["bank"]
    rows = [("holder", bank["holder"]), ("iban", iban_groups(bank["iban"])), ("bic", bank["bic"]),
            ("bank", bank["bank_name"]), ("reference", bank["reference"])]
    out = []
    for key, value in rows:
        label = c.t(T + key)
        copy_value = re.sub(r"\s", "", value) if key == "iban" else value
        out.append(f'<div class="copy-row"><dt>{esc(label)}</dt><dd><span class="copy-value" id="{id_prefix}-{key}">{esc(value)}</span>'
                   f'<button type="button" class="btn btn--outline btn--small copy-btn" data-copy="{esc(copy_value)}" '
                   f'aria-label="{esc(c.t(T + "copy_label").replace("{field}", label))}" hidden>{esc(c.t(T + "copy"))}</button></dd></div>')
    return f'<dl class="copy-list">{"".join(out)}</dl>'


def page_donate(c):
    T = "pages.donate."
    f = "donation"
    amounts = c.b.site["donation_amounts"]
    impact = "".join(f'<li><h3>{esc(i["t"])}</h3><p>{esc(i["d"])}</p></li>' for i in c.t(T + "impact"))
    choices = "".join(
        f'<input type="radio" name="giro-amount" id="giro-amount-{a}" value="{a}"{" checked" if a == amounts[1] else ""}>'
        f'<label for="giro-amount-{a}">{c.money(a)}</label>' for a in amounts)
    choices += f'<input type="radio" name="giro-amount" id="giro-amount-other" value="other"><label for="giro-amount-other">{esc(c.t(T + "amount_other"))}</label>'
    intervals = [(k, c.t(T + "interval." + k)) for k in ("once", "monthly", "quarterly", "yearly")]
    form = (form_open(c, f)
            + '<div class="field-row field-row--2">'
            + field(c, f, "betrag", c.t(T + "f_amount"), "text", True, validate="amount", inputmode="decimal",
                    value=str(amounts[1]), extra='autocomplete="off"')
            + "</div>"
            + radios(c, f, "rhythmus", c.t(T + "f_interval"), intervals, True, "once")
            + '<div class="field-row field-row--2">'
            + field(c, f, "name", c.t("forms.name"), required=True, autocomplete="name")
            + field(c, f, "email", c.t("forms.email"), "email", True, "email", validate="email")
            + "</div>"
            + checkbox(c, f, "bescheinigung", esc(c.t(T + "f_receipt")))
            + f'<fieldset id="{f}-address"><legend class="label">{esc(c.t(T + "address_legend"))}</legend>'
            + f'<p class="small muted">{esc(c.t(T + "address_hint"))}</p>'
            + field(c, f, "strasse", c.t("forms.street"), autocomplete="street-address", extra='data-required-if="bescheinigung"')
            + '<div class="field-row field-row--zip">'
            + field(c, f, "plz", c.t("forms.zip"), autocomplete="postal-code", validate="zip", inputmode="numeric", extra='data-required-if="bescheinigung"')
            + field(c, f, "ort", c.t("forms.city"), autocomplete="address-level2", extra='data-required-if="bescheinigung"')
            + "</div></fieldset>"
            + field(c, f, "nachricht", f'{c.t(T + "f_message")} <span class="req">({esc(c.t("common.optional"))})</span>', "textarea")
            + privacy_check(c, f)
            + honeypot(c, f)
            + form_close(c, f, "submit_donation"))
    return f'''{page_head(c, lead=esc(c.t(T + "lead")))}
<section class="section" aria-labelledby="h-impact"><div class="container">
<h2 id="h-impact">{esc(c.t(T + "impact_h2"))}</h2><ul class="rows prose">{impact}</ul>
<p class="small muted">{esc(c.t(T + "impact_placeholder"))}</p></div></section>
<section class="section" aria-labelledby="h-bank"><div class="container prose">
<h2 id="h-bank">{esc(c.t(T + "bank_h2"))}</h2>
{notice(c.t(T + "bank_placeholder"), accent=True)}
{bank_list(c)}</div></section>
<section class="section" aria-labelledby="h-giro"><div class="container">
<h2 id="h-giro">{esc(c.t(T + "giro_h2"))}</h2>
<p class="prose">{esc(c.t(T + "giro_text"))}</p>
<noscript><p class="notice">{esc(c.t(T + "giro_nojs"))}</p></noscript>
<div data-js-only hidden>
<fieldset class="field"><legend class="label">{esc(c.t(T + "amount_legend"))}</legend><div class="choice">{choices}</div></fieldset>
<div class="field" id="giro-other-field" hidden><label for="giro-other">{esc(c.t(T + "amount_other_label"))}</label>
<input type="text" id="giro-other" inputmode="decimal" autocomplete="off" aria-describedby="giro-other-error" style="max-width:12rem">
<span class="error-text" id="giro-other-error"></span></div>
<div class="giro" data-giro="main">
<div class="giro-code" data-giro-code role="img" aria-label=""></div>
<div><h3 class="h3">{esc(c.t(T + "giro_text_h"))}</h3><dl class="giro-text" data-giro-text aria-live="polite"></dl>
<button type="button" class="btn btn--outline btn--small" data-giro-download>{esc(c.t(T + "giro_download"))}</button></div>
</div>
</div>
</div></section>
<section class="section" aria-labelledby="h-tax"><div class="container prose">
<h2 id="h-tax">{esc(c.t(T + "tax_h2"))}</h2><p>{c.p(T + "tax_text")}</p>
<p><a href="../downloads/spendennachweis-vorlage.pdf" download hreflang="de">{esc(c.t(T + "tax_template"))}</a></p></div></section>
<section class="section" aria-labelledby="h-dform"><div class="container">
<h2 id="h-dform">{esc(c.t(T + "form_h2"))}</h2><p class="prose">{esc(c.t(T + "form_intro"))}</p>
{form}
<div id="donation-confirm" class="success-box" tabindex="-1" hidden>
<h3>{esc(c.t(T + "confirm_h"))}</h3>
<p data-confirm-status></p>
<p>{esc(c.t(T + "confirm_text"))}</p>
<p class="small" data-confirm-interval hidden>{esc(c.t(T + "confirm_interval"))}</p>
<p class="small muted"><span>{esc(c.t(T + "providers_h"))}:</span> <span data-providers></span></p>
<div class="giro" data-giro="confirm"><div class="giro-code" data-giro-code role="img" aria-label=""></div>
<div><dl class="giro-text" data-giro-text></dl></div></div>
</div>
</div></section>'''


def page_contact(c):
    T = "pages.contact."
    f = "contact"
    o = c.b.site["org"]
    m = c.b.site["map"]
    topics = [(k, v) for k, v in c.t("forms.topics").items()]
    form = (form_open(c, f)
            + field(c, f, "name", c.t("forms.name"), required=True, autocomplete="name")
            + field(c, f, "email", c.t("forms.email"), "email", True, "email", validate="email")
            + select(c, f, "thema", c.t("forms.topic"), topics, True, c.t("forms.topic_choose"))
            + field(c, f, "nachricht", c.t("forms.message"), "textarea", True)
            + privacy_check(c, f)
            + honeypot(c, f)
            + form_close(c, f, "submit_contact"))
    d = 0.004
    bbox = f'{m["lon"] - d * 1.6:.5f}%2C{m["lat"] - d:.5f}%2C{m["lon"] + d * 1.6:.5f}%2C{m["lat"] + d:.5f}'
    embed = f'https://www.openstreetmap.org/export/embed.html?bbox={bbox}&amp;layer=mapnik&amp;marker={m["lat"]}%2C{m["lon"]}'
    route = f'https://www.openstreetmap.org/?mlat={m["lat"]}&amp;mlon={m["lon"]}#map={m["zoom"]}/{m["lat"]}/{m["lon"]}'
    return f'''{page_head(c, lead=esc(c.t(T + "lead")))}
<div class="container grid-2">
<section aria-labelledby="h-cform"><h2 id="h-cform">{esc(c.t(T + "form_h2"))}</h2>{form}</section>
<div>
<section aria-labelledby="h-details"><h2 id="h-details">{esc(c.t(T + "details_h2"))}</h2>
<dl class="facts" style="font-size:1rem">
<dt>{esc(c.t(T + "address"))}</dt><dd><address style="font-style:normal">{c.address_html()}</address></dd>
<dt>{esc(c.t(T + "email"))}</dt><dd><a href="mailto:{esc(o["email"])}">{esc(o["email"])}</a></dd>
<dt>{esc(c.t(T + "phone"))}</dt><dd><a href="tel:{esc(re.sub(r"[^0-9+]", "", o["phone"]))}">{esc(o["phone_display"])}</a><br><span class="small muted">{esc(c.t(T + "phone_times"))}</span></dd>
</dl></section>
<section class="section" aria-labelledby="h-map"><h2 id="h-map">{esc(c.t(T + "map_h2"))}</h2>
<div class="map-box" data-map="{embed}" data-map-title="{esc(c.t("consent.map_iframe_title"))}">
<div class="map-placeholder"><p><strong>{esc(c.t("consent.map_title"))}</strong></p><p class="small">{esc(c.t("consent.map_text"))}</p>
<p><button type="button" class="btn btn--outline btn--small" data-map-load hidden>{esc(c.t("consent.map_load"))}</button></p></div>
</div>
<p class="small"><a href="{route}" target="_blank" rel="noopener">{esc(c.t("consent.map_route"))}</a></p>
</section>
</div>
</div>'''


def simple_legal_page(c, pid, with_toc=False):
    sections = c.t(f"pages.{pid}.sections")
    note = translation_note(c) if pid in TRANSLATED_LEGAL else ""
    return f'''{page_head(c)}
<div class="container">
{notice(c.t("common.placeholder_legal"), accent=True)}
{note}
{toc(c, sections) if with_toc else ""}
<div class="legal">{legal_sections(c, sections)}</div>
</div>'''


def page_imprint(c):
    return simple_legal_page(c, "imprint")


def page_privacy(c):
    return simple_legal_page(c, "privacy", with_toc=True)


def page_accessibility(c):
    return simple_legal_page(c, "accessibility")


def page_cookies(c):
    T = "pages.cookies."
    return f'''{page_head(c, lead=esc(c.t(T + "lead")))}
<section class="section" aria-labelledby="h-nec"><div class="container prose">
<h2 id="h-nec">{esc(c.t(T + "necessary_h2"))}</h2><p>{esc(c.t(T + "necessary_text"))}</p></div></section>
<section class="section" aria-labelledby="h-opt"><div class="container prose">
<h2 id="h-opt">{esc(c.t(T + "optional_h2"))}</h2>
<noscript><p class="notice">{esc(c.t(T + "nojs"))}</p></noscript>
<form id="consent-settings" class="form" data-js-only hidden>
<div class="check"><input type="checkbox" id="consent-map" name="map"><label for="consent-map">{esc(c.t(T + "map_label"))}<br><span class="small muted">{c.p(T + "map_desc")}</span></label></div>
<p class="small muted" id="consent-current"></p>
<button type="submit" class="btn">{esc(c.t(T + "save"))}</button>
<p class="form-status" id="consent-status" role="status" aria-live="polite"></p>
</form></div></section>'''


def page_newsletter_confirmed(c):
    T = "pages.newsletter_confirmed."
    return f'''{page_head(c, lead=esc(c.t(T + "text")))}
<div class="container"><a class="btn" href="{c.url("dates")}">{esc(c.t(T + "back"))}</a></div>'''


RENDER = {
    "home": page_home, "about": page_about, "courses": page_courses, "dates": page_dates,
    "association": page_association, "statutes": page_statutes, "fees": page_fees,
    "membership": page_membership, "donate": page_donate, "contact": page_contact,
    "imprint": page_imprint, "privacy": page_privacy, "cookies": page_cookies,
    "accessibility": page_accessibility, "newsletter_confirmed": page_newsletter_confirmed,
}


# --------------------------------------------------------------------------
# Meta-Angaben, strukturierte Daten, Seitendaten für JavaScript
# --------------------------------------------------------------------------
def abs_url(b, lang, pid):
    slug = SLUGS[pid][lang]
    return f'{b.site["base_url"]}/{lang}/' + ("" if slug == "index.html" else slug)


def meta_tags(c):
    b = c.b
    alts = [f'<link rel="alternate" hreflang="{l}" href="{abs_url(b, l, c.page)}">' for l in b.site["languages"]]
    alts.append(f'<link rel="alternate" hreflang="x-default" href="{b.site["base_url"]}/">')
    title = full_title(c)
    og = [
        f'<meta property="og:type" content="website">',
        f'<meta property="og:site_name" content="{esc(c.t("common.site_name"))}">',
        f'<meta property="og:title" content="{esc(title)}">',
        f'<meta property="og:description" content="{esc(c.t(f"pages.{c.page}.description"))}">',
        f'<meta property="og:url" content="{abs_url(b, c.lang, c.page)}">',
        f'<meta property="og:image" content="{b.site["base_url"]}/assets/og-image.png">',
        f'<meta property="og:image:width" content="1200">',
        f'<meta property="og:image:height" content="630">',
        f'<meta property="og:locale" content="{c.t("meta.locale")}">',
    ]
    og += [f'<meta property="og:locale:alternate" content="{b.i18n[l]["meta"]["locale"]}">' for l in b.site["languages"] if l != c.lang]
    og.append('<meta name="twitter:card" content="summary_large_image">')
    return "\n".join(alts), "\n".join(og)


def full_title(c):
    t = c.t(f"pages.{c.page}.title")
    site = c.t("common.site_name")
    return f"{site} – {t}" if c.page == "home" else f"{t} · {site}"


def jsonld(c):
    b = c.b
    o = b.site["org"]
    org = {
        "@type": "NGO",
        "@id": f'{b.site["base_url"]}/#org',
        "name": o["name"],
        "url": f'{b.site["base_url"]}/',
        "logo": f'{b.site["base_url"]}/assets/logo.svg',
        "email": o["email"],
        "telephone": o["phone"],
        "description": c.t("pages.home.description"),
        "address": {"@type": "PostalAddress", "streetAddress": o["street"], "postalCode": o["zip"],
                    "addressLocality": o["city"], "addressCountry": o["country"]},
    }
    graph = []
    if c.page == "home":
        graph.append(org)
    if c.page == "dates":
        mode = {"vereinsraum": "OfflineEventAttendanceMode", "online": "OnlineEventAttendanceMode",
                "hybrid": "MixedEventAttendanceMode"}
        for e in upcoming(b):
            co = c.course(e["course"])
            loc = ({"@type": "VirtualLocation", "url": abs_url(b, c.lang, "contact")} if e["location"] == "online"
                   else {"@type": "Place", "name": b.events["locations"][e["location"]][c.lang], "address": org["address"]})
            graph.append({
                "@type": "EducationEvent",
                "name": co["title"][c.lang],
                "description": co["text"][c.lang],
                "startDate": f'{e["date"]}T{e["start"]}',
                "endDate": f'{e["date"]}T{e["end"]}',
                "eventAttendanceMode": "https://schema.org/" + mode[e["location"]],
                "eventStatus": "https://schema.org/EventScheduled",
                "location": loc,
                "organizer": {"@type": "NGO", "name": o["name"], "url": f'{b.site["base_url"]}/'},
                "offers": {"@type": "Offer", "price": co["price"], "priceCurrency": "EUR",
                           "availability": "https://schema.org/" + ("SoldOut" if e["seats_free"] == 0 else "InStock"),
                           "url": abs_url(b, c.lang, "dates")},
                "inLanguage": "de",
            })
    if not graph:
        return ""
    data = {"@context": "https://schema.org", "@graph": graph}
    return '<script type="application/ld+json">' + json_for_script(data) + "</script>"


def json_for_script(data):
    return json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def page_data(c):
    """Daten für das JavaScript der Seite (eingebettet, damit auch file:// funktioniert)."""
    b = c.b
    T = c.T
    data = {
        "lang": c.lang,
        "page": c.page,
        "today": b.site["build_date"],
        "org": {"name": b.site["org"]["name"], "email": b.site["org"]["email"]},
        "strings": {
            "errors": {k: c.fill(v) for k, v in T["forms"]["errors"].items()},
            "status": {k: c.fill(v) for k, v in T["forms"]["status"].items()},
            "mail_subject": T["forms"]["mail_subject"],
            "form_names": T["forms"]["form_names"],
            "age": T["forms"]["age"],
            "menu": T["common"]["menu"],
            "menu_close": T["common"]["menu_close"],
            "filter_count": T["pages"]["dates"]["filter_count"],
            "cookies": {k: T["pages"]["cookies"][k] for k in ("saved", "current_on", "current_off")},
        },
    }
    if c.page in ("donate",):
        D = T["pages"]["donate"]
        data["bank"] = b.site["bank"]
        data["amounts"] = b.site["donation_amounts"]
        data["providers"] = b.site["payments"]["donation_providers"]
        data["money_pattern"] = T["common"]["money_pattern"]
        data["strings"]["donate"] = {k: D[k] for k in (
            "copy", "copied", "giro_alt", "giro_alt_open", "giro_recipient", "giro_amount", "giro_open_amount",
            "iban", "bic", "reference", "provider_transfer")}
    if c.page == "contact":
        data["events"] = {e["id"]: f'{c.course(e["course"])["title"][c.lang]} – {c.date(e["date"])}, {c.time(e["start"], e["end"])}'
                          for e in b.events["events"]}
        data["courses"] = {co["id"]: co["title"][c.lang] for co in b.courses["courses"]}
        data["strings"]["prefill"] = T["pages"]["contact"]["prefill"]
    return json_for_script(data)


def scripts(c):
    root = "../"
    names = PAGE_SCRIPTS.get(c.page, [])
    # main.js zuerst: stellt window.SkillsLab (Seitendaten, Hilfsfunktionen) bereit
    tags = [f'<script src="{root}js/main.js" defer></script>']
    tags += [f'<script src="{root}js/{n}.js" defer></script>' for n in names]
    return "\n".join(tags)


# --------------------------------------------------------------------------
# Zusammenbauen
# --------------------------------------------------------------------------
class Build:
    def __init__(self):
        self.site = load_json(ROOT / "data" / "site.json")
        self.fees = load_json(ROOT / "data" / "beitraege.json")
        self.courses = load_json(ROOT / "data" / "angebote.json")
        self.events = load_json(ROOT / "data" / "termine.json")
        self.i18n = {l: load_json(ROOT / "i18n" / f"{l}.json") for l in self.site["languages"]}
        self.layout = (TEMPLATES / "layout.html").read_text(encoding="utf-8")

    def render_page(self, lang, pid):
        c = Ctx(self, lang, pid)
        alternates, og = meta_tags(c)
        parts = {
            "lang": lang,
            "title": esc(full_title(c)),
            "description": esc(c.t(f"pages.{pid}.description")),
            "canonical": abs_url(self, lang, pid),
            "alternates": alternates,
            "og": og,
            "root": "../",
            "jsonld": jsonld(c),
            "skip": esc(c.t("common.skip")),
            "header": header(c),
            "main": RENDER[pid](c),
            "footer": footer(c),
            "consent": consent_banner(c),
            "data": page_data(c),
            "scripts": scripts(c),
        }
        out = self.layout
        for k, v in parts.items():
            out = out.replace("{{" + k + "}}", v)
        leftover = re.findall(r"\{\{[a-z_]+\}\}", out)
        if leftover:
            raise SystemExit(f"Nicht ersetzte Vorlagen-Platzhalter in {lang}/{pid}: {leftover}")
        stray = re.findall(r"\{(?:p|de|site):[^}]+\}|\{(?:address|board|email_link|fee_min|de_link)\}", out)
        if stray:
            raise SystemExit(f"Nicht ersetzte Text-Platzhalter in {lang}/{pid}: {stray}")
        return out

    def write(self, rel, content):
        path = ROOT / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    def run(self):
        count = 0
        for lang in self.site["languages"]:
            for pid, slugs in PAGES:
                self.write(f"{lang}/{slugs[lang]}", self.render_page(lang, pid))
                count += 1
        self.write("index.html", self.root_index())
        self.write("404.html", self.not_found())
        self.write("sitemap.xml", self.sitemap())
        self.write("robots.txt", f'User-agent: *\nAllow: /\n\nSitemap: {self.site["base_url"]}/sitemap.xml\n')
        return count

    # Sprachweiche --------------------------------------------------------------
    def root_index(self):
        langs = self.site["languages"]
        links = "".join(
            f'<li><a class="btn btn--outline" href="{l}/index.html" lang="{l}" hreflang="{l}" data-lang="{l}">'
            f'{esc(self.i18n[l]["meta"]["name"])}</a></li>' for l in langs)
        texts = "".join(f'<p lang="{l}">{esc(self.i18n[l]["pages"]["langselect"]["text"])}</p>' for l in langs)
        alts = "\n".join(f'<link rel="alternate" hreflang="{l}" href="{self.site["base_url"]}/{l}/">' for l in langs)
        return f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(self.i18n["de"]["pages"]["langselect"]["title"])}</title>
<meta name="description" content="{esc(self.i18n["de"]["pages"]["home"]["description"])}">
<link rel="canonical" href="{self.site["base_url"]}/">
{alts}
<link rel="alternate" hreflang="x-default" href="{self.site["base_url"]}/">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="css/style.css">
<noscript><meta http-equiv="refresh" content="5;url=de/index.html"></noscript>
<script>
  /* Sprachweiche: gespeicherte Wahl > Browsersprache > Deutsch */
  (function () {{
    var supported = {json.dumps(langs)};
    var lang = null;
    try {{ lang = localStorage.getItem("sl-lang"); }} catch (e) {{}}
    if (supported.indexOf(lang) === -1) {{
      var prefs = navigator.languages || [navigator.language || "de"];
      for (var i = 0; i < prefs.length && !lang; i++) {{
        var code = String(prefs[i]).slice(0, 2).toLowerCase();
        if (supported.indexOf(code) !== -1) lang = code;
      }}
    }}
    if (supported.indexOf(lang) === -1) lang = "{self.site["default_language"]}";
    location.replace(lang + "/index.html");
  }})();
</script>
</head>
<body>
<main id="main" class="container hero">
<h1>Skills Lab e.V.</h1>
{texts}
<ul class="btn-row" style="list-style:none;padding:0">{links}</ul>
</main>
</body>
</html>
'''

    def not_found(self):
        """404-Seite: wird für beliebige Adressen ausgeliefert und nutzt daher absolute Pfade.
        Der Pfadanteil von base_url wird vorangestellt (z. B. /test bei GitHub-Pages-Projektseiten)."""
        base = urlparse(self.site["base_url"]).path.rstrip("/")
        blocks = []
        for l in self.site["languages"]:
            p = self.i18n[l]["pages"]["notfound"]
            blocks.append(f'<section lang="{l}" class="section"><h2>{esc(p["h1"])}</h2><p>{esc(p["text"])}</p>'
                          f'<p><a class="btn btn--outline" href="{base}/{l}/index.html">{esc(p["back"])}</a></p></section>')
        return f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{esc(self.i18n["de"]["pages"]["notfound"]["title"])} · Skills Lab e.V.</title>
<link rel="icon" href="{base}/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{base}/css/style.css">
</head>
<body>
<main id="main" class="container page-head">
<h1>Skills Lab e.V. – 404</h1>
{"".join(blocks)}
</main>
</body>
</html>
'''

    def sitemap(self):
        urls = []
        for pid, _ in PAGES:
            if pid == "newsletter_confirmed":
                continue
            for l in self.site["languages"]:
                alts = "".join(f'<xhtml:link rel="alternate" hreflang="{a}" href="{abs_url(self, a, pid)}"/>'
                               for a in self.site["languages"])
                urls.append(f"<url><loc>{abs_url(self, l, pid)}</loc><lastmod>{self.site['build_date']}</lastmod>{alts}</url>")
        return ('<?xml version="1.0" encoding="UTF-8"?>\n'
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
                + "\n".join(urls) + "\n</urlset>\n")


def main():
    b = Build()
    errors = check_translations(b.i18n) + check_data(b.site, b.fees, b.courses, b.events, b.i18n)
    if errors:
        print("Fehler gefunden – bitte korrigieren:", file=sys.stderr)
        for e in errors:
            print("  - " + e, file=sys.stderr)
        sys.exit(1)
    print("Prüfung: Übersetzungen und Daten in Ordnung.")
    if "--check" in sys.argv:
        return
    n = b.run()
    print(f"Fertig: {n} Seiten + index.html, 404.html, sitemap.xml, robots.txt erzeugt.")


if __name__ == "__main__":
    main()
