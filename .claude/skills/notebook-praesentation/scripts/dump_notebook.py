"""Gibt ein Jupyter-Notebook kompakt als Text aus: jede Zelle mit Nummer, Typ, Quelltext und Ausgaben.

Nutzung:
    python dump_notebook.py notebook.ipynb [--max-output 1500] [--images ORDNER]

Mit --images werden Bildausgaben (z. B. Plots) als PNG gespeichert, damit man sie sich ansehen kann.
Bilder, auf die Markdown-Zellen verweisen (z. B. assets/...), werden am Ende aufgelistet.
Nur Standardbibliothek – läuft mit jedem Python 3.
"""

import argparse
import base64
import json
import re
import sys
from pathlib import Path


def text_of(value):
    return "".join(value) if isinstance(value, list) else (value or "")


def status(nb):
    """Wie vollständig ist das Notebook ausgeführt? Liefert (Code-Zellen, ausgeführt, Fehlerzellen)."""
    code = [c for c in nb["cells"] if c["cell_type"] == "code" and text_of(c.get("source")).strip()]
    executed = [c for c in code if c.get("execution_count") is not None]
    errors = [i for i, c in enumerate(nb["cells"])
              if any(o.get("output_type") == "error" for o in c.get("outputs", []))]
    return len(code), len(executed), errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("notebook")
    parser.add_argument("--max-output", type=int, default=1500, help="Zeichen pro Ausgabe, danach gekürzt")
    parser.add_argument("--images", help="Ordner für Bildausgaben")
    parser.add_argument("--status", action="store_true",
                        help="nur prüfen: Exit 0 = vollständig und fehlerfrei ausgeführt, 1 = nicht (vollständig) ausgeführt, 2 = Fehlerausgaben")
    args = parser.parse_args()

    nb = json.loads(Path(args.notebook).read_text(encoding="utf-8"))
    n_code, n_exec, errors = status(nb)
    summary = f"STATUS: {n_exec} von {n_code} Code-Zellen ausgeführt, Fehlerausgaben in Zellen: {errors or 'keine'}"
    if args.status:
        print(summary)
        sys.exit(2 if errors else 0 if n_exec == n_code and n_code else 1)
    print(summary)
    if errors or n_exec < n_code:
        print("WARNUNG: Notebook ist nicht vollständig und fehlerfrei ausgeführt – erst scripts/run_notebook.sh nutzen.")
    image_dir = Path(args.images) if args.images else None
    if image_dir:
        image_dir.mkdir(parents=True, exist_ok=True)
    referenced = []

    for i, cell in enumerate(nb["cells"]):
        kind = cell["cell_type"]
        source = text_of(cell.get("source"))
        print(f"--- [{i}] {kind} ---")
        print(source)
        if kind == "markdown":
            referenced += re.findall(r"!\[[^\]]*\]\(([^)\s]+)", source)
            referenced += re.findall(r'<img[^>]+src="([^"]+)"', source)
            continue
        for k, out in enumerate(cell.get("outputs", [])):
            data = out.get("data", {})
            if "text" in out:
                text = text_of(out["text"])
            elif "text/plain" in data:
                text = text_of(data["text/plain"])
            elif out.get("output_type") == "error":
                text = f"{out.get('ename')}: {out.get('evalue')}"
            else:
                text = ""
            if text:
                cut = text[: args.max_output]
                print(">>> AUSGABE:\n" + cut + ("\n[… gekürzt]" if len(text) > len(cut) else ""))
            if "image/png" in data:
                if image_dir:
                    target = image_dir / f"zelle{i:02d}_{k}.png"
                    target.write_bytes(base64.b64decode(text_of(data["image/png"])))
                    print(f">>> BILD: {target}")
                else:
                    print(">>> BILD (mit --images speichern)")

    if referenced:
        print("--- Verweise auf Bilder in Markdown-Zellen ---")
        for ref in dict.fromkeys(referenced):
            print(ref)


if __name__ == "__main__":
    main()
