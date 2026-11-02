# Inhaltsleitfaden

Was auf die Folien kommt, in welcher Reihenfolge und wie es formuliert wird. Das Ziel: eine
**Reise durch das Notebook**, die nebenbei etwas beibringt – ohne zu überfordern.

## Inhalt

1. Zielgruppe und Haltung
2. Die Reise: Gesamtaufbau
3. Stationen aus dem Notebook ableiten
4. Dramaturgie innerhalb einer Station
5. Eine Folie, eine Botschaft
6. Code-Folien und die Lernbox
7. Konzepte sichtbar machen
8. Zahlen und Fakten
9. Übungen
10. Rahmenfolien
11. Sprache
12. Sprechernotizen
13. Gliederung schreiben
14. Checkliste für den Inhalt

---

## 1. Zielgruppe und Haltung

Fest für alle Präsentationen dieses Skills:

- **Publikum:** Menschen, die gerade in Data Science einsteigen und einen leichten
  Softwareentwicklungs-Hintergrund haben. Sie kennen Funktionen, Variablen, Tests, Konfiguration
  – aber noch nicht Train/Test-Split, Overfitting oder Pipelines.
- **Sprache:** Deutsch, per „du“ (wie die Notebooks).
- **Haltung:** Erklären statt beeindrucken. Jede Folie beantwortet „Warum machen wir das?“ und
  „Was nehme ich mit?“. Lieber ein Schritt mehr als ein Sprung, bei dem jemand verloren geht.

Weil die Leute aus der Softwareentwicklung kommen, sind **Analogien aus ihrer Welt** das
stärkste Werkzeug. Bewährt haben sich:

| Data-Science-Begriff | Analogie |
|---|---|
| Features `X` / Label `y` | Argumente / Rückgabewert einer Funktion |
| `fit()` / `predict()` | erst konfigurieren, dann aufrufen |
| Modell lernen statt programmieren | Regel aus Beispielen ableiten statt selbst schreiben |
| `random_state` | fester Seed in Tests |
| Testdaten | Klausur – wer die Fragen kennt, hat eine geschönte Note |
| Kreuzvalidierung | flaky Tests – ein grüner Lauf beweist wenig |
| Pipeline | gut gekapseltes Modul; Funktionskomposition |
| Hyperparameter / gelernte Parameter | Konfigurationswerte, CLI-Flags / zur Laufzeit berechnete Werte |
| Grid Search | verschachtelte for-Schleifen |
| Input-Validierung vor `predict()` | Request-Validierung vor dem Handler |
| Gespeichertes Modell (`joblib`) | Build-Artefakt, das deployt wird |

Analogien kommen in die Lernbox, als kursive „≈ …“-Zeile auf Karten oder als eigene kleine Karte.
Sie ergänzen die Erklärung, ersetzen sie aber nicht.

## 2. Die Reise: Gesamtaufbau

```
Einstieg        Titel · Reiseroute · Lernziele · (Begriffe vorab)
Station 1..N    Kapitelfolie · Inhaltsfolien · (Übung + Lösung)
Zusammenfassung Rückblick · Regeln für den Spickzettel · Ausblick
```

Die Reihenfolge folgt dem Notebook – wer die Präsentation gesehen hat, findet sich danach im
Notebook sofort zurecht. Umstellen nur, wenn das Notebook selbst etwas vorgreift.

Die **Anzahl der Folien ist offen**; als Richtwert ergibt ein Notebook mit 40–70 Zellen
40–65 Folien, plus zwei Folien je Aufgabe (Übung + Lösung). Kurze Folien sind schnell erklärt –
viele kurze Folien überfordern weniger als wenige volle.

## 3. Stationen aus dem Notebook ableiten

- Grundlage sind die **inhaltlichen Hauptabschnitte des Notebooks** (meist `##`, oft nummeriert).
  Eine Station pro Hauptabschnitt.
- **5 bis 9 Stationen.** Kleine Abschnitte zusammenlegen (z. B. „Laden“ + „Kontrolle“),
  sehr große aufteilen (z. B. „Prädiktive Modellierung“ → „Kreuzvalidierung“ + „Vergleich“).
- Jede Station bekommt: `name` (ein Wort, für Kicker und Rückblick), `full` (Titel der
  Kapitelfolie), `line` (Halbsatz für die Reiseroute, z. B. „Train & Test trennen“) und ein `icon`.
