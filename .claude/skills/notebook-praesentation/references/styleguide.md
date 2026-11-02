# Styleguide „Tinte und Textmarker“

Wie die Präsentationen aussehen – und warum. Alle Werte hier sind in `scripts/deck_lib.js`
umgesetzt. Wer das Design ändern will, ändert die Bibliothek, nicht einzelne Deck-Skripte.

## Inhalt

1. Leitidee
2. Format und Raster
3. Farben
4. Schrift
5. Folienrahmen (Layouts)
6. Bausteine
7. Folientypen
8. Code auf Folien
9. Diagramme
10. Bilder und Icons
11. Typografie im Detail
12. Was wir nicht machen
13. Checkliste für die Sichtprüfung

---

## 1. Leitidee

Die Skizzen in den Bootcamp-Notebooks sind mit dunkelblauer Tinte gezeichnet und mit gelbem
Textmarker hervorgehoben. Die Präsentation übernimmt genau das: **weiße Fläche, dunkelblaue
Tinte, Gelb nur zum Hervorheben.** Minimalistisch, damit die Aufmerksamkeit beim Inhalt bleibt –
Einsteiger sollen nicht gleichzeitig Design und Data Science verarbeiten müssen.

Daraus folgen drei Grundsätze:

- **Gelb ist ein Textmarker, keine Dekoration.** Es markiert, was wichtig ist: die Lernbox,
  geänderte Code-Zeilen, das Ergebnis, die aktuelle Station. Taucht Gelb überall auf, markiert es nichts mehr.
- **Eine Folie, eine Botschaft.** Lieber eine Folie mehr als eine überladene.
- **Jede Folie hat etwas zum Anschauen** – Code, Diagramm, Skizze, Karten, große Zahlen. Reine
  Aufzählungsfolien gibt es nicht.

## 2. Format und Raster

| Größe | Wert | Konstante |
|---|---|---|
| Format | 16:9 breit, 13,333 × 7,5 Zoll | `LAYOUT_WIDE` |
| Seitenrand links/rechts | 0,6 Zoll | `MX` |
| Inhaltsbreite | 12,133 Zoll | `CW` |
| Kicker (Station) | y = 0,36 | – |
| Titel | y = 0,70, eine Zeile | Platzhalter `title` |
| Inhalt beginnt | y = 1,85 | `TOP` |
| Inhalt endet spätestens | y = 6,75 | `BOTTOM` |
| Fußzeile und Foliennummer | y = 7,0 | Layout `INHALT` |

Abstände zwischen Blöcken: **0,3 Zoll** (Karten, Spalten) bzw. **0,25 Zoll** (Code → Ausgabe).
Zwei Spalten: links 7,6 Zoll (Code), Lücke 0,35, rechts 4,18 Zoll (Lernbox) – das ist das
Standardraster der Code-Folien. Zwei gleich breite Karten: je 5,9 Zoll, Lücke 0,33.

## 3. Farben

Farben werden als Schemafarben gesetzt (`C.accent1` …), damit das Theme in PowerPoint stimmt.
Einige Optionen verlangen Hex-Werte (Diagrammfarben, Gitterlinien, Rahmen von Linien) – dort
`T.accent1` usw. aus dem Theme-Objekt verwenden. Eine Schemafarbe an einer Hex-Stelle macht die
Datei unlesbar; `save()` bricht dann mit einer Meldung ab.

| Rolle | Schema | Hex | Wofür |
|---|---|---|---|
| Tinte | `C.text1` / `T.dk1` | `1F2A44` | Text, Titel, dunkle Folien, Icon-Kreise, „gute“ Balken |
| Gedämpft | `C.text2` / `T.dk2` | `5B6475` | Beschreibungen, Labels, Fußzeile |
| Weiß | `C.background1` | `FFFFFF` | Hintergrund der Inhaltsfolien |
| Fläche | `C.background2` / `T.lt2` | `F3F4F6` | Karten, Code-Blöcke, neutrale Boxen |
| Textmarker | `C.accent1` / `T.accent1` | `F2C200` | Hervorhebung, Nummernkreise, aktive Station |
| Stahlblau | `C.accent2` / `T.accent2` | `3D5A80` | Kicker, Analogien, Trainings-Blöcke, Karten auf Dunkel |
| Warnung | `C.accent3` / `T.accent3` | `B5452F` | „Vorsicht“, fehlende Werte, „niemals“ – sparsam |
| Linie | `C.accent4` / `T.accent4` | `B8BFCC` | Linien, Pfeile, Untertitel auf Dunkel, „vorher“-Balken |
| Gelb-Tönung | `C.accent5` | `FFF4C7` | Lernbox, Kernaussage-Leiste, hervorgehobene Karte |
| Grün | `C.accent6` | `2E7D4F` | nur Code-Strings |

