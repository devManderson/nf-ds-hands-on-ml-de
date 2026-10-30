# Machine Learning in der Praxis

Eine praxisnahe Einführung in zentrale Techniken des Machine Learnings. Im angeleiteten Notebook skalierst du Features, tunst Hyperparameter und vergleichst Modelle mit Kreuzvalidierung auf den Titanic-Daten. In der Aufgabe verknüpfst du einen Lehrdatensatz zu Herzerkrankungen aus PostgreSQL, prüfst die Kodierung seiner Zielvariable und die Datenqualität und erstellst einen Klassifikator für dokumentierte Erkrankungen. Lade zum Schluss die gespeicherte Titanic-Pipeline neu, validiere neue Eingaben und gib Vorhersagen mit einem Report zur Eingabequalität ab.

## Lernziele

Am Ende dieses Repositorys kannst du:

- dem Machine-Learning-Workflow folgen, vom Festlegen eines Ziels bis zur Evaluation eines Modells.
- Features mit Standardisierung und Min-Max-Skalierung skalieren und diese von der Zeilennormalisierung unterscheiden.
- Modelle mit K-facher Kreuzvalidierung zuverlässig validieren.
- Hyperparameter mit Grid Search und Randomized Search tunen.
- Daten aus einer SQL-Datenbank abrufen und verknüpfen, um einen Trainingsdatensatz zusammenzustellen.
- die Quelle eines Datensatzes, seine Feature-Definitionen, fehlenden Werte und die Kodierung seiner Zielvariable vor der Modellierung prüfen.
- den vollständigen Workflow von Anfang bis Ende anwenden, um einen Klassifikator für ein neues Problem zu erstellen.
- eine trainierte Pipeline speichern und neu laden, neue Eingaben validieren und Batch-Vorhersagen interpretieren.

## Lernpfad

> [!TIP]
> Starte mit dem Leitfaden [**Machine-Learning-Workflow**](machine_learning_workflow.md). Er geht jeden Schritt eines ML-Projekts durch (Ziel festlegen, Daten beschaffen, aufteilen, erkunden, modellieren, evaluieren) und gibt dir den Überblick über das, was du in den Notebooks übst.

Die Notebooks bauen der Reihe nach aufeinander auf:

| Datei / Ordner | Beschreibung |
|---|---|
| [**Der Machine-Learning-Workflow**](machine_learning_workflow.md) | Schritt-für-Schritt-Überblick über ein ML-Projekt von Anfang bis Ende. Lies das zuerst. |
| [**1 - Skalierung & Hyperparameter-Tuning**](1_scaling_hyperparameter_tuning.ipynb) | Eine Mehrheitsklassen-Baseline festlegen, unskalierte und skalierte Modelle mit denselben CV-Folds vergleichen, KNN tunen und dann einmal auf den Testdaten evaluieren. |
| [**2 - Aufgabe: Machine Learning**](2_exercise_machine_learning.ipynb) | Fünf PostgreSQL-Tabellen verknüpfen, die invertierte Zielvariable korrigieren, Qualitätsprobleme behandeln und den vollständigen Klassifikations-Workflow in sieben angeleiteten Etappen üben. |
| [**3 - Vom Training zu Vorhersagen**](3_from_training_to_predictions.ipynb) | Die festgeschriebene Titanic-Pipeline neu laden, erfundene Requests validieren, batchweise vorhersagen, die Empfindlichkeit untersuchen und eine Übergabe vorbereiten. Enthält sechs Aufgaben. |

Führ für Notebook 3 zuerst Notebook 1 bis einschließlich **Export für Notebook 3** aus.
Die gespeicherte Pipeline lässt sich in einem frisch gestarteten Kernel laden. Lass ihre Konfiguration unverändert;
die neuen erfundenen Requests haben keine tatsächlichen Labels und können die Accuracy nicht belegen.

### Weitere Ordner und Dateien

| Datei / Ordner | Beschreibung |
|---|---|
| [**Data**](data/) | Titanic-Dateien und ein erfundener Vorhersage-Batch für Notebook 3. Die ältere vorverarbeitete Titanic-CSV bleibt nur zum Nachschlagen erhalten; Notebook 2 liest aus PostgreSQL. |
| [**Assets**](assets/) | In den Notebooks und im Workflow-Leitfaden verwendete Bilder. |
| [**Solutions**](solutions/) | Musterlösungen. |
| [**.env.example**](.env.example) | Template für die Zugangsdaten zur Datenbank für Notebook 2; kopiere es in eine lokale `.env`. |
| [**pyproject.toml**](pyproject.toml) | Projektkonfiguration und Abhängigkeiten. |
| [**uv.lock**](uv.lock) | Lock-Datei für die Abhängigkeiten. |

Die Notebooks erstellen ein lokales, von Git ignoriertes Verzeichnis `artifacts/` für die gespeicherte
Titanic-Pipeline, die Metadaten, die Vorhersage-Reports und deine Modellübergabe.
Wenn du die Aufgaben abgeschlossen hast, nutz die Musterlösungen für
[Notebook 2](solutions/2_exercise_machine_learning.ipynb) und
[Notebook 3](solutions/3_from_training_to_predictions.ipynb), um deine Entscheidungen zu vergleichen.

## Setup