- Rahmenabschnitte des Notebooks (Einleitung, Lernziele, Setup/Imports, Checkliste am Ende) sind
  keine Stationen – sie fließen in Einstieg und Zusammenfassung ein. Dasselbe gilt für
  Überblicksabschnitte ohne eigenen Code (z. B. „Vorhersage-Workflow“ mit einer Skizze): Sie werden
  eine Einstiegsfolie.
- Reine Import-Zellen bekommen keine eigene Folie.

## 4. Dramaturgie innerhalb einer Station

Ein bewährter Ablauf – nicht jede Station braucht alle Schritte:

1. **Kapitelfolie** – ein Satz: Was lernst du hier?
2. **Problem oder Frage** – warum brauchen wir das? Am besten mit echten Zahlen aus den Daten
   (Beispiel: Wertebereiche Age 0–80 gegen Fare 0–512).
3. **Konzept als Bild** – Skizze, Zahlenstrahl, Ablaufdiagramm, Vorher/Nachher. *Erst die Idee,
   dann der Code.*
4. **Code** – der Notebook-Code, der das Konzept umsetzt, mit Lernbox.
5. **Ergebnis** – Ausgabe, Diagramm oder große Zahl. Was bedeutet sie?
6. **Einordnung** – Vergleich, Grenzen, typischer Fehler („Niemals …“ / „Gut zu wissen …“).
7. **Übung + Lösung**, wenn das Notebook an dieser Stelle eine Aufgabe hat.

Vergleiche (vorher/nachher, A/B) immer als Paar zeigen: erst A, dann B mit der markierten
Änderung, dann beide zusammen im Diagramm.

## 5. Eine Folie, eine Botschaft

Bevor eine Folie entsteht, steht ihre Botschaft als ein Satz fest (siehe Gliederung, Abschnitt 13).
Alles auf der Folie dient diesem Satz.

Textmengen, an die wir uns halten:

| Element | Richtwert |
|---|---|
| Titel | max. ~45 Zeichen, eine Zeile, eine Aussage oder klare Frage |
| Lernbox | 2–4 Punkte, je max. ~110 Zeichen |
| Textblock neben einem Visual | max. ~40 Wörter |
| Kernaussage-Leiste | ein Satz, max. ~100 Zeichen |
| Karten | Titel 1–3 Wörter, Text max. ~20 Wörter |
| Code | max. 14 Zeilen (mit Ausgabe 9–11), max. 60 Zeichen pro Zeile |

Passt es nicht, wird geteilt – nie die Schrift verkleinert.

## 6. Code-Folien und die Lernbox

**Welcher Code kommt auf die Folie?** Der Code aus dem Notebook, der für die Botschaft nötig ist.
Erlaubt und erwünscht:

- Lange Aufrufe auf mehrere Zeilen umbrechen, ein Argument pro Zeile.
- Kurze deutsche Kommentare ergänzen, die erklären *warum* (`# gleiche Aufteilung bei jedem Lauf`).
- Unwichtiges weglassen (Zeitmessung, Ausgabe-Formatierung, Hilfsfunktionen) und das in den
  Sprechernotizen erwähnen.
- Einen Wert direkt einsetzen, wenn die Variable sonst erklärt werden müsste – dann als Kommentar
  festhalten (`cv=cv,  # cv = 5 Folds`).

Nicht erlaubt: Code verändern, sodass er etwas anderes tut als im Notebook, oder Code erfinden,
der im Notebook nicht vorkommt. Ausnahme: offensichtlich illustrative Skizzen („Wie
verschachtelte Schleifen“), die nicht als Notebook-Code ausgegeben werden.

**Ausgabe:** Die echte Ausgabe aus dem Notebook, bei Bedarf gekürzt („Ausgabe (gekürzt)“).

**Die Lernbox „Das nimmst du mit“** ist der wichtigste Teil der Code-Folie. Sie beschreibt nicht
den Code Zeile für Zeile, sondern was man *lernt*. Gute Punkte sind von dieser Art:

| Art | Beispiel |
|---|---|
| Prinzip | „Das Label gehört nie in X – sonst verrätst du dem Modell die Antwort. Das nennt man Data Leakage.“ |
| Konvention | „Vier Rückgabewerte, immer in dieser Reihenfolge: X_train, X_test, y_train, y_test.“ |
| Falle | „Beim Erstellen wird noch nichts gelernt – das passiert erst bei fit().“ |
| Einordnung des Ergebnisses | „72,2 %: klar besser als die Baseline (61,7 %).“ |
| Methode | „Gleiches Modell, gleiche Folds – nur eine Zeile geändert. So misst du den Effekt genau einer Änderung.“ |
| Analogie | „random_state macht Ergebnisse reproduzierbar – wie ein fester Seed in Tests.“ |

