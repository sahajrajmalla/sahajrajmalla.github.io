// Game.jsx - "Explore My World": pilot a rocket (night) or sail a ship (day) to a star or island to open a page.
//
// Input is built so that nothing can stay "held":
//  - the on-screen pad uses Pointer Events with pointer capture, so a press ends when the finger or
//    mouse is released anywhere, when the browser cancels it, or when capture is lost;
//  - the keyboard is read by direction (not by key text), so Shift, Caps Lock or another layout cannot
//    leave a key down; Cmd/Ctrl/Alt shortcuts are ignored, and everything is released when the window
//    loses focus, the tab is hidden, or the game closes;
//  - the pad and the keyboard are tracked separately, so letting go of one never cancels the other.
// The page behind is locked with the shared, counted scroll lock and is released on every exit path.
const { useEffect, useRef, useState, useCallback } = React;
const UI = window.SahajUI;

const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "'Times New Roman',Georgia,serif";

/* Two playing fields: a wide one for desktops, tablets and phones on their side, and a taller one
   for phones held upright. Positions are in field units; the canvas scales the field to fit. */
const WORLDS = {
  wide: {
    w: 820, h: 430, start: [410, 360],
    portals: [
      { id: 'about',    label: 'ABOUT',    x: 150, y: 120, tone: 'accent2', rgb: '77,127,255' },
      { id: 'research', label: 'RESEARCH', x: 415, y: 90,  color: '#8b5cf6', rgb: '139,92,246' },
      { id: 'projects', label: 'PROJECTS', x: 680, y: 130, color: '#10b981', rgb: '16,185,129' },
      { id: 'phd',      label: 'FOR PhD',  x: 585, y: 265, tone: 'goldInk', rgb: '201,168,76' },
      { id: 'contact',  label: 'CONTACT',  x: 230, y: 270, color: '#ff6b6b', rgb: '255,107,107' },
    ],
  },
  tall: {
    w: 520, h: 500, start: [260, 440],
    portals: [
      { id: 'about',    label: 'ABOUT',    x: 125, y: 118, tone: 'accent2', rgb: '77,127,255' },
      { id: 'research', label: 'RESEARCH', x: 395, y: 118, color: '#8b5cf6', rgb: '139,92,246' },
      { id: 'projects', label: 'PROJECTS', x: 260, y: 258, color: '#10b981', rgb: '16,185,129' },
      { id: 'contact',  label: 'CONTACT',  x: 125, y: 392, color: '#ff6b6b', rgb: '255,107,107' },
      { id: 'phd',      label: 'FOR PhD',  x: 395, y: 392, tone: 'goldInk', rgb: '201,168,76' },
    ],
  },
};
const NEAR = 86;   // how close counts as "in range", in field units

/* ── keyboard: map a key event to a direction ── */
const CODE_DIR = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down' };
const NAME_DIR = { arrowleft: 'left', a: 'left', arrowright: 'right', d: 'right', arrowup: 'up', w: 'up', arrowdown: 'down', s: 'down' };
const keyDir = (e) => NAME_DIR[String(e.key || '').toLowerCase()] || CODE_DIR[e.code] || null;
const keyId = (e) => e.code || String(e.key || '').toLowerCase();

/* ── colours: the canvas cannot read CSS variables, so resolve them once per theme ── */
function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n, fb) => (cs.getPropertyValue(n) || '').trim() || fb;
  return { accent: v('--accent', '#2255e8'), accent2: v('--accent-2', '#4d7fff'), gold: v('--gold', '#c9a84c'), goldInk: v('--gold-ink', '#c9a84c') };
}
function withAlpha(c, a) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
  if (m) {
    let h = m[1]; if (h.length === 3) h = h.split('').map(x => x + x).join('');
    return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')';
  }
  const r = /^rgba?\(([^)]+)\)$/i.exec(c);
  if (r) { const p = r[1].split(',').map(s => s.trim()); return 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + a + ')'; }
  return c;
}

