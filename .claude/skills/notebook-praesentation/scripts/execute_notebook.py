"""Führt ein Notebook mit nbclient aus und speichert die ausgeführte Kopie.

Wird von run_notebook.sh mit dem Python des Projekts aufgerufen (dort liegen die Pakete,
die das Notebook braucht); nbclient kommt über PYTHONPATH aus dem Cache des Skills.

    python execute_notebook.py QUELLE.ipynb ZIEL.ipynb [--timeout 600]

Exit-Codes: 0 = ohne Fehler durchgelaufen, 2 = eine Zelle ist fehlgeschlagen.
Der Kernel startet im Ordner des Notebooks – wie in Jupyter.
"""

import argparse
import json
import os
import sys
import tempfile
from pathlib import Path

import nbformat
from nbclient import NotebookClient
from nbclient.exceptions import CellExecutionError, CellTimeoutError

KERNEL = "notebook-praesentation-python"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("target")
    parser.add_argument("--timeout", type=int, default=600, help="Sekunden pro Zelle")
    args = parser.parse_args()

    # Eigene Kernel-Definition mit genau diesem Python – sonst könnte ein anderswo
    # registrierter „python3“-Kernel mit anderen Paketen starten.
    spec_root = Path(tempfile.mkdtemp())
    spec_dir = spec_root / "kernels" / KERNEL
    spec_dir.mkdir(parents=True)
    (spec_dir / "kernel.json").write_text(json.dumps({
        "argv": [sys.executable, "-m", "ipykernel_launcher", "-f", "{connection_file}"],
        "display_name": "Projekt-Python",
        "language": "python",
    }))
    os.environ["JUPYTER_PATH"] = str(spec_root) + os.pathsep + os.environ.get("JUPYTER_PATH", "")

    source = Path(args.source).resolve()
    nb = nbformat.read(source, as_version=4)
    client = NotebookClient(nb, timeout=args.timeout, kernel_name=KERNEL,
                            resources={"metadata": {"path": str(source.parent)}})
    failed = False
    try:
        client.execute()
    except (CellExecutionError, CellTimeoutError) as err:
        failed = True
        for i, cell in enumerate(nb.cells):
            for out in cell.get("outputs", []):
                if out.get("output_type") == "error":
                    print(f"FEHLER in Zelle [{i}]: {out.get('ename')}: {out.get('evalue')}")
                    print("Quelltext der Zelle:\n" + cell.source)
                    break
            else:
                continue
            break
        else:
            print(f"FEHLER: {type(err).__name__}: {str(err)[:1500]}")
    nbformat.write(nb, args.target)
    print(("Teilweise ausgeführte Kopie: " if failed else "Ausgeführte Kopie: ") + args.target)
    sys.exit(2 if failed else 0)


if __name__ == "__main__":
    main()
