// Bausteine für Lern-Präsentationen im Stil „Tinte und Textmarker“.
//
// Ein Deck-Skript holt sich mit createDeck() ein Deck-Objekt und baut damit Folie für Folie:
//
//   const { createDeck } = require(process.env.DECK_LIB);
//   const d = createDeck({ title, footer, author, stations, assets });
//   await d.titleSlide({ kicker, title, subtitle, notes });
//   ...
//   await d.save("deck.pptx");
//
// Maße in Zoll (LAYOUT_WIDE: 13,333 × 7,5), Schriftgrößen in Punkt.
// Das Design ist im Styleguide (references/styleguide.md) beschrieben – Änderungen an
// Farben, Größen oder Abständen gehören hierher, nicht in die einzelnen Deck-Skripte.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const RDS = require("react-dom/server");
const sharp = require("sharp");
const lu = require("react-icons/lu");

// ---------- Theme ----------
const THEME = {
  name: "Tinte und Textmarker",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1F2A44", // Tinte (Navy)
    lt1: "FFFFFF",
    dk2: "5B6475", // gedämpfter Text
    lt2: "F3F4F6", // Flächen
    accent1: "F2C200", // Textmarker-Gelb
    accent2: "3D5A80", // Stahlblau
    accent3: "B5452F", // Warnung
    accent4: "B8BFCC", // Linien / grau
    accent5: "FFF4C7", // Gelb-Tönung
    accent6: "2E7D4F", // Grün
    hlink: "3D5A80",
    folHlink: "5B6475",
  },
};
const T = THEME.colors;

const W = 13.333;
const H = 7.5;
const MX = 0.6;
const CW = W - 2 * MX; // 12.133
const TOP = 1.85;
const BOTTOM = 6.75;
const MONO = "Consolas";

// Code-Farben (heller Editor-Look)
const CODE = { text: "1F2A44", kw: "8B3FA8", str: "2E7D4F", com: "6B7385", num: "B4572E", fn: "1D5FA8" };
const LH = 0.25; // Zeilenhöhe Code (18 pt)

// Diagrammwerte mit fest kodiertem Dezimalkomma, damit Beschriftungen unabhängig von der
// Office-Sprache deutsch sind. Werte vorher skalieren, dasselbe Format für Daten und Wertachse:
//   Prozent:          pm(0.713) = 713     + PCT  → „71,3 %“
//   eine Nachkommast. dec(0.2) = 2        + DEC1 → „0,2“
//   zwei Nachkommast. dec(0.25, 2) = 25   + DEC2 → „0,25“
const PCT = "0\\,0\u00A0\\%";
const pm = (v) => Math.round(v * 1000);
const DEC1 = "0\\,0";
const DEC2 = "0\\,00";
const dec = (v, d = 1) => Math.round(v * 10 ** d);

// Geschütztes Leerzeichen zwischen Zahl und %, damit „61,7 %“ nie umbricht.
const nb = (t) => t.replace(/(\d) %/g, "$1\u00A0%").replace(/± /g, "±\u00A0");

// ---------- Python-Syntaxfarben ----------
const KW = new Set(["from", "import", "def", "return", "for", "in", "if", "else", "elif", "lambda", "True", "False", "None", "as", "with", "and", "or", "not", "class", "try", "except", "raise", "while", "is", "assert", "yield"]);
function tokenize(ln) {
  const out = [];
  const re = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|(.)/g;
  let m;
  while ((m = re.exec(ln))) {
    let t;
    if (m[1]) t = { text: m[1], color: CODE.com, italic: true };
    else if (m[2]) t = { text: m[2], color: CODE.str };
    else if (m[3]) t = { text: m[3], color: CODE.num };
    else if (m[4]) {
      const after = ln.slice(re.lastIndex);
      if (KW.has(m[4])) t = { text: m[4], color: CODE.kw };
      else if (after.startsWith("(")) t = { text: m[4], color: CODE.fn };
      else t = { text: m[4], color: CODE.text };
    } else t = { text: m[0], color: CODE.text };
    const prev = out[out.length - 1];
    if (prev && prev.color === t.color && !!prev.italic === !!t.italic) prev.text += t.text;
    else out.push(t);
  }
  return out;
}

const ZAHLWORT = { 3: "Drei", 4: "Vier", 5: "Fünf", 6: "Sechs", 7: "Sieben" };

