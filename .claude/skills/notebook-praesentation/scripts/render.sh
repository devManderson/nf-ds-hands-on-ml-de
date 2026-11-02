#!/usr/bin/env bash
# Rendert ein Deck zu PNGs (ZIEL/png/slide-01.png …) und baut daraus Übersichtsbilder
# (ZIEL/uebersicht-01.jpg …) für die Sichtprüfung.
#
#   render.sh deck.pptx ZIEL              # alle Folien
#   render.sh deck.pptx ZIEL 3,7,12       # nur diese neu rendern; uebersicht-* bleibt vollständig,
#                                         # zusätzlich zeigt geaendert-* nur diese Folien
#
# Weg 1: PowerPoint unter Windows (aus WSL) – zeigt genau, was das Publikum sieht.
# Weg 2: LibreOffice + pdftoppm – Schriften können leicht abweichen.
# Ohne beides bricht das Skript mit Exit-Code 3 ab; dann bleibt nur die Text- und Dateiprüfung.
set -euo pipefail

DECK="$(realpath "$1")"
OUT="$(realpath -m "$2")"
ONLY="${3:-}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PY="${DECK_PY:-python3}"
mkdir -p "$OUT/png"
[ -z "$ONLY" ] && rm -f "$OUT"/png/slide-*.png

rendered=""
if command -v powershell.exe >/dev/null 2>&1 && command -v wslpath >/dev/null 2>&1; then
  WINTEMP="$(powershell.exe -NoProfile -Command '[System.IO.Path]::GetTempPath()' | tr -d '\r')"
  WT="$(wslpath -u "$WINTEMP")/notebook_praesentation_$$"
  mkdir -p "$WT"
  cp "$DECK" "$WT/deck.pptx"
  cp "$HERE/render_ppt.ps1" "$WT/"
  if timeout 600 powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(wslpath -w "$WT/render_ppt.ps1")" \
       -Dir "$(wslpath -w "$WT")" -Only "$ONLY" >&2; then
    cp "$WT"/png/slide-*.png "$OUT/png/"
    rendered="PowerPoint"
  else
    echo "[render] PowerPoint-Export fehlgeschlagen, versuche LibreOffice …" >&2
  fi
  rm -rf "$WT"
fi

if [ -z "$rendered" ]; then
  SOFFICE="$(command -v soffice || command -v libreoffice || true)"
  if [ -n "$SOFFICE" ] && command -v pdftoppm >/dev/null 2>&1; then
    TMP="$(mktemp -d)"
    "$SOFFICE" --headless --convert-to pdf --outdir "$TMP" "$DECK" >&2
    pdftoppm -png -r 120 "$TMP"/*.pdf "$TMP/slide"
    for f in "$TMP"/slide-*.png; do
      n="$(basename "$f" .png | sed 's/slide-0*//')"
      if [ -z "$ONLY" ] || [[ ",$ONLY," == *",$n,"* ]]; then
        cp "$f" "$OUT/png/$(printf 'slide-%02d.png' "$n")"
      fi
    done
    rm -rf "$TMP"
    rendered="LibreOffice"
  fi
fi

if [ -z "$rendered" ]; then
  echo "[render] Weder PowerPoint (WSL) noch LibreOffice + pdftoppm gefunden – keine Bilder." >&2
  exit 3
fi
echo "[render] gerendert mit $rendered" >&2
# Übersichten aller Folien bleiben immer vollständig; bei einer Auswahl zusätzlich nur die geänderten
"$PY" "$HERE/contact_sheet.py" "$OUT/png" "$OUT"
[ -n "$ONLY" ] && "$PY" "$HERE/contact_sheet.py" "$OUT/png" "$OUT" "$ONLY" geaendert
exit 0