Zusätzlich fest verdrahtet: Warnfläche `F8E7E2` (Box „Niemals …“), Tabellenlinien `E3E6EB`,
helle Tabellenmarkierung `FBE7A1`, Balken „ohne“ `8FA0BA`, Baseline-Balken `D5D9E0`.

**Hell/Dunkel-Sandwich:** Titel-, Kapitel- und Ausblickfolien sind dunkel (Tinte), alle
Inhaltsfolien weiß. So spürt man beim Durchklicken, wann ein neuer Abschnitt beginnt.

## 4. Schrift

| Element | Schrift | Größe |
|---|---|---|
| Folientitel | Calibri fett | 36 pt, eine Zeile, max. ~45 Zeichen |
| Titel auf Titel-/Kapitelfolie | Calibri fett | 48 / 44 pt |
| Kicker (Station) | Calibri fett, Großbuchstaben, gesperrt | 12 pt, Stahlblau |
| Zwischenüberschrift | Calibri fett | 18–22 pt |
| Fließtext | Calibri | 15–17 pt (nie unter 14) |
| Beschriftungen, Achsen | Calibri | 12–14 pt, gedämpft |
| Große Zahlen | Calibri fett | 34–66 pt |
| Code | Consolas | 14 pt, Zeilenabstand 18 pt |
| Ausgabe | Consolas | 13 pt, gedämpft |
| Formeln | Cambria kursiv | 34 pt |

Calibri, Consolas und Cambria sind bei jedem Office dabei (Windows und Mac) – deshalb diese Wahl.
Keine weiteren Schriften einführen.

## 5. Folienrahmen (Layouts)

| Layout | Hintergrund | Platzhalter | Wird erzeugt von |
|---|---|---|---|
| `TITEL` | Tinte | Titel (unten bündig) | `titleSlide()` |
| `KAPITEL` | Tinte | Titel | `divider()` |
| `INHALT` | Weiß | Titel, Fußzeile, Foliennummer | `content()` und alle Inhaltsfolientypen |
| `AUSBLICK` | Tinte | Titel (oben) | `outlookSlide()` |

Jede Inhaltsfolie trägt oben links den **Kicker** „STATION 3 · SKALIERUNG“ (bzw. „EINSTIEG“,
„ZUSAMMENFASSUNG“). Er zeigt, wo auf der Reise man gerade ist – wichtig bei 50+ Folien.

Kapitelfolien zeigen die Stationsnummer in einem großen gelben Kreis, darüber „STATION 3 VON 8“,
darunter einen Satz, was man in dieser Station lernt, und unten die **Fortschrittspunkte**
(erledigt = weiß, aktuell = gelb und größer, kommend = Umriss). Die Titelfolie zeigt dieselben
Punkte, alle noch offen.

## 6. Bausteine

