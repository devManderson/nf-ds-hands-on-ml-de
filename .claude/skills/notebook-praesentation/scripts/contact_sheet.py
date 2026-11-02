"""Setzt gerenderte Folien zu Übersichtsbildern zusammen (6 Folien pro Bild, mit Foliennummer).

Nutzung:
    python contact_sheet.py PNG-ORDNER ZIEL-ORDNER [3,7,12] [PRÄFIX]

Ohne Folienauswahl entstehen uebersicht-01.jpg, uebersicht-02.jpg … aus allen Folien; mit Auswahl
nur Bilder dieser Folien (Präfix z. B. „geaendert“). Ersetzt werden nur Bilder mit demselben Präfix.
Die Bilder sind groß genug, um Überläufe, Überlappungen und Umbrüche zu erkennen.
"""

import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw


def slide_number(path):
    return int(re.search(r"(\d+)\.png$", path.name).group(1))


def main():
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    only = {int(x) for x in sys.argv[3].split(",")} if len(sys.argv) > 3 and sys.argv[3] else None
    prefix = sys.argv[4] if len(sys.argv) > 4 else "uebersicht"
    files = sorted(src.glob("slide-*.png"), key=slide_number)
    if only:
        files = [f for f in files if slide_number(f) in only]
    dst.mkdir(parents=True, exist_ok=True)
    for old in dst.glob(f"{prefix}-*.jpg"):
        old.unlink()

    tw, th, cols, rows = 800, 450, 2, 3
    per = cols * rows
    for start in range(0, len(files), per):
        chunk = files[start : start + per]
        sheet = Image.new("RGB", (cols * tw + (cols + 1) * 10, rows * (th + 24) + 10), "white")
        draw = ImageDraw.Draw(sheet)
        for i, f in enumerate(chunk):
            img = Image.open(f).convert("RGB").resize((tw, th), Image.LANCZOS)
            x = 10 + (i % cols) * (tw + 10)
            y = 10 + (i // cols) * (th + 24)
            draw.text((x, y), f"Folie {slide_number(f)}", fill="red")
            sheet.paste(img, (x, y + 14))
            draw.rectangle([x - 1, y + 13, x + tw, y + 14 + th], outline="#999999")
        out = dst / f"{prefix}-{start // per + 1:02d}.jpg"
        sheet.save(out, quality=88)
        print(out)


if __name__ == "__main__":
    main()
