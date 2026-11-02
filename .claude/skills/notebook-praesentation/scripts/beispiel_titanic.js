// Beispiel-Deck: Lern-Präsentation zu 1_scaling_hyperparameter_tuning.ipynb (Titanic, 61 Folien).
// Zeigt, wie die Bausteine aus deck_lib.js zu einer kompletten Präsentation kombiniert werden:
// fertige Folientypen (Titel, Reiseroute, Kapitel, Code-Folie, Übung, Rückblick …) plus
// frei komponierte Konzeptfolien (Zahlenstrahl, Diagramme, Tabellen, Skizzen).
// Aufruf: node beispiel_titanic.js <out.pptx> <assets-ordner>
const path = require("path");
const { createDeck } = require(process.env.DECK_LIB || path.join(__dirname, "deck_lib.js"));

const OUT = process.argv[2];
const ASSETS = process.argv[3];

// Eine Station pro Hauptabschnitt des Notebooks
const STATIONS = [
  { name: "Daten", full: "Die Daten", line: "Titanic kennenlernen", icon: "LuDatabase" },
  { name: "Aufteilen", full: "Aufteilen", line: "Train & Test trennen", icon: "LuSplit" },
  { name: "Skalierung", full: "Skalierung", line: "Zahlen vergleichbar machen", icon: "LuRuler" },
  { name: "Pipeline", full: "Pipeline", line: "Schritte verketten", icon: "LuWorkflow" },
  { name: "Kreuzvalidierung", full: "Kreuzvalidierung", line: "Fair bewerten", icon: "LuRepeat" },
  { name: "Vergleich", full: "Skalierung im Praxistest", line: "Bringt Skalierung was?", icon: "LuBarChart3" },
  { name: "Tuning", full: "Hyperparameter-Tuning", line: "Beste Einstellungen finden", icon: "LuSlidersHorizontal" },
  { name: "Abschluss", full: "Abschluss & Export", line: "Testen & speichern", icon: "LuSave" },
];

