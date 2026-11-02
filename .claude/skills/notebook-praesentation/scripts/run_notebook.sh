#!/usr/bin/env bash
# Stellt sicher, dass ein Notebook vollständig und fehlerfrei ausgeführt vorliegt.
#
#   run_notebook.sh NOTEBOOK.ipynb ARBEITSORDNER [PROJEKT-PYTHON]
#
# 1. Ist das Notebook schon vollständig ausgeführt und ohne Fehler, gibt es nichts zu tun
#    (Exit 0, letzte Zeile: Pfad des Original-Notebooks).
# 2. Sonst wird eine Kopie des Projekts in ARBEITSORDNER/sandbox ausgeführt – das Original-Projekt
#    bleibt unberührt (Exporte, artifacts/ usw. landen nur in der Kopie).
#    Ohne Fehler: Exit 0, letzte Zeile: Pfad der ausgeführten Kopie.
#    Mit Fehler:  Exit 2, Zelle und Fehlermeldung stehen in der Ausgabe – dann keine Präsentation bauen.
#
# PROJEKT-PYTHON ist standardmäßig <git-root>/.venv/bin/python. nbclient wird nicht in diese Umgebung
# installiert, sondern in den Cache des Skills und nur über PYTHONPATH eingebunden.
set -euo pipefail

NB="$(realpath "$1")"
WORK="$(realpath -m "$2")"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECK_PY="${DECK_PY:-python3}"
ROOT="$(git -C "$(dirname "$NB")" rev-parse --show-toplevel 2>/dev/null || dirname "$NB")"
PY="${3:-$ROOT/.venv/bin/python}"
mkdir -p "$WORK"

set +e
"$CHECK_PY" "$HERE/dump_notebook.py" "$NB" --status
status=$?
set -e
if [ "$status" -eq 0 ]; then
  echo "$NB"
  exit 0
fi

if [ ! -x "$PY" ]; then
  echo "Kein Projekt-Python gefunden ($PY). Frag den Nutzer, mit welchem Python das Notebook laufen soll." >&2
  exit 4
fi

# nbclient für genau diese Python-Version im Cache bereitstellen
CACHE="${NOTEBOOK_PRAESENTATION_CACHE:-${XDG_CACHE_HOME:-$HOME/.cache}/notebook-praesentation}"
PYVER="$("$PY" -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")')"
RUNNER="$CACHE/nbrunner-py$PYVER"
if ! PYTHONPATH="$RUNNER" "$PY" -c "import nbclient, nbformat, ipykernel" 2>/dev/null; then
  echo "[run] Installiere nbclient für Python $PYVER nach $RUNNER …" >&2
  if "$PY" -c "import ipykernel, jupyter_client" 2>/dev/null; then
    pkgs=(--no-deps nbclient nbformat fastjsonschema)   # Rest bringt die Projektumgebung mit
  else
    pkgs=(nbclient nbformat ipykernel)
  fi
  if command -v uv >/dev/null 2>&1; then
    uv pip install -q --python "$PY" --target "$RUNNER" "${pkgs[@]}" >&2
  else
    "$PY" -m pip install -q --target "$RUNNER" "${pkgs[@]}" >&2
  fi
fi

# Projekt ohne Git, Umgebungen und Ausgabeordner in eine Sandbox kopieren
SANDBOX="$WORK/sandbox"
rm -rf "$SANDBOX" && mkdir -p "$SANDBOX"
tar -C "$ROOT" --exclude=./.git --exclude=./.venv --exclude=./venv --exclude=./docs --exclude=./.claude \
    --exclude=node_modules --exclude=__pycache__ --exclude=.ipynb_checkpoints -cf - . | tar -C "$SANDBOX" -xf -
REL="${NB#"$ROOT"/}"
STEM="$(basename "$NB" .ipynb)"
TARGET="$WORK/$STEM.ausgefuehrt.ipynb"

echo "[run] Führe $REL in der Sandbox aus (das kann einige Minuten dauern) …" >&2
set +e
(cd "$SANDBOX/$(dirname "$REL")" && PYTHONPATH="$RUNNER" "$PY" "$HERE/execute_notebook.py" "$SANDBOX/$REL" "$TARGET")
rc=$?
set -e
if [ "$rc" -ne 0 ]; then
  echo "[run] Das Notebook läuft nicht fehlerfrei durch – keine Präsentation bauen." >&2
  exit 2
fi
echo "$TARGET"
