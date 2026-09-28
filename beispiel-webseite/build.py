"""Erzeugt index.html (eigenständige Seite mit lokalen Schriften) aus site.html.

site.html ist das Seitenfragment, das auch als Vorschau-Artifact veröffentlicht wird.
"""
import re

src = open("site.html", encoding="utf-8").read()
# Google-Fonts-Verbindungen durch lokal gehostete Schriften ersetzen (DSGVO)
src = re.sub(r'<link rel="preconnect"[^>]*>\n', "", src)
src = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>',
             '<link rel="stylesheet" href="fonts/fonts.css">', src)
title, rest = src.split("\n", 1)
head, body = rest.split("</style>\n", 1)

page = f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Skills Lab e.V. – offene Werkstatt, Repair-Café und Tüftel-Club im Odenwald.">
{title}
{head}</style>
</head>
<body>
{body}</body>
</html>
"""
open("index.html", "w", encoding="utf-8").write(page)
print("index.html geschrieben")