// =====================================================================
function createDeck(opts) {
  const stations = opts.stations; // [{ name, full, line, icon }] – eine pro Notebook-Abschnitt
  const N = stations.length;
  const footer = opts.footer || opts.title;

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = opts.title;
  pres.subject = opts.subject || "Lern-Präsentation";
  if (opts.author) pres.author = opts.author;
  const C = pres.SchemeColor;
  const S = pres.shapes;
  let current = { section: "Einstieg", kicker: "EINSTIEG" };

  // ---------- Layouts ----------
  pres.defineSlideMaster({
    title: "TITEL",
    background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.0, w: 11.7, h: 1.9, fontSize: 48, bold: true, color: C.background1, align: "left", valign: "bottom", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "KAPITEL",
    background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 3.4, y: 2.35, w: 9.3, h: 1.1, fontSize: 44, bold: true, color: C.background1, align: "left", valign: "bottom", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "AUSBLICK",
    background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.8, y: 1.4, w: 11.7, h: 1.0, fontSize: 44, bold: true, color: C.background1, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "INHALT",
    background: { color: C.background1 },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.7, w: CW, h: 0.8, fontSize: 36, bold: true, color: C.text1, align: "left", valign: "top", margin: 0 }, text: "" } },
      { text: { text: footer, options: { x: MX, y: 7.0, w: 8, h: 0.3, fontSize: 10, color: C.text2, margin: 0 } } },
    ],
    slideNumber: { x: 12.13, y: 7.0, w: 0.6, h: 0.3, fontSize: 10, color: T.dk2, align: "right" },
  });

  // ---------- Grundformen ----------
  function tx(slide, text, o) {
    if (o.fontFace !== MONO) {
      if (typeof text === "string") text = nb(text);
      else text = text.map((r) => (r.options && r.options.fontFace === MONO ? r : Object.assign({}, r, { text: nb(r.text) })));
    }
    slide.addText(text, Object.assign({ isTextBox: true, margin: 0, valign: "top", fontSize: 16, color: C.text1 }, o));
  }
  function rect(slide, o) {
    slide.addShape(o.r ? S.ROUNDED_RECTANGLE : S.RECTANGLE, Object.assign({ line: { type: "none" } }, o, o.r ? { rectRadius: o.r } : {}));
  }
  function line(slide, x1, y1, x2, y2, o = {}) {
    slide.addShape(S.LINE, {
      x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
      flipH: x2 < x1, flipV: y2 < y1,
      line: Object.assign({ color: o.color || T.accent4, width: o.width || 1.5 }, o.arrow ? { endArrowType: "triangle" } : {}, o.dash ? { dashType: o.dash } : {}),
    });
  }
  function dot(slide, x, y, d, fill, lineOpt) {
    slide.addShape(S.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: lineOpt || { type: "none" } });
  }

  const iconCache = {};
  async function icon(name, color) {
    const key = name + color;
    if (iconCache[key]) return iconCache[key];
    const Comp = lu[name];
    if (!Comp) throw new Error(`Icon „${name}“ gibt es in react-icons/lu nicht.`);
    const svg = RDS.renderToStaticMarkup(React.createElement(Comp, { size: "256" })).replace(/currentColor/g, "#" + color);
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    return (iconCache[key] = "image/png;base64," + buf.toString("base64"));
  }
  async function iconCircle(slide, name, x, y, d, fill, fg) {
    dot(slide, x, y, d, fill);
    const pad = d * 0.24;
    slide.addImage({ data: await icon(name, fg), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad });
  }
  function numCircle(slide, n, x, y, d, fill, fg) {
    dot(slide, x, y, d, fill);
    tx(slide, String(n), { x, y, w: d, h: d, fontSize: Math.round(d * 32), bold: true, align: "center", valign: "middle", color: fg });
  }
  function bullets(slide, items, o) {
    tx(slide, items.map((t, i) => ({ text: t, options: Object.assign({ bullet: { indent: 14 }, paraSpaceAfter: o.gap || 8 }, i < items.length - 1 ? { breakLine: true } : {}) })),
      Object.assign({ fontSize: 16 }, o, { gap: undefined }));
  }

  // ---------- Folienrahmen ----------
  function progressDots(slide, active, x0, y) {
    const gap = 0.5;
    line(slide, x0 + 0.1, y + 0.1, x0 + (N - 1) * gap + 0.1, y + 0.1, { color: T.accent2, width: 1 });
    for (let i = 1; i <= N; i++) {
      const cx = x0 + (i - 1) * gap + 0.1;
      if (i === active) dot(slide, cx - 0.15, y - 0.05, 0.3, C.accent1);
      else if (i < active) dot(slide, cx - 0.09, y + 0.01, 0.18, C.background1);
      else dot(slide, cx - 0.09, y + 0.01, 0.18, C.text1, { color: T.accent4, width: 1 });
    }
  }

  const declared = new Set();
  function section(title, kicker) {
    current = { section: title, kicker: kicker || title.toUpperCase() };
    if (!declared.has(title)) pres.addSection({ title });
    declared.add(title);
  }

  function content(title, notes) {
    if (!declared.has(current.section)) section(current.section, current.kicker);
    const s = pres.addSlide({ masterName: "INHALT", sectionTitle: current.section });
    tx(s, current.kicker, { x: MX, y: 0.36, w: 9, h: 0.3, fontSize: 12, bold: true, color: C.accent2, charSpacing: 1.5 });
    s.addText(title, { placeholder: "title" });
    if (notes) s.addNotes(notes);
    return s;
  }

  async function titleSlide(o) {
    section("Einstieg", "EINSTIEG");
    const s = pres.addSlide({ masterName: "TITEL", sectionTitle: current.section });
    tx(s, o.kicker, { x: 0.8, y: 1.5, w: 11, h: 0.4, fontSize: 14, bold: true, color: C.accent1, charSpacing: 2 });
    s.addText(o.title, { placeholder: "title" });
    tx(s, o.subtitle, { x: 0.8, y: 4.15, w: 11, h: 0.9, fontSize: 22, color: C.accent4 });
    progressDots(s, 0, 0.8, 6.2);
    if (o.notes) s.addNotes(o.notes);
    return s;
  }

  function divider(n, subtitle, notes) {
    const st = stations[n - 1];
    section(`${n} · ${st.name}`, `STATION ${n} · ${st.name.toUpperCase()}`);
    const s = pres.addSlide({ masterName: "KAPITEL", sectionTitle: current.section });
    dot(s, 0.9, 2.35, 1.95, C.accent1);
    tx(s, String(n), { x: 0.9, y: 2.35, w: 1.95, h: 1.95, fontSize: 72, bold: true, align: "center", valign: "middle" });
    tx(s, `STATION ${n} VON ${N}`, { x: 3.4, y: 1.9, w: 6, h: 0.35, fontSize: 14, bold: true, color: C.accent1, charSpacing: 2 });
    s.addText(st.full || st.name, { placeholder: "title" });
    tx(s, subtitle, { x: 3.4, y: 3.65, w: 9.2, h: 1.0, fontSize: 20, color: C.accent4 });
    progressDots(s, n, 3.4, 6.2);
    if (notes) s.addNotes(notes);
    return s;
  }

  // ---------- Code ----------
  function codeBlock(slide, src, o) {
    const lines = src.replace(/^\n/, "").replace(/\n$/, "").split("\n");
    const padY = 0.2;
    const padX = 0.25;
    const h = lines.length * LH + 2 * padY;
    rect(slide, { x: o.x, y: o.y, w: o.w, h, r: 0.08, fill: { color: C.background2 }, objectName: "Code" });
    (o.hl || []).forEach((i) => rect(slide, { x: o.x + 0.08, y: o.y + padY + i * LH, w: o.w - 0.16, h: LH, fill: { color: C.accent1, transparency: 45 }, objectName: "Code-Markierung" }));
    const runs = [];
    lines.forEach((ln, i) => {
      const toks = ln.length ? tokenize(ln) : [{ text: " ", color: CODE.text }];
      toks.forEach((t, j) => {
        const opt = { color: t.color };
        if (t.italic) opt.italic = true;
        if (j === toks.length - 1 && i < lines.length - 1) opt.breakLine = true;
        runs.push({ text: t.text, options: opt });
      });
    });
    tx(slide, runs, { x: o.x + padX, y: o.y + padY, w: o.w - 2 * padX, h: lines.length * LH, fontFace: MONO, fontSize: o.fontSize || 14, lineSpacing: 18, objectName: "Code-Text" });
    return o.y + h;
  }

  function outputBlock(slide, src, o) {
    const lines = src.replace(/^\n/, "").replace(/\n$/, "").split("\n");
    tx(slide, o.label || "Ausgabe", { x: o.x, y: o.y, w: 4, h: 0.28, fontSize: 12, bold: true, color: C.text2 });
    const lh = 16 / 72;
    const h = lines.length * lh + 0.3;
    rect(slide, { x: o.x, y: o.y + 0.32, w: o.w, h, r: 0.06, fill: { color: C.background1 }, line: { color: T.accent4, width: 1 } });
    tx(slide, lines.map((l, i) => ({ text: l.length ? l : " ", options: i < lines.length - 1 ? { breakLine: true } : {} })),
      { x: o.x + 0.2, y: o.y + 0.32 + 0.15, w: o.w - 0.4, h: lines.length * lh, fontFace: MONO, fontSize: 13, lineSpacing: 16, color: C.text2 });
    return o.y + 0.32 + h;
  }

  // „Das nimmst du mit“ – die Lernbotschaft einer Folie
  async function takeaway(slide, items, o) {
    const cpl = Math.floor((o.w - 0.75) / (15 / 72 * 0.41));
    const nLines = items.reduce((a, t) => a + Math.ceil(t.length / cpl), 0);
    const h = o.h || 1.0 + nLines * 0.255 + (items.length - 1) * 0.12 + 0.2;
    rect(slide, { x: o.x, y: o.y, w: o.w, h, r: 0.1, fill: { color: C.accent5 }, objectName: "Das nimmst du mit" });
    await iconCircle(slide, "LuLightbulb", o.x + 0.25, o.y + 0.25, 0.5, C.accent1, T.dk1);
    tx(slide, o.title || "Das nimmst du mit", { x: o.x + 0.9, y: o.y + 0.25, w: o.w - 1.1, h: 0.5, fontSize: 17, bold: true, valign: "middle" });
    bullets(slide, items, { x: o.x + 0.3, y: o.y + 0.95, w: o.w - 0.55, h: h - 1.1, fontSize: 15 });
    return o.y + h;
  }

  async function codeSlide(d) {
    const s = content(d.title, d.notes);
    const cw = d.codeW || 7.6;
    const y = codeBlock(s, d.code, { x: MX, y: TOP, w: cw, hl: d.hl, fontSize: d.codeFontSize });
    if (d.output) outputBlock(s, d.output, { x: MX, y: y + 0.25, w: cw, label: d.outputLabel });
    await takeaway(s, d.takeaways, { x: MX + cw + 0.35, y: TOP, w: CW - cw - 0.35, h: d.takeawayH });
    return s;
  }

  // ---------- Inhaltsbausteine ----------
  // Gelbe Leiste mit der Kernaussage, meist unten auf der Folie
  function callout(slide, text, o = {}) {
    const x = o.x ?? MX, w = o.w ?? CW, y = o.y ?? 5.85, h = o.h ?? 0.75;
    rect(slide, { x, y, w, h, r: 0.08, fill: { color: o.fill || C.accent5 } });
    tx(slide, text, { x: x + 0.35, y, w: w - 0.7, h, fontSize: o.fontSize || 18, bold: o.bold ?? true, valign: "middle" });
  }

  function statBlock(slide, o) {
    tx(slide, o.value, { x: o.x, y: o.y, w: o.w, h: o.vh || 1.0, fontSize: o.size || 60, bold: true, color: o.color || C.text1, valign: "bottom" });
    tx(slide, o.label, { x: o.x, y: o.y + (o.vh || 1.0) + 0.08, w: o.w, h: 0.7, fontSize: 16, color: C.text2 });
  }

  // Kartenraster: items = [{ icon, title, text, fill? }]. Bis 2 Spalten: Icon links, ab 3: Icon oben.
  async function cardGrid(slide, items, o = {}) {
    const cols = o.cols || (items.length === 3 ? 3 : items.length <= 4 ? 2 : 3);
    const rows = Math.ceil(items.length / cols);
    const gap = 0.3;
    const x0 = o.x ?? MX, w = o.w ?? CW, y0 = o.y ?? 1.95;
    const cw = (w - (cols - 1) * gap) / cols;
    const ch = o.h || Math.min(cols >= 3 ? 3.75 : 2.1, ((o.bottom ?? BOTTOM - 0.15) - y0 - (rows - 1) * gap) / rows);
    // row: Icon links (bis 2 Spalten) · stack: Icon oben (ab 3 Spalten, hohe Karten) · compact: Icon und Titel in einer Zeile
    const layout = cols <= 2 ? "row" : ch >= 3.0 ? "stack" : "compact";
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const x = x0 + (i % cols) * (cw + gap);
      const y = y0 + Math.floor(i / cols) * (ch + gap);
      rect(slide, { x, y, w: cw, h: ch, r: 0.1, fill: { color: it.fill || C.background2 } });
      if (layout === "stack") {
        await iconCircle(slide, it.icon, x + 0.3, y + 0.3, 0.7, C.text1, "FFFFFF");
        tx(slide, it.title, { x: x + 0.3, y: y + 1.2, w: cw - 0.5, h: 0.8, fontSize: 19, bold: true });
        tx(slide, it.text, { x: x + 0.3, y: y + 2.0, w: cw - 0.5, h: ch - 2.15, fontSize: 15, color: C.text2 });
      } else if (layout === "compact") {
        await iconCircle(slide, it.icon, x + 0.3, y + 0.3, 0.6, C.text1, "FFFFFF");
        tx(slide, it.title, { x: x + 1.1, y: y + 0.3, w: cw - 1.3, h: 0.6, fontSize: 18, bold: true, valign: "middle" });
        tx(slide, it.text, { x: x + 0.3, y: y + 1.05, w: cw - 0.5, h: ch - 1.2, fontSize: 15, color: C.text2 });
      } else {
        await iconCircle(slide, it.icon, x + 0.35, y + 0.35, 0.75, C.text1, "FFFFFF");
        tx(slide, it.title, { x: x + 1.35, y: y + 0.35, w: cw - 1.65, h: 0.45, fontSize: 20, bold: true });
        tx(slide, it.text, { x: x + 1.35, y: y + 0.85, w: cw - 1.65, h: ch - 1.0, fontSize: 15, color: C.text2 });
      }
    }
    return y0 + rows * ch + (rows - 1) * gap;
  }

  // Zeilen mit Icon links, Überschrift und einem Satz: items = [{ icon, title, text }]
  async function iconRows(slide, items, o = {}) {
    const y0 = o.y ?? 2.0, rh = o.rowH ?? 1.3;
    for (let i = 0; i < items.length; i++) {
      const y = y0 + i * rh;
      await iconCircle(slide, items[i].icon, MX, y, 0.85, C.text1, "FFFFFF");
      tx(slide, items[i].title, { x: MX + 1.2, y: y - 0.02, w: CW - 1.2, h: 0.42, fontSize: 20, bold: true });
      tx(slide, items[i].text, { x: MX + 1.2, y: y + 0.42, w: CW - 1.2, h: 0.5, fontSize: 16, color: C.text2 });
    }
    return y0 + items.length * rh;
  }

  // Nummerierte Schrittfolge von links nach rechts: items = [{ title, text }], o.highlight = Index (weglassen = keiner markiert)
  function steps(slide, items, o = {}) {
    const n = items.length;
    const y = o.y ?? 2.0;
    const colW = CW / n;
    items.forEach((it, i) => {
      const x = MX + i * colW;
      if (i < n - 1) line(slide, x + 1.05, y + 0.45, x + colW - 0.05, y + 0.45, { color: T.accent4, width: 1.5, arrow: true });
      const hi = i === o.highlight;
      numCircle(slide, i + 1, x, y, 0.9, hi ? C.accent1 : C.text1, hi ? C.text1 : C.background1);
      tx(slide, it.title, { x, y: y + 1.15, w: colW - 0.4, h: 0.45, fontSize: 20, bold: true });
      tx(slide, it.text, { x, y: y + 1.65, w: colW - 0.5, h: 1.3, fontSize: 16, color: C.text2 });
    });
  }

  // Formel als Bruch: lhs (Runs), num, den; o.w = Bruchbreite
  function fraction(slide, o) {
    const fs = 34;
    tx(slide, o.lhs, { x: o.x, y: o.y + 0.32, w: 1.9, h: 0.8, fontSize: fs, fontFace: "Cambria", italic: true, valign: "middle", align: "right" });
    const fx = o.x + 2.05;
    tx(slide, o.num, { x: fx, y: o.y, w: o.w, h: 0.65, fontSize: fs, fontFace: "Cambria", italic: true, align: "center", valign: "bottom" });
    line(slide, fx, o.y + 0.72, fx + o.w, o.y + 0.72, { color: T.dk1, width: 2 });
    tx(slide, o.den, { x: fx, y: o.y + 0.8, w: o.w, h: 0.65, fontSize: fs, fontFace: "Cambria", italic: true, align: "center", valign: "top" });
  }

  // Gemeinsame Diagramm-Optionen. Werte mit pm() in Promille umrechnen und PCT als Format nutzen.
  function chartBase(extra) {
    return Object.assign({
      catAxisLabelColor: T.dk2, valAxisLabelColor: T.dk2,
      catAxisLabelFontFace: "+mn-lt", valAxisLabelFontFace: "+mn-lt",
      catAxisLabelFontSize: 13, valAxisLabelFontSize: 12,
      dataLabelFontFace: "+mn-lt", dataLabelFontSize: 11, dataLabelColor: T.dk1,
      legendFontFace: "+mn-lt", legendFontSize: 13, legendColor: T.dk1,
      valGridLine: { color: "E3E6EB", size: 0.75 }, catGridLine: { style: "none" },
      catAxisLineColor: T.accent4, valAxisLineShow: false,
    }, extra);
  }

  // Tabelle im Hausstil: Kopfzeile Tinte, feine graue Linien. rows = Zeilen aus Strings oder
  // { text, options } (z. B. options: { fill: { color: "FBE7A1" } } zum Markieren einer Zelle).
  // o.mono = Spaltenindizes in Consolas; o.colW ist Pflicht (Summe = o.w).
  function table(slide, header, rows, o) {
    const mono = new Set(o.mono || []);
    const cell = (c, j) => {
      const base = typeof c === "object" && c !== null ? c : { text: String(c) };
      return { text: base.text, options: Object.assign(mono.has(j) ? { fontFace: MONO } : {}, base.options || {}) };
    };
    const hdr = header.map((h) => ({ text: h, options: { bold: true, color: T.lt1, fill: { color: T.dk1 } } }));
    slide.addTable([hdr, ...rows.map((r) => r.map(cell))], Object.assign({
      x: MX, y: TOP, rowH: 0.5, fontSize: 15, color: T.dk1, valign: "middle",
      border: { type: "solid", pt: 1, color: "E3E6EB" }, margin: [0, 0.1, 0, 0.1],
    }, o, { mono: undefined }));
  }

  // Kleines Label für Zustände: kind = "ok" (Tinte), "warn" (Gelb), "error" (Rot), "neutral" (Fläche)
  function chip(slide, text, x, y, o = {}) {
    const style = { ok: [C.text1, C.background1], warn: [C.accent1, C.text1], error: [C.accent3, C.background1], neutral: [C.background2, C.text1] }[o.kind || "neutral"];
    const w = o.w || text.length * 0.1 + 0.3;
    rect(slide, { x, y, w, h: o.h || 0.34, r: 0.06, fill: { color: style[0] } });
    tx(slide, text, { x, y, w, h: o.h || 0.34, fontSize: o.fontSize || 13, fontFace: MONO, bold: true, color: style[1], align: "center", valign: "middle" });
    return w;
  }

  // Karte für eine Datei: Name in Consolas, darunter ein Satz
  function fileCard(slide, name, text, x, y, w, h = 1.15) {
    rect(slide, { x, y, w, h, r: 0.08, fill: { color: C.background1 }, line: { color: T.accent4, width: 1 } });
    tx(slide, name, { x: x + 0.2, y: y + 0.13, w: w - 0.4, h: 0.35, fontSize: 13, fontFace: MONO, bold: true });
    tx(slide, text, { x: x + 0.2, y: y + 0.5, w: w - 0.4, h: h - 0.6, fontSize: 13, color: C.text2 });
  }

  // Hinweisbox mit Icon: kind = "warn" (Niemals …), "tip" (Gut zu wissen …), "ok" (Das zeigt …)
  async function noteBox(slide, o) {
    const style = {
      warn: ["F8E7E2", "LuX", C.accent3, "FFFFFF"],
      tip: [C.accent5, "LuLightbulb", C.accent1, T.dk1],
      ok: [C.accent5, "LuCheck", C.accent1, T.dk1],
    }[o.kind || "tip"];
    rect(slide, { x: o.x, y: o.y, w: o.w, h: o.h, r: 0.1, fill: { color: style[0] } });
    await iconCircle(slide, style[1], o.x + 0.3, o.y + (o.h - 0.55) / 2, 0.55, style[2], style[3]);
    const runs = o.lead ? [{ text: o.lead, options: { bold: true } }, { text: o.text }] : o.text;
    tx(slide, runs, { x: o.x + 1.05, y: o.y + 0.1, w: o.w - 1.3, h: o.h - 0.2, fontSize: 16, valign: "middle" });
  }

  // Zwei Hinweisboxen nebeneinander über die volle Breite, z. B. „Niemals …“ + „Gut zu wissen …“
  async function notePair(slide, left, right, o = {}) {
    const y = o.y ?? 4.95, h = o.h ?? 1.6, w = (CW - 0.33) / 2;
    await noteBox(slide, Object.assign({ kind: "warn" }, left, { x: MX, y, w, h }));
    await noteBox(slide, Object.assign({ kind: "tip" }, right, { x: MX + w + 0.33, y, w, h }));
  }

  // ---------- Fertige Folientypen ----------
  async function journeySlide(notes, title = "Unsere Reiseroute") {
    const s = content(title, notes);
    const cols = N <= 4 ? N : Math.ceil(N / 2);
    const colW = CW / cols;
    const big = cols <= 4;
    for (let i = 0; i < N; i++) {
      const st = stations[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = MX + col * colW;
      const y = N <= 4 ? 2.9 : row === 0 ? 2.0 : 4.35;
      if (col < cols - 1 && i < N - 1) line(s, x + 0.95, y + 0.45, x + colW, y + 0.45, { color: T.accent4, width: 1.25 });
      await iconCircle(s, st.icon, x, y, 0.9, C.accent5, T.dk1);
      tx(s, `${i + 1} · ${st.name}`, { x, y: y + 1.05, w: colW - 0.15, h: 0.4, fontSize: big ? 19 : 16, bold: true });
      tx(s, st.line, { x, y: y + 1.45, w: colW - 0.15, h: 0.6, fontSize: big ? 15 : 14, color: C.text2 });
    }
    return s;
  }

  async function goalsSlide(goals, notes, title = "Was du am Ende kannst") {
    const s = content(title, notes);
    await cardGrid(s, goals, { y: 1.95 });
    return s;
  }

  async function exerciseSlide(title, task, tips, notes) {
    const s = content(title, notes);
    await iconCircle(s, "LuPencil", MX, 2.05, 1.7, C.accent1, T.dk1);
    tx(s, "Deine Aufgabe", { x: 2.85, y: 2.0, w: 9.8, h: 0.5, fontSize: 22, bold: true });
    const taskLines = Math.max(1, Math.ceil(task.length / 78));
    const ty = 2.55 + taskLines * 0.36 + 0.4;
    tx(s, task, { x: 2.85, y: 2.55, w: 9.6, h: taskLines * 0.36 + 0.1, fontSize: 20 });
    tx(s, "Tipps", { x: 2.85, y: ty, w: 9.8, h: 0.45, fontSize: 18, bold: true });
    bullets(s, tips, { x: 2.85, y: ty + 0.5, w: 9.6, h: 5.85 - ty - 0.6, fontSize: 17, gap: 6 });
    rect(s, { x: MX, y: 6.0, w: CW, h: 0.6, r: 0.08, fill: { color: C.background2 } });
    tx(s, "Probier es im Notebook selbst aus, bevor du zur Lösung weiterblätterst.", { x: MX + 0.3, y: 6.0, w: CW - 0.6, h: 0.6, fontSize: 16, italic: true, color: C.text2, valign: "middle" });
    return s;
  }

  async function recapSlide(lines, notes, title = "Die Reise im Rückblick") {
    if (current.section !== "Zusammenfassung") section("Zusammenfassung", "ZUSAMMENFASSUNG");
    const s = content(title, notes);
    const rows = Math.ceil(N / 2);
    const rh = Math.min(1.15, (BOTTOM - 1.95) / rows);
    lines.forEach((ln, i) => {
      const x = MX + Math.floor(i / rows) * 6.23;
      const y = 1.95 + (i % rows) * rh;
      numCircle(s, i + 1, x, y, 0.6, C.accent1, C.text1);
      tx(s, stations[i].name, { x: x + 0.8, y: y - 0.04, w: 5.0, h: 0.38, fontSize: 18, bold: true });
      tx(s, ln, { x: x + 0.8, y: y + 0.36, w: 5.1, h: 0.5, fontSize: 15, color: C.text2 });
    });
    return s;
  }

  function rulesSlide(rules, notes, title) {
    if (current.section !== "Zusammenfassung") section("Zusammenfassung", "ZUSAMMENFASSUNG");
    const s = content(title || `${ZAHLWORT[rules.length] || rules.length} Regeln für deinen Spickzettel`, notes);
    const rh = Math.min(0.93, 4.8 / rules.length);
    rules.forEach((r, i) => {
      const y = 1.95 + i * rh;
      numCircle(s, i + 1, MX, y, 0.68, C.text1, C.background1);
      tx(s, r, { x: MX + 1.0, y, w: 11, h: 0.68, fontSize: 22, valign: "middle" });
    });
    return s;
  }

  // Schlussfolie: cards = [{ icon, title, text }] (1–3), danach „Fragen?“
  async function outlookSlide(o) {
    if (current.section !== "Zusammenfassung") section("Zusammenfassung", "ZUSAMMENFASSUNG");
    const s = pres.addSlide({ masterName: "AUSBLICK", sectionTitle: current.section });
    tx(s, "AUSBLICK", { x: 0.8, y: 1.0, w: 11, h: 0.4, fontSize: 14, bold: true, color: C.accent1, charSpacing: 2 });
    s.addText(o.title || "Wie geht es weiter?", { placeholder: "title" });
    const n = o.cards.length;
    const cw = (11.7 - (n - 1) * 0.3) / n;
    for (let i = 0; i < n; i++) {
      const x = 0.8 + i * (cw + 0.3);
      const c = o.cards[i];
      rect(s, { x, y: 2.85, w: cw, h: 2.5, r: 0.1, fill: { color: C.accent2 } });
      await iconCircle(s, c.icon, x + 0.35, 3.15, 0.7, C.accent1, T.dk1);
      tx(s, c.title, { x: x + 1.25, y: 3.15, w: cw - 1.5, h: 0.7, fontSize: 20, bold: true, color: C.background1, valign: "middle" });
      tx(s, c.text, { x: x + 0.35, y: 4.05, w: cw - 0.7, h: 1.1, fontSize: 16, color: C.background1 });
    }
    tx(s, "Fragen?", { x: 0.8, y: 5.9, w: 6, h: 0.7, fontSize: 28, bold: true, color: C.accent1 });
    if (o.notes) s.addNotes(o.notes);
    return s;
  }

  // ---------- Speichern ----------
  // pptxgenjs schreibt Offices Standardpalette ins Theme; hier kommen unsere Farben hinein,
  // damit Schemafarben (C.accent1 …) auch in PowerPoint richtig aufgelöst werden.
  async function save(file) {
    await pres.writeFile({ fileName: file });
    const JSZip = require(require.resolve("jszip", { paths: [path.dirname(require.resolve("pptxgenjs"))] }));
    const zip = await JSZip.loadAsync(fs.readFileSync(file));
    const part = "ppt/theme/theme1.xml";
    const slots = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
    const scheme = `<a:clrScheme name="${THEME.name}">` + slots.map((k) => `<a:${k}><a:srgbClr val="${THEME.colors[k]}"/></a:${k}>`).join("") + "</a:clrScheme>";
    const xml = (await zip.file(part).async("string")).replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, () => scheme);
    if (!xml.includes(scheme)) throw new Error("Farbschema im Theme nicht gefunden.");
    zip.file(part, xml);
    // Eine Schemafarbe in einer Hex-Option landet als <a:srgbClr val="accent1"/> – das öffnet PowerPoint nicht.
    for (const name of Object.keys(zip.files)) {
      if (!name.endsWith(".xml")) continue;
      const bad = (await zip.file(name).async("string")).match(/<a:srgbClr val="((?![0-9A-Fa-f]{6}")[^"]*)"/);
      if (bad) throw new Error(`${name}: Farbe „${bad[1]}“ ist kein Hex-Wert. Dort T.<farbe> statt C.<farbe> verwenden.`);
    }
    fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  }

  return {
    pres, C, S, T, THEME, W, H, MX, CW, TOP, BOTTOM, MONO, PCT, pm,
    tx, rect, line, dot, icon, iconCircle, numCircle, bullets,
    progressDots, section, content, titleSlide, divider,
    codeBlock, outputBlock, takeaway, codeSlide,
    callout, statBlock, cardGrid, iconRows, steps, fraction, chartBase,
    table, chip, fileCard, noteBox, notePair, DEC1, DEC2, dec,
    journeySlide, goalsSlide, exerciseSlide, recapSlide, rulesSlide, outlookSlide,
    save,
    assets: (f) => path.join(opts.assets || ".", f),
  };
}

module.exports = { createDeck, THEME };