| Baustein | Funktion | Wann |
|---|---|---|
| Lernbox „Das nimmst du mit“ | `takeaway(s, items, {x,y,w})` | Auf jeder Code-Folie rechts; 2–4 Punkte |
| Code-Block | `codeBlock(s, code, {x,y,w,hl})` | Code mit Syntaxfarben, `hl` markiert Zeilen gelb |
| Ausgabe | `outputBlock(s, text, {x,y,w,label})` | Unter dem Code, weiß mit grauem Rahmen |
| Kernaussage-Leiste | `callout(s, text, {y,h})` | Gelbe Leiste mit der Botschaft der Folie, meist unten |
| Große Zahl | `statBlock(s, {x,y,w,value,label})` | Ergebnisse, Datensatzgrößen, Vorher/Nachher |
| Kartenraster | `cardGrid(s, items, {cols})` | 2–6 gleichrangige Punkte mit Icon; Layout passt sich an (Icon links / oben / kompakt) |
| Tabelle | `table(s, header, rows, {x,y,w,colW,mono})` | Kopfzeile Tinte, feine Linien; `mono` = Spalten in Consolas; Zelle markieren mit `{ text, options: { fill: { color: "FBE7A1" } } }` |
| Status-Chip | `chip(s, text, x, y, {kind})` | Zustände: `ok` Tinte, `warn` Gelb, `error` Rot, `neutral` Fläche; gibt die Breite zurück |
| Datei-Karte | `fileCard(s, name, text, x, y, w)` | Gespeicherte oder geladene Dateien |
| Hinweisbox | `noteBox(s, {kind,lead,text,x,y,w,h})` | `warn` (rotes X), `tip` (Glühbirne), `ok` (Häkchen) |
| Hinweis-Paar | `notePair(s, links, rechts, {y,h})` | Zwei Hinweisboxen über die volle Breite, z. B. „Niemals …“ + „Gut zu wissen …“ |
| Icon-Zeilen | `iconRows(s, items)` | 3–4 Gründe/Vorteile untereinander |
| Schrittfolge | `steps(s, items, {highlight})` | Prozess in 3–4 Schritten; `highlight` weglassen = keiner gelb |
| Aufzählung | `bullets(s, items, {x,y,w,h})` | Nur als Ergänzung neben einem Visual |
| Formel | `fraction(s, {lhs,num,den,w})` | Bruchformeln, immer mit Rechenbeispiel daneben |
| Nummernkreis | `numCircle(s, n, x, y, d, fill, fg)` | Aufzählungen, Schritte |
| Icon im Kreis | `iconCircle(s, name, x, y, d, fill, fg)` | Kartenköpfe, Konzepte |
| Grundformen | `tx`, `rect`, `line`, `dot` | Eigene Skizzen und Diagramme |

`tx()` setzt automatisch geschützte Leerzeichen vor „%“ und nach „±“ und legt Textfelder ohne
Innenabstand an (`margin: 0`) – dadurch fluchten Text und Formen.

Wiederkehrende Kombinationen:

- **Lernbox** = gelbe Tönung, Glühbirne im gelben Kreis, Überschrift „Das nimmst du mit“. Sie ist
  das Markenzeichen der Präsentation. Ihr Text sagt, *was man aus der Folie lernt* – nicht, was
  der Code tut.
- **„Niemals …“ + „Gut zu wissen …“** (`notePair`): zwei Boxen nebeneinander (Warnfläche mit
  rotem X, Gelb-Tönung mit Glühbirne) – für Regeln mit typischem Fehler (Beispiel: goldene Regel,
  Folie 19). Variante „Das zeigt …“ (`ok`) + „Das zeigt … nicht“ (`warn`) für Grenzen eines Versuchs.
- **Status-Farben** sind im ganzen Deck gleich: in Ordnung = Tinte, prüfen = Gelb, abgelehnt = Rot.
- **Analogie für Entwickler:innen**: kursiv in Stahlblau, beginnt mit „≈“, oder als eigene Karte
  („Wie ein flaky Test“).

## 7. Folientypen

