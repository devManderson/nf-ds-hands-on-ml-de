---
name: notebook-praesentation
description: Erstellt aus einem Jupyter-Notebook (.ipynb) eine Lern-Präsentation als PowerPoint-Datei (.pptx) in docs/ – auf Deutsch, für Data-Science-Einsteiger mit leichtem Softwareentwicklungs-Hintergrund, im minimalistischen Design „Tinte und Textmarker“, als Schritt-für-Schritt-Reise durch das Notebook mit Code-Folien und „Das nimmst du mit“-Lernboxen, Übungen, Rückblick und Sprechernotizen. Verwende diesen Skill immer, wenn jemand aus einem Notebook Folien, eine Präsentation, ein Deck, eine Lern- oder Unterrichtspräsentation oder Schulungsmaterial machen möchte – auch wenn PowerPoint nicht ausdrücklich genannt wird oder nur der Notebook-Name fällt („mach mir Folien zu 3_from_training_to_predictions“).
---

# Notebook → Lern-Präsentation

Dieser Skill macht aus einem Jupyter-Notebook eine PowerPoint-Präsentation, die Einsteiger
Schritt für Schritt durch das Notebook führt und ihnen dabei etwas beibringt. Vorbild ist die
Präsentation zu `1_scaling_hyperparameter_tuning.ipynb` (61 Folien), deren Generator als
`scripts/beispiel_titanic.js` beiliegt.

**Festgelegt – nicht nachfragen:** Sprache Deutsch („du“), Publikum Data-Science-Einsteiger mit
leichtem Softwareentwicklungs-Hintergrund, Design „Tinte und Textmarker“. Der Nutzer hat
entschieden, dass jede Präsentation genau so aussieht. Nachgefragt wird nur in den Fällen, die
der Ablauf unten ausdrücklich nennt (Musterlösung verwenden? Datei überschreiben? Kein Python gefunden?).

**Nur für intakte Notebooks:** Eine Präsentation entsteht nur, wenn das Notebook vollständig und
fehlerfrei durchläuft. Bricht es ab, wird keine Präsentation gebaut – der Nutzer bekommt stattdessen
die Zelle und die Fehlermeldung (Schritt 2). Eine Präsentation zu einem kaputten Notebook würde
Lernende auf Code schicken, der bei ihnen nicht funktioniert.

**Ergebnis:** `docs/<notebook-name>.pptx` im Projekt (z. B. `docs/3_from_training_to_predictions.pptx`).
Existiert die Datei schon, frag nach, bevor du sie überschreibst.

## Dateien

| Datei | Inhalt | Wann lesen |
|---|---|---|
| `references/inhaltsleitfaden.md` | Zielgruppe, Aufbau der Reise, Stationen, Lernbox, Zahlenregeln, Übungen, Sprache | Vor dem Planen, vollständig |
| `references/styleguide.md` | Farben, Schriften, Raster, Bausteine, Folientypen, Diagramme, QA-Checkliste | Vor dem Bauen, vollständig |
| `scripts/deck_lib.js` | Bibliothek: Theme, Layouts, alle Bausteine und fertigen Folientypen | Beim Bauen; Kopf und Funktionssignaturen |
| `scripts/beispiel_titanic.js` | Komplettes Beispiel-Deck (61 Folien) | Als Vorlage: Kopf übernehmen, passende Folien nachschlagen |
| `scripts/setup.sh` | Node + npm-Pakete + Python-Umgebung (gecacht) | Schritt 1 |
| `scripts/run_notebook.sh` | Prüft, ob das Notebook ausgeführt ist; führt sonst eine Kopie in einer Sandbox aus | Schritt 2 und 3 |
| `scripts/dump_notebook.py` | Notebook kompakt als Text, Bildausgaben als PNG, Status mit `--status` | Schritt 4 |
| `scripts/render.sh` | Folien als PNG + Übersichtsbilder (PowerPoint unter WSL, sonst LibreOffice) | Schritt 9 |

## Ablauf

