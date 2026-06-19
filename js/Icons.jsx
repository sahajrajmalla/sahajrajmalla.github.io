// Icons.jsx — real brand logos + project marks + line glyphs.
// window.SahajIcons[name]({ size, color, strokeW }) → an <svg> element.
// Brand glyphs are filled (official simple-icons paths); the rest are line icons.

(function () {
  const fill = (d, vb = "0 0 24 24") => ({ size = 18, color = "currentColor" }) =>
    React.createElement("svg", { width: size, height: size, viewBox: vb, fill: color, "aria-hidden": true, style:{ display:"block" } },
      React.createElement("path", { d }));

  // Line-icon factory: children are raw SVG element descriptors [tag, attrs]
  const line = (...els) => ({ size = 18, color = "currentColor", strokeW = 1.8 }) =>
    React.createElement("svg",
      { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: strokeW, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, style:{ display:"block" } },
      els.map((e, i) => React.createElement(e[0], { key: i, ...e[1] })));

  const I = {
    /* ───────── Brand logos (filled) ───────── */
    github: fill("M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z"),
    linkedin: fill("M20.4 3H3.6C3 3 2.5 3.5 2.5 4.1v15.8c0 .6.5 1.1 1.1 1.1h16.8c.6 0 1.1-.5 1.1-1.1V4.1c0-.6-.5-1.1-1.1-1.1zM8.3 18.3H5.6V9.7h2.7v8.6zM6.9 8.6a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zM18.4 18.3h-2.7v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3H10V9.7h2.6v1.2h.1c.4-.7 1.2-1.4 2.6-1.4 2.7 0 3.2 1.8 3.2 4.1v4.7z"),
    scholar: fill("M12 2 1 8.5l11 6.5 9-5.3V16h2V8.5L12 2zM5 13.2V17c0 1.7 3.1 3.5 7 3.5s7-1.8 7-3.5v-3.8l-7 4.1-7-4.1z"),
    researchgate: line(["rect", { x: 3, y: 3, width: 18, height: 18, rx: 4.2 }], ["path", { d: "M9 17V8h3.3a2.45 2.45 0 0 1 0 4.9H9" }], ["path", { d: "M11.7 12.9 14.8 17" }]),
    x: fill("M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"),
    instagram: line(
      ["rect", { x: 2.5, y: 2.5, width: 19, height: 19, rx: 5.4 }],
      ["circle", { cx: 12, cy: 12, r: 4.2 }],
      ["circle", { cx: 17.4, cy: 6.6, r: 1, fill: "currentColor", stroke: "none" }]),
    medium: fill("M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"),
    facebook: fill("M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"),
    email: line(["rect", { x: 2.5, y: 4.5, width: 19, height: 15, rx: 2.5 }], ["path", { d: "M3 7l9 6 9-6" }]),

    /* ───────── Project marks (line) ───────── */
    greatapi: line(["path", { d: "M8 5.5C5.8 5.5 5.5 7 5.5 9s-1 2.5-2 3c1 .5 2 1 2 3s.3 3.5 2.5 3.5" }], ["path", { d: "M16 5.5c2.2 0 2.5 1.5 2.5 3.5s1 2.5 2 3c-1 .5-2 1-2 3s-.3 3.5-2.5 3.5" }], ["path", { d: "M13 9l-2 6" }]),
    mallanet: line(
      ["circle", { cx: 5, cy: 6, r: 1.6 }], ["circle", { cx: 5, cy: 12, r: 1.6 }], ["circle", { cx: 5, cy: 18, r: 1.6 }],
      ["circle", { cx: 13, cy: 9, r: 1.6 }], ["circle", { cx: 13, cy: 15, r: 1.6 }],
      ["circle", { cx: 20, cy: 12, r: 1.6 }],
      ["path", { d: "M6.5 6.6l5 2M6.5 12l5-2.4M6.5 12l5 2.4M6.5 17.4l5-2M14.5 9.6l4 1.8M14.5 14.4l4-1.8", opacity: 0.85 }]),
    mail: line(["rect", { x: 2.5, y: 4.5, width: 19, height: 15, rx: 2.5 }], ["path", { d: "M3 7l9 6 9-6" }]),
    house: line(["path", { d: "M3.5 11.5 12 4l8.5 7.5" }], ["path", { d: "M5.5 10v9.5h13V10" }], ["path", { d: "M10 19.5v-5h4v5" }]),
    cards: line(["rect", { x: 8.5, y: 4.5, width: 10, height: 14, rx: 2, transform: "rotate(9 13.5 11.5)" }], ["rect", { x: 5, y: 6, width: 10, height: 14, rx: 2 }], ["path", { d: "M10 13.2l1.4-2 1.4 2" }]),
    atom: line(["circle", { cx: 12, cy: 12, r: 1.6, fill: "currentColor", stroke: "none" }], ["ellipse", { cx: 12, cy: 12, rx: 9, ry: 3.6 }], ["ellipse", { cx: 12, cy: 12, rx: 9, ry: 3.6, transform: "rotate(60 12 12)" }], ["ellipse", { cx: 12, cy: 12, rx: 9, ry: 3.6, transform: "rotate(120 12 12)" }]),

    /* ───────── Institution ───────── */
    ku: line(["path", { d: "M12 3 3.5 7.5h17z" }], ["path", { d: "M6 10v7M10 10v7M14 10v7M18 10v7" }], ["path", { d: "M3.5 20.5h17M4.5 17.5h15" }]),

    /* ───────── Interests (line) ───────── */
    travel: line(["path", { d: "M22 2 11 13" }], ["path", { d: "M22 2 15 22l-4-9-9-4z" }]),
    art: line(["path", { d: "M12 3c-5 0-9 3.6-9 8 0 2.5 2 4.5 4.5 4.5H9c1 0 1.6 1 1.2 1.9-.3.7-.2 1.6.5 2 .4.3 1 .4 1.6.4 5 0 8.2-3.4 8.2-8.4C21.5 6.4 17.4 3 12 3Z" }], ["circle", { cx: 7.5, cy: 10.5, r: 1, fill: "currentColor", stroke: "none" }], ["circle", { cx: 12, cy: 8, r: 1, fill: "currentColor", stroke: "none" }], ["circle", { cx: 16.3, cy: 10.5, r: 1, fill: "currentColor", stroke: "none" }]),
    philosophy: line(["path", { d: "M5 12c0-1.8 1.3-3.2 3-3.2s2.8 1.4 4 3.2 2.3 3.2 4 3.2 3-1.4 3-3.2-1.3-3.2-3-3.2-2.8 1.4-4 3.2-2.3 3.2-4 3.2-3-1.4-3-3.2Z" }]),
    psychology: line(["circle", { cx: 12, cy: 11, r: 7.5 }], ["path", { d: "M12 7.5a3.2 3.2 0 1 0 3.2 3.2 1.6 1.6 0 1 0-1.6-1.6" }]),
    music: line(["path", { d: "M9 18V6l10-2v12" }], ["circle", { cx: 6.2, cy: 18, r: 2.8 }], ["circle", { cx: 16.2, cy: 16, r: 2.8 }]),
    anime: line(["path", { d: "M3 7.5h18" }], ["path", { d: "M4 4.2c4.4 1.6 11.6 1.6 16 0" }], ["path", { d: "M6.2 7.5V20M17.8 7.5V20" }], ["path", { d: "M6 11.2h12" }]),
    football: line(["circle", { cx: 12, cy: 12, r: 9 }], ["path", { d: "M12 8.2l3.4 2.5-1.3 4h-4.2l-1.3-4z" }], ["path", { d: "M12 3.2v2.4M20.4 10.4l-2.6 1.1M17.1 19.4l-1.5-2M8.4 19.4l1.5-2M3.6 10.4l2.6 1.1" }]),
    explore: line(["circle", { cx: 12, cy: 12, r: 9 }], ["path", { d: "M16.2 7.8l-2.3 6.4-6.1 2.3 2.3-6.4z" }]),

    /* ───────── UI ───────── */
    arrowRight: line(["path", { d: "M5 12h14" }], ["path", { d: "M13 6l6 6-6 6" }]),
    arrowDown: line(["path", { d: "M12 5v14" }], ["path", { d: "M5 12l7 7 7-7" }]),
    planet: line(["circle", { cx: 12, cy: 12, r: 6 }], ["ellipse", { cx: 12, cy: 12, rx: 11, ry: 3.6, transform: "rotate(-20 12 12)", opacity: 0.75 }]),
    external: line(["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }], ["path", { d: "M15 3h6v6M10 14 21 3" }]),
  };

  window.SahajIcons = I;
})();