Die Nummern verweisen auf Kommentare in `scripts/beispiel_titanic.js` („// 16 Standardisierung“).

| Typ | Aufbau | Funktion / Beispiel |
|---|---|---|
| Titel | Kicker gelb, Titel 48 pt, Untertitel, Fortschrittspunkte | `titleSlide()` · 1 |
| Reiseroute | Alle Stationen mit Icon, Name und Halbsatz | `journeySlide()` · 2 |
| Lernziele | Kartenraster, Lernziele aus dem Notebook | `goalsSlide()` · 3 |
| Begriffe vorab | 3 Karten mit großem Code-Symbol, Erklärung, Analogie + Kernaussage-Leiste | frei · 4 |
| Kapitel | Station n von N | `divider()` · 5, 10, 13 … |
| Große Zahlen | 3 Stat-Blöcke + Verteilungsbalken oder Erklärbox | frei · 6, 57 |
| Code | Code links, Ausgabe darunter, Lernbox rechts | `codeSlide()` · 7, 9, 12, 23 … |
| Problem-Visual | Selbst gezeichnete Skizze + Erklärung + Kernaussage-Leiste | frei · 14, 30 |
| Gegenüberstellung | Zwei Karten nebeneinander (Gelb-Tönung = „die gute Seite“) | frei · 15, 40, 45, 53 |
| Formel | Bruchformel, Legende, Ergebnis links; Rechenbeispiel mit Zahlenstrahl rechts | `fraction()` · 16, 17 |
| Bild + Tabelle | Bild aus dem Notebook links, Vergleichstabelle rechts | frei · 18 |
| Ablaufdiagramm | Kästen und Pfeile, Ein- und Ausgaben | frei · 19, 21 |
| Vorher/Nachher | Zeile mit Zellen „vorher“, Pfeil, Zeile „nachher“ | frei · 25 |
| Gründe | Icon-Zeilen + Kernaussage-Leiste | `iconRows()` · 26 |
| Übung | Stift-Icon, Aufgabe, Tipps, Hinweis „erst selbst probieren“ | `exerciseSlide()` · 27, 42 |
| Lösung | Code-Folie mit markierten Änderungen | `codeSlide()` · 28, 43 |
| Prozessraster | Gitter aus Blöcken (Folds, Grid-Kombinationen) | frei · 31, 51 |
| Vier Fakten | 4 Karten nebeneinander | `cardGrid({cols:4})` · 32 |
| Diagramm | Natives Diagramm links (8,3 Zoll), Kennzahlen oder Fazit rechts | `chartBase()` · 38, 41 |
| Rechenweg | Zahlen in Kästen mit ×, =, + | frei · 48 |
| Schrittfolge | 3–4 nummerierte Schritte + Kernaussage-Leiste | `steps()` · 55 |
| Rückblick | Eine Zeile pro Station | `recapSlide()` · 59 |
| Regeln | 3–7 nummerierte Merksätze | `rulesSlide()` · 60 |
| Ausblick | Dunkel, 1–3 Karten zu den nächsten Notebooks, „Fragen?“ | `outlookSlide()` · 61 |

Freie Folien starten mit `content(titel, notizen)` und werden mit den Bausteinen komponiert.
Gleiche Folientypen sehen überall gleich aus: gleiche Positionen, Größen und Farben.

## 8. Code auf Folien

- **Zeilenlänge** (Consolas 14 pt ≈ 0,107 Zoll pro Zeichen, Innenabstand 0,25 Zoll je Seite):
  Code-Block 7,6 Zoll → **höchstens 64 Zeichen**; 6,3 Zoll → 53; volle Breite → 105.
  Ausgaben (13 pt) im 7,6-Zoll-Kasten: höchstens 70 Zeichen. Längere Zeilen umbrechen wie in Python
  üblich (Argumente auf eigene Zeilen), nie die Schrift verkleinern.
- **Höchstens 14 Zeilen** pro Block (mit Ausgabe darunter eher 9–11). Mehr → auf zwei Folien teilen.
- **Höhe** = Zeilen × 0,25 + 0,4 Zoll; Ausgabe = Zeilen × 0,22 + 0,62 Zoll inkl. Label.
- **Markieren statt erklären:** Wenn sich gegenüber der vorigen Folie nur eine Zeile ändert,
  diese Zeile mit `hl: [index]` gelb markieren (Index ab 0, ohne führende Leerzeile).
- Code-Kommentare auf Deutsch, kurz, rechts neben dem Code ausgerichtet.
- Leerzeichen am Zeilenanfang bleiben erhalten – Einrückung genau wie in Python.

## 9. Diagramme

- **Immer native PowerPoint-Diagramme** (`s.addChart`), keine Plot-Bilder aus dem Notebook. Die
  Zahlen dafür stammen aus den Notebook-Ausgaben (siehe Inhaltsleitfaden).
- **Deutsches Zahlenformat unabhängig von der Office-Sprache:** Werte skalieren und ein Format mit
  fest eingebautem Komma setzen – für `dataLabelFormatCode` und `valAxisLabelFormatCode` dasselbe:
  - Prozent: `pm(0.713)` = 713 mit `PCT` → „71,3 %“ (Achse 0–1000)
  - Dezimalzahl, z. B. Wahrscheinlichkeiten: `dec(0.2)` = 2 mit `DEC1` → „0,2“ (Achse 0–10);
    zwei Stellen mit `dec(v, 2)` und `DEC2`
  Bei Balken mit Datenbeschriftung kann die Wertachse ausgeblendet werden
  (`valAxisHidden: true`, `valGridLine: { style: "none" }`); bei Linien bleibt sie sichtbar.
- Referenz- oder Schwellenlinien kann pptxgenjs nicht zeichnen – als zweite Datenreihe mit
  konstantem Wert oder als Text neben dem Diagramm lösen.
- Balken beginnen bei null (`valAxisMinVal: 0`), sonst übertreiben sie Unterschiede.
- Farben: „vorher/ohne“ `T.accent4` oder `8FA0BA`, „nachher/mit“ `T.dk1`, Baseline `D5D9E0`.
  Bei Kategorien mit Reihenfolge `catAxisOrientation: "maxMin"`, damit oben beginnt.
- Immer `chartBase({...})` als Grundlage – gleiche Schrift, Farbe und Größe der Beschriftungen in allen Diagrammen.
- Kein Diagrammtitel im Diagramm – der Folientitel ist die Aussage.

## 10. Bilder und Icons

- **Icons**: Lucide-Set aus `react-icons/lu`, immer in einem Kreis (weiß auf Tinte, oder Tinte auf
  Gelb/Gelb-Tönung). Geprüfte Namen: `LuDatabase LuSplit LuScale LuWorkflow LuRepeat LuBarChart3
  LuSlidersHorizontal LuPackage LuLightbulb LuLock LuAlertTriangle LuCheck LuX LuTarget LuSearch
  LuShuffle LuDice5 LuSave LuFlag LuPencil LuRuler LuGitMerge LuLayers LuSigma LuTrophy LuCode
  LuArrowRight LuPuzzle LuShieldCheck LuBoxes LuBox LuMapPin LuTable LuFileCode LuTrees LuNetwork
  LuFlaskConical LuMountain LuSettings2 LuBrain LuCheckCircle LuXCircle LuListChecks
  LuGraduationCap LuCompass LuEye LuCalculator LuRefreshCw LuScissors LuCpu LuKeyRound LuFileJson
  LuBraces LuMedal LuTimer LuUsers`. Neuere Namen wie `LuChartBar`, `LuTriangleAlert` oder
  `LuCircleCheck` gibt es in der installierten Version nicht. Prüfen:
  `node -e "console.log(!!require('react-icons/lu').LuName)"`.
- **Bilder aus dem Notebook** (Skizzen in `assets/`) dürfen auf Folien, wenn sie ein Konzept besser
  zeigen als eine eigene Zeichnung. Immer mit `altText`, Seitenverhältnis beibehalten.
  SVG-Diagramme (z. B. aus Mermaid) nicht umwandeln – dabei gehen Leerzeichen verloren –, sondern
  mit Kästen und Pfeilen nachzeichnen (Beispiel: Folie 21 „Zwei Spaltentypen, zwei Wege“).
- Externe Bilder (Internet-URLs im Notebook) nicht einbinden.

## 11. Typografie im Detail

- Deutsche Anführungszeichen „…“, Gedankenstrich – mit Leerzeichen, Malzeichen ×, Pfeil →.
- Dezimalkomma und Leerzeichen vor %: „61,7 %“. Python-Ausgaben bleiben im Original („0.617“).
- Titel ohne Punkt am Ende. Fließtext linksbündig; zentriert nur Zahlen in Kreisen, Tabellenzellen
  und kurze Beschriftungen unter Formen.
- Fachbegriffe in Code-Schrift, wenn es Code ist (`StandardScaler`), sonst normal.

## 12. Was wir nicht machen

- Keine Linien unter Titeln, keine farbigen Balken oder Streifen am Folienrand oder an Karten.
- Keine Verläufe, keine Schatten, keine Beige-/Cremetöne als Hintergrund.
- Keine zweite Hervorhebungsfarbe neben Gelb (Rot nur für Warnungen).
- Keine Schrift unter 12 pt, kein Fließtext unter 14 pt.
- Keine Bilder von Diagrammen, wenn ein natives Diagramm geht.
- Keine Folie ohne visuelles Element; keine reine Aufzählungsfolie.

## 13. Checkliste für die Sichtprüfung

Für jede gerenderte Folie:

- [ ] Kein Text läuft über seinen Kasten oder den Folienrand hinaus, nichts ist abgeschnitten.
- [ ] Nichts überlappt (Beschriftungen auf Linien, Text in Formen, Labels übereinander).
- [ ] Titel einzeilig, gleiche Position wie auf den anderen Folien.
- [ ] Keine Zahl ist vom „%“ getrennt, kein Wort mitten im Wort umbrochen, keine einzelne Silbe in der letzten Zeile.
- [ ] Code-Zeilen brechen nicht um; Markierungen liegen genau auf ihrer Zeile.
- [ ] Großer Monospace-Text (z. B. Namenszerlegung) bricht nicht um – dort `wrap: false` setzen.
- [ ] Lernbox: Text passt hinein, Box nicht viel größer als ihr Text.
- [ ] Diagramme: deutsche Zahlen („71,3 %“), Beschriftungen lesbar, nicht abgeschnitten.
- [ ] Abstände gleichmäßig; keine großen Leerflächen neben gedrängten Bereichen.
- [ ] Gelb nur dort, wo etwas hervorgehoben werden soll.