Alle Pfade wie `docs/`, `assets/`, `solutions/`, `.venv/` und `README.md` beziehen sich auf das
Projekt, in dem das Notebook liegt. Arbeite in einem eigenen Arbeitsordner (`$WORK`), am besten
im Scratchpad der Sitzung, sonst `mktemp -d`. Dort liegen ausgeführte Kopien, Gliederung,
Deck-Skript, Zwischenstände und Renderings – im Projekt landet am Ende nur die fertige `.pptx`.

### 1. Umgebung einrichten

```bash
SKILL=<Basisverzeichnis dieses Skills>
eval "$(bash "$SKILL/scripts/setup.sh")"   # setzt PATH, NODE_PATH, DECK_LIB, DECK_PY
PPTX="$(dirname "$(dirname "$(dirname "$(find ~/.claude -path '*pptx/scripts/office/validate.py' -print -quit 2>/dev/null)")")")"
```

Beim ersten Lauf lädt `setup.sh` Node.js und die npm-Pakete nach `~/.cache/notebook-praesentation`
(unter WSL gibt es oft kein Linux-Node; ein Windows-Node unter `/mnt/c` funktioniert nicht).
Die Variablen gelten nur in dieser Shell – in jedem späteren Bash-Aufruf die drei Zeilen erneut
voranstellen (geht schnell, weil alles gecacht ist).

`$PPTX` ist das Verzeichnis des pptx-Skills; von dort brauchst du nur `scripts/office/validate.py`
und `scripts/slide_text.py`. Den pptx-Skill selbst musst du nicht laden – seine allgemeinen
Designratschläge gelten hier nicht, der Styleguide dieses Skills hat Vorrang. Findet `find` nichts,
lade `anthropic-skills:pptx` nur, um sein Basisverzeichnis zu erfahren. Gibt es ihn gar nicht, prüfe
mindestens, dass `$DECK_PY -c "from pptx import Presentation as P; print(len(P('deck.pptx').slides))"`
die Datei öffnet.

### 2. Prüfen, ob das Notebook intakt ist

```bash
bash "$SKILL/scripts/run_notebook.sh" <notebook.ipynb> "$WORK"
```

Das Skript prüft zuerst, ob jede Code-Zelle ausgeführt ist und keine Fehlerausgabe hat.

- **Schon vollständig ausgeführt:** nichts zu tun. Letzte Ausgabezeile = Pfad des Originals.
- **Nicht (vollständig) ausgeführt oder mit Fehlerausgaben:** Das Skript kopiert das Projekt nach
  `$WORK/sandbox` (ohne `.git`, `.venv`, `docs`, `.claude`) und führt dort das Notebook einmal komplett
  mit dem Projekt-Python (`.venv/bin/python`) aus. So können Export-Zellen nichts im Projekt
  überschreiben. Läuft alles durch: Exit 0, letzte Zeile = Pfad der ausgeführten Kopie
  `$WORK/<name>.ausgefuehrt.ipynb`. Mit dieser Kopie arbeitest du ab jetzt.
- **Exit 2 – eine Zelle schlägt fehl:** **Hier aufhören, keine Präsentation bauen.** Berichte dem
  Nutzer, welche Zelle (Nummer und Quelltext) mit welcher Fehlermeldung abbricht, und was die
  Ursache sein dürfte (z. B. fehlende Datei, fehlende Datenbankverbindung in `.env`, absichtlich
  leere Übungszelle). Repariere nichts am Notebook.
- **Exit 4 – kein Projekt-Python gefunden:** Frag den Nutzer, mit welchem Python das Notebook laufen
  soll, und übergib es als drittes Argument.

`nbclient` landet dabei im Cache des Skills, nicht in der Projektumgebung – `.venv` und
`uv.lock` bleiben unverändert.

### 3. Musterlösung suchen und nachfragen

Viele Kurs-Repos legen Musterlösungen als eigenes Notebook ab, z. B. `solutions/<gleicher-name>.ipynb`
(auch `solution/`, `loesungen/` oder ähnlich), statt sie in `<details>`-Blöcken ins Notebook zu schreiben.

```bash
find <projekt> -ipath '*solution*' -name '<notebook-name>.ipynb' -o -ipath '*loesung*' -name '<notebook-name>.ipynb'
```