Schwache Punkte vermeiden: „Hier wird die Pipeline erstellt.“ (beschreibt nur), „Das ist wichtig.“
(leer), Wiederholung des Titels.

## 7. Konzepte sichtbar machen

Bevor Code kommt, braucht das Konzept ein Bild. Bewährte Formen:

- **Zahlenstrahl** mit Original- und transformierten Werten (Skalierung).
- **Balken auf gemeinsamer Achse** (unterschiedliche Wertebereiche).
- **Raster aus Blöcken** (Folds der Kreuzvalidierung, Kombinationen einer Grid Search, mit Gelb
  für „ausgewählt“).
- **Ablaufdiagramm** aus Kästen und Pfeilen (Pipeline, fit/transform, Validierung → Vorhersage).
- **Vorher/Nachher-Zeile** an einem echten Datensatz (ein Passagier durch die Pipeline).
- **Kleine Tabelle** mit Markierung (One-Hot-Encoding).
- **Streudiagramm-Skizze** (KNN-Nachbarschaft) – ausdrücklich als schematisch kennzeichnen.
- **Rechenweg** in Kästen (5 × 2 × 3 = 30).
- **Skizzen aus dem Notebook** (`assets/`), wenn sie das Konzept gut zeigen – PNG/JPG direkt.
  SVG-Diagramme (z. B. aus Mermaid) nicht einbinden, sondern mit Kästen und Pfeilen nachzeichnen:
  Beim Umwandeln gehen Leerzeichen verloren, und sie sind oft englisch.

Formeln immer mit einem durchgerechneten Beispiel mit einfachen Zahlen (μ = 50, σ = 10 → 70 wird zu 2).

## 8. Zahlen und Fakten

Falsche Zahlen auf einer Lernfolie sind schlimmer als keine. Deshalb:

- Jede Zahl auf einer Folie stammt aus einer **Notebook-Ausgabe**, aus dem **Notebook-Text**, aus
  den **Daten** oder aus einer **Berechnung mit dem Code des Notebooks**.
- Fehlt eine Zahl, die eine Folie stark machen würde (z. B. Scores pro Fold, Wertebereiche, ein
  transformierter Beispielwert), rechne sie mit dem Notebook-Code in der Projektumgebung nach
  (`.venv/bin/python`, gleiche Parameter, gleicher `random_state`). Prüfe vorher, dass deine
  Rechnung die Ausgaben des Notebooks reproduziert – erst dann ist sie vertrauenswürdig.
- Zusätzlich berechnete Zahlen in den Sprechernotizen kennzeichnen und dem Nutzer am Ende auflisten.
- Nichts schätzen, nichts runden, was das Notebook nicht rundet; keine „ungefähr“-Zahlen erfinden.
- Hat das Notebook keine Ausgaben, wurde es in Schritt 2 einmal komplett ausgeführt – die Zahlen
  stammen dann aus dieser ausgeführten Kopie. Läuft es nicht fehlerfrei, entsteht keine
  Präsentation (siehe SKILL.md); Folien ohne Zahlen sind keine Ausweichlösung.
- Deutsches Format auf Folien (71,3 %), Originalformat in Code und Ausgaben (0.713).
- Prozentpunkte und Prozent unterscheiden.

## 9. Übungen

Jede Aufgabe im Notebook („Aufgabe 1“, „Übung“) wird zu zwei Folien:

1. **Übung** (`exerciseSlide`): Aufgabe in einem Satz, 2–3 Tipps, Hinweis „erst selbst probieren“.
   Tipps geben Richtung, nicht die Lösung („Nur ein Baustein ändert sich.“).
2. **Lösung** (`codeSlide`): Musterlösung aus dem `<details>`-Block im Notebook oder – wenn der
   Nutzer zugestimmt hat – aus dem separaten Lösungs-Notebook (z. B. `solutions/`). Geänderte
   Zeilen markiert, Lernbox mit der Einsicht aus der Aufgabe. Ergebnisse stammen aus der
   ausgeführten Musterlösung.

Passt eine Lösung nicht auf eine Code-Folie (lange Funktion, große Tabelle, langer Text):
- Code: auf das Wesentliche kürzen oder auf zwei Folien verteilen, Auslassungen in den Notizen nennen.
- Tabellen (z. B. eine Triage mit 14 Einträgen): als `table()` mit Lernbox daneben zeigen.
- Text-Ergebnisse (z. B. eine Übergabe-Notiz): als Kartenraster oder nummerierte Punkte zusammenfassen.