function useViewport() {
  const [s, setS] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    let raf = 0;
    const on = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; setS({ w: window.innerWidth, h: window.innerHeight }); }); };
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => { window.removeEventListener('resize', on); window.removeEventListener('orientationchange', on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return s;
}

function Game({ onClose, onNavigate }) {
  const dialogRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const scaleRef = useRef(1);                    // displayed pixels per field unit
  const input = useRef({ kb: new Map(), pads: new Map() });   // held keys (id -> direction) and held pad presses (id -> direction)
  const leftRef = useRef(false);                 // the game has been left (closed or navigated); ignore everything after
  const helpRef = useRef(false);
  const onCloseRef = useRef(onClose); onCloseRef.current = onClose;
  const onNavRef = useRef(onNavigate); onNavRef.current = onNavigate;
  const isLight = window.useTheme() === 'light';
  const vp = useViewport();
  const [nearLabel, setNearLabel] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [noCanvas, setNoCanvas] = useState(false);
  helpRef.current = showHelp;

  UI.useScrollLock(true);

  /* ── layout, computed from the viewport so the pad and ENTER are never cut off ── */
  const side = vp.w > vp.h && vp.h < 560;        // phone on its side: pad and ENTER sit beside the field
  const compact = vp.w < 420;
  const padSize = side ? 46 : compact ? 50 : 54;
  const enterSize = side ? 66 : 78;
  const headerH = side ? 48 : 64;
  const deckH = side ? 0 : padSize * 2 + 6 + 30;
  const sideCols = side ? (padSize * 3 + 12 + 28) + (enterSize + 28) : 0;
  const panelW = Math.min(880, vp.w - 20);
  const availW = panelW - 2 - sideCols;
  const availH = vp.h - 20 - 2 - headerH - deckH;
  const worldKey = availW >= 540 ? 'wide' : 'tall';
  const world = WORLDS[worldKey];
  const ratio = world.w / world.h;
  const cssW = Math.max(180, Math.floor(Math.min(availW, availH * ratio)));
  const cssH = Math.round(cssW / ratio);
  scaleRef.current = cssW / world.w;

  /* ── input ── */
  const releaseAll = useCallback(() => { input.current.kb.clear(); input.current.pads.clear(); }, []);
  const go = useCallback((id) => {
    if (leftRef.current) return;
    leftRef.current = true;
    releaseAll();
    onNavRef.current(id);
  }, [releaseAll]);
  const leave = useCallback(() => {
    if (leftRef.current) return;
    leftRef.current = true;
    releaseAll();
    onCloseRef.current();
  }, [releaseAll]);
  const tryEnter = useCallback(() => {
    const st = stateRef.current;
    if (st && st.nearPortal) go(st.nearPortal.id);
  }, [go]);

  // window-level input: keyboard, and every way a press can end
  useEffect(() => {
    const inp = input.current;
    const onKeyDown = (e) => {
      if (leftRef.current || e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.altKey) { inp.kb.clear(); return; }   // browser shortcuts swallow the key-up
      if (e.key === 'Escape') { e.preventDefault(); if (helpRef.current) setShowHelp(false); else leave(); return; }
      const dir = keyDir(e);
      const onPad = e.target && e.target.closest && e.target.closest('[data-pad]');
      if (dir) { e.preventDefault(); inp.kb.set(keyId(e), dir); return; }
      const onOtherButton = e.target && e.target.closest && e.target.closest('button, a, input, select, textarea') && !onPad;
      if ((e.key === 'Enter' || e.key === 'e' || e.key === 'E') && !onOtherButton) {
        const st = stateRef.current;
        if (st && st.nearPortal) { e.preventDefault(); if (!e.repeat) tryEnter(); }
        else if (e.key === 'Enter') e.preventDefault();
      }
    };
    const onKeyUp = (e) => {
      inp.kb.delete(keyId(e));
      if (e.key === 'Meta' || e.key === 'Control' || e.key === 'Alt') inp.kb.clear();
    };
    const dropPointer = (e) => { inp.pads.delete('p' + e.pointerId); };
    const onHide = () => { if (document.hidden) releaseAll(); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', releaseAll);
    window.addEventListener('pagehide', releaseAll);
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pointerup', dropPointer, true);
    window.addEventListener('pointercancel', dropPointer, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', releaseAll);
      window.removeEventListener('pagehide', releaseAll);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pointerup', dropPointer, true);
      window.removeEventListener('pointercancel', dropPointer, true);
      releaseAll();
    };
  }, [leave, releaseAll, tryEnter]);

  // take focus into the dialog when it opens
  useEffect(() => {
    if (dialogRef.current) { try { dialogRef.current.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  }, []);

  /* ── the field ── */
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setNoCanvas(true); return undefined; }
    const W = WORLDS[worldKey], VW = W.w, VH = W.h, PORTALS = W.portals;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(VW * DPR); canvas.height = Math.round(VH * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * VW, y: Math.random() * VH, r: Math.random() * 1.1 + 0.2,
      phase: Math.random() * 6.28, ps: Math.random() * 0.03 + 0.006,
    }));

    // the player survives a change of field (rotating the phone): keep the same relative spot
    let st = stateRef.current;
    if (!st) {
      st = stateRef.current = { player: { x: W.start[0], y: W.start[1], vx: 0, vy: 0, tilt: 0, heading: -Math.PI / 2 }, time: 0, nearPortal: null, last: 0, worldKey };
    } else if (st.worldKey !== worldKey) {
      const o = WORLDS[st.worldKey];
      st.player.x = st.player.x / o.w * VW; st.player.y = st.player.y / o.h * VH; st.player.vx = 0; st.player.vy = 0;
      st.worldKey = worldKey; st.last = 0;
    }

    let P = readPalette();
    let themeSig = document.documentElement.getAttribute('data-theme');
    const colorOf = (p) => p.color || P[p.tone];

    function starPath(cx, cy, spikes, outer, inner) {
      let rot = -Math.PI / 2; const step = Math.PI / spikes;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
      for (let i = 0; i < spikes; i++) { rot += step; ctx.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner); rot += step; ctx.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer); }
      ctx.closePath();
    }

    function bg(t, light) {
      if (light) {
        // blue-ocean nautical chart
        const pg = ctx.createLinearGradient(0, 0, 0, VH);
        pg.addColorStop(0, '#3f92bd'); pg.addColorStop(0.5, '#2f7ba8'); pg.addColorStop(1, '#256a95');
        ctx.fillStyle = pg; ctx.fillRect(0, 0, VW, VH);
        const sea = ctx.createRadialGradient(VW * 0.5, VH * 0.42, 40, VW * 0.5, VH * 0.5, VW * 0.62);
        sea.addColorStop(0, 'rgba(150,205,224,0.4)'); sea.addColorStop(1, 'rgba(40,110,150,0)');
        ctx.fillStyle = sea; ctx.fillRect(0, 0, VW, VH);
        ctx.strokeStyle = 'rgba(230,244,250,0.14)'; ctx.lineWidth = 1;
        for (let gx = 0; gx <= VW; gx += 68) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, VH); ctx.stroke(); }
        for (let gy = 0; gy <= VH; gy += 68) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(VW, gy); ctx.stroke(); }
        ctx.strokeStyle = 'rgba(240,250,255,0.5)'; ctx.lineWidth = 1; ctx.lineCap = 'round';
        for (const s of stars) {
          s.phase += s.ps * 0.5; const wob = Math.sin(s.phase) * 1.1;
          ctx.beginPath(); ctx.moveTo(s.x - 3, s.y);
          ctx.quadraticCurveTo(s.x - 1, s.y - 1.6 + wob, s.x + 1, s.y);
          ctx.quadraticCurveTo(s.x + 3, s.y + 1.6 - wob, s.x + 5, s.y); ctx.stroke();
        }
        const vg = ctx.createRadialGradient(VW * 0.5, VH * 0.5, VH * 0.32, VW * 0.5, VH * 0.5, VW * 0.62);
        vg.addColorStop(0, 'rgba(12,50,80,0)'); vg.addColorStop(1, 'rgba(12,50,80,0.34)');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);
        // corner compass rose, north marked
        ctx.save(); ctx.translate(VW - 52, VH - 48); ctx.globalAlpha = 0.8;
        ctx.strokeStyle = 'rgba(255,248,232,0.9)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 0, 20, 0, 6.283); ctx.stroke();
        ctx.fillStyle = 'rgba(255,248,232,0.9)';
        for (let i = 0; i < 4; i++) { ctx.save(); ctx.rotate(i * Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, -18); ctx.lineTo(4, 0); ctx.lineTo(-4, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
        ctx.fillStyle = '#e8564a'; ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(3, 0); ctx.lineTo(-3, 0); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff8e8'; ctx.font = "bold 11px 'Times New Roman',Georgia,serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('N', 0, -25);
        ctx.restore(); ctx.globalAlpha = 1; ctx.textBaseline = 'alphabetic';
        return;
      }
      ctx.fillStyle = '#03040d'; ctx.fillRect(0, 0, VW, VH);
      const neb = ctx.createRadialGradient(VW * 0.7, VH * 0.3, 0, VW * 0.7, VH * 0.3, 260);
      neb.addColorStop(0, 'rgba(60,30,120,0.18)'); neb.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = neb; ctx.fillRect(0, 0, VW, VH);
      const neb2 = ctx.createRadialGradient(VW * 0.2, VH * 0.6, 0, VW * 0.2, VH * 0.6, 220);
      neb2.addColorStop(0, 'rgba(20,60,120,0.15)'); neb2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = neb2; ctx.fillRect(0, 0, VW, VH);
      for (const s of stars) {
        s.phase += s.ps; const a = 0.3 + Math.sin(s.phase) * 0.35 + 0.35;
        ctx.globalAlpha = Math.max(0, Math.min(1, a)); ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // K enlarges the portals, the ship and the labels on small screens so they stay readable and easy to hit
    function drawPortal(p, near, t, light, K) {
      const col = colorOf(p);
      const pulse = Math.sin(t * 3 + p.x) * 0.12 + 0.9;
      ctx.save(); ctx.translate(p.x, p.y); ctx.scale(K, K); ctx.translate(-p.x, -p.y);
      if (light) {
        // an island (a section to land on)
        if (near) {
          ctx.save(); ctx.globalAlpha = 0.4 + Math.sin(t * 3) * 0.12;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 58);
          g.addColorStop(0, 'rgba(' + p.rgb + ',0.85)'); g.addColorStop(1, 'rgba(' + p.rgb + ',0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, 58, 0, 6.283); ctx.fill(); ctx.restore();
        }
        ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(p.x, p.y + 6, 30 + Math.sin(t * 2 + p.x) * 1.5, 11, 0, 0, 6.283); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#26484a';
        ctx.beginPath(); ctx.ellipse(p.x, p.y + 8, 27, 8, 0, 0, 6.283); ctx.fill(); ctx.restore();
        ctx.fillStyle = '#e8d4a2'; ctx.strokeStyle = '#b89a62'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(p.x, p.y + 5, 25, 9, 0, 0, 6.283); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#7cb184'; ctx.strokeStyle = '#528a5d'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x - 17, p.y + 3);
        ctx.quadraticCurveTo(p.x - 7, p.y - 15, p.x + 2, p.y - 6);
        ctx.quadraticCurveTo(p.x + 10, p.y - 19, p.x + 19, p.y + 3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = '#7a5326'; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(p.x + 9, p.y + 1); ctx.quadraticCurveTo(p.x + 13, p.y - 10, p.x + 11, p.y - 18); ctx.stroke();
        ctx.strokeStyle = '#4e8248'; ctx.lineWidth = 1.4;
        const tx = p.x + 11, ty = p.y - 18;
        ctx.beginPath();
        ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + 9, ty - 3, tx + 13, ty + 2);
        ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx - 8, ty - 3, tx - 11, ty + 2);
        ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + 5, ty - 8, tx + 10, ty - 8);
        ctx.stroke();
        ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(tx - 1, ty - 2); ctx.lineTo(tx - 11, ty - 4.5); ctx.lineTo(tx - 1, ty - 7); ctx.closePath(); ctx.fill();
        ctx.save(); ctx.textAlign = 'center';
        ctx.font = 'bold ' + (near ? 14 : 13) + "px 'Helvetica Neue',Arial,sans-serif";
        ctx.lineWidth = 3.4; ctx.strokeStyle = 'rgba(10,44,72,0.92)'; ctx.lineJoin = 'round';
        ctx.strokeText(p.label, p.x, p.y - 26);
        ctx.fillStyle = near ? '#fff7e6' : '#eaf4fb'; ctx.fillText(p.label, p.x, p.y - 26);
        if (near) { ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(6,40,26,0.9)'; ctx.font = "bold 11px 'Helvetica Neue',Arial,sans-serif"; ctx.strokeText('LAND HERE', p.x, p.y + 23); ctx.fillStyle = '#7dffc4'; ctx.fillText('LAND HERE', p.x, p.y + 23); }
        ctx.restore();
        ctx.restore();
        return;
      }
      const outer = (near ? 22 : 18) * pulse, inner = outer * 0.45;
      ctx.save(); ctx.globalAlpha = near ? 0.30 : 0.16;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, near ? 58 : 44);
      g.addColorStop(0, 'rgba(' + p.rgb + ',1)'); g.addColorStop(1, 'rgba(' + p.rgb + ',0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, near ? 58 : 44, 0, 6.283); ctx.fill(); ctx.restore();
      starPath(p.x, p.y, 5, outer, inner);
      ctx.fillStyle = near ? col : withAlpha(col, 0.8); ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(p.x - outer * 0.18, p.y - outer * 0.18, outer * 0.14, 0, 6.283); ctx.fill();
      ctx.fillStyle = near ? '#fff' : col; ctx.textAlign = 'center';
      ctx.font = 'bold ' + (near ? 13 : 12) + "px 'Helvetica Neue',Arial,sans-serif";
      ctx.fillText(p.label, p.x, p.y - outer - 12);
      if (near) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = "11px 'Helvetica Neue',Arial,sans-serif"; ctx.fillText('ENTER', p.x, p.y + outer + 19); }
      ctx.restore();
    }

    function rider(t) {
      const wave = Math.sin(t * 6) * 0.5;
      ctx.fillStyle = '#e87060'; ctx.beginPath(); ctx.ellipse(0, -2, 5.5, 5, 0, 0, 6.283); ctx.fill();
      ctx.strokeStyle = 'rgba(255,210,190,0.4)'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(-3, -5); ctx.lineTo(-3, 2); ctx.moveTo(0, -6); ctx.lineTo(0, 2); ctx.moveTo(3, -5); ctx.lineTo(3, 2); ctx.stroke();
      ctx.strokeStyle = '#334466'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-2.5, 2); ctx.lineTo(-3.5, 7); ctx.moveTo(2.5, 2); ctx.lineTo(3.5, 7); ctx.stroke();
      ctx.fillStyle = '#f5f5f5'; ctx.beginPath(); ctx.arc(-3.7, 7.6, 1.6, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.arc(3.7, 7.6, 1.6, 0, 6.283); ctx.fill();
      ctx.strokeStyle = '#e87060'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(4, -3); ctx.lineTo(8, -7 - wave * 2); ctx.stroke();
      ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.arc(8, -7 - wave * 2, 1.6, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.arc(0, -9, 4.6, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#1a1a30'; ctx.beginPath(); ctx.ellipse(0, -12.5, 5, 2, 0, 0, 6.283); ctx.fill();
      ctx.fillRect(-5, -13.5, 10, 3); ctx.fillStyle = P.gold; ctx.fillRect(-5, -11, 10, 1);
      ctx.fillStyle = '#1a0a0a'; ctx.beginPath(); ctx.arc(-1.6, -9, 0.7, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.arc(1.6, -9, 0.7, 0, 6.283); ctx.fill();
      ctx.strokeStyle = '#1a0a0a'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.arc(0, -7.5, 1.6, 0.2, Math.PI - 0.2); ctx.stroke();
    }

    function drawRocket(pl, t, light, K) {
      const x = pl.x, y = pl.y;
      const moving = Math.abs(pl.vx) + Math.abs(pl.vy) > 0.5;
      const bob = Math.sin(t * 8) * 1.5;
      ctx.save(); ctx.translate(x, y + bob); ctx.scale(K, K); ctx.rotate(pl.tilt);

      if (light) {
        // my ship, seen from above, sailing the chart
        ctx.rotate(pl.heading + Math.PI / 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        for (let i = 0; i < 3; i++) { const yy = 15 + i * 6; ctx.save(); ctx.globalAlpha = (3 - i) / 4; ctx.beginPath(); ctx.moveTo(-4 - i, yy); ctx.quadraticCurveTo(0, yy + 3, 4 + i, yy); ctx.stroke(); ctx.restore(); }
        ctx.beginPath();
        ctx.moveTo(0, -19);
        ctx.quadraticCurveTo(9, -5, 7, 14);
        ctx.quadraticCurveTo(0, 19, -7, 14);
        ctx.quadraticCurveTo(-9, -5, 0, -19);
        ctx.closePath();
        const hg = ctx.createLinearGradient(-8, 0, 8, 0);
        hg.addColorStop(0, '#b5701a'); hg.addColorStop(0.5, '#f4b73f'); hg.addColorStop(1, '#b5701a');
        ctx.fillStyle = hg; ctx.strokeStyle = '#6f4310'; ctx.lineWidth = 1.6; ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#7a4e1b'; ctx.beginPath(); ctx.ellipse(0, 3, 3.3, 8, 0, 0, 6.283); ctx.fill();
        ctx.fillStyle = '#fbf4e6'; ctx.strokeStyle = '#b09666'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(0, -4, 6.6, 4.6, 0, 0, 6.283); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#365a86'; ctx.beginPath(); ctx.arc(0, -4, 1.5, 0, 6.283); ctx.fill();
        ctx.fillStyle = '#5f3c14'; ctx.beginPath(); ctx.arc(0, 2, 1.2, 0, 6.283); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(-6, -13); ctx.quadraticCurveTo(0, -19, 6, -13); ctx.stroke();
        ctx.restore();
        ctx.save(); ctx.translate(x, y + bob); ctx.scale(K, K);
        ctx.fillStyle = 'rgba(255,248,232,0.95)'; ctx.strokeStyle = 'rgba(10,44,72,0.85)'; ctx.lineWidth = 2.6; ctx.lineJoin = 'round';
        ctx.font = "bold 10px 'Helvetica Neue',Arial,sans-serif"; ctx.textAlign = 'center';
        ctx.strokeText('YOU', 0, -26); ctx.fillText('YOU', 0, -26);
        ctx.restore();
        return;
      }

      const fh = 14 + Math.sin(t * 16) * 5 + (moving ? 6 : 0);
      const fg = ctx.createLinearGradient(0, 22, 0, 22 + fh);
      fg.addColorStop(0, 'rgba(255,200,60,0.95)'); fg.addColorStop(0.5, 'rgba(255,120,30,0.7)'); fg.addColorStop(1, 'rgba(255,60,20,0)');
      ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(-7, 22); ctx.lineTo(0, 22 + fh); ctx.lineTo(7, 22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#d23b3b';
      ctx.beginPath(); ctx.moveTo(-9, 16); ctx.lineTo(-17, 26); ctx.lineTo(-9, 24); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(9, 16); ctx.lineTo(17, 26); ctx.lineTo(9, 24); ctx.closePath(); ctx.fill();
      const bg2 = ctx.createLinearGradient(-10, 0, 10, 0);
      bg2.addColorStop(0, '#b9c4d8'); bg2.addColorStop(0.5, '#f2f6ff'); bg2.addColorStop(1, '#aeb9cd');
      ctx.fillStyle = bg2;
      ctx.beginPath();
      ctx.moveTo(-10, 18); ctx.quadraticCurveTo(-11, -8, 0, -22); ctx.quadraticCurveTo(11, -8, 10, 18); ctx.closePath(); ctx.fill();
      ctx.fillStyle = P.accent; ctx.beginPath(); ctx.moveTo(-7, -6); ctx.quadraticCurveTo(0, -12, 7, -6); ctx.lineTo(6, 0); ctx.lineTo(-6, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#7fd0ff'; ctx.beginPath(); ctx.arc(0, 8, 5, 0, 6.283); ctx.fill();
      ctx.strokeStyle = P.gold; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(-1.6, 6.4, 1.6, 0, 6.283); ctx.fill();
      ctx.save(); ctx.translate(0, -22); rider(t); ctx.restore();
      ctx.restore();
      ctx.save(); ctx.translate(x, y + bob); ctx.scale(K, K);
      ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = "bold 10px 'Helvetica Neue',Arial,sans-serif"; ctx.textAlign = 'center';
      ctx.fillText('YOU', 0, -44);
      ctx.restore();
    }

    const held = (dir) => {
      const inp = input.current;
      for (const d of inp.kb.values()) if (d === dir) return true;
      for (const d of inp.pads.values()) if (d === dir) return true;
      return false;
    };

    let animId = 0, lastNear = undefined, alive = true;
    function loop(ts) {
      animId = 0;
      if (!alive || leftRef.current) return;
      const pl = st.player;
      const raw = st.last ? (ts - st.last) / 16.67 : 1;
      const dt = Math.max(0, Math.min(raw, 3)); st.last = ts; st.time += dt * 0.016;
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const sig = document.documentElement.getAttribute('data-theme');
      if (sig !== themeSig) { themeSig = sig; P = readPalette(); }
      const uk = VW / 820;                       // keep the crossing time the same on the smaller field
      const acc = 0.22 * uk, max = 2.3 * uk;
      let ax = 0, ay = 0;
      if (held('left')) ax -= 1;
      if (held('right')) ax += 1;
      if (held('up')) ay -= 1;
      if (held('down')) ay += 1;
      pl.vx += ax * acc * dt; pl.vy += ay * acc * dt;
      const fr = Math.pow(0.86, dt); pl.vx *= fr; pl.vy *= fr;
      const sp = Math.hypot(pl.vx, pl.vy); if (sp > max) { pl.vx = pl.vx / sp * max; pl.vy = pl.vy / sp * max; }
      pl.x = Math.max(28, Math.min(VW - 28, pl.x + pl.vx * dt));
      pl.y = Math.max(40, Math.min(VH - 34, pl.y + pl.vy * dt));
      pl.tilt += ((pl.vx * 0.05 / uk) - pl.tilt) * Math.min(1, 0.2 * dt);
      if (sp > 0.25 * uk) { const target = Math.atan2(pl.vy, pl.vx); pl.heading += Math.atan2(Math.sin(target - pl.heading), Math.cos(target - pl.heading)) * Math.min(1, 0.2 * dt); }

      const K = Math.max(1, Math.min(2, 0.95 / (scaleRef.current || 1)));
      const reach = NEAR * Math.min(1.35, K);
      let nearest = null, nd = Infinity;
      for (const p of PORTALS) { const d = Math.hypot(p.x - pl.x, p.y - pl.y); if (d < nd) { nd = d; nearest = p; } }
      st.nearPortal = nd < reach ? nearest : null;
      const nl = st.nearPortal ? st.nearPortal.label : null;
      if (nl !== lastNear) { lastNear = nl; setNearLabel(nl); }

      bg(st.time, light);
      for (const p of PORTALS) drawPortal(p, st.nearPortal === p, st.time, light, K);
      drawRocket(pl, st.time, light, K);
      animId = requestAnimationFrame(loop);
    }

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const mx = (e.clientX - rect.left) * (VW / rect.width), my = (e.clientY - rect.top) * (VH / rect.height);
      const K = Math.max(1, Math.min(2, 0.95 / (scaleRef.current || 1)));
      for (const p of PORTALS) { if (Math.hypot(p.x - mx, p.y - my) < 34 * K) { go(p.id); return; } }
    };
    canvas.addEventListener('click', onClick);
    loop(performance.now());        // paint a first frame at once, even if rAF is throttled; it schedules the next

    return () => { alive = false; if (animId) cancelAnimationFrame(animId); animId = 0; canvas.removeEventListener('click', onClick); };
  }, [worldKey, go]);

  /* ── on-screen pad: one button per direction ── */
  const pressPad = (e, dir) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
    input.current.pads.set('p' + e.pointerId, dir);
  };
  const endPad = (e) => { input.current.pads.delete('p' + e.pointerId); };
  const padKey = (e, dir, down) => {
    if (e.key !== ' ' && e.key !== 'Spacebar') return;
    e.preventDefault();
    if (down) { if (!e.repeat) input.current.pads.set('s' + dir, dir); } else input.current.pads.delete('s' + dir);
  };
  const padBtn = (glyph, dir, name) => (
    <button type="button" data-pad="" aria-label={name}
      onPointerDown={(e) => pressPad(e, dir)} onPointerUp={endPad} onPointerCancel={endPad} onLostPointerCapture={endPad}
      onKeyDown={(e) => padKey(e, dir, true)} onKeyUp={(e) => padKey(e, dir, false)} onBlur={() => input.current.pads.delete('s' + dir)}
      onContextMenu={(e) => e.preventDefault()} onMouseDown={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}
      style={{ width: padSize + 'px', height: padSize + 'px', background: isLight ? 'rgba(217,154,52,0.2)' : 'rgba(34,85,232,0.42)', border: '1px solid ' + (isLight ? 'rgba(217,154,52,0.65)' : 'rgba(77,127,255,0.65)'), borderRadius: '13px', color: isLight ? '#7a4d0c' : '#fff', fontSize: '22px', lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none', WebkitTapHighlightColor: 'transparent', touchAction: 'none', padding: 0 }}
    >{glyph}</button>
  );

  const enterBtn = (
    <button type="button" onClick={tryEnter} disabled={!nearLabel} aria-label={nearLabel ? 'Open ' + nearLabel : 'Enter (fly close to a ' + (isLight ? 'island' : 'star') + ' first)'}
      style={{ width: enterSize + 'px', height: enterSize + 'px', background: nearLabel ? 'radial-gradient(circle at 40% 35%,#e8c45c,#b88a2a)' : 'rgba(201,168,76,0.18)', border: '2px solid ' + (nearLabel ? 'rgba(201,168,76,0.95)' : 'rgba(201,168,76,0.35)'), borderRadius: '50%', color: nearLabel ? '#1a1206' : (isLight ? '#7a5a1a' : '#a8955a'), fontSize: '14px', fontWeight: 800, fontFamily: SANS, cursor: nearLabel ? 'pointer' : 'default', letterSpacing: '0.5px', boxShadow: nearLabel ? '0 0 24px rgba(201,168,76,0.5)' : 'none', transition: 'all 0.2s ease', flexShrink: 0, padding: 0, touchAction: 'manipulation' }}>
      ENTER
    </button>
  );
  const pad = (
    <div role="group" aria-label="Movement pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
      {padBtn('↑', 'up', 'Move up')}
      <div style={{ display: 'flex', gap: '6px' }}>{padBtn('←', 'left', 'Move left')}{padBtn('↓', 'down', 'Move down')}{padBtn('→', 'right', 'Move right')}</div>
    </div>
  );
  const hint = (
    <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
      <p style={{ fontFamily: SANS, fontSize: '14px', lineHeight: 1.5, color: 'var(--ink-3)' }}>
        {nearLabel ? <span style={{ color: 'var(--gold-ink)', fontWeight: 700 }}>{isLight ? '⚓' : '★'} {nearLabel} in range</span> : (isLight ? 'Sail toward an island ⚓' : 'Move toward a star ★')}
      </p>
    </div>
  );

  const trapTab = (e) => {
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const f = Array.prototype.slice.call(dialogRef.current.querySelectorAll('button:not([disabled])'));
    if (!f.length) { e.preventDefault(); return; }
    const first = f[0], last = f[f.length - 1], a = document.activeElement;
    if (e.shiftKey && (a === first || a === dialogRef.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
  };

  const headBtn = { background: 'var(--surface-2)', border: '1px solid var(--line-2)', borderRadius: '10px', width: '42px', height: '42px', cursor: 'pointer', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, touchAction: 'manipulation' };
  const title = isLight ? 'Chart the Voyage ⚓' : 'Explore My World 🚀';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: isLight ? 'rgba(60,40,10,0.58)' : 'rgba(2,4,12,0.95)', WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left))', overscrollBehavior: 'contain', touchAction: 'none' }}
      onClick={(e) => { if (e.target === e.currentTarget) leave(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={isLight ? 'Chart the Voyage, a small game' : 'Explore My World, a small game'} tabIndex={-1} onKeyDown={trapTab}
        style={{ position: 'relative', width: panelW + 'px', maxWidth: '100%', maxHeight: '100%', background: isLight ? '#fff9ec' : '#040a16', border: '1px solid ' + (isLight ? 'rgba(217,154,52,0.4)' : 'rgba(34,85,232,0.35)'), borderRadius: '18px', overflow: 'hidden', boxShadow: isLight ? '0 30px 70px rgba(120,80,20,0.35)' : '0 0 0 1px rgba(34,85,232,0.2),0 40px 80px rgba(0,0,0,0.8)', display: 'flex', flexDirection: 'column', outline: 'none' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: side ? '6px 12px' : '10px 14px 10px 18px', minHeight: headerH + 'px', borderBottom: '1px solid var(--line)', background: isLight ? 'rgba(255,246,224,0.92)' : 'rgba(6,12,26,0.85)', flexShrink: 0 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: SERIF, fontSize: side ? '16px' : '18px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{title}</p>
            {!side && (
              <p style={{ fontFamily: SANS, fontSize: '13px', color: 'var(--ink-3)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nearLabel ? (isLight ? '⚓' : '★') + ' ' + nearLabel + ' in range · press ENTER' : (isLight ? 'Sail to an island to open a page' : 'Fly to a star to open a page')}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button type="button" onClick={() => setShowHelp(s => !s)} aria-label="How to play" aria-expanded={showHelp} title="How to play" style={Object.assign({ fontFamily: SANS, fontSize: '18px', fontWeight: 700 }, headBtn)}>?</button>
            <button type="button" onClick={leave} aria-label="Close" title="Close" style={Object.assign({ fontSize: '24px' }, headBtn)}>×</button>
          </div>
        </div>

        {/* Field (and, on a short landscape screen, the controls beside it) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: side ? '14px' : 0, padding: side ? '0 14px' : 0, background: isLight ? '#2f7ba8' : '#03040d', flexShrink: 0 }}>
          {side && pad}
          <div style={{ position: 'relative', width: cssW + 'px', height: cssH + 'px', flexShrink: 0 }}>
            <canvas ref={canvasRef} role="img" aria-label={isLight ? 'The chart. Sail the ship with the arrow keys or the pad. Islands open the pages of this site.' : 'The star field. Fly the rocket with the arrow keys or the pad. Stars open the pages of this site.'}
              style={{ display: 'block', width: cssW + 'px', height: cssH + 'px', cursor: 'pointer', touchAction: 'none' }} />
            {noCanvas && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', textAlign: 'center', background: isLight ? '#fff9ec' : '#040a16' }}>
                <p style={{ fontFamily: SANS, fontSize: '15px', color: 'var(--ink-2)' }}>This browser cannot draw the game. Pick a page instead:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {WORLDS.wide.portals.map(p => <button key={p.id} type="button" className="btn-secondary" onClick={() => go(p.id)}>{p.label}</button>)}
                </div>
              </div>
            )}
            {showHelp && (
              <div style={{ position: 'absolute', inset: 0, background: isLight ? 'rgba(255,248,232,0.96)' : 'rgba(3,5,14,0.93)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto', touchAction: 'pan-y' }} onClick={() => setShowHelp(false)}>
                <div style={{ maxWidth: '400px', textAlign: 'center', margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
                  <p style={{ fontFamily: SERIF, fontSize: '21px', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px' }}>How to play</p>
                  <p style={{ fontFamily: SANS, fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.7 }}>
                    {isLight
                      ? <React.Fragment>Sail your <strong style={{ color: 'var(--gold-ink)' }}>ship</strong> with the <strong style={{ color: 'var(--accent-2)' }}>arrow keys or WASD</strong>, or the <strong style={{ color: 'var(--accent-2)' }}>pad</strong> on a phone. Glide up to an island and press <strong>Enter</strong> or <strong>E</strong>, or tap the island, to open that page. <strong>Esc</strong> closes the game.</React.Fragment>
                      : <React.Fragment>Fly your <strong style={{ color: 'var(--gold-ink)' }}>rocket</strong> with the <strong style={{ color: 'var(--accent-2)' }}>arrow keys or WASD</strong>, or the <strong style={{ color: 'var(--accent-2)' }}>pad</strong> on a phone. Fly close to a star and press <strong>Enter</strong> or <strong>E</strong>, or tap the star, to open that page. <strong>Esc</strong> closes the game.</React.Fragment>}
                  </p>
                  <button type="button" onClick={() => setShowHelp(false)} className="btn-primary" style={{ marginTop: '16px' }}>Got it</button>
                </div>
              </div>
            )}
          </div>
          {side && enterBtn}
        </div>

        {/* Control deck: below the field, so it never covers a star */}
        {!side && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', background: isLight ? 'rgba(255,246,224,0.96)' : 'rgba(6,11,22,0.96)', borderTop: '1px solid var(--line)', flexShrink: 0 }}>
            {pad}
            {!compact && hint}
            {compact && <div style={{ flex: 1 }} />}
            {enterBtn}
          </div>
        )}

        {/* announced to screen readers when a star or island comes within reach */}
        <div className="sr-only" role="status" aria-live="polite">{nearLabel ? nearLabel + ' is in range. Press Enter to open it.' : ''}</div>
      </div>
    </div>
  );
}

window.SahajGame = Game;
