#!/usr/bin/env python3
"""
Erzeugt das Text-Logo „Skills Lab“ als SVG mit Pfaden (unabhängig von installierten Schriften):

    assets/logo.svg       – für helle Hintergründe
    assets/logo-dark.svg  – für dunkle Hintergründe
    assets/favicon.svg    – Browser-Symbol

Nur nötig, wenn das Logo neu gestaltet werden soll. Benötigt (einmalig):
    pip install fonttools brotli
Aufruf:
    python3 tools/make_logo.py
"""
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "assets" / "fonts" / "inter-latin-wght-normal.woff2"

TEXT = "Skills Lab"
WEIGHT = 700
SIZE = 40           # Schriftgröße in SVG-Einheiten
SQUARE = 14         # Kantenlänge des Akzent-Quadrats
GAP = 10            # Abstand Quadrat → Schrift
TRACKING = -0.4     # Laufweite in SVG-Einheiten

COLORS = {
    "logo.svg": {"text": "#1e6b47", "accent": "#e2ad1f"},
    "logo-dark.svg": {"text": "#dcdfe2", "accent": "#c2a463"},
}


def text_path(font, text, size):
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    scale = size / upm
    ascent = font["hhea"].ascent * scale
    pen = SVGPathPen(glyph_set, ntos=lambda v: ("%.2f" % v).rstrip("0").rstrip("."))
    x = 0.0
    for ch in text:
        name = cmap[ord(ch)]
        glyph = glyph_set[name]
        # Schrift-Koordinaten (y nach oben) → SVG (y nach unten)
        tpen = TransformPen(pen, (scale, 0, 0, -scale, x, ascent))
        glyph.draw(tpen)
        x += glyph.width * scale + TRACKING
    cap_height = getattr(font["OS/2"], "sCapHeight", 0) * scale or size * 0.73
    return pen.getCommands(), x - TRACKING, ascent, cap_height


def main():
    font = TTFont(FONT)
    font = instantiateVariableFont(font, {"wght": WEIGHT})
    d, width, baseline, cap = text_path(font, TEXT, SIZE)
    descent = -font["hhea"].descent * SIZE / font["head"].unitsPerEm
    height = round(baseline + descent)
    total_w = round(SQUARE + GAP + width + 2)
    sq_y = round(baseline - cap / 2 - SQUARE / 2, 2)
    for name, c in COLORS.items():
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w} {height}" width="{total_w}" height="{height}" '
               f'role="img" aria-label="Skills Lab">\n'
               f'  <title>Skills Lab</title>\n'
               f'  <rect x="0" y="{sq_y}" width="{SQUARE}" height="{SQUARE}" fill="{c["accent"]}"/>\n'
               f'  <path transform="translate({SQUARE + GAP} 0)" fill="{c["text"]}" d="{d}"/>\n'
               f'</svg>\n')
        (ROOT / "assets" / name).write_text(svg, encoding="utf-8")

    # Favicon: grünes Quadrat mit weißem „S“ und goldenem Akzent
    d_s, w_s, base_s, cap_s = text_path(font, "S", 44)
    off_x = round((64 - w_s) / 2, 2)
    off_y = round(32 - (base_s - cap_s / 2), 2)
    fav = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">\n'
           '  <rect width="64" height="64" rx="8" fill="#1e6b47"/>\n'
           '  <rect x="46" y="46" width="10" height="10" fill="#f2c94c"/>\n'
           f'  <path transform="translate({off_x} {off_y})" fill="#ffffff" d="{d_s}"/>\n'
           '</svg>\n')
    (ROOT / "assets" / "favicon.svg").write_text(fav, encoding="utf-8")
    print("assets/logo.svg, assets/logo-dark.svg, assets/favicon.svg erzeugt.")


if __name__ == "__main__":
    main()