Verwende [uv](https://docs.astral.sh/uv/getting-started/installation/) 0.13.5 oder neuer
und Python 3.13.17 oder ein neueres Patch-Release von 3.13, wie in
[`.python-version`](.python-version) festgelegt.

> [!NOTE]
> In allen Schritten ist Text in spitzen Klammern wie `<repo-name>` ein **Platzhalter**. Ersetz ihn samt den Klammern `< >` durch deinen eigenen Wert. Aus `cd <repo-name>` wird zum Beispiel `cd ds-hands-on-ml`.

### 1. Repository aus dem Template erstellen

Klick auf GitHub auf **Use this template**.

Beim Erstellen des Repositorys:

- Leg dich selbst als **Owner** fest
- Wähl einen Namen für das Repository
- Deaktiviere **Include all branches**
- Klick auf **Create repository**

> [!IMPORTANT]
> Wenn du zu zweit oder in einer Gruppe arbeitest, erledigt nur **eine Person** diesen Schritt.

---

### 2. Collaborators hinzufügen (nur bei Paar- oder Gruppenarbeit)

Wenn du mit Teammitgliedern arbeitest:

1. Öffne das Repository auf GitHub
2. Geh zu **Settings → Collaborators**
3. Füg deine Teammitglieder als Collaborators hinzu
4. Teil den Link zum Repository mit deinem Team

Die Teammitglieder sollten die Einladung annehmen, bevor sie weitermachen.

---

### 3. Repository klonen

Kopiere die SSH-URL über den Button **Code** auf GitHub und führ dann Folgendes aus:

```bash
git clone <copied-ssh-url>
```

Die kopierte SSH-URL hat die Form `git@github.com:<your-username>/<repo-name>.git`.

---

### 4. In den Projektordner wechseln und Abhängigkeiten installieren

Das installiert alle Abhängigkeiten und erstellt eine virtuelle Umgebung in `.venv/`.

```bash
cd <repo-name>
uv sync
```

---

### 5. Datenbankverbindung einrichten

Notebook 2 und seine Lösung verwenden die gemeinsam genutzte PostgreSQL-Datenbank.
Frag dein Coaching-Team nach den Verbindungsdaten und nach Lesezugriff auf das Schema `heart`.
Die Notebooks 1 und 3 verwenden die mitgelieferten Titanic-Dateien und brauchen keine Zugangsdaten.

Kopiere das Template:

```bash
cp .env.example .env
```

Trag `DATABASE`, `USER_DB`, `PASSWORD`, `HOST` und `PORT` ein.
Das Notebook baut die URL automatisch; gib das Passwort unverändert ein,
ohne URL-Kodierung. Ein vorhandener vollständiger `DB_STRING` wird ebenfalls unterstützt.

Die Datenbank ist eine Lehrfassung, keine exakte Kopie der ursprünglichen Datei
von UCI. Ihr Feld `heart_attack` ist invertiert: **1 bedeutet keine Krankheit dokumentiert,
0 bedeutet Krankheit vorhanden**. Notebook 2 erklärt, wie du dieses Feld beibehältst und
`disease_present = 1 - heart_attack` ableitest, wobei Klasse 1 Krankheit bedeutet.
Das ist keine Vorhersage künftiger Herzinfarkte.

> [!CAUTION]
> `.env` und Datenbankexporte dürfen nie per Commit ins Repo gelangen. Beide werden von Git ignoriert. Die bereitgestellten Abfragen in den Notebooks verwenden schreibgeschützte Transaktionen.

---

### 6. Notebooks öffnen

> [!NOTE]
> Achte darauf, VS Code im Stammverzeichnis des Projekts zu öffnen, damit es die von `uv sync` erstellte Umgebung automatisch erkennt.

Starte VS Code im Stammverzeichnis des Projekts:

```bash
code .
```

Öffne dann ein Notebook und wähl die von `uv sync` erstellte Python-Umgebung als Kernel aus.

## Quellen & weiterführende Literatur

- [**UCI Heart Disease**](https://archive.ics.uci.edu/dataset/45/heart+disease): Originaldaten aus Cleveland, Definitionen der Attribute und die Lizenz des Datensatzes.
- [**Der Machine-Learning-Workflow**](machine_learning_workflow.md): Der Schritt-für-Schritt-Leitfaden in diesem Repo, dein Ausgangspunkt.
- [**Feature Engineering**](https://github.com/neuefische/ds-feature-engineering): Begleitendes Bootcamp-Repo, um beim Feature Engineering tiefer einzusteigen (Imputation, Kodierung, Binning, Erstellung von Features).
- [**Scikit-learn: Preprocessing data**](https://scikit-learn.org/stable/modules/preprocessing.html): Standardisierung, Normalisierung und andere Skalierungsmethoden.
- [**Scikit-learn: Cross-validation**](https://scikit-learn.org/stable/modules/cross_validation.html): Die Leistung von Estimators evaluieren und Overfitting vermeiden.
- [**Scikit-learn: Tuning hyperparameters**](https://scikit-learn.org/stable/modules/grid_search.html): Grid Search, Randomized Search und Successive Halving.
- [**Scikit-learn: Model persistence**](https://scikit-learn.org/stable/model_persistence.html): Trainierte Modelle und ihre Umgebungen speichern und neu laden.