Offene Aufgaben ohne Musterlösung (eigene Daten, Interpretationen) bekommen nur die Übungsfolie,
mit Tipps, worauf man achten sollte.

## 10. Rahmenfolien

| Folie | Inhalt |
|---|---|
| Titel | Kicker „HANDS-ON MACHINE LEARNING · NOTEBOOK n“ (Kurs/Nummer aus README oder Dateiname), Notebook-Titel, Untertitel „Eine Reise durch das Notebook – mit …“ (Datensatz, Hauptbibliothek) |
| Reiseroute | alle Stationen |
| Lernziele | die Lernziele des Notebooks, verdichtet auf 3–6 Karten |
| Begriffe vorab | optional, wenn das Notebook Grundbegriffe voraussetzt, die Einsteiger stolpern lassen |
| Rückblick | pro Station eine Zeile: die wichtigste Erkenntnis, gern mit Ergebniszahl |
| Regeln | 3–7 Merksätze, die man auf einen Spickzettel schreiben würde – Handlungsregeln, keine Fakten |
| Ausblick | die nächsten Notebooks laut README (1–3 Karten), dann „Fragen?“. Beim letzten Notebook der Reihe stattdessen: Checkliste am Ende des Notebooks, optionale Erweiterungen, Vergleich mit der Musterlösung |

## 11. Sprache

- Kurze Sätze, aktive Verben, „du“.
- Fachbegriffe beim ersten Auftreten erklären; englische Fachbegriffe bleiben englisch
  (Pipeline, Feature, Fold), werden aber auf Deutsch erklärt.
- Titel als Aussage oder echte Frage: „Ein Experiment ist kein Beweis“, „Wer braucht Skalierung?“.
- Neutral formulieren, keine Wertungen über Personen. Bei sensiblen Daten (z. B. Überleben,
  Krankheit) einmal klarstellen, dass es eine Lernaufgabe ist und kein Entscheidungssystem.

## 12. Sprechernotizen

Jede Folie bekommt 1–3 Sätze Notizen (`notes`-Parameter oder `slide.addNotes`): was man dazu
sagt, Hintergrund, der nicht auf die Folie passt, Hinweise auf Vereinfachungen und auf
zusätzlich berechnete Zahlen. Nicht den Folientext wiederholen.

## 13. Gliederung schreiben

Vor dem Code entsteht im Arbeitsordner eine `gliederung.md`. Sie zwingt dazu, jede Folie über
ihre Botschaft zu definieren, und macht Lücken sichtbar, bevor Arbeit in Layout fließt.

```markdown
# Gliederung: <Notebook-Titel>

Stationen: 1 Daten (LuDatabase) · 2 Aufteilen (LuSplit) · …

| Nr | Station | Typ | Titel | Botschaft (ein Satz) | Quelle (Zellen) |
|---|---|---|---|---|---|
| 1 | Einstieg | Titel | Skalierung & Hyperparameter-Tuning | – | 0 |
| 7 | 1 Daten | Code | Daten laden und fehlende Werte zählen | Erst schauen, dann entscheiden | 6, 7 |
| 14 | 3 Skalierung | Problem-Visual | Das Problem: vier Features, vier Maßstäbe | Fare dominiert jede Abstandsrechnung | 13, Daten |

Zusätzlich zu berechnen: Scores pro Fold für …, Wertebereiche von …
```

## 14. Checkliste für den Inhalt

- [ ] Jeder inhaltliche Abschnitt des Notebooks findet sich in einer Station oder im Einstieg wieder.
- [ ] Jede Aufgabe des Notebooks hat eine Übungsfolie (und, wenn vorhanden, eine Lösungsfolie).
- [ ] Jede Code-Folie hat eine Lernbox mit echten Erkenntnissen, nicht mit Beschreibungen.
- [ ] Vor jedem neuen Konzept kommt ein Bild, nicht direkt Code.
- [ ] Alle Zahlen sind belegt (Ausgabe, Text, Daten oder nachgerechnet); nachgerechnete sind in den Notizen markiert.
- [ ] Alle gezeigten Ausgaben stammen aus einem vollständigen, fehlerfreien Lauf des Notebooks.
- [ ] Kein Titel länger als eine Zeile; keine Folie mit mehr als einer Botschaft.
- [ ] Rückblick und Regeln passen zu dem, was in den Stationen wirklich vorkam.
- [ ] Ausblick nennt die tatsächlich nächsten Notebooks (README).
- [ ] Jede Folie hat Sprechernotizen.