async function main() {
  const d = createDeck({
    title: "Skalierung & Hyperparameter-Tuning",
    footer: "Skalierung & Hyperparameter-Tuning · Notebook 1",
    author: "Marco Anderson",
    stations: STATIONS,
    assets: ASSETS,
  });
  const { pres, C, S, T, W, MX, CW, TOP, MONO, PCT, tx, rect, line, icon, iconCircle, divider, content, codeBlock, outputBlock, takeaway, codeSlide, statBlock, fraction, chartBase, callout, bullets, iconRows, steps, exerciseSlide } = d;
  let s;

  // ================= EINSTIEG =================
  // 1 Titel
  await d.titleSlide({
    kicker: "HANDS-ON MACHINE LEARNING · NOTEBOOK 1",
    title: "Skalierung & Hyperparameter-Tuning",
    subtitle: "Eine Reise durch das Notebook – mit dem Titanic-Datensatz und scikit-learn",
    notes: "Willkommen! Wir gehen heute Schritt für Schritt durch Notebook 1. Ziel ist nicht, jede Zeile auswendig zu können, sondern zu verstehen, warum jeder Schritt da ist.",
  });

  // 2 Reiseroute
  await d.journeySlide("Acht Stationen – genau in der Reihenfolge des Notebooks. Die Station steht oben links auf jeder Folie, damit man weiß, wo man gerade ist.");

  // 3 Lernziele (aus dem Notebook übernommen)
  await d.goalsSlide([
    { icon: "LuRuler", title: "Skalieren", text: "Numerische Features mit StandardScaler und MinMaxScaler skalieren – und wissen, wann das hilft." },
    { icon: "LuWorkflow", title: "Pipeline bauen", text: "Vorverarbeitung und Modell in einer einzigen scikit-learn-Pipeline bündeln." },
    { icon: "LuRepeat", title: "Kreuzvalidieren", text: "Modelle mit K-facher Kreuzvalidierung zuverlässiger bewerten als mit einem einzigen Split." },
    { icon: "LuSlidersHorizontal", title: "Tunen", text: "Hyperparameter mit GridSearchCV und RandomizedSearchCV finden und beide vergleichen." },
  ], "Das sind die vier Lernziele aus dem Notebook. Am Ende der Präsentation schauen wir zurück, ob wir sie erreicht haben.");

  // 4 Begriffe
  s = content("Drei Begriffe vorab", "Für alle mit Software-Hintergrund: Ein Modell ist im Grunde eine Funktion. Der Unterschied: Wir schreiben die Logik nicht selbst, sondern lassen sie aus Beispielen lernen.");
  const terms = [
    ["X", "Features", "Die Eingaben, aus denen das Modell lernt – z. B. Alter, Fahrpreis, Geschlecht.", "≈ die Argumente einer Funktion"],
    ["y", "Label", "Das, was wir vorhersagen wollen – hier: überlebt (1) oder nicht (0).", "≈ der Rückgabewert"],
    ["fit · predict", "Lernen & Anwenden", "fit() lernt aus Beispielen mit bekannter Antwort. predict() wendet das Gelernte auf neue Daten an.", "≈ erst konfigurieren, dann aufrufen"],
  ];
  for (let i = 0; i < 3; i++) {
    const x = MX + i * 4.14;
    rect(s, { x, y: 1.95, w: 3.85, h: 3.55, r: 0.1, fill: { color: C.background2 } });
    tx(s, terms[i][0], { x: x + 0.3, y: 2.15, w: 3.3, h: 0.8, fontSize: i === 2 ? 30 : 40, bold: true, fontFace: MONO, valign: "middle" });
    tx(s, terms[i][1], { x: x + 0.3, y: 3.05, w: 3.3, h: 0.45, fontSize: 20, bold: true });
    tx(s, terms[i][2], { x: x + 0.3, y: 3.55, w: 3.3, h: 1.2, fontSize: 15 });
    tx(s, terms[i][3], { x: x + 0.3, y: 4.85, w: 3.3, h: 0.4, fontSize: 14, italic: true, color: C.accent2 });
  }
  callout(s, "Machine Learning heißt: Statt die Regel selbst zu programmieren, lernt das Modell sie aus Beispielen.", { y: 5.85, h: 0.75 });

  // ================= 1 DATEN =================
  divider(1, "Wir lernen den Titanic-Datensatz kennen und wählen unsere Eingaben aus.", "Erste Station: Bevor wir irgendetwas modellieren, schauen wir uns die Daten an.");

  // 6 Datensatz
  s = content("Der Titanic-Datensatz", "Die Datei data/titanic.csv. Wichtig: Das ist eine historische Lernaufgabe – kein System, das entscheiden soll, wer Hilfe bekommt. Die ungleiche Verteilung (549 zu 342) merken wir uns für die Baseline.");
  statBlock(s, { x: MX, y: 1.8, w: 3.8, value: "891", label: "Passagiere (Zeilen)" });
  statBlock(s, { x: MX + 4.14, y: 1.8, w: 3.8, value: "12", label: "Spalten" });
  statBlock(s, { x: MX + 8.28, y: 1.8, w: 3.8, value: "0 / 1", label: "Ziel: Survived (nicht überlebt / überlebt)" });
  tx(s, "Die Klassen sind ungleich verteilt", { x: MX, y: 4.05, w: 8, h: 0.45, fontSize: 19, bold: true });
  const wNo = CW * 549 / 891;
  rect(s, { x: MX, y: 4.6, w: wNo - 0.04, h: 0.8, fill: { color: C.text1 } });
  rect(s, { x: MX + wNo + 0.04, y: 4.6, w: CW - wNo - 0.04, h: 0.8, fill: { color: C.accent1 } });
  tx(s, "549 nicht überlebt · 61,6 %", { x: MX + 0.25, y: 4.6, w: wNo - 0.5, h: 0.8, fontSize: 18, bold: true, color: C.background1, valign: "middle" });
  tx(s, "342 überlebt · 38,4 %", { x: MX + wNo + 0.3, y: 4.6, w: CW - wNo - 0.5, h: 0.8, fontSize: 18, bold: true, valign: "middle" });
  tx(s, "Merk dir die ≈ 62 %: So viel schafft später schon ein Modell, das einfach immer „nicht überlebt“ rät.", { x: MX, y: 5.7, w: CW, h: 0.5, fontSize: 16, italic: true, color: C.text2 });

  // 7 Laden
  await codeSlide({
    title: "Daten laden und fehlende Werte zählen",
    code: `
import pandas as pd

# Rohdaten laden
df = pd.read_csv("data/titanic.csv")
df.head()

# Fehlende Werte pro Spalte zählen
df.isnull().sum()`,
    output: `
Age         177
Cabin       687
Embarked      2
alle anderen  0`,
    outputLabel: "Ausgabe (gekürzt)",
    takeaways: [
      "Erst schauen, dann entscheiden: Zähle fehlende Werte, bevor du dich um sie kümmerst.",
      "Gefüllt wird später in der Pipeline – nicht jetzt mit Werten aus dem ganzen Datensatz.",
    ],
    notes: "df.head() zeigt die ersten Zeilen, isnull().sum() zählt Lücken pro Spalte. Age fehlt bei 177 Personen, Cabin fast überall. Wir füllen die Lücken bewusst noch nicht – warum, sehen wir bei der Pipeline.",
  });

  // 8 Spaltenauswahl
  s = content("Welche Spalten nutzen wir?", "Sechs Eingaben: vier Zahlen, zwei Kategorien. Das ist eine Lehr-Auswahl, um Imputation, Skalierung und Kodierung zu üben. Pclass wäre ein guter Prädiktor, wird aber weggelassen, damit Notebook 3 dasselbe Eingabeformat nutzen kann.");
  tx(s, "Unsere 6 Eingaben", { x: MX, y: 1.95, w: 5.6, h: 0.45, fontSize: 20, bold: true });
  tx(s, "Numerisch", { x: MX, y: 2.55, w: 3, h: 0.3, fontSize: 14, bold: true, color: C.text2 });
  ["Age", "SibSp", "Parch", "Fare"].forEach((c, i) => {
    rect(s, { x: MX + i * 1.38, y: 2.95, w: 1.25, h: 0.55, r: 0.08, fill: { color: C.text1 } });
    tx(s, c, { x: MX + i * 1.38, y: 2.95, w: 1.25, h: 0.55, fontSize: 16, fontFace: MONO, color: C.background1, align: "center", valign: "middle" });
  });
  tx(s, "Kategorial", { x: MX, y: 3.8, w: 3, h: 0.3, fontSize: 14, bold: true, color: C.text2 });
  ["Sex", "Embarked"].forEach((c, i) => {
    rect(s, { x: MX + i * 1.38, y: 4.2, w: 1.25, h: 0.55, r: 0.08, fill: { color: C.accent1 } });
    tx(s, c, { x: MX + i * 1.38, y: 4.2, w: 1.25, h: 0.55, fontSize: 16, fontFace: MONO, align: "center", valign: "middle" });
  });
  tx(s, [
    { text: "SibSp", options: { fontFace: MONO, bold: true } }, { text: ": Geschwister/Partner an Bord", options: { breakLine: true } },
    { text: "Parch", options: { fontFace: MONO, bold: true } }, { text: ": Eltern/Kinder an Bord", options: { breakLine: true } },
    { text: "Embarked", options: { fontFace: MONO, bold: true } }, { text: ": Abfahrtshafen (C, Q, S)" },
  ], { x: MX, y: 5.05, w: 5.6, h: 1.0, fontSize: 14, color: C.text2, lineSpacingMultiple: 1.15 });
  tx(s, "Bewusst weggelassen", { x: 6.9, y: 1.95, w: 5.8, h: 0.45, fontSize: 20, bold: true });
  const excl = [
    ["Survived", "Das ist die Antwort selbst."],
    ["PassengerId", "Nur eine laufende Nummer."],
    ["Name, Ticket", "Freitext – bräuchte Feature Engineering."],
    ["Cabin", "Fehlt bei 77 % der Passagiere."],
    ["Pclass", "Sinnvoll, aber hier bewusst weggelassen."],
  ];
  const bNone = { type: "none" };
  const bLine = { type: "solid", pt: 1, color: "E3E6EB" };
  s.addTable(excl.map((r) => [
    { text: r[0], options: { fontFace: MONO, bold: true, border: [bNone, bNone, bLine, bNone] } },
    { text: r[1], options: { border: [bNone, bNone, bLine, bNone] } },
  ]), { x: 6.9, y: 2.5, w: 5.83, colW: [1.95, 3.88], rowH: 0.62, fontSize: 15, color: T.dk1, valign: "middle", margin: [0, 0.05, 0, 0] });
  tx(s, "Eine Lehr-Auswahl – keine Aussage darüber, welche Features am besten sind.", { x: 6.9, y: 5.85, w: 5.8, h: 0.5, fontSize: 14, italic: true, color: C.text2 });

  // 9 X/y
  await codeSlide({
    title: "Features (X) und Label (y) trennen",
    code: `
# Das Label: was wir vorhersagen wollen
y = df["Survived"]

# Die Features: sechs ausgewählte Eingaben
X = df[["Age", "SibSp", "Parch", "Fare",
        "Sex", "Embarked"]]

X.head(2)`,
    output: `
    Age  SibSp  Parch     Fare     Sex Embarked
0  22.0      1      0   7.2500    male        S
1  38.0      1      0  71.2833  female        C`,
    takeaways: [
      "Das Label gehört nie in X – sonst verrätst du dem Modell die Antwort. Das nennt man Data Leakage.",
      "Konvention: X groß (Tabelle mit vielen Spalten), y klein (eine Spalte).",
      "Jede Zeile in X gehört zur selben Person wie die Zeile in y.",
    ],
    notes: "Doppelte eckige Klammern liefern einen DataFrame, einfache eine Series. X.head(2) dient als Kontrolle: Survived darf hier nicht mehr auftauchen.",
  });

  // ================= 2 AUFTEILEN =================
  divider(2, "Wir legen Testdaten beiseite – für eine ehrliche Abschlussprüfung ganz am Ende.", "Zweite Station: Die wichtigste Disziplin im ganzen Notebook – Testdaten bleiben unangetastet.");

  // 11 Train/Test Konzept
  s = content("Train und Test: die Abschlussprüfung", "Alles, was wir in den nächsten Stationen entscheiden – Skalierung, Modell, Hyperparameter –, entscheiden wir nur auf den Trainingsdaten. Die Testdaten sehen wir genau einmal.");
  const wTr = CW * 0.8;
  rect(s, { x: MX, y: 2.0, w: wTr - 0.05, h: 1.1, r: 0.06, fill: { color: C.text1 } });
  tx(s, "Training · 80 % · 712 Passagiere", { x: MX + 0.35, y: 2.0, w: wTr - 0.6, h: 1.1, fontSize: 20, bold: true, color: C.background1, valign: "middle" });
  rect(s, { x: MX + wTr + 0.05, y: 2.0, w: CW - wTr - 0.05, h: 1.1, r: 0.06, fill: { color: C.accent1 } });
  s.addImage({ data: await icon("LuLock", T.dk1), x: MX + wTr + 0.25, y: 2.33, w: 0.42, h: 0.42 });
  tx(s, [{ text: "Test · 20 %", options: { bold: true, breakLine: true } }, { text: "179 Passagiere" }], { x: MX + wTr + 0.8, y: 2.0, w: 1.6, h: 1.1, fontSize: 15, valign: "middle" });
  tx(s, "Trainingsdaten", { x: MX, y: 3.5, w: 7, h: 0.45, fontSize: 20, bold: true });
  tx(s, "Hier lernt das Modell. Und hier triffst du alle Entscheidungen: welche Skalierung, welches Modell, welche Hyperparameter.", { x: MX, y: 4.0, w: 7.2, h: 1.1, fontSize: 16 });
  tx(s, "Testdaten", { x: 8.45, y: 3.5, w: 4.3, h: 0.45, fontSize: 20, bold: true });
  tx(s, "Bleiben verschlossen bis zur letzten Station. Nur so zeigen sie ehrlich, wie gut das Modell mit neuen Daten klarkommt.", { x: 8.45, y: 4.0, w: 4.25, h: 1.4, fontSize: 16 });
  callout(s, "Wie bei einer Klausur: Wer die Prüfungsfragen vorher kennt, bekommt eine geschönte Note.", { y: 5.75, h: 0.75 });

  // 12 train_test_split
  await codeSlide({
    title: "Aufteilen mit train_test_split",
    code: `
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,      # ca. 20 % als Testdaten
    random_state=42,    # gleiche Aufteilung bei jedem Lauf
    stratify=y,         # Anteil Überlebender bleibt gleich
)`,
    takeaways: [
      "Vier Rückgabewerte, immer in dieser Reihenfolge: X_train, X_test, y_train, y_test.",
      "random_state macht Ergebnisse reproduzierbar – wie ein fester Seed in Tests.",
      "stratify=y sorgt dafür, dass in beiden Teilen etwa 38 % überlebt haben.",
      "Ab jetzt ist X_test tabu – bis zur letzten Station.",
    ],
    notes: "Im Notebook steht der Aufruf in einer Zeile; hier ist er zum Erklären auf mehrere Zeilen verteilt. Features und Labels werden gemeinsam aufgeteilt, damit jede Person ihr Label behält.",
  });

  // ================= 3 SKALIERUNG =================
  divider(3, "Warum unterschiedliche Wertebereiche ein Problem sind – und zwei Lösungen dafür.", "Dritte Station: Feature-Skalierung. Erst das Problem, dann zwei Verfahren, dann die wichtigste Regel.");

  // 14 Problem
  s = content("Das Problem: vier Features, vier Maßstäbe", "Wertebereiche aus den Trainingsdaten. SibSp und Parch sind auf dieser Achse kaum zu sehen – für ein Modell, das Abstände misst, spielen sie neben Fare dann auch kaum eine Rolle.");
  const ranges = [["Age", 0.42, 80, "0 – 80"], ["SibSp", 0, 8, "0 – 8"], ["Parch", 0, 6, "0 – 6"], ["Fare", 0, 512.33, "0 – 512"]];
  const bx = 2.0;
  const bw = 6.2;
  const sc = bw / 520;
  ranges.forEach((r, i) => {
    const y = 2.05 + i * 0.8;
    tx(s, r[0], { x: MX, y, w: 1.3, h: 0.5, fontSize: 17, fontFace: MONO, bold: true, valign: "middle" });
    rect(s, { x: bx, y, w: bw, h: 0.5, fill: { color: C.background2 } });
    rect(s, { x: bx + r[1] * sc, y, w: Math.max((r[2] - r[1]) * sc, 0.05), h: 0.5, fill: { color: r[0] === "Fare" ? C.text1 : C.accent1 } });
    const lx = r[0] === "Fare" ? bx + 0.2 : bx + r[2] * sc + 0.15;
    tx(s, r[3], { x: lx, y, w: 1.4, h: 0.5, fontSize: 15, bold: true, valign: "middle", color: r[0] === "Fare" ? C.background1 : C.text1 });
  });
  [0, 100, 200, 300, 400, 500].forEach((v) => {
    tx(s, String(v), { x: bx + v * sc - 0.3, y: 5.25, w: 0.6, h: 0.3, fontSize: 12, color: C.text2, align: "center" });
  });
  tx(s, "Was heißt das?", { x: 8.75, y: 2.0, w: 4.0, h: 0.45, fontSize: 19, bold: true });
  tx(s, "Für ein Modell, das Abstände misst, zählt ein Unterschied von 100 beim Fahrpreis viel mehr als 10 Jahre beim Alter – nur wegen der Einheit.", { x: 8.75, y: 2.5, w: 3.95, h: 2.0, fontSize: 16 });
  callout(s, "Skalierung bringt alle numerischen Features auf einen vergleichbaren Maßstab.", { y: 5.85, h: 0.75 });

  // 15 Wer braucht Skalierung
  s = content("Wer braucht Skalierung?", "Faustregel: Alles, was mit Abständen oder Gradienten arbeitet, reagiert auf Skalierung. Bäume vergleichen nur mit Schwellenwerten und sind deshalb meist unempfindlich.");
  const cols = [
    { icon: "LuCheck", title: "Profitieren oft", fill: C.accent5, rows: [["KNN", "misst Abstände zwischen Passagieren"], ["SVM", "misst Abstände zur Trennlinie"], ["SGD / logistische Regression", "lernt in kleinen Schritten (Gradientenabstieg)"]] },
    { icon: "LuTrees", title: "Meist egal", fill: C.background2, rows: [["Entscheidungsbaum", "teilt an Schwellenwerten: Ist Age < 30?"], ["Random Forest", "viele Bäume – gleiches Prinzip"]] },
  ];
  for (let i = 0; i < 2; i++) {
    const c = cols[i];
    const x = MX + i * 6.23;
    rect(s, { x, y: 1.95, w: 5.9, h: 3.8, r: 0.1, fill: { color: c.fill } });
    await iconCircle(s, c.icon, x + 0.35, 2.25, 0.65, C.text1, "FFFFFF");
    tx(s, c.title, { x: x + 1.2, y: 2.25, w: 4.4, h: 0.65, fontSize: 22, bold: true, valign: "middle" });
    c.rows.forEach((r, j) => {
      tx(s, [{ text: r[0], options: { bold: true, breakLine: true } }, { text: r[1], options: { color: C.text2 } }], { x: x + 0.4, y: 3.15 + j * 0.85, w: 5.2, h: 0.75, fontSize: 16 });
    });
  }
  tx(s, "Eine Verbesserung ist nie garantiert – deshalb messen wir sie in Station 6 nach.", { x: MX, y: 6.0, w: CW, h: 0.5, fontSize: 16, italic: true, color: C.text2 });

  // 16 Standardisierung
  s = content("Verfahren 1: Standardisierung", "Mittelwert abziehen zentriert die Werte um null, durch die Standardabweichung teilen drückt den Abstand in 'Standardabweichungen' aus. StandardScaler nutzt die Standardabweichung der Grundgesamtheit (Division durch m).");
  fraction(s, { x: MX, y: 2.0, w: 2.6, lhs: [{ text: "x" }, { text: "neu", options: { subscript: true } }, { text: " =" }], num: "x − μ", den: "σ" });
  tx(s, [
    { text: "μ", options: { bold: true, fontFace: "Cambria" } }, { text: "  Mittelwert der Trainingsdaten", options: { breakLine: true } },
    { text: "σ", options: { bold: true, fontFace: "Cambria" } }, { text: "  Standardabweichung – wie stark die Werte streuen" },
  ], { x: MX, y: 3.75, w: 6.2, h: 0.85, fontSize: 16, lineSpacingMultiple: 1.2 });
  tx(s, [{ text: "Ergebnis: ", options: { bold: true } }, { text: "Mittelwert 0, Standardabweichung 1", options: { breakLine: true } }, { text: "In scikit-learn: ", options: { bold: true } }, { text: "StandardScaler", options: { fontFace: MONO } }],
    { x: MX, y: 4.85, w: 6.2, h: 0.8, fontSize: 16, lineSpacingMultiple: 1.2 });
  tx(s, "Vorsicht: Ausreißer verschieben μ und σ.", { x: MX, y: 5.95, w: 6.2, h: 0.4, fontSize: 15, italic: true, color: C.accent3 });
  {
    const cx = 7.2, cy = 1.95, cw = 5.53;
    rect(s, { x: cx, y: cy, w: cw, h: 4.55, r: 0.1, fill: { color: C.background2 } });
    tx(s, "Beispiel: μ = 50, σ = 10", { x: cx + 0.35, y: cy + 0.3, w: cw - 0.7, h: 0.45, fontSize: 18, bold: true });
    tx(s, "Original", { x: cx + 0.35, y: cy + 1.0, w: 2, h: 0.3, fontSize: 12, color: C.text2 });
    tx(s, "Standardisiert", { x: cx + 0.35, y: cy + 2.6, w: 2, h: 0.3, fontSize: 12, color: C.text2 });
    const lx0 = cx + 0.6, lx1 = cx + cw - 0.6, ly = cy + 1.9;
    line(s, lx0 - 0.2, ly, lx1 + 0.2, ly, { color: T.dk1, width: 1.5 });
    const vals = [30, 40, 50, 60, 70];
    const zs = ["−2", "−1", "0", "1", "2"];
    vals.forEach((v, k) => {
      const px = lx0 + k * (lx1 - lx0) / 4;
      line(s, px, ly - 0.1, px, ly + 0.1, { color: T.dk1, width: 1.5 });
      tx(s, String(v), { x: px - 0.4, y: ly - 0.55, w: 0.8, h: 0.35, fontSize: 16, color: C.text2, align: "center" });
      tx(s, zs[k], { x: px - 0.4, y: ly + 0.2, w: 0.8, h: 0.4, fontSize: 20, bold: true, align: "center" });
      if (v === 50 || v === 70) s.addShape(S.OVAL, { x: px - 0.11, y: ly - 0.11, w: 0.22, h: 0.22, fill: { color: C.accent1 }, line: { color: T.dk1, width: 1 } });
    });
    tx(s, "Ein Wert von 70 liegt zwei Standardabweichungen über dem Mittelwert:", { x: cx + 0.35, y: cy + 3.0, w: cw - 0.7, h: 0.6, fontSize: 15 });
    tx(s, "(70 − 50) / 10 = 2", { x: cx + 0.35, y: cy + 3.65, w: cw - 0.7, h: 0.5, fontSize: 20, bold: true, fontFace: "Cambria" });
  }

  // 17 Min-Max
  s = content("Verfahren 2: Min-Max-Skalierung", "Min-Max bildet den Trainingsbereich auf 0 bis 1 ab. Ein neuer Wert außerhalb des Trainingsbereichs landet außerhalb von [0, 1] – das ist korrekt. Auf keinen Fall Min und Max auf den Testdaten neu berechnen!");
  fraction(s, { x: MX, y: 2.0, w: 3.4, lhs: [{ text: "x" }, { text: "neu", options: { subscript: true } }, { text: " =" }], num: "x − min", den: "max − min" });
  tx(s, [
    { text: "min, max", options: { bold: true } }, { text: "  kleinster und größter Wert der Trainingsdaten" },
  ], { x: MX, y: 3.75, w: 6.2, h: 0.85, fontSize: 16, lineSpacingMultiple: 1.2 });
  tx(s, [{ text: "Ergebnis: ", options: { bold: true } }, { text: "Trainingswerte liegen zwischen 0 und 1", options: { breakLine: true } }, { text: "In scikit-learn: ", options: { bold: true } }, { text: "MinMaxScaler", options: { fontFace: MONO } }],
    { x: MX, y: 4.85, w: 6.2, h: 0.8, fontSize: 16, lineSpacingMultiple: 1.2 });
  tx(s, "Vorsicht: Ein extremer Ausreißer drückt alle anderen Werte eng zusammen.", { x: MX, y: 5.95, w: 6.4, h: 0.4, fontSize: 15, italic: true, color: C.accent3 });
  {
    const cx = 7.2, cy = 1.95, cw = 5.53;
    rect(s, { x: cx, y: cy, w: cw, h: 4.55, r: 0.1, fill: { color: C.background2 } });
    tx(s, "Beispiel: min = 10, max = 30", { x: cx + 0.35, y: cy + 0.3, w: cw - 0.7, h: 0.45, fontSize: 18, bold: true });
    tx(s, "Original", { x: cx + 0.35, y: cy + 1.0, w: 2, h: 0.3, fontSize: 12, color: C.text2 });
    tx(s, "Skaliert", { x: cx + 0.35, y: cy + 2.6, w: 2, h: 0.3, fontSize: 12, color: C.text2 });
    const lx0 = cx + 0.6, lx1 = cx + cw - 0.6, ly = cy + 1.9;
    const step = (lx1 - lx0) / 3;
    rect(s, { x: lx0, y: ly - 0.2, w: 2 * step, h: 0.4, fill: { color: C.accent1, transparency: 50 } });
    line(s, lx0 - 0.2, ly, lx1 + 0.2, ly, { color: T.dk1, width: 1.5 });
    const vals = [10, 20, 30, 40];
    const zs = ["0", "0,5", "1", "1,5"];
    vals.forEach((v, k) => {
      const px = lx0 + k * step;
      line(s, px, ly - 0.1, px, ly + 0.1, { color: T.dk1, width: 1.5 });
      tx(s, String(v), { x: px - 0.4, y: ly - 0.55, w: 0.8, h: 0.35, fontSize: 16, color: C.text2, align: "center" });
      tx(s, zs[k], { x: px - 0.45, y: ly + 0.2, w: 0.9, h: 0.4, fontSize: 20, bold: true, align: "center", color: v === 40 ? C.accent3 : C.text1 });
    });
    tx(s, "Ein neuer Wert von 40 liegt über dem Trainings-Maximum – und landet außerhalb von [0, 1]:", { x: cx + 0.35, y: cy + 3.0, w: cw - 0.7, h: 0.6, fontSize: 15 });
    tx(s, "(40 − 10) / (30 − 10) = 1,5", { x: cx + 0.35, y: cy + 3.65, w: cw - 0.7, h: 0.5, fontSize: 20, bold: true, fontFace: "Cambria" });
  }

  // 18 Vergleich
  s = content("Beide Verfahren im Vergleich", "Die Skizze stammt aus dem Notebook. Achtung Begriffsfalle: In der Skizze heißt Min-Max 'Normalization'. Der Normalizer von scikit-learn macht etwas anderes – er skaliert jede Zeile auf Länge 1.");
  s.addImage({ path: d.assets("normalization_vs_standardization.png"), x: MX, y: 1.85, w: 4.8, h: 4.8, altText: "Skizze: Originaldaten im Vergleich mit Min-Max-skalierten und standardisierten Daten" });
  d.table(s, ["", "Min-Max", "Standardisierung"], [
    [{ text: "Ergebnis", options: { bold: true } }, "Bereich 0 bis 1", "Mittelwert 0, Std. 1"],
    [{ text: "Ausreißer", options: { bold: true } }, "drücken den Rest zusammen", "verschieben μ und σ"],
    [{ text: "Bleibt gleich", options: { bold: true } }, { text: "Reihenfolge und Form der Verteilung", options: { colspan: 2 } }],
    [{ text: "Normalverteilt?", options: { bold: true } }, { text: "Nein – das macht keines der beiden", options: { colspan: 2 } }],
    [{ text: "scikit-learn", options: { bold: true } }, { text: "MinMaxScaler", options: { fontFace: MONO } }, { text: "StandardScaler", options: { fontFace: MONO } }],
  ], { x: 5.8, y: 1.95, w: 6.93, colW: [1.85, 2.54, 2.54], rowH: 0.6 });
  tx(s, "Welches ist besser? Kommt auf Modell und Daten an – ausprobieren und per Kreuzvalidierung vergleichen.", { x: 5.8, y: 5.85, w: 6.9, h: 0.7, fontSize: 15, italic: true, color: C.text2 });

  // 19 Goldene Regel
  s = content("Die goldene Regel: fit nur auf Trainingsdaten", "Bonusfrage aus dem Notebook: Haben skalierte Testdaten auch Mittelwert 0? Nicht unbedingt – und das ist korrekt. Der Scaler verwendet die Kennzahlen aus dem Training wieder. Hinweis: Die Trainingsdaten werden natürlich auch transformiert (fit_transform).");
  {
    const by1 = 2.0, by2 = 3.55, bh = 0.95;
    rect(s, { x: MX, y: by1, w: 2.6, h: bh, r: 0.08, fill: { color: C.text1 } });
    tx(s, "Trainingsdaten", { x: MX, y: by1, w: 2.6, h: bh, fontSize: 17, bold: true, color: C.background1, align: "center", valign: "middle" });
    rect(s, { x: MX, y: by2, w: 2.6, h: bh, r: 0.08, fill: { color: C.accent1 } });
    tx(s, "Testdaten", { x: MX, y: by2, w: 2.6, h: bh, fontSize: 17, bold: true, align: "center", valign: "middle" });
    line(s, MX + 2.65, by1 + bh / 2, 5.0, by1 + bh / 2, { color: T.dk1, width: 2, arrow: true });
    line(s, MX + 2.65, by2 + bh / 2, 5.0, by2 + bh / 2, { color: T.dk1, width: 2, arrow: true });
    tx(s, "fit()", { x: 3.3, y: by1 + 0.02, w: 1.6, h: 0.4, fontSize: 15, fontFace: MONO, bold: true, align: "center" });
    tx(s, "transform()", { x: 3.3, y: by2 + 0.02, w: 1.6, h: 0.4, fontSize: 15, fontFace: MONO, bold: true, align: "center" });
    rect(s, { x: 5.05, y: by1, w: 3.2, h: by2 + bh - by1, r: 0.08, fill: { color: C.background2 }, line: { color: T.dk1, width: 1.5 } });
    tx(s, [
      { text: "StandardScaler", options: { bold: true, fontFace: MONO, breakLine: true } },
      { text: "lernt μ und σ nur aus den Trainingsdaten", options: { breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 8 } },
      { text: "wendet sie auf alle Daten an" },
    ], { x: 5.3, y: by1, w: 2.75, h: by2 + bh - by1, fontSize: 15, valign: "middle", align: "center" });
    line(s, 8.3, by1 + bh / 2, 9.25, by1 + bh / 2, { color: T.dk1, width: 2, arrow: true });
    line(s, 8.3, by2 + bh / 2, 9.25, by2 + bh / 2, { color: T.dk1, width: 2, arrow: true });
    rect(s, { x: 9.3, y: by1, w: 3.43, h: bh, r: 0.08, fill: { color: C.background2 } });
    tx(s, "Train, skaliert", { x: 9.3, y: by1, w: 3.43, h: bh, fontSize: 16, bold: true, align: "center", valign: "middle" });
    rect(s, { x: 9.3, y: by2, w: 3.43, h: bh, r: 0.08, fill: { color: C.background2 } });
    tx(s, [{ text: "Test, skaliert", options: { bold: true, breakLine: true } }, { text: "mit μ und σ aus dem Training", options: { fontSize: 13, color: C.text2 } }], { x: 9.3, y: by2, w: 3.43, h: bh, fontSize: 16, align: "center", valign: "middle" });
  }
  await d.notePair(s,
    { lead: "Niemals ", text: "einen zweiten Scaler auf den Testdaten fitten. Das wäre ein Blick in die Prüfungsfragen." },
    { lead: "Gut zu wissen: ", text: "Skalierte Testdaten haben deshalb nicht genau Mittelwert 0 – und das ist richtig so." });

  // ================= 4 PIPELINE =================
  divider(4, "Vorverarbeitung und Modell zu einem einzigen Objekt verbinden.", "Vierte Station: Wir bauen die Vorverarbeitung so, dass sie automatisch nur aus Trainingsdaten lernt.");

  // 21 Zwei Wege
  s = content("Zwei Spaltentypen, zwei Wege", "Modelle brauchen Zahlen ohne Lücken. Numerische Spalten: Lücken mit dem Median füllen, dann skalieren. Kategoriale Spalten: Lücken mit dem häufigsten Wert füllen, dann One-Hot-Encoding.");
  {
    const lane = [2.25, 4.35];
    const bh = 0.95;
    rect(s, { x: 2.45, y: 1.95, w: 8.2, h: 3.9, r: 0.08, fill: { color: C.background1 }, line: { color: T.accent4, width: 1.25, dashType: "dash" } });
    tx(s, "ColumnTransformer", { x: 7.9, y: 5.45, w: 2.6, h: 0.3, fontSize: 13, fontFace: MONO, color: C.text2, align: "right" });
    rect(s, { x: MX, y: 3.2, w: 1.45, h: 1.55, r: 0.08, fill: { color: C.text1 } });
    tx(s, [{ text: "X", options: { bold: true, fontSize: 24, fontFace: MONO, breakLine: true } }, { text: "6 Spalten" }], { x: MX, y: 3.2, w: 1.45, h: 1.55, fontSize: 14, color: C.background1, align: "center", valign: "middle" });
    const L = [
      [["Numerisch", "Age, SibSp, Parch, Fare"], ["Lücken füllen", "Median"], ["Skalieren", "StandardScaler"]],
      [["Kategorial", "Sex, Embarked"], ["Lücken füllen", "häufigster Wert"], ["Kodieren", "One-Hot-Encoding"]],
    ];
    const xs = [2.7, 5.55, 8.15];
    const ws = [2.5, 2.2, 2.25];
    for (let r = 0; r < 2; r++) {
      for (let k = 0; k < 3; k++) {
        rect(s, { x: xs[k], y: lane[r], w: ws[k], h: bh, r: 0.08, fill: { color: k === 0 ? C.background2 : C.accent5 } });
        tx(s, [{ text: L[r][k][0], options: { bold: true, breakLine: true } }, { text: L[r][k][1], options: { fontSize: 13, color: C.text2 } }], { x: xs[k] + 0.1, y: lane[r], w: ws[k] - 0.2, h: bh, fontSize: 16, align: "center", valign: "middle" });
        if (k < 2) line(s, xs[k] + ws[k] + 0.03, lane[r] + bh / 2, xs[k + 1] - 0.03, lane[r] + bh / 2, { color: T.dk1, width: 1.5, arrow: true });
      }
      line(s, MX + 1.47, 3.975, xs[0] - 0.03, lane[r] + bh / 2, { color: T.dk1, width: 1.5, arrow: true });
      line(s, xs[2] + ws[2] + 0.03, lane[r] + bh / 2, 10.95, 3.975, { color: T.dk1, width: 1.5, arrow: true });
    }
    rect(s, { x: 11.0, y: 3.2, w: 1.73, h: 1.55, r: 0.08, fill: { color: C.text1 } });
    tx(s, [{ text: "9 Spalten", options: { bold: true, breakLine: true } }, { text: "nur Zahlen" }], { x: 11.0, y: 3.2, w: 1.73, h: 1.55, fontSize: 15, color: C.background1, align: "center", valign: "middle" });
  }
  tx(s, "Der ColumnTransformer verteilt die Spalten auf zwei Wege und fügt die Ergebnisse wieder zusammen.", { x: MX, y: 6.1, w: CW, h: 0.5, fontSize: 16, italic: true, color: C.text2 });

  // 22 One-Hot
  s = content("One-Hot-Encoding: aus Text werden Zahlen", "Für jede gelernte Kategorie entsteht eine eigene 0/1-Spalte. Genau eine davon ist pro Zeile 1. So entsteht keine künstliche Reihenfolge.");
  {
    const hdr = (t) => ({ text: t, options: { bold: true, fontFace: MONO, fontSize: 14, color: T.lt1, fill: { color: T.dk1 } } });
    const vals = ["S", "C", "Q", "S"];
    s.addTable([[hdr("Embarked")], ...vals.map((v) => [{ text: v, options: { fontFace: MONO } }])], { x: MX, y: 2.1, w: 1.8, colW: [1.8], rowH: 0.62, fontSize: 18, color: T.dk1, align: "center", valign: "middle", border: { type: "solid", pt: 1, color: "E3E6EB" } });
    line(s, 2.6, 3.65, 3.45, 3.65, { color: T.dk1, width: 2, arrow: true });
    const cats = ["C", "Q", "S"];
    const one = (v, c) => (v === c ? { text: "1", options: { bold: true, fill: { color: "FBE7A1" } } } : { text: "0", options: { color: T.dk2 } });
    s.addTable([cats.map((c) => hdr("Embarked_" + c)), ...vals.map((v) => cats.map((c) => one(v, c)))], { x: 3.6, y: 2.1, w: 4.65, colW: [1.55, 1.55, 1.55], rowH: 0.62, fontSize: 18, color: T.dk1, align: "center", valign: "middle", border: { type: "solid", pt: 1, color: "E3E6EB" } });
  }
  tx(s, [{ text: "Warum nicht einfach", options: { breakLine: true } }, { text: "C = 0, Q = 1, S = 2?" }], { x: 8.75, y: 2.0, w: 4.0, h: 0.75, fontSize: 18, bold: true });
  tx(s, "Dann würde das Modell eine Reihenfolge annehmen – als wäre S „größer“ als C. One-Hot vermeidet das.", { x: 8.75, y: 2.8, w: 3.98, h: 1.3, fontSize: 15 });
  tx(s, "Aus einer Spalte mit drei Kategorien werden drei 0/1-Spalten – pro Zeile steht genau eine 1.", { x: MX, y: 5.5, w: 7.65, h: 0.8, fontSize: 16, italic: true, color: C.text2 });
  tx(s, 'handle_unknown="ignore"', { x: 8.75, y: 4.3, w: 4.0, h: 0.4, fontSize: 15, bold: true, fontFace: MONO });
  tx(s, "Taucht später eine unbekannte Kategorie auf, gibt es lauter Nullen statt eines Fehlers.", { x: 8.75, y: 4.75, w: 3.98, h: 1.0, fontSize: 15 });

  // 23 Code Pipelines
  await codeSlide({
    title: "Code: eine Pipeline pro Spaltentyp",
    code: `
numeric_standardized = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore",
                              sparse_output=False)),
])`,
    takeaways: [
      "Eine Pipeline ist eine Liste von (Name, Schritt)-Paaren, die der Reihe nach laufen – wie verkettete Funktionen.",
      "Die Namen wie „imputer“ oder „scaler“ sind frei wählbar – du brauchst sie später beim Tuning.",
      "sparse_output=False liefert eine normale Tabelle statt einer platzsparenden Spezialmatrix.",
    ],
    notes: "Zwei kleine Pipelines: Die numerische füllt Lücken mit dem Median und standardisiert, die kategoriale füllt mit dem häufigsten Wert und kodiert One-Hot.",
  });

  // 24 ColumnTransformer
  await codeSlide({
    title: "Code: der ColumnTransformer",
    code: `
col_scale  = ["Age", "SibSp", "Parch", "Fare"]
col_encode = ["Sex", "Embarked"]

scaling_transformation = ColumnTransformer([
    ("numeric", numeric_standardized, col_scale),
    ("categorical", categorical_pipeline, col_encode),
])

# Zum Vergleich: ohne Skalierung
no_scaling_transformation = ColumnTransformer([
    ("numeric", SimpleImputer(strategy="median"), col_scale),
    ("categorical", categorical_pipeline, col_encode),
])`,
    hl: [4, 10],
    takeaways: [
      "Der ColumnTransformer ist eine Weiche: Jede Spaltengruppe bekommt ihre eigene Vorverarbeitung.",
      "Die beiden Varianten unterscheiden sich nur in der markierten Zeile.",
      "Beim Erstellen wird noch nichts gelernt – das passiert erst bei fit().",
    ],
    notes: "Die Variante ohne Skalierung brauchen wir gleich für den fairen Vergleich: Imputation und Kodierung bleiben gleich, nur der Scaler fehlt.",
  });

  // 25 Ein Passagier
  s = content("Ein Passagier durch die Pipeline", "Echtes Beispiel: Passagier mit Index 692 aus X_train, transformiert mit scaling_transformation (gefittet auf X_train). Das Alter fehlt und wird mit dem Median 28,5 gefüllt, danach standardisiert.");
  {
    const before = [["Age", "NaN"], ["SibSp", "0"], ["Parch", "0"], ["Fare", "56,50"], ["Sex", "male"], ["Embarked", "S"]];
    tx(s, "Vorher: 6 Spalten, gemischt", { x: MX, y: 1.9, w: 6, h: 0.35, fontSize: 15, bold: true, color: C.text2 });
    before.forEach((b, i) => {
      const x = MX + i * 1.5;
      tx(s, b[0], { x, y: 2.3, w: 1.4, h: 0.3, fontSize: 13, fontFace: MONO, color: C.text2, align: "center" });
      rect(s, { x, y: 2.62, w: 1.4, h: 0.72, r: 0.06, fill: { color: C.background2 } });
      tx(s, b[1], { x, y: 2.62, w: 1.4, h: 0.72, fontSize: 19, fontFace: MONO, align: "center", valign: "middle", color: b[1] === "NaN" ? C.accent3 : C.text1, bold: b[1] === "NaN" });
    });
    tx(s, "Age fehlt → Median 28,5 → standardisiert −0,08", { x: 9.75, y: 2.62, w: 3.0, h: 0.72, fontSize: 14, color: C.text2, valign: "middle" });
    line(s, 4.6, 3.5, 4.6, 4.25, { color: T.dk1, width: 2, arrow: true });
    tx(s, "Pipeline (gelernt auf X_train)", { x: 4.8, y: 3.62, w: 4.5, h: 0.4, fontSize: 14, italic: true, color: C.text2 });
    const after = [["Age", "−0,08"], ["SibSp", "−0,47"], ["Parch", "−0,47"], ["Fare", "0,51"], ["Sex_female", "0"], ["Sex_male", "1"], ["Embarked_C", "0"], ["Embarked_Q", "0"], ["Embarked_S", "1"]];
    tx(s, "Nachher: 9 Spalten, nur Zahlen", { x: MX, y: 4.3, w: 6, h: 0.35, fontSize: 15, bold: true, color: C.text2 });
    after.forEach((a, i) => {
      const x = MX + i * 1.35;
      tx(s, a[0], { x: x - 0.02, y: 4.72, w: 1.29, h: 0.3, fontSize: 12, fontFace: MONO, color: C.text2, align: "center" });
      rect(s, { x, y: 5.05, w: 1.25, h: 0.72, r: 0.06, fill: { color: i < 4 ? C.accent5 : C.background2 } });
      tx(s, a[1], { x, y: 5.05, w: 1.25, h: 0.72, fontSize: 19, fontFace: MONO, align: "center", valign: "middle", bold: a[1] === "1" });
    });
    tx(s, "4 numerische → gefüllt + standardisiert", { x: MX, y: 5.85, w: 5.3, h: 0.35, fontSize: 14, color: C.text2 });
    tx(s, "2 kategoriale → 5 One-Hot-Spalten", { x: MX + 4 * 1.35, y: 5.85, w: 6.0, h: 0.35, fontSize: 14, color: C.text2 });
  }
  tx(s, "Genau dieses Format – nur Zahlen, keine Lücken – brauchen die Modelle.", { x: MX, y: 6.35, w: CW, h: 0.4, fontSize: 16, bold: true });

  // 26 Warum Pipeline
  s = content("Warum der Aufwand mit der Pipeline?", "Der wichtigste Punkt ist der erste: Während der Kreuzvalidierung bekommt jeder Fold eine frische Kopie der Pipeline, die nur aus ihren Trainingsdaten lernt.");
  await iconRows(s, [
    { icon: "LuShieldCheck", title: "Kein Data Leakage", text: "Bei jedem fit() lernt die Pipeline Mediane, Kategorien und Skalierung nur aus den jeweiligen Trainingsdaten." },
    { icon: "LuPackage", title: "Ein Objekt für alles", text: "fit(), predict(), speichern – Vorverarbeitung und Modell reisen immer zusammen." },
    { icon: "LuPuzzle", title: "Austauschbare Bausteine", text: "Anderen Scaler testen? Eine Zeile ändern – der Rest bleibt gleich." },
  ]);
  callout(s, "Aus Software-Sicht: wie ein gut gekapseltes Modul – eine Schnittstelle, die Details stecken innen.", { y: 5.95, h: 0.7, fontSize: 17 });

  // 27 Übung 1
  await exerciseSlide("Übung 1: Min-Max statt Standardisierung",
    "Baue dieselbe Vorverarbeitung wie eben – aber mit MinMaxScaler statt StandardScaler.",
    ["Nur ein Baustein ändert sich.", "MinMaxScaler oben im Notebook importieren.", "Nicht vorab auf allen Daten fitten."],
    "Aufgabe 1 im Notebook. Gebt den Teilnehmenden ein paar Minuten Zeit, bevor ihr die Lösung zeigt.");

  // 28 Lösung 1
  await codeSlide({
    title: "Lösung 1",
    code: `
from sklearn.preprocessing import MinMaxScaler

numeric_normalized = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", MinMaxScaler()),
])

normalization_transformation = ColumnTransformer([
    ("numeric", numeric_normalized, col_scale),
    ("categorical", categorical_pipeline, col_encode),
])`,
    hl: [0, 4],
    takeaways: [
      "Austauschen statt neu schreiben: Imputation und Kodierung bleiben gleich.",
      "Gelernt wird erst später – in jedem Fold der Kreuzvalidierung separat.",
    ],
    notes: "MinMaxScaler lernt Minimum und Maximum aus den Trainingsdaten und bildet den Trainingsbereich auf 0 bis 1 ab.",
  });

  // ================= 5 KREUZVALIDIERUNG =================
  divider(5, "Warum ein einzelner Test nicht reicht – und wie fünf es besser machen.", "Fünfte Station: Wie bewerten wir Modelle fair, ohne die Testdaten anzufassen?");

  // 30 Ein Experiment
  s = content("Ein Experiment ist kein Beweis", "Das sind echte Werte: KNN ohne Skalierung, bewertet auf fünf verschiedenen Teilen der Trainingsdaten. Dasselbe Modell – fast 10 Prozentpunkte Unterschied, nur je nach Datenauswahl.");
  {
    const vals = [0.713, 0.685, 0.697, 0.782, 0.732];
    tx(s, "Dasselbe Modell (KNN), fünf verschiedene Prüf-Teilmengen:", { x: MX, y: 1.95, w: 8.2, h: 0.45, fontSize: 17, bold: true });
    const ax0 = MX + 0.3, ax1 = 8.4, ay = 3.6;
    const sx = (v) => ax0 + (v - 0.66) / (0.80 - 0.66) * (ax1 - ax0);
    line(s, ax0, ay, ax1, ay, { color: T.accent4, width: 1.5 });
    [0.66, 0.70, 0.74, 0.78].forEach((v) => {
      line(s, sx(v), ay - 0.07, sx(v), ay + 0.07, { color: T.accent4, width: 1.5 });
      tx(s, Math.round(v * 100) + " %", { x: sx(v) - 0.4, y: ay + 0.36, w: 0.8, h: 0.3, fontSize: 12, color: C.text2, align: "center" });
    });
    rect(s, { x: sx(0.685), y: ay - 0.28, w: sx(0.782) - sx(0.685), h: 0.56, fill: { color: C.accent1, transparency: 55 } });
    vals.forEach((v, i) => {
      s.addShape(S.OVAL, { x: sx(v) - 0.16, y: ay - 0.16, w: 0.32, h: 0.32, fill: { color: C.text1 }, line: { color: T.lt1, width: 1.5 } });
      const rank = [...vals].sort().indexOf(v);
      tx(s, (v * 100).toFixed(1).replace(".", ",") + " %", { x: sx(v) - 0.5, y: rank % 2 === 0 ? ay - 1.0 : ay - 0.65, w: 1.0, h: 0.35, fontSize: 14, bold: true, align: "center" });
    });
    tx(s, "68,5 % bis 78,2 %", { x: MX, y: 4.55, w: 8, h: 0.75, fontSize: 36, bold: true });
    tx(s, "Eine einzige Aufteilung hätte uns irgendeinen dieser Werte gezeigt – reiner Zufall.", { x: MX, y: 5.35, w: 7.9, h: 0.8, fontSize: 16, color: C.text2 });
  }
  rect(s, { x: 9.15, y: 1.95, w: 3.58, h: 3.2, r: 0.1, fill: { color: C.background2 } });
  await iconCircle(s, "LuRefreshCw", 9.45, 2.25, 0.65, C.text1, "FFFFFF");
  tx(s, "Wie ein flaky Test", { x: 9.45, y: 3.1, w: 3.0, h: 0.45, fontSize: 19, bold: true });
  tx(s, "Ein grüner Lauf beweist wenig. Erst viele Läufe zeigen das echte Bild.", { x: 9.45, y: 3.6, w: 3.05, h: 1.6, fontSize: 16 });

  // 31 K-Fold Diagramm
  s = content("So funktioniert 5-fache Kreuzvalidierung", "Fünf Runden. In jeder Runde ist ein anderer Teil die Prüfung, die anderen vier sind Training. Jeder Teil ist genau einmal Prüfung. Die Scores hier sind wieder die echten Werte von KNN ohne Skalierung.");
  {
    tx(s, "X_train wird in 5 gleich große Teile (Folds) geteilt", { x: 1.75, y: 1.9, w: 7, h: 0.35, fontSize: 15, color: C.text2 });
    const scores = ["0,713", "0,685", "0,697", "0,782", "0,732"];
    const bx0 = 1.75, bw = 1.33, gap = 0.06, rh = 0.48;
    for (let r = 0; r < 5; r++) {
      const y = 2.4 + r * 0.66;
      tx(s, `Runde ${r + 1}`, { x: MX, y, w: 1.1, h: rh, fontSize: 15, bold: true, valign: "middle" });
      for (let k = 0; k < 5; k++) {
        const val = k === r;
        rect(s, { x: bx0 + k * (bw + gap), y, w: bw, h: rh, r: 0.05, fill: { color: val ? C.accent1 : C.accent2 } });
        if (r === 0) tx(s, val ? "Prüfung" : "Training", { x: bx0 + k * (bw + gap), y, w: bw, h: rh, fontSize: 13, bold: true, color: val ? C.text1 : C.background1, align: "center", valign: "middle" });
      }
      const ex = bx0 + 5 * (bw + gap);
      line(s, ex + 0.05, y + rh / 2, ex + 0.6, y + rh / 2, { color: T.dk1, width: 1.5, arrow: true });
      tx(s, scores[r], { x: ex + 0.7, y, w: 0.9, h: rh, fontSize: 17, fontFace: MONO, valign: "middle" });
    }
    const mx = 10.95;
    rect(s, { x: mx, y: 3.4, w: 1.78, h: 1.3, r: 0.08, fill: { color: C.text1 } });
    tx(s, [{ text: "Mittelwert", options: { fontSize: 14, breakLine: true } }, { text: "0,722", options: { fontSize: 26, bold: true, fontFace: MONO } }], { x: mx, y: 3.4, w: 1.78, h: 1.3, color: C.background1, align: "center", valign: "middle" });
    line(s, 10.55, 4.05, mx - 0.03, 4.05, { color: T.dk1, width: 1.5, arrow: true });
  }
  rect(s, { x: MX, y: 5.95, w: 0.3, h: 0.3, fill: { color: C.accent1 } });
  tx(s, "Validierungs-Fold (Prüfung)", { x: MX + 0.45, y: 5.92, w: 3.2, h: 0.36, fontSize: 14, valign: "middle" });
  rect(s, { x: 4.4, y: 5.95, w: 0.3, h: 0.3, fill: { color: C.accent2 } });
  tx(s, "Trainings-Folds", { x: 4.85, y: 5.92, w: 2.2, h: 0.36, fontSize: 14, valign: "middle" });
  s.addImage({ data: await icon("LuLock", T.dk2), x: 7.3, y: 5.94, w: 0.32, h: 0.32 });
  tx(s, "X_test spielt hier keine Rolle – er bleibt verschlossen.", { x: 7.75, y: 5.92, w: 5.0, h: 0.36, fontSize: 14, color: C.text2, valign: "middle" });

  // 32 Was du zurückbekommst
  s = content("Was die Kreuzvalidierung dir liefert", "Wichtig: Die Standardabweichung ist kein Konfidenzintervall, weil sich die Trainings-Folds überlappen. Sie zeigt nur, wie stark die Ergebnisse schwanken.");
  await d.cardGrid(s, [
    { icon: "LuListChecks", title: "5 Scores", text: "Einer pro Runde, also pro Validierungs-Fold." },
    { icon: "LuTarget", title: "Mittelwert", text: "Wie gut ist das Modell im Schnitt? Unsere Hauptkennzahl." },
    { icon: "LuBarChart3", title: "Standard­abweichung", text: "Wie stark schwanken die Scores? Ein Maß für Streuung – kein Konfidenzintervall." },
    { icon: "LuCpu", title: "Wie viele Folds?", text: "Üblich: 5 bis 10. Mehr Folds = mehr Rechenzeit." },
  ], { cols: 4, h: 3.75 });
  tx(s, [{ text: "In Code: ", options: { bold: true } }, { text: "cross_val_score(modell, X_train, y_train, cv=5)", options: { fontFace: MONO } }, { text: " – eine Zeile für alle fünf Runden." }], { x: MX, y: 6.0, w: CW, h: 0.5, fontSize: 16 });

  // 33 Baseline
  await codeSlide({
    title: "Die Messlatte: eine Baseline",
    code: `
from sklearn.dummy import DummyClassifier

baseline_scores = cross_val_score(
    DummyClassifier(strategy="most_frequent"),
    X_train, y_train,
    scoring="accuracy",
    cv=cv,           # cv = 5 Folds
    n_jobs=-1,       # alle CPU-Kerne nutzen
)
print(f"{baseline_scores.mean():.3f}")`,
    output: "0.617",
    takeaways: [
      "Der DummyClassifier ignoriert alle Features und rät immer die häufigste Klasse: „nicht überlebt“.",
      "Damit schafft er schon 61,7 % – das ist die Messlatte für jedes echte Modell.",
      "Ohne Baseline weißt du nicht, ob 72 % gut oder schlecht sind.",
    ],
    notes: "Die Mehrheitsklasse wird in jedem Trainings-Fold neu gelernt, nicht aus dem ganzen Datensatz. Im Notebook werden die Scores zusätzlich im Dictionary cv_scores gesammelt, für den Vergleich später.",
  });

  // ================= 6 VERGLEICH =================
  divider(6, "KNN und SGD – jeweils ohne und mit Skalierung, auf denselben Folds.", "Sechste Station: Jetzt messen wir, ob Skalierung wirklich etwas bringt.");

  // 35 KNN Konzept
  s = content("KNN: Frag die Nachbarn", "K-Nearest Neighbors ist eines der einfachsten Modelle: kein echtes Training, nur Merken und Vergleichen. Die Skizze ist schematisch.");
  {
    rect(s, { x: MX, y: 1.95, w: 6.0, h: 4.6, r: 0.1, fill: { color: C.background2 } });
    line(s, 0.95, 6.15, 6.3, 6.15, { color: T.dk2, width: 1.25, arrow: true });
    line(s, 0.95, 6.15, 0.95, 2.75, { color: T.dk2, width: 1.25, arrow: true });
    tx(s, "Merkmal 1", { x: 5.2, y: 6.2, w: 1.3, h: 0.3, fontSize: 12, color: C.text2, align: "right" });
    tx(s, "Merkmal 2", { x: 1.05, y: 2.65, w: 1.3, h: 0.3, fontSize: 12, color: C.text2 });
    const qx = 3.6, qy = 4.2;
    s.addShape(S.OVAL, { x: qx - 1.0, y: qy - 1.0, w: 2.0, h: 2.0, fill: { color: C.accent1, transparency: 80 }, line: { color: T.dk1, width: 1.25, dashType: "dash" } });
    const Y = C.accent1, N = C.text1;
    const pts = [[3.1, 3.8, Y], [4.0, 3.7, Y], [3.3, 4.8, Y], [4.1, 4.6, N], [3.7, 3.45, N],
      [1.6, 3.3, N], [2.1, 5.7, N], [5.6, 5.6, N], [1.4, 5.0, N], [5.3, 3.0, N], [5.8, 3.7, Y], [2.0, 3.2, Y], [4.9, 5.85, Y], [2.5, 2.95, N], [5.9, 4.8, Y]];
    pts.forEach((p) => s.addShape(S.OVAL, { x: p[0] - 0.13, y: p[1] - 0.13, w: 0.26, h: 0.26, fill: { color: p[2] }, line: { color: T.dk1, width: 0.75 } }));
    s.addShape(S.OVAL, { x: qx - 0.2, y: qy - 0.2, w: 0.4, h: 0.4, fill: { color: C.background1 }, line: { color: T.dk1, width: 2 } });
    tx(s, "?", { x: qx - 0.2, y: qy - 0.2, w: 0.4, h: 0.4, fontSize: 16, bold: true, align: "center", valign: "middle" });
    s.addShape(S.OVAL, { x: 1.0, y: 2.18, w: 0.22, h: 0.22, fill: { color: C.accent1 }, line: { color: T.dk1, width: 0.75 } });
    tx(s, "überlebt", { x: 1.3, y: 2.12, w: 1.2, h: 0.34, fontSize: 13, valign: "middle" });
    s.addShape(S.OVAL, { x: 2.6, y: 2.18, w: 0.22, h: 0.22, fill: { color: C.text1 }, line: { color: T.dk1, width: 0.75 } });
    tx(s, "nicht überlebt", { x: 2.9, y: 2.12, w: 1.8, h: 0.34, fontSize: 13, valign: "middle" });
  }
  const knnSteps = [
    ["Neuer Passagier", "Wir kennen seine Merkmale, aber nicht das Ergebnis."],
    ["Die k nächsten suchen", "Standard: k = 5 ähnlichste Passagiere aus den Trainingsdaten."],
    ["Mehrheit entscheidet", "3 von 5 haben überlebt → Vorhersage: überlebt."],
  ];
  knnSteps.forEach((st, i) => {
    const y = 2.0 + i * 1.1;
    d.numCircle(s, i + 1, 7.1, y, 0.5, C.text1, C.background1);
    tx(s, st[0], { x: 7.8, y: y - 0.03, w: 4.9, h: 0.4, fontSize: 18, bold: true });
    tx(s, st[1], { x: 7.8, y: y + 0.37, w: 4.9, h: 0.6, fontSize: 15, color: C.text2 });
  });
  callout(s, "„Nächste“ heißt: kleinster Abstand. Darum ist Skalierung bei KNN so wichtig.", { x: 7.1, w: 5.63, y: 5.45, h: 1.1, fontSize: 16 });

  // 36 KNN unskaliert
  await codeSlide({
    title: "KNN ohne Skalierung",
    code: `
knn_classifier = Pipeline([
    ("preprocessing", no_scaling_transformation),
    ("knn", KNeighborsClassifier()),
])

scores = cross_val_score(
    knn_classifier, X_train, y_train,
    scoring="accuracy", cv=cv, n_jobs=-1,
)`,
    hl: [1],
    output: `
Mean accuracy (unscaled): 0.722
Fold standard deviation (unscaled): 0.034`,
    takeaways: [
      "Du übergibst die ganze Pipeline – so wird die Vorverarbeitung in jedem Fold neu gelernt.",
      "„Ohne Skalierung“ heißt: Lücken füllen und kodieren ja, skalieren nein.",
      "72,2 %: klar besser als die Baseline (61,7 %).",
    ],
    notes: "cross_val_score trainiert für jeden Fold eine frische Pipeline und liefert Validierungs-Scores – nicht den Score auf dem Testdatensatz.",
  });

  // 37 KNN skaliert
  await codeSlide({
    title: "KNN mit Skalierung",
    code: `
knn_classifier_scaled = Pipeline([
    ("scaling_trans", scaling_transformation),
    ("knn", KNeighborsClassifier()),
])

scores_scaled = cross_val_score(
    knn_classifier_scaled, X_train, y_train,
    scoring="accuracy", cv=cv, n_jobs=-1,
)`,
    hl: [1],
    output: `
Mean accuracy (scaled): 0.788
Fold standard deviation (scaled): 0.012
Accuracy difference: +6.6 percentage points`,
    takeaways: [
      "Gleiches Modell, gleiche Folds – nur eine Zeile geändert. So misst du den Effekt genau einer Änderung.",
      "+6,6 Prozentpunkte – und die Streuung ist kleiner geworden.",
    ],
    notes: "Das ist das Grundprinzip eines fairen Experiments: alles gleich lassen außer der einen Sache, die man untersuchen will.",
  });

  // 38 Chart KNN pro Fold
  s = content("KNN pro Fold: höher und stabiler", "Die Balken zeigen die Accuracy pro Validierungs-Fold. Mit Skalierung sind alle fünf Folds besser und liegen enger beieinander.");
  s.addChart(pres.charts.BAR, [
    { name: "ohne Skalierung", labels: ["Fold 1", "Fold 2", "Fold 3", "Fold 4", "Fold 5"], values: [713, 685, 697, 782, 732] },
    { name: "standardisiert", labels: ["Fold 1", "Fold 2", "Fold 3", "Fold 4", "Fold 5"], values: [769, 790, 782, 796, 803] },
  ], chartBase({
    x: MX, y: TOP, w: 8.3, h: 4.85, barDir: "col", barGrouping: "clustered", barGapWidthPct: 70,
    chartColors: [T.accent4, T.dk1], valAxisMinVal: 0, valAxisMaxVal: 1000, valAxisHidden: true, valGridLine: { style: "none" },
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: PCT, showLegend: true, legendPos: "t",
  }));
  statBlock(s, { x: 9.4, y: 1.85, w: 3.35, vh: 0.75, size: 34, value: "72,2 → 78,8 %", label: "mittlere Accuracy" });
  statBlock(s, { x: 9.4, y: 3.5, w: 3.35, vh: 0.75, size: 34, value: "±3,4 → ±1,2", label: "Streuung über die Folds (Prozentpunkte)" });
  tx(s, "Skalierung macht KNN hier besser und verlässlicher.", { x: 9.4, y: 5.25, w: 3.33, h: 1.0, fontSize: 16, bold: true });

  // 39 SGD Konzept
  s = content("SGD: ein Modell, das in Schritten lernt", "SGDClassifier kann verschiedene lineare Modelle trainieren; welches, bestimmt der Parameter loss. Mit log_loss wird es eine logistische Regression. max_iter ist nur eine Obergrenze.");
  codeBlock(s, `
SGDClassifier(
    loss="log_loss",     # = logistische Regression
    max_iter=10000,      # Obergrenze für Durchläufe
    random_state=RSEED,  # wiederholbar
)`, { x: MX, y: TOP, w: 6.3 });
  await takeaway(s, [
    "SGD steht für Stochastic Gradient Descent – ein Trainingsverfahren, kein eigenes Modell.",
    "Die Pipeline bleibt gleich, nur der Modell-Schritt wechselt.",
  ], { x: MX, y: 3.85, w: 6.3 });
  await iconCircle(s, "LuMountain", 7.4, 1.95, 0.75, C.text1, "FFFFFF");
  tx(s, "Gradientenabstieg in einem Satz", { x: 8.35, y: 1.95, w: 4.4, h: 0.75, fontSize: 19, bold: true, valign: "middle" });
  tx(s, "Das Modell ändert seine Gewichte Schritt für Schritt in die Richtung, in der der Fehler kleiner wird – wie ein Abstieg im Nebel.", { x: 7.4, y: 2.9, w: 5.33, h: 1.3, fontSize: 16 });
  tx(s, "Warum hier Skalierung hilft", { x: 7.4, y: 4.4, w: 5.33, h: 0.45, fontSize: 19, bold: true });
  tx(s, "Bei sehr unterschiedlichen Maßstäben passt keine Schrittgröße für alle Features gleichzeitig. Das Lernen wird langsam oder instabil.", { x: 7.4, y: 4.9, w: 5.33, h: 1.5, fontSize: 16 });

  // 40 SGD Ergebnis
  s = content("SGD: Skalierung macht hier noch mehr aus", "Der Code ist derselbe wie bei KNN, nur mit SGDClassifier als letztem Schritt. Ohne Skalierung schwankt SGD stark – ein Fold erreicht nur 58,5 %.");
  rect(s, { x: MX, y: 1.95, w: 5.3, h: 2.9, r: 0.1, fill: { color: C.background2 } });
  tx(s, "ohne Skalierung", { x: MX + 0.4, y: 2.2, w: 4.5, h: 0.4, fontSize: 18, bold: true, color: C.text2 });
  tx(s, "67,7 %", { x: MX + 0.4, y: 2.7, w: 4.5, h: 1.2, fontSize: 66, bold: true, color: C.text2 });
  tx(s, "Streuung ± 5,6 Prozentpunkte", { x: MX + 0.4, y: 3.95, w: 4.5, h: 0.4, fontSize: 16, color: C.text2 });
  s.addImage({ data: await icon("LuArrowRight", T.dk1), x: 6.2, y: 2.95, w: 0.9, h: 0.9 });
  rect(s, { x: 7.43, y: 1.95, w: 5.3, h: 2.9, r: 0.1, fill: { color: C.accent5 } });
  tx(s, "mit Standardisierung", { x: 7.83, y: 2.2, w: 4.5, h: 0.4, fontSize: 18, bold: true });
  tx(s, "77,8 %", { x: 7.83, y: 2.7, w: 4.5, h: 1.2, fontSize: 66, bold: true });
  tx(s, "Streuung ± 2,5 Prozentpunkte", { x: 7.83, y: 3.95, w: 4.5, h: 0.4, fontSize: 16 });
  tx(s, "+10,1 Prozentpunkte", { x: MX, y: 5.2, w: 8, h: 0.7, fontSize: 32, bold: true });
  tx(s, "Bei SGD ist der Effekt noch größer als bei KNN (+6,6) – und das Ergebnis wird deutlich stabiler.", { x: MX, y: 5.9, w: CW, h: 0.5, fontSize: 16, color: C.text2 });

  // 41 Überblick
  s = content("Alle Modelle im Überblick", "Diese Tabelle baut das Notebook aus den gesammelten cv_scores. Wichtig: Prozentpunkte und Prozent nicht verwechseln.");
  s.addChart(pres.charts.BAR, [{
    name: "Mittlere CV-Accuracy",
    labels: ["Baseline (Mehrheit)", "SGD – ohne Skalierung", "KNN – ohne Skalierung", "SGD – standardisiert", "KNN – standardisiert"],
    values: [617, 677, 722, 778, 788],
  }], chartBase({
    x: MX, y: TOP, w: 8.3, h: 4.85, barDir: "bar", catAxisOrientation: "maxMin", barGapWidthPct: 45,
    chartColors: ["D5D9E0", "8FA0BA", "8FA0BA", T.dk1, T.dk1], valAxisHidden: true, valGridLine: { style: "none" },
    valAxisMinVal: 0, valAxisMaxVal: 1000, showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: PCT, dataLabelFontSize: 13,
    showLegend: false, catAxisLabelFontSize: 14,
  }));
  tx(s, "Was fällt auf?", { x: 9.4, y: 1.95, w: 3.35, h: 0.45, fontSize: 19, bold: true });
  bullets(s, [
    "Alle Modelle schlagen die Baseline.",
    "Skalierung hilft beiden – SGD sogar um 10 Punkte.",
    "Prozentpunkte ≠ Prozent: von 70 % auf 75 % sind +5 Prozentpunkte.",
  ], { x: 9.4, y: 2.5, w: 3.33, h: 3.6, gap: 10 });

  // 42 Übung 2
  await exerciseSlide("Übung 2: KNN mit Min-Max-Skalierung",
    "Trainiere und bewerte KNN mit deiner Min-Max-Vorverarbeitung aus Übung 1.",
    ["Gleiche Struktur wie beim standardisierten KNN.", "Nur der Vorverarbeitungs-Schritt ändert sich.", "Dieselben Folds verwenden (cv=cv)."],
    "Aufgabe 2 im Notebook. Wer fertig ist: Ergebnis mit dem standardisierten KNN vergleichen.");

  // 43 Lösung 2
  await codeSlide({
    title: "Lösung 2",
    code: `
knn_normalized = Pipeline([
    ("scaling_trans", normalization_transformation),
    ("knn", KNeighborsClassifier()),
])
scores_norm = cross_val_score(
    knn_normalized, X_train, y_train,
    scoring="accuracy", cv=cv, n_jobs=-1,
)
print("Score (normalized):", round(scores_norm.mean(), 2))`,
    hl: [1],
    output: "Score (normalized): 0.79",
    takeaways: [
      "Min-Max (79,2 %) und Standardisierung (78,8 %) liegen hier fast gleichauf.",
      "Keiner der beiden ist grundsätzlich besser – vergleiche immer auf denselben Folds.",
    ],
    notes: "Ungerundet: 0,792 mit Min-Max gegenüber 0,788 mit Standardisierung. Der Unterschied ist kleiner als die Streuung über die Folds.",
  });

  // ================= 7 TUNING =================
  divider(7, "Die besten Einstellungen systematisch finden, statt zu raten.", "Siebte Station: Bisher haben wir KNN mit Standardeinstellungen benutzt. Geht es besser?");

  // 45 Parameter vs Hyperparameter
  s = content("Parameter und Hyperparameter", "Die besten Hyperparameter unterscheiden sich von Datensatz zu Datensatz. Deshalb probieren wir sie aus – aber systematisch und mit Kreuzvalidierung.");
  const hp = [
    { fill: C.accent5, icon: "LuSlidersHorizontal", title: "Hyperparameter", body: "Legst du vor dem Training fest.", ex: "KNeighborsClassifier(n_neighbors=5)", dev: "≈ Konfigurationswerte oder CLI-Flags" },
    { fill: C.background2, icon: "LuBrain", title: "Gelernte Parameter", body: "Berechnet das Modell beim Training aus den Daten.", ex: "μ und σ im StandardScaler", dev: "≈ Werte, die das Programm zur Laufzeit ausrechnet" },
  ];
  for (let i = 0; i < 2; i++) {
    const x = MX + i * 6.23;
    const h = hp[i];
    rect(s, { x, y: 1.95, w: 5.9, h: 3.6, r: 0.1, fill: { color: h.fill } });
    await iconCircle(s, h.icon, x + 0.35, 2.25, 0.7, C.text1, "FFFFFF");
    tx(s, h.title, { x: x + 1.25, y: 2.25, w: 4.4, h: 0.7, fontSize: 22, bold: true, valign: "middle" });
    tx(s, h.body, { x: x + 0.4, y: 3.2, w: 5.2, h: 0.45, fontSize: 17 });
    tx(s, "Beispiel", { x: x + 0.4, y: 3.8, w: 5.2, h: 0.3, fontSize: 13, bold: true, color: C.text2 });
    tx(s, h.ex, { x: x + 0.4, y: 4.12, w: 5.2, h: 0.4, fontSize: 15, fontFace: i === 0 ? MONO : undefined });
    tx(s, h.dev, { x: x + 0.4, y: 4.85, w: 5.2, h: 0.4, fontSize: 15, italic: true, color: C.accent2 });
  }
  tx(s, "Die Frage: Welche Hyperparameter passen am besten zu unseren Daten?", { x: MX, y: 5.9, w: CW, h: 0.5, fontSize: 18, bold: true });

  // 46 Stellschrauben KNN
  s = content("Die Stellschrauben von KNN", "Drei Hyperparameter, die wir gleich gemeinsam tunen. p = 3 ist eine weitere Minkowski-Distanz und wird einfach mit ausprobiert.");
  d.table(s, ["Hyperparameter", "Bedeutung", "Werte im Grid"], [
    ["n_neighbors", "Wie viele Nachbarn abstimmen", "2, 3, 4, 5, 10"],
    ["weights", "uniform: alle Stimmen gleich · distance: nähere zählen mehr", "uniform, distance"],
    ["p", "Abstandsmaß: 1 = Manhattan, 2 = euklidisch, 3 = Minkowski", "1, 2, 3"],
  ], { y: 1.95, w: CW, colW: [2.4, 6.53, 3.2], rowH: [0.55, 0.65, 0.65, 0.65], fontSize: 16, mono: [0, 2], margin: [0, 0.12, 0, 0.12] });
  {
    const ax = 1.0, ay = 6.35, bx2 = 3.6, by2 = 4.75;
    line(s, ax, ay, bx2, ay, { color: T.accent1, width: 4 });
    line(s, bx2, ay, bx2, by2, { color: T.accent1, width: 4 });
    line(s, ax, ay, bx2, by2, { color: T.dk1, width: 2, dash: "dash" });
    s.addShape(S.OVAL, { x: ax - 0.12, y: ay - 0.12, w: 0.24, h: 0.24, fill: { color: C.text1 }, line: { type: "none" } });
    s.addShape(S.OVAL, { x: bx2 - 0.12, y: by2 - 0.12, w: 0.24, h: 0.24, fill: { color: C.text1 }, line: { type: "none" } });
    rect(s, { x: 4.4, y: 5.0, w: 0.5, h: 0.12, fill: { color: C.accent1 } });
    tx(s, [{ text: "p = 1 · Manhattan: ", options: { bold: true } }, { text: "wie Straßenblöcke – nur waagrecht und senkrecht" }], { x: 5.1, y: 4.85, w: 7.6, h: 0.4, fontSize: 16 });
    line(s, 4.4, 5.86, 4.9, 5.86, { color: T.dk1, width: 2, dash: "dash" });
    tx(s, [{ text: "p = 2 · euklidisch: ", options: { bold: true } }, { text: "die Luftlinie" }], { x: 5.1, y: 5.66, w: 7.6, h: 0.4, fontSize: 16 });
  }

  // 47 Namenskonvention
  s = content("Namen in der Pipeline: schritt__parameter", "Der doppelte Unterstrich ist die Brücke von der Pipeline in den einzelnen Schritt. So kann GridSearchCV Einstellungen tief in der Pipeline ändern.");
  {
    const fs = 54;
    const cwid = fs * 0.5498 / 72;
    const segs = [["knn", "Schritt", C.accent1, 40], ["__", "Trenner", null, 0], ["n_neighbors", "Parameter", C.background2, 0]];
    const total = segs.reduce((a, g) => a + g[0].length * cwid, 0);
    let x = (W - total) / 2;
    segs.forEach((g) => {
      const w = g[0].length * cwid;
      if (g[2]) rect(s, { x: x - 0.04, y: 2.05, w: w + 0.08, h: 0.95, fill: g[3] ? { color: g[2], transparency: g[3] } : { color: g[2] } });
      tx(s, g[0], { x, y: 2.05, w: w + 0.4, h: 0.95, fontSize: fs, fontFace: MONO, valign: "middle", wrap: false, color: g[0] === "__" ? C.accent3 : C.text1 });
      tx(s, g[1], { x: x + w / 2 - 0.6, y: 3.1, w: 1.2, h: 0.4, fontSize: 16, bold: true, color: C.text2, align: "center" });
      x += w;
    });
  }
  codeBlock(s, `
knn_classifier_scaled = Pipeline([
    ("scaling_trans", scaling_transformation),
    ("knn", KNeighborsClassifier()),
])`, { x: MX, y: 3.95, w: 7.6, hl: [2] });
  await takeaway(s, [
    "Mit schritt__parameter erreichst du jede Einstellung in der Pipeline.",
    "get_params() listet alle verfügbaren Namen auf.",
  ], { x: 8.55, y: 3.95, w: 4.18 });

  // 48 Grid Search Mathe
  s = content("Grid Search: alles ausprobieren", "Mit refit=True (Standard) trainiert GridSearchCV die beste Kombination am Ende noch einmal auf ganz X_train. Das Ergebnis steckt dann in best_estimator_.");
  {
    const box = (x, y, v, lab, hi) => {
      rect(s, { x, y, w: 1.45, h: 1.05, r: 0.08, fill: { color: hi ? C.accent1 : C.background2 } });
      tx(s, v, { x, y, w: 1.45, h: 1.05, fontSize: 38, bold: true, align: "center", valign: "middle" });
      tx(s, lab, { x: x - 0.2, y: y + 1.12, w: 1.85, h: 0.55, fontSize: 13, color: C.text2, align: "center" });
    };
    const op = (x, y, t) => tx(s, t, { x, y, w: 0.6, h: 1.05, fontSize: 32, color: C.text2, align: "center", valign: "middle" });
    const xs = [MX, 2.65, 4.7, 6.75];
    box(xs[0], 2.0, "5", "n_neighbors"); op(2.05, 2.0, "×");
    box(xs[1], 2.0, "2", "weights"); op(4.1, 2.0, "×");
    box(xs[2], 2.0, "3", "p"); op(6.15, 2.0, "=");
    box(xs[3], 2.0, "30", "Kombinationen", true);
    box(xs[0], 4.1, "30", "Kombinationen"); op(2.05, 4.1, "×");
    box(xs[1], 4.1, "5", "Folds"); op(4.1, 4.1, "=");
    box(xs[2], 4.1, "150", "Trainingsläufe", true); op(6.15, 4.1, "+");
    box(xs[3], 4.1, "1", "Refit des Gewinners");
  }
  tx(s, "Wie verschachtelte Schleifen", { x: 8.65, y: 1.95, w: 4.1, h: 0.45, fontSize: 19, bold: true });
  codeBlock(s, `
for k in [2, 3, 4, 5, 10]:
  for w in ["uniform", "distance"]:
    for p in [1, 2, 3]:
      bewerte(k, w, p)  # 5 Folds`, { x: 8.65, y: 2.5, w: 4.08, fontSize: 12.5 });
  tx(s, "Gründlich, aber teuer: Jeder weitere Wert multipliziert den Aufwand.", { x: 8.65, y: 4.3, w: 4.08, h: 1.0, fontSize: 16 });
  tx(s, "Pro Fold wird immer die komplette Pipeline neu trainiert – nicht nur KNN.", { x: MX, y: 6.05, w: CW, h: 0.5, fontSize: 16, italic: true, color: C.text2 });

  // 49 GridSearch Code
  await codeSlide({
    title: "Code: GridSearchCV",
    code: `
param_grid = {
    "knn__n_neighbors": [2, 3, 4, 5, 10],
    "knn__weights": ["uniform", "distance"],
    "knn__p": [1, 2, 3],
}

gs = GridSearchCV(
    knn_classifier_scaled, param_grid,
    scoring="accuracy", cv=cv,
    verbose=3, n_jobs=-1,
)
gs.fit(X_train, y_train)`,
    output: "Fitting 5 folds for each of 30 candidates, totalling 150 fits",
    outputLabel: "Ausgabe (erste Zeile)",
    takeaways: [
      "param_grid ist ein Dictionary: Schlüssel = Hyperparameter, Wert = Liste der Kandidaten.",
      "verbose=3 schreibt jeden einzelnen Trainingslauf ins Log.",
      "Gesucht wird nur auf X_train – die Testdaten bleiben weiter verschlossen.",
    ],
    notes: "Im Notebook wird zusätzlich die Laufzeit mit timer() gemessen. Die Scores im Log sind Validierungs-Scores, keine Test-Accuracy.",
  });

  // 50 Ergebnis Grid
  s = content("Das Ergebnis der Grid Search", "best_score_ ist der Mittelwert über die fünf Folds für die beste Kombination. Interessant: Gewonnen hat k = 10 mit Manhattan-Distanz – nicht der Standard k = 5.");
  const attrs = [
    ["gs.best_score_", "0.824", "mittlere CV-Accuracy des besten Kandidaten"],
    ["gs.best_params_", "{'knn__n_neighbors': 10, 'knn__p': 1, 'knn__weights': 'uniform'}", "die Gewinner-Einstellungen"],
    ["gs.best_estimator_", "Pipeline(…)", "die komplette Pipeline – schon neu trainiert auf ganz X_train"],
  ];
  attrs.forEach((a, i) => {
    const y = 1.95 + i * 1.5;
    rect(s, { x: MX, y, w: 3.2, h: 0.48, r: 0.06, fill: { color: C.text1 } });
    tx(s, a[0], { x: MX, y, w: 3.2, h: 0.48, fontSize: 15, fontFace: MONO, bold: true, color: C.background1, align: "center", valign: "middle" });
    tx(s, a[1], { x: MX, y: y + 0.58, w: 8.0, h: 0.38, fontSize: 14, fontFace: MONO });
    tx(s, a[2], { x: MX, y: y + 0.95, w: 8.0, h: 0.38, fontSize: 15, color: C.text2 });
  });
  rect(s, { x: 9.1, y: 1.95, w: 3.63, h: 4.4, r: 0.1, fill: { color: C.accent5 } });
  tx(s, "KNN mit Standardwerten", { x: 9.4, y: 2.2, w: 3.1, h: 0.35, fontSize: 14, color: C.text2 });
  tx(s, "78,8 %", { x: 9.4, y: 2.55, w: 3.1, h: 0.75, fontSize: 36, bold: true, color: C.text2 });
  tx(s, "KNN getunt", { x: 9.4, y: 3.5, w: 3.1, h: 0.35, fontSize: 14, color: C.text2 });
  tx(s, "82,4 %", { x: 9.4, y: 3.85, w: 3.1, h: 0.85, fontSize: 48, bold: true });
  tx(s, "+3,6 Prozentpunkte – nur durch bessere Einstellungen", { x: 9.4, y: 4.95, w: 3.1, h: 1.0, fontSize: 16, bold: true });

  // 51 Randomized Konzept
  s = content("Randomized Search: Stichprobe statt alles", "Die gelben Felder sind genau die 10 Kombinationen, die RandomizedSearchCV mit random_state=10 gezogen hat. Die beste Kombination der Grid Search war zufällig nicht dabei.");
  {
    const ks = [2, 3, 4, 5, 10];
    const sampled = new Set(["5|1", "3|3", "2|5", "2|1", "2|4", "5|4", "4|3", "10|4", "4|0", "2|3"]);
    const gx = 2.0, cw = 0.97, ch = 0.6, g = 0.06;
    tx(s, "uniform", { x: gx, y: 1.95, w: 3 * cw + 2 * g, h: 0.35, fontSize: 14, bold: true, align: "center" });
    tx(s, "distance", { x: gx + 3 * (cw + g), y: 1.95, w: 3 * cw + 2 * g, h: 0.35, fontSize: 14, bold: true, align: "center" });
    for (let c = 0; c < 6; c++) tx(s, `p=${(c % 3) + 1}`, { x: gx + c * (cw + g), y: 2.3, w: cw, h: 0.3, fontSize: 13, fontFace: MONO, color: C.text2, align: "center" });
    ks.forEach((k, r) => {
      const y = 2.7 + r * (ch + g);
      tx(s, `k = ${k}`, { x: MX, y, w: 1.25, h: ch, fontSize: 15, fontFace: MONO, valign: "middle" });
      for (let c = 0; c < 6; c++) {
        const hit = sampled.has(`${k}|${c}`);
        const best = k === 10 && c === 0;
        rect(s, { x: gx + c * (cw + g), y, w: cw, h: ch, r: 0.04, fill: { color: hit ? C.accent1 : C.background2 }, line: best ? { color: T.dk1, width: 2.5 } : { type: "none" } });
      }
    });
  }
  statBlock(s, { x: 8.75, y: 1.8, w: 4.0, vh: 0.8, size: 40, value: "10 von 30", label: "Kombinationen (n_iter=10)" });
  statBlock(s, { x: 8.75, y: 3.35, w: 4.0, vh: 0.8, size: 40, value: "50 Läufe", label: "10 × 5 Folds, plus 1 Refit" });
  rect(s, { x: 8.75, y: 5.05, w: 0.3, h: 0.3, fill: { color: C.accent1 } });
  tx(s, "zufällig gezogen", { x: 9.2, y: 5.02, w: 3.5, h: 0.36, fontSize: 14, valign: "middle" });
  rect(s, { x: 8.75, y: 5.55, w: 0.3, h: 0.3, fill: { color: C.background2 }, line: { color: T.dk1, width: 2.5 } });
  tx(s, "Bester laut Grid Search", { x: 9.2, y: 5.52, w: 3.5, h: 0.36, fontSize: 14, valign: "middle" });
  tx(s, "Gleicher Suchraum, ein Drittel des Aufwands.", { x: MX, y: 6.15, w: 8, h: 0.45, fontSize: 16, bold: true });

  // 52 Randomized Code
  await codeSlide({
    title: "Code: RandomizedSearchCV",
    code: `
rs = RandomizedSearchCV(
    knn_classifier_scaled, param_grid,
    scoring="accuracy", cv=cv,
    n_iter=10,            # 10 von 30 Kombinationen
    random_state=RSEED,   # gleiche Stichprobe
    verbose=3, n_jobs=-1,
)
rs.fit(X_train, y_train)`,
    hl: [3, 4],
    output: `
Best CV accuracy: 0.788
Best parameters: {'knn__weights': 'uniform',
                  'knn__p': 2, 'knn__n_neighbors': 5}`,
    outputLabel: "Ausgabe (gekürzt)",
    takeaways: [
      "Gleiche Schnittstelle wie GridSearchCV – dazu kommen nur n_iter und random_state.",
      "Derselbe param_grid wird wiederverwendet, damit sich im Vergleich nur die Suchstrategie ändert.",
      "Diesmal hat die Stichprobe den besten Kandidaten (k = 10, p = 1) nicht erwischt.",
    ],
    notes: "Bei Random Search hängt das Ergebnis von der Stichprobe ab. Mit einem anderen random_state hätte sie den besten Kandidaten vielleicht gefunden.",
  });

  // 53 Grid vs Random
  s = content("Grid oder Random?", "Die Zeiten stammen aus einem einzigen Lauf und hängen von Hardware und Caching ab – kein Benchmark. Bei großen Suchräumen wird der Unterschied schnell riesig.");
  const cmp = [
    { title: "Grid Search", fill: C.accent5, vals: ["30", "150 (+1)", "82,4 %", "0,25 s"], good: "kleine Suchräume, wenn Gründlichkeit zählt" },
    { title: "Randomized Search", fill: C.background2, vals: ["10", "50 (+1)", "78,8 %", "0,09 s"], good: "große Suchräume oder wenig Zeit" },
  ];
  const labs = ["Kandidaten", "Trainingsläufe", "beste CV-Accuracy", "Laufzeit"];
  for (let i = 0; i < 2; i++) {
    const x = MX + i * 6.23;
    const c = cmp[i];
    rect(s, { x, y: 1.95, w: 5.9, h: 4.35, r: 0.1, fill: { color: c.fill } });
    tx(s, c.title, { x: x + 0.4, y: 2.2, w: 5.1, h: 0.5, fontSize: 22, bold: true });
    labs.forEach((l, j) => {
      const y = 2.9 + j * 0.62;
      tx(s, l, { x: x + 0.4, y, w: 2.8, h: 0.5, fontSize: 16, color: C.text2, valign: "middle" });
      tx(s, c.vals[j], { x: x + 3.0, y, w: 2.5, h: 0.5, fontSize: 22, bold: true, align: "right", valign: "middle" });
    });
    tx(s, [{ text: "Gut für: ", options: { bold: true } }, { text: c.good }], { x: x + 0.4, y: 5.45, w: 5.1, h: 0.7, fontSize: 16 });
  }
  tx(s, "Zeitmessung aus einem Lauf – hängt von der Hardware ab, kein Benchmark.", { x: MX, y: 6.4, w: CW, h: 0.35, fontSize: 12, color: C.text2 });

  // ================= 8 ABSCHLUSS =================
  divider(8, "Einmal ehrlich testen – dann das Modell für Notebook 3 speichern.", "Letzte Station: Jetzt – und erst jetzt – holen wir die Testdaten aus dem Tresor.");

  // 55 Erst auswählen
  s = content("Erst auswählen, dann testen", "Die Reihenfolge ist entscheidend: Die Auswahl fällt ausschließlich über die CV-Scores. Erst danach wird der Testdatensatz einmal benutzt.");
  steps(s, [
    { title: "Vergleichen", text: "Kandidaten nur per CV-Score vergleichen: Grid 82,4 % gegen Random 78,8 %." },
    { title: "Einmal testen", text: "Den Gewinner genau einmal auf X_test anwenden." },
    { title: "Berichten", text: "Den Test-Score festhalten – und nicht zurückgehen, um nachzutunen." },
  ], { highlight: 1 });
  callout(s, [{ text: "Warum so streng? ", options: { bold: true } }, { text: "Jede Entscheidung, die du anhand der Testdaten triffst, schönt den Test-Score." }], { y: 5.35, h: 1.0, bold: false });

  // 56 Final Code
  await codeSlide({
    title: "Code: der einzige Blick auf die Testdaten",
    code: `
searches = {"Grid search": gs, "Randomized search": rs}

# Auswahl NUR anhand der CV-Scores
selected_name = max(
    searches, key=lambda name: searches[name].best_score_
)
selected_model = searches[selected_name].best_estimator_

# Erster und einziger Blick auf die Testdaten
y_pred_test = selected_model.predict(X_test)
accuracy_score(y_test, y_pred_test)`,
    hl: [9],
    output: `
Selected by CV accuracy: Grid search
Final test accuracy: 0.799`,
    outputLabel: "Ausgabe (gekürzt)",
    takeaways: [
      "predict() nutzt die gelernte Vorverarbeitung – es wird nichts neu trainiert.",
      "Der Test-Score ist das Endergebnis, kein Werkzeug zum Weiter-Tunen.",
    ],
    notes: "max() mit key wählt die Suche mit dem höchsten best_score_. Bei Gleichstand gewinnt der erste Eintrag im Dictionary. Im Notebook gibt print_pretty_summary zusätzlich die Hyperparameter aus.",
  });

  // 57 CV vs Test
  s = content("CV-Score und Test-Score", "Wir haben den besten von 30 Kandidaten ausgewählt. In so einem Bestwert steckt immer auch etwas Glück. Der Test-Score auf unberührten Daten ist der ehrlichere Wert – und liegt immer noch deutlich über der Baseline.");
  statBlock(s, { x: MX, y: 1.8, w: 3.8, value: "82,4 %", label: "CV-Accuracy der besten Suche" });
  statBlock(s, { x: MX + 4.14, y: 1.8, w: 3.8, value: "79,9 %", label: "Test-Accuracy – einmal gemessen", color: C.accent2 });
  statBlock(s, { x: MX + 8.28, y: 1.8, w: 3.8, value: "61,7 %", label: "Baseline zum Vergleich", color: C.text2 });
  rect(s, { x: MX, y: 4.0, w: CW, h: 1.95, r: 0.1, fill: { color: C.background2 } });
  tx(s, "Warum ist der Test-Score niedriger?", { x: MX + 0.4, y: 4.25, w: CW - 0.8, h: 0.45, fontSize: 20, bold: true });
  tx(s, "Wir haben den besten von 30 Kandidaten ausgewählt. In diesem Bestwert steckt immer auch ein bisschen Glück – der CV-Score ist deshalb eher optimistisch. Der Testdatensatz liefert den ehrlicheren Wert.", { x: MX + 0.4, y: 4.8, w: CW - 0.8, h: 0.95, fontSize: 17 });

  // 58 Export
  {
    s = content("Export: das Modell für Notebook 3 speichern", "Gespeichert wird genau das Modell, das getestet wurde – kein neues Training, kein neues Tuning. Die Dateien liegen im Ordner artifacts/, der von Git ignoriert wird.");
    const y = codeBlock(s, `
import joblib

# Komplette Pipeline speichern – inkl. Vorverarbeitung
joblib.dump(
    selected_model,
    artifact_dir / "titanic_pipeline.joblib",
)

# Metadaten: Features, Kategorien, Wertebereiche, Scores
(artifact_dir / "titanic_model_info.json").write_text(
    json.dumps(model_info, indent=2) + "\\n"
)`, { x: MX, y: TOP, w: 7.6 });
    const files = [["titanic_pipeline.joblib", "das trainierte Modell inklusive Vorverarbeitung"], ["titanic_model_info.json", "Eingaben, bekannte Kategorien, Wertebereiche, Scores"]];
    files.forEach((f, i) => d.fileCard(s, f[0], f[1], MX + i * 3.875, y + 0.25, 3.725));
    await takeaway(s, [
      "Speichere die ganze Pipeline, nicht nur das Modell – sonst fehlt bei neuen Daten die Vorverarbeitung.",
      "Kein neues Training: Gespeichert wird genau das, was du getestet hast.",
      "Notebook 3 lädt beides und macht damit Vorhersagen.",
    ], { x: 8.55, y: TOP, w: 4.18 });
  }

  // ================= ZUSAMMENFASSUNG =================
  // 59 Rückblick – eine Zeile pro Station
  await d.recapSlide([
    "Erst schauen: Lücken zählen, Features bewusst wählen.",
    "Testdaten wegschließen – bis zur letzten Station.",
    "Vergleichbare Maßstäbe – fit nur auf Trainingsdaten.",
    "Vorverarbeitung + Modell = ein Objekt, kein Leakage.",
    "Fünf Experimente statt einem, Baseline als Messlatte.",
    "Skalierung: KNN +6,6 und SGD +10,1 Prozentpunkte.",
    "Grid gründlich, Random sparsam – beste CV 82,4 %.",
    "Einmal testen (79,9 %), ganze Pipeline speichern.",
  ], "Eine Zeile pro Station – das ist der rote Faden des Notebooks.");

  // 60 Regeln
  d.rulesSlide([
    "Testdaten erst ganz am Ende anfassen.",
    "fit() nur auf Trainingsdaten.",
    "Vorverarbeitung gehört in die Pipeline.",
    "Immer gegen eine Baseline vergleichen.",
    "Entscheidungen per Kreuzvalidierung treffen – nicht per Test-Score.",
  ], "Wenn nur fünf Sätze hängen bleiben, dann diese.");

  // 61 Ausblick – die nächsten Notebooks laut README
  await d.outlookSlide({
    cards: [
      { icon: "LuDatabase", title: "Notebook 2 · Aufgabe", text: "Den kompletten Workflow selbst anwenden – mit Daten zu Herzerkrankungen aus PostgreSQL." },
      { icon: "LuPackage", title: "Notebook 3 · Vorhersagen", text: "Die gespeicherte Pipeline laden, neue Eingaben prüfen und Vorhersagen machen." },
    ],
    notes: "Für Notebook 3 muss Notebook 1 bis einschließlich 'Export für Notebook 3' gelaufen sein, damit die Dateien in artifacts/ existieren.",
  });

  await d.save(OUT);
  console.log("geschrieben:", OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