Gibt es so ein Notebook, **frag den Nutzer** (AskUserQuestion), ob die Lösungsfolien darauf
beruhen sollen – mit dem gefundenen Pfad in der Frage. Wenn ja, prüfe es genauso mit
`run_notebook.sh`. Läuft die Musterlösung nicht fehlerfrei, sag das dem Nutzer und frag, ob die
Präsentation ohne sie entstehen soll (dann nur Übungsfolien, Lösungsfolien nur aus `<details>`-Blöcken).
Gibt es keine separate Musterlösung, nutze die `<details>`-Blöcke im Notebook, ohne zu fragen.

### 4. Notebook und Umfeld lesen

```bash
$DECK_PY "$SKILL/scripts/dump_notebook.py" <ausgeführtes-notebook> --images "$WORK/nb-bilder" > "$WORK/notebook.txt"
```

Lies `notebook.txt` vollständig (bei großen Notebooks in Teilen). Achte auf: Überschriften,
Lernziele, Formeln, jede Code-Zelle mit Ausgabe, Aufgaben samt Musterlösungen, Verweise auf
Bilder in `assets/`. Sieh dir gespeicherte Plots und relevante Skizzen an. Mit Musterlösung:
diese genauso ausgeben und lesen. Lies auch die `README.md` des Projekts – für Kursname,
Reihenfolge der Notebooks und den Ausblick.

### 5. Gliederung schreiben

Lies `references/inhaltsleitfaden.md`. Leite die Stationen ab (5–9) und schreibe
`$WORK/gliederung.md` nach der Vorlage dort: jede Folie mit Typ, Titel, **Botschaft in einem
Satz** und Quellzellen. Notiere, welche Zahlen fehlen und nachgerechnet werden müssen. Die
Gliederung ist dein Plan – sie muss niemandem vorgelegt werden.

### 6. Fehlende Zahlen nachrechnen

Nur wenn die Gliederung Zahlen braucht, die das Notebook nicht ausgibt (Scores pro Fold,
Wertebereiche, ein Beispieldatensatz vor/nach der Transformation …). Rechne sie mit dem Code des
Notebooks und dem Projekt-Python nach – in `$WORK/sandbox`, falls es die gibt, sonst so, dass im
Projekt nichts geschrieben wird. Prüfe zuerst, dass deine Rechnung die vorhandenen Ausgaben exakt
reproduziert. Halte jede so gewonnene Zahl fest – sie kommt in die Sprechernotizen und in den
Abschlussbericht.

### 7. Deck-Skript schreiben

Lies `references/styleguide.md`. Schreibe `$WORK/deck.js` nach dem Muster von
`scripts/beispiel_titanic.js`:

```js
const { createDeck } = require(process.env.DECK_LIB);
const STATIONS = [{ name: "Daten", full: "Die Daten", line: "Titanic kennenlernen", icon: "LuDatabase" }, /* … */];

async function main() {
  const d = createDeck({ title, footer: `${title} · Notebook n`, author, stations: STATIONS, assets: "<projekt>/assets" });
  const { C, T, MX, CW, TOP, MONO, PCT, pm, tx, rect, line, content, divider, codeSlide, callout /* … */ } = d;
  await d.titleSlide({ kicker, title, subtitle, notes });
  await d.journeySlide(notes);
  await d.goalsSlide(goals, notes);
  d.divider(1, "Was du hier lernst …", notes);
  await codeSlide({ title, code, hl, output, takeaways, notes });
  // … freie Folien: const s = content(titel, notizen); dann Bausteine
  await d.recapSlide(lines, notes);
  d.rulesSlide(rules, notes);
  await d.outlookSlide({ cards, notes });
  await d.save(process.argv[2]);
}
main().catch((e) => { console.error(e); process.exit(1); });
```

