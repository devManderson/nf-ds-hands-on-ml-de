#!/usr/bin/env bash
# Richtet alles ein, was der Skill braucht, und gibt export-Zeilen aus:
#   eval "$(bash setup.sh)"
#
# - Node.js mit pptxgenjs, react-icons, react, react-dom und sharp
# - eine Python-Umgebung mit python-pptx, lxml, defusedxml und Pillow (Validierung, Übersichtsbilder)
#
# Alles landet in einem Cache außerhalb des Projekts, damit es nur beim ersten Mal geladen wird:
#   ${NOTEBOOK_PRAESENTATION_CACHE:-~/.cache/notebook-praesentation}
# Fortschrittsmeldungen gehen nach stderr, stdout enthält nur die export-Zeilen.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CACHE="${NOTEBOOK_PRAESENTATION_CACHE:-${XDG_CACHE_HOME:-$HOME/.cache}/notebook-praesentation}"
NODE_VERSION="v22.11.0"
mkdir -p "$CACHE"
log() { echo "[setup] $*" >&2; }

# --- Node.js ---
# Ein Windows-Node unter /mnt/c kann mit Linux-Pfaden nicht umgehen, deshalb zählt nur ein Linux-Node.
NODE_BIN=""
if command -v node >/dev/null 2>&1 && [[ "$(command -v node)" != /mnt/* ]]; then
  NODE_BIN="$(dirname "$(command -v node)")"
elif [ -x "$CACHE/node/bin/node" ]; then
  NODE_BIN="$CACHE/node/bin"
else
  case "$(uname -s)-$(uname -m)" in
    Linux-x86_64) PLATFORM="linux-x64" ;;
    Linux-aarch64) PLATFORM="linux-arm64" ;;
    Darwin-x86_64) PLATFORM="darwin-x64" ;;
    Darwin-arm64) PLATFORM="darwin-arm64" ;;
    *) log "Unbekannte Plattform $(uname -s)-$(uname -m) – bitte Node.js selbst installieren."; exit 1 ;;
  esac
  log "Lade Node.js $NODE_VERSION ($PLATFORM) …"
  TMP="$(mktemp -d)"
  curl -fsSL "https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-$PLATFORM.tar.gz" -o "$TMP/node.tgz"
  tar -xzf "$TMP/node.tgz" -C "$TMP"
  rm -rf "$CACHE/node" && mv "$TMP/node-$NODE_VERSION-$PLATFORM" "$CACHE/node"
  rm -rf "$TMP"
  NODE_BIN="$CACHE/node/bin"
fi

# --- npm-Pakete ---
JS="$CACHE/js"
if [ ! -d "$JS/node_modules/pptxgenjs" ] || [ ! -d "$JS/node_modules/sharp" ]; then
  log "Installiere pptxgenjs, react-icons, react, react-dom, sharp …"
  mkdir -p "$JS"
  (cd "$JS" && [ -f package.json ] || PATH="$NODE_BIN:$PATH" npm init -y >/dev/null)
  (cd "$JS" && PATH="$NODE_BIN:$PATH" npm install --no-audit --no-fund \
    pptxgenjs@3.12.0 react-icons@5.3.0 react@18.3.1 react-dom@18.3.1 sharp@0.33.5 >&2)
fi

# --- Python-Umgebung ---
PY="$CACHE/py/bin/python"
if [ ! -x "$PY" ] || ! "$PY" -c "import pptx, lxml, defusedxml, PIL" 2>/dev/null; then
  log "Richte Python-Umgebung ein …"
  if command -v uv >/dev/null 2>&1; then
    uv venv -q --allow-existing "$CACHE/py" >&2
    VIRTUAL_ENV="$CACHE/py" uv pip install -q python-pptx lxml defusedxml Pillow >&2
  else
    python3 -m venv "$CACHE/py"
    "$PY" -m pip install -q python-pptx lxml defusedxml Pillow >&2
  fi
fi

log "Fertig: Node $("$NODE_BIN/node" --version), Cache $CACHE"
echo "export PATH=\"$NODE_BIN:\$PATH\""
echo "export NODE_PATH=\"$JS/node_modules\""
echo "export DECK_LIB=\"$HERE/deck_lib.js\""
echo "export DECK_PY=\"$PY\""