`author` = `git config user.name`. Nutze für wiederkehrende Folien immer die fertigen
Folientypen und Bausteine der Bibliothek (Tabelle, Chips, Datei-Karten, Hinweis-Paar, Kartenraster …)
– das hält alle Präsentationen einheitlich. Freie Folien (Skizzen, Diagramme) komponierst du aus
`tx`, `rect`, `line`, `dot` und den Bausteinen; schau dir im Beispiel eine ähnliche Folie an, bevor
du eine neue Form erfindest. Fehlt dir ein Baustein, den du mehrfach brauchst, schreib ihn als
Funktion in `deck.js` und erwähne ihn im Abschlussbericht – dann kann er in die Bibliothek wandern.

Hinweise, die bei den ersten Decks Zeit gekostet haben:

- Lokale Variablen nicht so nennen wie Bibliotheksfunktionen (`steps`, `line`, `tx`, `table` …),
  wenn du diese per Destrukturierung holst – sonst `SyntaxError: Identifier has already been declared`.
- `C.<farbe>` (Schemafarbe) überall, außer in Hex-Optionen: Diagrammfarben, `valGridLine`, Linien
  innerhalb von `line()` und Rahmen (`line: { color }`) – dort `T.<farbe>`.
- Diagrammwerte skalieren und das passende Format setzen: Prozent `pm()` + `PCT`, Dezimalzahlen
  `dec()` + `DEC1`/`DEC2` – für Datenbeschriftung und Wertachse. So stehen deutsche Zahlen auf den
  Folien, unabhängig von der Office-Sprache. Referenzlinien kann pptxgenjs nicht – als zweite
  Datenreihe oder als Text lösen.
- Großer Monospace-Text bricht sonst um – `wrap: false` setzen.
- Die Lernbox wird aus der Textlänge bemessen; wirkt sie in der Sichtprüfung zu groß oder zu klein,
  `takeawayH` an `codeSlide` übergeben statt die Folie nachzubauen.
- pptxgenjs-Optionsobjekte nicht zwischen zwei Aufrufen teilen (sie werden verändert).

### 8. Bauen und prüfen

```bash
cd "$WORK" && node deck.js deck.pptx
$DECK_PY "$PPTX/scripts/office/validate.py" deck.pptx
$DECK_PY "$PPTX/scripts/slide_text.py" deck.pptx > text.md   # Inhalt gegenlesen: Tippfehler, Reihenfolge, Zahlen
```

### 9. Sichtprüfung

```bash
bash "$SKILL/scripts/render.sh" deck.pptx "$WORK/render"          # alle Folien → uebersicht-*.jpg
bash "$SKILL/scripts/render.sh" deck.pptx "$WORK/render" 7,12,30  # nach Korrekturen nur diese → geaendert-*.jpg
```

Unter WSL rendert das Skript mit dem installierten PowerPoint (unsichtbar; ein geöffnetes
PowerPoint wird nicht beendet) – das zeigt genau, was das Publikum sieht. Sonst nutzt es
LibreOffice. Gibt es keinen Renderer (Exit-Code 3), sag das dem Nutzer.

Sieh dir **jedes** Übersichtsbild `render/uebersicht-*.jpg` an und gehe die Checkliste am Ende
des Styleguides durch. Der erste Durchlauf hat praktisch immer ein paar echte Fehler (Überlauf,
Überlappung, umgebrochene Zahlen). Korrigiere sie im Deck-Skript, baue neu und rendere nur die
geänderten Folien erneut: `geaendert-*.jpg` zeigt genau diese, `uebersicht-*.jpg` bleibt
vollständig und aktuell. Hör auf, wenn sie sauber sind.

### 10. Abliefern

Kopiere `deck.pptx` nach `docs/<notebook-name>.pptx` (Ordner bei Bedarf anlegen). Berichte kurz:

- Pfad und Folienanzahl, Stationen in einer Zeile
- ob das Notebook (und die Musterlösung) für die Präsentation ausgeführt werden musste
- welche Zahlen nachgerechnet wurden (nicht direkt aus Notebook-Ausgaben)
- wo Code gegenüber dem Notebook gekürzt oder umgebrochen wurde, falls nennenswert
- dass die Präsentation validiert und gerendert geprüft wurde (oder warum nicht)
- wo das Deck-Skript liegt, falls Änderungen gewünscht sind

Nichts committen, wenn der Nutzer es nicht verlangt.
