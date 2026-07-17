// Backdrops.jsx - the two hero worlds behind the home page.
//   Night = a fuller space simulation: dense pre-rendered starfield + colourful
//           nebulae + spiral galaxy, plus live Earth/moon, Saturn, Mars, a BIG
//           binary "colliding black holes" pair, a swirling wormhole, a pulsar
//           with sweeping beams, drifting asteroids, UFO, satellite, rocket,
//           comet and shooting stars. (No constellations.)
//   Day   = a calm, majestic voyage: bluer sky (no sun beams), flowing sea, a
//           sun-glitter path under the sun, SIDE-VIEW sea life that breaches and
//           dives (blue whale, orca pod, great-white pair, leaping dolphins),
//           drifting clouds & gulls, and a small ship that sails in from a random
//           side and docks at the island's port ("PhD dream").
// Perf (strict): heavy layers pre-render once per resize; both loops throttle to
//   ~32fps, cap DPR at 1.5, and pause when the tab is hidden or scrolled away.
const { useEffect, useRef } = React;
const BK_TAU = Math.PI * 2;
const FRAME_MS = 1000 / 32;
const SUN_X = 0.85, SUN_Y = 0.17;      // shared sun placement (glitter stays under it)

function drawMallaMark(g, cx, cy, size, ink) {
  g.save();
  g.translate(cx, cy); g.scale(size / 64, size / 64); g.translate(-32, -30);
  g.lineCap = 'round'; g.lineJoin = 'round';
  g.strokeStyle = ink; g.lineWidth = 3.4;
  g.beginPath(); g.moveTo(7, 53); g.lineTo(20, 21); g.lineTo(32, 40); g.lineTo(44, 21); g.lineTo(57, 53); g.stroke();
  g.strokeStyle = '#c9a84c'; g.lineWidth = 2.6;
  g.beginPath(); g.moveTo(24, 18); g.lineTo(40, 18); g.stroke();
  g.fillStyle = '#c9a84c';
  for (const [x, y, r] of [[24.5, 9, 1.9], [28.2, 6, 1.9], [32, 3, 2.3], [35.8, 6, 1.9], [39.5, 9, 1.9]]) { g.beginPath(); g.arc(x, y, r, 0, BK_TAU); g.fill(); }
  g.restore();
}

function makeRunner(canvas, drawFn) {
  let animId = 0, last = 0, visible = true;
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0 });
  io.observe(canvas);
  function loop(ts) {
    animId = requestAnimationFrame(loop);
    if (document.hidden || !visible) { last = ts; return; }
    if (ts - last < FRAME_MS) return;
    last = ts; drawFn(ts * 0.001);
  }
  return { start() { animId = requestAnimationFrame(loop); }, stop() { cancelAnimationFrame(animId); io.disconnect(); } };
}

/* ═══════════════════════════════════════════════ NIGHT: SPACE CANVAS */
function SpaceCanvas({ mobile }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const TWK_N = mobile ? 70 : 130;         // live twinkling stars (most stars are pre-rendered)

    let twinkle = [], asteroids = [];
    let shoot = null;
    let comet = { x: -200, y: 0, active: false };
    const ufo = { x: -120, y: 0 }, rocket = { x: 0, y: 0 }, sat = { x: -80, y: 0 };
    let P = {};
    const bgc = document.createElement('canvas');

    function rand(a, b) { return a + Math.random() * (b - a); }

    function makeBodies() {
      twinkle = [];
      for (let i = 0; i < TWK_N; i++) twinkle.push({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.09 + 0.02, phase: Math.random() * BK_TAU, ps: Math.random() * 0.02 + 0.005,
        big: i < (mobile ? 8 : 18), warm: Math.random() < 0.22,
      });
      asteroids = [];
      const AN = mobile ? 4 : 7;
      for (let i = 0; i < AN; i++) {
        const verts = [], n = 6 + (Math.random() * 3 | 0);
        for (let k = 0; k < n; k++) { const a = k / n * BK_TAU; const rr = rand(0.6, 1); verts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
        asteroids.push({ x: Math.random() * w, y: Math.random() * h, vx: rand(-0.5, 0.5) || 0.3, vy: rand(-0.2, 0.35), rot: rand(0, BK_TAU), vr: rand(-0.01, 0.01), size: rand(2.4, 6.5), verts });
      }
    }

    function nebula(b, cx, cy, R, hues, alpha) {
      for (let i = 0; i < 14; i++) {
        const ang = rand(0, BK_TAU), rad = Math.pow(Math.random(), 0.7) * R;
        const ox = cx + Math.cos(ang) * rad, oy = cy + Math.sin(ang) * rad * 0.72, rr = R * rand(0.28, 0.62);
        const hue = hues[(Math.random() * hues.length) | 0];
        const g = b.createRadialGradient(ox, oy, 0, ox, oy, rr);
        g.addColorStop(0, 'rgba(' + hue + ',' + (alpha * rand(0.7, 1.1)).toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + hue + ',0)');
        b.fillStyle = g; b.beginPath(); b.arc(ox, oy, rr, 0, BK_TAU); b.fill();
      }
      for (let i = 0; i < 3; i++) {
        const ox = cx + rand(-R * 0.3, R * 0.3), oy = cy + rand(-R * 0.24, R * 0.24), rr = R * rand(0.12, 0.24);
        const g = b.createRadialGradient(ox, oy, 0, ox, oy, rr);
        g.addColorStop(0, 'rgba(255,248,236,' + (alpha * 1.5).toFixed(3) + ')'); g.addColorStop(0.5, 'rgba(' + hues[0] + ',' + (alpha * 0.9).toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + hues[0] + ',0)');
        b.fillStyle = g; b.beginPath(); b.arc(ox, oy, rr, 0, BK_TAU); b.fill();
      }
      for (let i = 0; i < 20; i++) { b.globalAlpha = rand(0.3, 0.9); b.fillStyle = Math.random() < 0.3 ? '#ffe6c0' : '#eaf1ff'; b.beginPath(); b.arc(cx + rand(-R, R), cy + rand(-R * 0.7, R * 0.7), rand(0.4, 1.1), 0, BK_TAU); b.fill(); }
      b.globalAlpha = 1;
    }

    function renderDeepSky() {
      bgc.width = canvas.width; bgc.height = canvas.height;
      const b = bgc.getContext('2d'); b.setTransform(DPR, 0, 0, DPR, 0, 0);
      // milky-way band
      b.save(); b.translate(w * 0.5, h * 0.42); b.rotate(-0.42); b.scale(1, 0.32);
      const mg = b.createRadialGradient(0, 0, 0, 0, 0, w * 0.62);
      mg.addColorStop(0, 'rgba(150,175,255,0.14)'); mg.addColorStop(0.55, 'rgba(130,150,235,0.06)'); mg.addColorStop(1, 'rgba(130,150,235,0)');
      b.fillStyle = mg; b.beginPath(); b.arc(0, 0, w * 0.62, 0, BK_TAU); b.fill(); b.restore();
      const ca = Math.cos(-0.42), sa = Math.sin(-0.42), dustN = mobile ? 90 : 180;
      for (let i = 0; i < dustN; i++) {
        const d = rand(-0.62, 0.62) * w * 0.6, p = ((Math.random() + Math.random() + Math.random()) - 1.5) / 1.5 * h * 0.11;
        b.globalAlpha = rand(0.08, 0.4); b.fillStyle = '#c8d8ff';
        b.fillRect(w * 0.5 + ca * d - sa * p, h * 0.42 + sa * d + ca * p, rand(0.5, 1.2), rand(0.5, 1.2));
      }
      b.globalAlpha = 1;
      // dense static starfield ("more stars", free at runtime)
      const SN = mobile ? 320 : 620;
      for (let i = 0; i < SN; i++) {
        const a = rand(0.15, 0.8); b.globalAlpha = a;
        b.fillStyle = Math.random() < 0.18 ? '#ffe7c6' : (Math.random() < 0.2 ? '#cfe0ff' : '#ffffff');
        const r = Math.random() < 0.9 ? rand(0.3, 0.9) : rand(0.9, 1.5);
        b.beginPath(); b.arc(Math.random() * w, Math.random() * h, r, 0, BK_TAU); b.fill();
      }
      b.globalAlpha = 1;
      // colourful nebulae
      const S = Math.min(w, 1100);
      nebula(b, w * 0.62, h * 0.24, S * 0.24, ['236,84,142', '150,58,182', '68,120,236'], 0.11);
      nebula(b, w * 0.13, h * 0.66, S * 0.19, ['52,198,192', '58,120,224', '182,90,192'], 0.09);
      nebula(b, w * 0.86, h * 0.30, S * 0.15, ['242,172,72', '226,96,64', '152,70,152'], 0.075);
      nebula(b, w * 0.40, h * 0.10, S * 0.13, ['120,150,255', '196,120,224'], 0.06);
      // spiral galaxy (upper-left)
      const gx = w * 0.2, gy = h * 0.12, gr = mobile ? 15 : 22;
      const gg = b.createRadialGradient(gx, gy, 0, gx, gy, gr * 1.7);
      gg.addColorStop(0, 'rgba(232,226,255,0.55)'); gg.addColorStop(0.35, 'rgba(180,170,255,0.16)'); gg.addColorStop(1, 'rgba(180,170,255,0)');
      b.fillStyle = gg; b.beginPath(); b.arc(gx, gy, gr * 1.7, 0, BK_TAU); b.fill();
      b.save(); b.translate(gx, gy); b.rotate(0.5); b.scale(1, 0.42);
      b.strokeStyle = 'rgba(210,200,255,0.5)'; b.lineWidth = 1.1;
      b.beginPath(); b.arc(0, 0, gr * 0.55, 0.3, 3.4); b.stroke(); b.beginPath(); b.arc(0, 0, gr * 0.95, 3.3, 6.4); b.stroke(); b.restore();
      b.fillStyle = '#fff'; b.beginPath(); b.arc(gx, gy, 1.8, 0, BK_TAU); b.fill();
    }

    function resize() {
      const nw = canvas.offsetWidth, nh = canvas.offsetHeight; if (nw <= 0 || nh <= 0) return;
      w = nw; h = nh; canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      P = {
        earth:  { x: w * 0.90, y: h * 0.14, r: mobile ? 18 : 26 },
        saturn: { x: w * 0.085, y: h * 0.82, r: mobile ? 13 : 18 },
        mars:   { x: w * 0.045, y: h * 0.40, r: mobile ? 7 : 10 },
        bh:     { x: w * 0.5, y: h * 0.44, r: mobile ? 15 : 22 },
        worm:   { x: w * 0.90, y: h * 0.90, r: mobile ? 15 : 21 },
        pulsar: { x: w * 0.52, y: h * 0.085, r: mobile ? 2.4 : 3.2 },
      };
      ufo.y = h * 0.24; rocket.x = w * 0.72; rocket.y = h + 80; sat.y = h * 0.07;
      makeBodies(); renderDeepSky();
    }

    function drawTwinkle() {
      for (const s of twinkle) {
        s.phase += s.ps; const a = Math.max(0, Math.min(1, 0.3 + Math.sin(s.phase) * 0.35 + 0.35));
        if (s.big) { ctx.save(); ctx.globalAlpha = a * 0.5; ctx.fillStyle = s.warm ? '#ffd9a8' : '#9fbcff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 2.6, 0, BK_TAU); ctx.fill(); ctx.restore(); }
        ctx.globalAlpha = a; ctx.fillStyle = s.warm ? '#fff2df' : '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, BK_TAU); ctx.fill();
        s.y -= s.speed; if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; }
      }
      ctx.globalAlpha = 1;
    }

    function drawAsteroids() {
      for (const a of asteroids) {
        a.x += a.vx; a.y += a.vy; a.rot += a.vr;
        if (a.x < -20) a.x = w + 20; if (a.x > w + 20) a.x = -20; if (a.y < -20) a.y = h + 20; if (a.y > h + 20) a.y = -20;
        ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot);
        ctx.beginPath(); a.verts.forEach((v, i) => { const x = v[0] * a.size, y = v[1] * a.size; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
        ctx.fillStyle = '#6b6560'; ctx.fill(); ctx.strokeStyle = 'rgba(200,190,180,0.5)'; ctx.lineWidth = 0.6; ctx.stroke();
        ctx.fillStyle = 'rgba(40,36,32,0.6)'; ctx.beginPath(); ctx.arc(a.size * 0.2, a.size * 0.1, a.size * 0.22, 0, BK_TAU); ctx.fill();
        ctx.restore();
      }
    }

    function planet(x, y, r, c0, c1) { const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, BK_TAU); ctx.fill(); }

    function drawEarth(t) {
      const { x, y, r } = P.earth; const cy = y + Math.sin(t * 0.6) * 3;
      ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = '#508cff'; ctx.beginPath(); ctx.arc(x, cy, r * 1.7, 0, BK_TAU); ctx.fill(); ctx.restore();
      planet(x, cy, r, '#4a8ee8', '#0e2a55');
      ctx.fillStyle = '#2a7a3a'; ctx.beginPath(); ctx.arc(x - r*0.22, cy - r*0.3, r*0.36, 0, BK_TAU); ctx.fill(); ctx.beginPath(); ctx.arc(x + r*0.28, cy + r*0.2, r*0.26, 0, BK_TAU); ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x - r*0.1, cy - r*0.46, r*0.4, r*0.1, 0.3, 0, BK_TAU); ctx.fill(); ctx.restore();
      const mr = r * 2.1, ma = t * 0.7; planet(x + Math.cos(ma) * mr, cy + Math.sin(ma) * mr * 0.5, r * 0.26, '#d8d8e0', '#75758a');
    }
    function drawSaturn() {
      const { x, y, r } = P.saturn;
      ctx.save(); ctx.strokeStyle = 'rgba(200,158,78,0.4)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y, r * 2.2, r * 0.4, 0.32, Math.PI, 0); ctx.stroke(); ctx.restore();
      planet(x, y, r, '#f0c070', '#a05f28');
      ctx.save(); ctx.strokeStyle = 'rgba(210,170,90,0.75)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y, r * 2.2, r * 0.4, 0.32, 0, Math.PI); ctx.stroke(); ctx.restore();
    }
    function drawMars() { const { x, y, r } = P.mars; planet(x, y, r, '#e07a4a', '#7a2f18'); }

    // BIG binary "colliding black holes": two cores orbiting, shared hot accretion + lensing
    function drawBlackHoles(t) {
      const { x, y, r } = P.bh; const orb = r * 0.85, ang = t * 0.9, spin = 0.8 + Math.sin(t * 2) * 0.2;
      ctx.save();
      // shared accretion glow
      const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 2.6);
      halo.addColorStop(0, 'rgba(255,180,90,' + (0.28 * spin).toFixed(3) + ')'); halo.addColorStop(0.45, 'rgba(200,90,220,0.16)'); halo.addColorStop(1, 'rgba(120,40,180,0)');
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, BK_TAU); ctx.fill();
      // whirling accretion disk (lensing ring)
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang * 0.5); ctx.scale(1, 0.42);
      ctx.strokeStyle = 'rgba(255,210,150,0.7)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(0, 0, r * 1.7, 0, BK_TAU); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,140,80,0.5)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(0, 0, r * 2.1, 0, BK_TAU); ctx.stroke(); ctx.restore();
      // two black cores
      for (const s of [0, Math.PI]) {
        const bx = x + Math.cos(ang + s) * orb, by = y + Math.sin(ang + s) * orb * 0.5;
        const cg = ctx.createRadialGradient(bx, by, 0, bx, by, r * 0.9);
        cg.addColorStop(0, '#000'); cg.addColorStop(0.7, '#000'); cg.addColorStop(1, 'rgba(255,150,70,0.6)');
        ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(bx, by, r * 0.62, 0, BK_TAU); ctx.fill();
      }
      ctx.restore();
    }

    // swirling wormhole: nested rotating rings receding into a bright throat
    function drawWormhole(t) {
      const { x, y, r } = P.worm;
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.5); ctx.scale(1, 0.6);
      for (let i = 6; i >= 1; i--) {
        const rr = r * (i / 6); ctx.globalAlpha = 0.5 - i * 0.05;
        ctx.strokeStyle = i % 2 ? 'rgba(90,220,235,0.9)' : 'rgba(150,110,255,0.9)'; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.arc(0, 0, rr, 0, BK_TAU); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.42);
      core.addColorStop(0, 'rgba(235,250,255,0.95)'); core.addColorStop(0.6, 'rgba(120,200,255,0.5)'); core.addColorStop(1, 'rgba(120,200,255,0)');
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(0, 0, r * 0.42, 0, BK_TAU); ctx.fill();
      // faint inward spiral
      ctx.strokeStyle = 'rgba(200,235,255,0.4)'; ctx.lineWidth = 1; ctx.beginPath();
      for (let a = 0; a < 10; a += 0.3) { const rr = r * (1 - a / 10); const px = Math.cos(a * 2) * rr, py = Math.sin(a * 2) * rr; a ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke(); ctx.restore();
    }

    // pulsar: bright neutron star with two sweeping beams + rapid pulse
    function drawPulsar(t) {
      const { x, y, r } = P.pulsar; const pulse = 0.55 + Math.abs(Math.sin(t * 5)) * 0.45, ang = t * 0.9;
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      for (const dir of [0, Math.PI]) {
        ctx.save(); ctx.rotate(dir);
        const bl = mobile ? 90 : 150; const g = ctx.createLinearGradient(0, 0, 0, -bl);
        g.addColorStop(0, 'rgba(150,220,255,' + (0.28 * pulse).toFixed(3) + ')'); g.addColorStop(1, 'rgba(150,220,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-6, -bl); ctx.lineTo(6, -bl); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      ctx.restore();
      const cg = ctx.createRadialGradient(x, y, 0, x, y, r * 3 * pulse);
      cg.addColorStop(0, 'rgba(230,245,255,' + pulse.toFixed(3) + ')'); cg.addColorStop(1, 'rgba(150,210,255,0)');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(x, y, r * 3 * pulse, 0, BK_TAU); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r, 0, BK_TAU); ctx.fill();
    }

    function drawUFO(t) {
      ufo.x += 0.22; if (ufo.x > w + 110) ufo.x = -110;
      const x = ufo.x, y = ufo.y + Math.sin(t * 1.8) * 4;
      ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#00ff64'; ctx.beginPath(); ctx.arc(x, y, 30, 0, BK_TAU); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#7a8a9c'; ctx.beginPath(); ctx.ellipse(x, y + 4, 19, 7, 0, 0, BK_TAU); ctx.fill();
      ctx.fillStyle = 'rgba(150,220,255,0.6)'; ctx.beginPath(); ctx.ellipse(x, y - 1, 10, 8, 0, Math.PI, 0); ctx.fill();
      for (let i = 0; i < 3; i++) { ctx.fillStyle = Math.sin(t * 5 + i * 1.2) > 0 ? '#00ff88' : '#024'; ctx.beginPath(); ctx.arc(x - 11 + i * 11, y + 4, 2, 0, BK_TAU); ctx.fill(); }
    }
    function drawSat(t) {
      sat.x += 0.4; if (sat.x > w + 60) sat.x = -60; const x = sat.x, y = sat.y + Math.sin(t) * 3;
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#c8d0e0'; ctx.fillRect(-3, -3, 6, 6);
      ctx.fillStyle = '#2a64c8'; ctx.fillRect(-12, -2.5, 7, 5); ctx.fillRect(5, -2.5, 7, 5);
      ctx.strokeStyle = '#9fb0c8'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-12, 0); ctx.moveTo(5, 0); ctx.lineTo(12, 0); ctx.stroke(); ctx.restore();
    }
    function drawRocket(t) {
      rocket.y -= 0.16; if (rocket.y < -90) rocket.y = h + 80; const x = rocket.x + Math.sin(t * 1.4) * 2, y = rocket.y;
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#dde4f0'; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-7, 6); ctx.lineTo(7, 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ff4444'; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-3.5, -12); ctx.lineTo(3.5, -12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#4488ff'; ctx.beginPath(); ctx.arc(0, -6, 3.4, 0, BK_TAU); ctx.fill();
      ctx.fillStyle = '#cc3333'; ctx.beginPath(); ctx.moveTo(-7, 6); ctx.lineTo(-13, 13); ctx.lineTo(-7, 10); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(7, 6); ctx.lineTo(13, 13); ctx.lineTo(7, 10); ctx.closePath(); ctx.fill();
      const fh = 9 + Math.sin(t * 14) * 3; ctx.fillStyle = 'rgba(255,160,40,0.85)'; ctx.beginPath(); ctx.moveTo(-4, 7); ctx.lineTo(0, 7 + fh); ctx.lineTo(4, 7); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    function drawComet(t) {
      if (!comet.active) { if (Math.random() < 0.0025) { comet.active = true; comet.x = -40; comet.y = rand(h * 0.1, h * 0.5); } return; }
      comet.x += 3.2; if (comet.x > w + 60) comet.active = false; const x = comet.x, y = comet.y + comet.x * 0.12;
      const grad = ctx.createLinearGradient(x, y, x - 70, y - 9); grad.addColorStop(0, 'rgba(180,220,255,0.9)'); grad.addColorStop(1, 'rgba(180,220,255,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 70, y - 9); ctx.stroke();
      ctx.fillStyle = '#dff0ff'; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, BK_TAU); ctx.fill();
    }
    function drawShoot() {
      if (!shoot) { if (Math.random() < 0.005) shoot = { x: rand(0, w * 0.7), y: rand(0, h * 0.25), vx: rand(7, 13), vy: rand(3, 6), life: 55 }; return; }
      const a = shoot.life / 55; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#ffffc8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - shoot.vx * 9, shoot.y - shoot.vy * 9); ctx.stroke(); ctx.restore();
      shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.life--; if (shoot.life <= 0) shoot = null;
    }

    function drawScene(t) {
      if (!bgc.width) return;
      ctx.clearRect(0, 0, w, h); ctx.drawImage(bgc, 0, 0, w, h);
      drawTwinkle(); drawAsteroids();
      drawEarth(t); drawSaturn(); drawMars();
      drawBlackHoles(t); drawWormhole(t); drawPulsar(t);
      if (!mobile) { drawUFO(t); drawSat(t); }
      drawRocket(t); drawComet(t); drawShoot();
    }
    function drawStatic() {
      if (!bgc.width) return; ctx.clearRect(0, 0, w, h); ctx.drawImage(bgc, 0, 0, w, h);
      for (const s of twinkle) { ctx.globalAlpha = 0.7; ctx.fillStyle = s.warm ? '#fff2df' : '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, BK_TAU); ctx.fill(); }
      ctx.globalAlpha = 1; drawEarth(0); drawSaturn(); drawMars(); drawBlackHoles(0); drawWormhole(0); drawPulsar(0);
    }

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) drawStatic(); }); ro.observe(canvas);
    drawStatic();
    const runner = makeRunner(canvas, drawScene); if (!reduce) runner.start();
    return () => { runner.stop(); ro.disconnect(); };
  }, [mobile]);

  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />;
}

/* ═══════════════════════════════════════════════ DAY: OPEN-SEA CANVAS */
function DayCanvas({ mobile }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    const HOR = 0.60;

    let clouds = [], gulls = [], foam = [], creatures = [], farBoats = [], seaGrad = null;
    const ship = { x: 0, y: 0, face: -1, anchored: false, t0: null, spawnX: 0 };
    let islandX = 0, islandY = 0, dockSide = 1, anchorX = 0, anchorY = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function makeScene() {
      seaGrad = ctx.createLinearGradient(0, h * HOR, 0, h);
      seaGrad.addColorStop(0, '#8fc4d8'); seaGrad.addColorStop(0.28, '#63a9c8'); seaGrad.addColorStop(0.62, '#3f8bb4'); seaGrad.addColorStop(1, '#2b6f9c');

      clouds = [];
      const CN = mobile ? 6 : 10;                       // more clouds, random
      for (let i = 0; i < CN; i++) clouds.push({
        x: Math.random() * w, y: h * rand(0.03, 0.36), v: rand(0.03, 0.13), s: rand(0.7, 1.8),
        puffs: [[0,0,15],[13,-6,11],[26,1,13],[11,5,12],[-12,3,10]].map(p => [p[0]+rand(-3,3), p[1]+rand(-3,3), p[2]*rand(0.8,1.2)]),
      });
      gulls = [];
      const BN = mobile ? 5 : 9;
      for (let i = 0; i < BN; i++) gulls.push({ x: Math.random() * w, y: h * rand(0.08, 0.42), v: rand(0.28, 0.5) * (Math.random() < 0.3 ? -1 : 1), s: rand(0.7, 1.3), ph: rand(0, BK_TAU) });
      foam = [];
      for (let i = 0; i < (mobile ? 14 : 24); i++) foam.push({ x: Math.random() * w, y: h * rand(HOR + 0.05, 0.99), r: rand(0.8, 1.8), ph: rand(0, BK_TAU) });
      // distant sailboats on the horizon — depth & majesty
      farBoats = [{ x: w * 0.66, s: mobile ? 0.7 : 1 }, { x: w * 0.5, s: mobile ? 0.5 : 0.7 }];

      // SIDE-VIEW sea life — full bodies that breach & dive; staggered jump phases
      const sc = mobile ? 0.74 : 1; const C = [];
      function add(kind, x, by, v, dir, s, opt) { C.push(Object.assign({ kind, x, baseY: h * by, v, dir, s: s * sc, ph: rand(0, 9), jph: rand(0, 9) }, opt)); }
      add('whale', w * 0.60, HOR + 0.18, 0.10, 1, 1.12, { jr: 0.14, period: 999, airTime: 0, jumpH: 0 });
      for (let i = 0; i < 4; i++) add('dolphin', w * (0.30 + i * 0.06), HOR + 0.26, 0.6, 1, 0.5, { jr: 1, period: 5.5, airTime: 1.1, jumpH: 34, maxAng: 1.0 });
      for (let i = 0; i < 3; i++) add('orca', w * (0.40 + i * 0.07), HOR + 0.12, 0.4, -1, 0.72, { jr: 1, period: 8, airTime: 1.3, jumpH: 30, maxAng: 0.85 });
      add('shark', w * 0.22, HOR + 0.22, 0.24, 1, 0.82, { jr: 1, period: 14, airTime: 1.0, jumpH: 16, maxAng: 0.5 });   // lone great white (they hunt solo)
      creatures = C;

      // island CENTERED — the ship sails an equal distance from whichever side it enters
      islandX = w * 0.5;
      islandY = h * (HOR + 0.30);
      if (mobile) {
        // lift the island/boat to sit just above the PhD/Research buttons with a margin
        const cta = document.getElementById('home-ctas'), cv = canvas.getBoundingClientRect();
        if (cta && cv.height) {
          const r = cta.getBoundingClientRect();
          islandY = Math.max(h * (HOR + 0.05), Math.min(h * 0.9, (r.top - cv.top) - 46));
        }
      }
      const fromRight = Math.random() < 0.5; dockSide = fromRight ? 1 : -1;
      anchorX = islandX + dockSide * (mobile ? 66 : 100); anchorY = islandY - 2;
      ship.x = fromRight ? w + 130 : -130; ship.y = anchorY; ship.face = fromRight ? -1 : 1; ship.anchored = false; ship.t0 = null; ship.spawnX = ship.x;
    }

    function resize() {
      const nw = canvas.offsetWidth, nh = canvas.offsetHeight; if (nw <= 0 || nh <= 0) return;
      w = nw; h = nh; canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      makeScene();
    }

    function drawOcean(t) {
      const y0 = h * HOR; ctx.fillStyle = seaGrad; ctx.fillRect(0, y0, w, h - y0);
      const bands = [
        { y: HOR + 0.12, amp: 6,  len: 0.8,  sp: 0.5,  col: 'rgba(60,140,172,0.32)' },
        { y: HOR + 0.24, amp: 10, len: 0.6,  sp: 0.65, col: 'rgba(44,118,156,0.33)' },
        { y: HOR + 0.42, amp: 15, len: 0.44, sp: 0.55, col: 'rgba(32,98,138,0.35)' },
        { y: HOR + 0.66, amp: 22, len: 0.32, sp: 0.7,  col: 'rgba(22,80,120,0.37)' },
      ];
      for (const bnd of bands) {
        const by = h * bnd.y, k = (BK_TAU / (w * bnd.len)); ctx.fillStyle = bnd.col; ctx.beginPath(); ctx.moveTo(0, by);
        for (let x = 0; x <= w; x += 14) ctx.lineTo(x, by + Math.sin(x * k + t * bnd.sp) * bnd.amp);
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
      }
      const hz = ctx.createLinearGradient(0, y0, 0, y0 + 34); hz.addColorStop(0, 'rgba(226,240,246,0.7)'); hz.addColorStop(1, 'rgba(226,240,246,0)');
      ctx.fillStyle = hz; ctx.fillRect(0, y0, w, 34);
    }

    function drawSunGlitter(t) {
      const y0 = h * HOR, sx = w * SUN_X;
      const N = mobile ? 18 : 30;
      for (let i = 0; i < N; i++) {
        const p = i / N, yy = y0 + p * (h - y0), spread = 6 + p * (mobile ? 66 : 126);
        const gx = sx + (((i * 53) % 100) / 100 - 0.5) * 2 * spread; const tw = Math.max(0, Math.sin(t * 0.6 + i * 1.3)); const a = tw * (0.3 - p * 0.22);
        if (a < 0.03) continue; const len = 4 + p * 18 + tw * 5;
        ctx.strokeStyle = 'rgba(255,236,158,' + a.toFixed(3) + ')'; ctx.lineWidth = 1 + p * 1.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(gx - len / 2, yy); ctx.lineTo(gx + len / 2, yy); ctx.stroke();
      }
    }

    function crestLine(yBase, phase, alpha, amp, s) {
      ctx.strokeStyle = 'rgba(255,252,244,' + alpha + ')'; ctx.lineWidth = 1.5; ctx.beginPath();
      const off = -(phase % s) - s; for (let x = off; x < w + s; x += s) { ctx.moveTo(x, yBase); ctx.quadraticCurveTo(x + s / 2, yBase - amp, x + s, yBase); } ctx.stroke();
    }
    function drawFoam(t) {
      ctx.fillStyle = 'rgba(255,253,246,0.6)';
      for (const f of foam) { ctx.globalAlpha = 0.26 + Math.max(0, Math.sin(t * 1.1 + f.ph)) * 0.4; ctx.beginPath(); ctx.arc(((f.x + t * 6) % (w + 20)) - 10, f.y, f.r, 0, BK_TAU); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    function splash(x, y, s) {
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * 3 * s, y); ctx.lineTo(x + i * 5 * s, y - (7 - Math.abs(i) * 1.6) * s); ctx.stroke(); }
    }

    /* side-view bodies drawn facing +x, centred on the local waterline (back is -y) */
    function bodyDolphin(s) {
      ctx.fillStyle = '#5b7183'; ctx.strokeStyle = '#3f5262'; ctx.lineWidth = 0.9 * s;
      ctx.beginPath(); ctx.moveTo(23*s,-1*s); ctx.quadraticCurveTo(10*s,-9*s,-6*s,-8*s); ctx.quadraticCurveTo(-22*s,-6*s,-30*s,-1*s);
      ctx.quadraticCurveTo(-22*s,3*s,-6*s,5*s); ctx.quadraticCurveTo(10*s,6*s,23*s,-1*s); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c8d4db'; ctx.beginPath(); ctx.moveTo(-4*s,4.4*s); ctx.quadraticCurveTo(9*s,5.4*s,20*s,-0.5*s); ctx.quadraticCurveTo(9*s,2.6*s,-4*s,2.8*s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#5b7183'; ctx.beginPath(); ctx.moveTo(-2*s,-7*s); ctx.quadraticCurveTo(4*s,-16*s,10*s,-8*s); ctx.quadraticCurveTo(4*s,-7*s,-2*s,-7*s); ctx.fill(); // dorsal
      ctx.beginPath(); ctx.moveTo(-28*s,-1*s); ctx.quadraticCurveTo(-34*s,-8*s,-38*s,-7*s); ctx.quadraticCurveTo(-32*s,-1*s,-38*s,6*s); ctx.quadraticCurveTo(-33*s,0,-28*s,-1*s); ctx.closePath(); ctx.fill(); // crescent fluke
      ctx.fillStyle = '#22303a'; ctx.beginPath(); ctx.arc(15*s,-3*s,1*s,0,BK_TAU); ctx.fill();
    }
    function bodyOrca(s) {
      ctx.fillStyle = '#14171e'; ctx.strokeStyle = '#05070b'; ctx.lineWidth = 0.9 * s;
      ctx.beginPath(); ctx.moveTo(29*s,-1*s); ctx.quadraticCurveTo(12*s,-11*s,-6*s,-9*s); ctx.quadraticCurveTo(-24*s,-7*s,-33*s,-1*s);
      ctx.quadraticCurveTo(-24*s,4*s,-6*s,6*s); ctx.quadraticCurveTo(12*s,6*s,29*s,-1*s); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#eef4ff'; ctx.beginPath(); ctx.ellipse(6*s,5*s,13*s,2.4*s,0,0,BK_TAU); ctx.fill(); // belly
      ctx.beginPath(); ctx.ellipse(16*s,-4*s,3.2*s,1.9*s,0,0,BK_TAU); ctx.fill(); // eye patch
      ctx.fillStyle = '#3a4552'; ctx.beginPath(); ctx.ellipse(-11*s,-3*s,6*s,3*s,0,0,BK_TAU); ctx.fill(); // saddle
      ctx.fillStyle = '#14171e'; ctx.beginPath(); ctx.moveTo(-2*s,-8*s); ctx.quadraticCurveTo(3*s,-22*s,11*s,-9*s); ctx.quadraticCurveTo(4*s,-8*s,-2*s,-8*s); ctx.fill(); // tall dorsal
      ctx.beginPath(); ctx.moveTo(-31*s,-1*s); ctx.quadraticCurveTo(-38*s,-9*s,-42*s,-8*s); ctx.quadraticCurveTo(-35*s,-1*s,-42*s,7*s); ctx.quadraticCurveTo(-36*s,0,-31*s,-1*s); ctx.closePath(); ctx.fill(); // fluke
    }
    function bodyShark(s) {
      const g = ctx.createLinearGradient(0, -10*s, 0, 10*s); g.addColorStop(0, '#8894a0'); g.addColorStop(0.55, '#6b7884'); g.addColorStop(1, '#e7ecef');
      ctx.fillStyle = g; ctx.strokeStyle = '#4a5560'; ctx.lineWidth = 0.9 * s;
      ctx.beginPath(); ctx.moveTo(32*s,0); ctx.quadraticCurveTo(12*s,-8*s,-6*s,-7*s); ctx.quadraticCurveTo(-22*s,-5*s,-30*s,-1*s);
      ctx.quadraticCurveTo(-22*s,2*s,-6*s,5*s); ctx.quadraticCurveTo(12*s,5*s,32*s,0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#5b6772'; ctx.beginPath(); ctx.moveTo(-1*s,-6*s); ctx.quadraticCurveTo(4*s,-19*s,12*s,-7*s); ctx.quadraticCurveTo(4*s,-6*s,-1*s,-6*s); ctx.fill(); // dorsal
      ctx.beginPath(); ctx.moveTo(7*s,4*s); ctx.lineTo(3*s,13*s); ctx.lineTo(13*s,5*s); ctx.closePath(); ctx.fill(); // pectoral
      ctx.beginPath(); ctx.moveTo(-28*s,-1*s); ctx.quadraticCurveTo(-34*s,-9*s,-40*s,-12*s); ctx.quadraticCurveTo(-33*s,-2*s,-38*s,7*s); ctx.quadraticCurveTo(-33*s,0,-28*s,-1*s); ctx.closePath(); ctx.fill(); // crescent caudal (upper lobe longer)
      ctx.fillStyle = '#1c2229'; ctx.beginPath(); ctx.arc(21*s,-2*s,1*s,0,BK_TAU); ctx.fill();
    }
    function bodyWhale(s, t) {
      const g = ctx.createLinearGradient(0, -14*s, 0, 12*s); g.addColorStop(0, '#5b83a2'); g.addColorStop(0.5, '#3f6a8a'); g.addColorStop(1, '#8fb0c8');
      ctx.fillStyle = g; ctx.strokeStyle = '#2a4d68'; ctx.lineWidth = 1 * s;
      ctx.beginPath(); ctx.moveTo(58*s,-2*s); ctx.quadraticCurveTo(24*s,-14*s,-8*s,-12*s); ctx.quadraticCurveTo(-42*s,-9*s,-58*s,-2*s);
      ctx.quadraticCurveTo(-42*s,3*s,-8*s,9*s); ctx.quadraticCurveTo(24*s,9*s,58*s,-2*s); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#33597a'; ctx.beginPath(); ctx.moveTo(-22*s,-9*s); ctx.quadraticCurveTo(-17*s,-16*s,-11*s,-9*s); ctx.fill(); // small dorsal
      ctx.fillStyle = '#2a4d68'; ctx.beginPath(); ctx.moveTo(-55*s,-2*s); ctx.quadraticCurveTo(-64*s,-10*s,-70*s,-9*s); ctx.quadraticCurveTo(-62*s,-2*s,-70*s,7*s); ctx.quadraticCurveTo(-63*s,0,-55*s,-2*s); ctx.closePath(); ctx.fill(); // broad fluke
      ctx.fillStyle = '#8fb0c8'; ctx.beginPath(); ctx.moveTo(20*s,5*s); ctx.quadraticCurveTo(10*s,16*s,2*s,7*s); ctx.fill(); // flipper
      ctx.fillStyle = '#22303a'; ctx.beginPath(); ctx.arc(46*s,-4*s,1.4*s,0,BK_TAU); ctx.fill();
      if (Math.sin(t * 0.5) > 0.5) { const bh = 16*s; const sp = ctx.createLinearGradient(52*s,-6*s,52*s,-6*s-bh); sp.addColorStop(0,'rgba(255,255,255,0.6)'); sp.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle = sp; ctx.beginPath(); ctx.ellipse(52*s,-6*s-bh/2,4*s,bh/2,0,0,BK_TAU); ctx.fill(); }
    }

    function drawCreature(c, t) {
      c.x += c.v * c.dir; const m = c.s * 90; if (c.dir > 0 && c.x > w + m) c.x = -m; if (c.dir < 0 && c.x < -m) c.x = w + m;
      let arc = 0, ang = 0, air = false, p = 0;
      if (c.kind !== 'whale') { const cyc = (t * (c.jr || 1) * 0.3 + c.jph) % c.period; air = cyc < c.airTime; p = air ? cyc / c.airTime : 0; arc = air ? Math.sin(p * Math.PI) : 0; ang = air ? -Math.cos(p * Math.PI) * c.maxAng * c.dir : Math.sin(t + c.ph) * 0.05; }
      else ang = Math.sin(t * 0.5 + c.ph) * 0.04;
      const cy = c.baseY - arc * c.jumpH * c.s;
      const solid = arc > 0.04 || c.kind === 'whale';
      // shadow / ripple at the waterline
      ctx.save(); ctx.globalAlpha = 0.14 - arc * 0.1; ctx.fillStyle = '#0a2a44';
      ctx.beginPath(); ctx.ellipse(c.x, c.baseY + 3, (c.kind === 'whale' ? 54 : 24) * c.s, 6 * c.s, 0, 0, BK_TAU); ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(c.x, cy); ctx.scale(c.dir, 1); ctx.rotate(ang * c.dir);
      ctx.globalAlpha = solid ? 1 : 0.6;
      if (c.kind === 'dolphin') bodyDolphin(c.s); else if (c.kind === 'orca') bodyOrca(c.s); else if (c.kind === 'shark') bodyShark(c.s); else bodyWhale(c.s, t);
      ctx.restore(); ctx.globalAlpha = 1;
      if (air && (p < 0.14 || p > 0.86)) splash(c.x, c.baseY, c.s * 1.2);
      // a crisp fin cutting the surface while cruising
      if (!air && c.kind !== 'whale') { ctx.fillStyle = c.kind === 'orca' ? '#14171e' : c.kind === 'shark' ? '#5b6772' : '#5b7183'; const fh = (c.kind === 'orca' ? 12 : 8) * c.s; ctx.beginPath(); ctx.moveTo(c.x - 4 * c.s, c.baseY); ctx.quadraticCurveTo(c.x + 1, c.baseY - fh, c.x + 5 * c.s, c.baseY); ctx.quadraticCurveTo(c.x, c.baseY + 1, c.x - 4 * c.s, c.baseY); ctx.fill(); }
    }

    function drawFarBoat(b, t) {
      const y = h * HOR - 1; ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = '#3a5a72';
      ctx.beginPath(); ctx.moveTo(b.x - 9 * b.s, y); ctx.quadraticCurveTo(b.x, y + 3 * b.s, b.x + 9 * b.s, y); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(b.x, y); ctx.lineTo(b.x, y - 12 * b.s); ctx.lineTo(b.x + 7 * b.s, y); ctx.closePath(); ctx.fill(); ctx.restore();
    }

    function drawIsland(t) {
      const x = islandX, y = islandY;
      const glow = 0.5 + Math.sin(t * 1.1) * 0.18;
      ctx.save(); ctx.globalAlpha = 0.5 * glow; const gg = ctx.createRadialGradient(x, y - 14, 0, x, y - 14, 66); gg.addColorStop(0, 'rgba(255,226,150,0.9)'); gg.addColorStop(1, 'rgba(255,226,150,0)'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y - 14, 66, 0, BK_TAU); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#7ab08a'; ctx.strokeStyle = '#4f8562'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - 34, y); ctx.quadraticCurveTo(x - 18, y - 26, x - 2, y - 14); ctx.quadraticCurveTo(x + 12, y - 30, x + 34, y); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#e9d7a4'; ctx.beginPath(); ctx.ellipse(x, y, 40, 6, 0, 0, BK_TAU); ctx.fill();
      // little wooden port/pier on the dock side
      ctx.strokeStyle = '#7a4a1e'; ctx.lineWidth = 2;
      const px = x + dockSide * 30; ctx.beginPath(); ctx.moveTo(x + dockSide * 12, y + 1); ctx.lineTo(px + dockSide * 20, y + 2); ctx.stroke();
      ctx.lineWidth = 1.4; for (let i = 0; i < 3; i++) { const px2 = px + dockSide * i * 8; ctx.beginPath(); ctx.moveTo( px2, y + 1); ctx.lineTo( px2, y + 6); ctx.stroke(); }
      // palm
      ctx.strokeStyle = '#6b4423'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 6, y - 2); ctx.quadraticCurveTo(x + 10, y - 16, x + 8, y - 26); ctx.stroke();
      ctx.strokeStyle = '#4e7a44'; ctx.lineWidth = 1.5; const tx = x + 8, ty = y - 26;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + 11, ty - 3, tx + 15, ty + 3); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx - 10, ty - 3, tx - 13, ty + 3); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + 7, ty - 10, tx + 12, ty - 9); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx - 6, ty - 10, tx - 10, ty - 8); ctx.stroke();
      ctx.fillStyle = 'rgba(255,250,240,0.96)'; ctx.textAlign = 'center'; ctx.font = "italic 700 " + (mobile ? 12 : 14) + "px 'Times New Roman', Georgia, serif";
      ctx.save(); ctx.shadowColor = 'rgba(20,60,90,0.6)'; ctx.shadowBlur = 4; ctx.fillText('PhD dream', x, y - 40); ctx.restore();
    }

    function drawMe(t) {
      const wave = Math.sin(t * 4) * 0.5; ctx.save(); ctx.translate(4, -18);
      ctx.strokeStyle = '#2f4363'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-2, 2); ctx.lineTo(-3, 8); ctx.moveTo(2, 2); ctx.lineTo(3, 8); ctx.stroke();
      ctx.fillStyle = '#e6ddc8'; ctx.beginPath(); ctx.ellipse(0, -2, 4.4, 5.2, 0, 0, BK_TAU); ctx.fill();
      ctx.strokeStyle = '#e6ddc8'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(3, -3); ctx.lineTo(7, -8 - wave * 2); ctx.stroke();
      ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.arc(7, -8 - wave * 2, 1.5, 0, BK_TAU); ctx.fill();
      ctx.strokeStyle = '#e6ddc8'; ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(-6, 2); ctx.stroke();
      ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.arc(0, -9, 3.9, 0, BK_TAU); ctx.fill();
      ctx.fillStyle = '#1c2b4a'; ctx.beginPath(); ctx.ellipse(0, -12, 4.4, 1.7, 0, 0, BK_TAU); ctx.fill(); ctx.fillRect(-4.4, -13, 8.8, 2.6); ctx.fillStyle = '#c9a84c'; ctx.fillRect(-4.4, -11, 8.8, 0.9); ctx.restore();
    }

    function drawShip(t) {
      if (!ship.anchored) {
        // time-based voyage (frame-rate independent): glide in over ~8s, then dock
        if (ship.t0 == null && t > 0) { ship.t0 = t; ship.spawnX = ship.x; }
        const p = ship.t0 == null ? 0 : Math.min(1, (t - ship.t0) / 8);
        const e = 1 - Math.pow(1 - p, 3);                 // ease-out
        ship.x = ship.spawnX + (anchorX - ship.spawnX) * e;
        ship.face = Math.sign(anchorX - ship.spawnX) || -1;
        if (p >= 1) ship.anchored = true;
      }
      const x = ship.x, y = ship.y + Math.sin(t * 0.7) * 2.5, k = (mobile ? 0.55 : 0.85);
      const roll = Math.sin(t * 0.7 + 1) * 0.03, wob = Math.sin(t * 2.4) * 2;
      ctx.save(); ctx.translate(x, y); ctx.rotate(roll); ctx.scale(ship.face * k, k);
      if (!ship.anchored) { ctx.strokeStyle = 'rgba(255,253,245,0.5)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-46, 6); ctx.quadraticCurveTo(-70, 10, -92, 6); ctx.moveTo(-44, 10); ctx.quadraticCurveTo(-62, 15, -80, 13); ctx.stroke(); }
      // hull — a smooth sunny sailing-boat hull with a boot stripe & portholes
      const hg = ctx.createLinearGradient(0, -10, 0, 15); hg.addColorStop(0, '#efb043'); hg.addColorStop(0.5, '#d6902a'); hg.addColorStop(1, '#a9691a');
      ctx.beginPath(); ctx.moveTo(-50, -9); ctx.quadraticCurveTo(-58, 6, -38, 12); ctx.quadraticCurveTo(2, 16, 36, 13); ctx.quadraticCurveTo(56, 11, 68, -8); ctx.lineTo(48, -11); ctx.quadraticCurveTo(0, -14, -50, -9); ctx.closePath();
      ctx.fillStyle = hg; ctx.strokeStyle = '#6f4310'; ctx.lineWidth = 1.8; ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#5f3c14'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-46, 7); ctx.quadraticCurveTo(0, 11, 46, 6); ctx.stroke();                     // boot stripe
      ctx.strokeStyle = 'rgba(255,246,222,0.95)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-48, -8); ctx.quadraticCurveTo(0, -12, 54, -9); ctx.stroke();      // cream rail
      ctx.fillStyle = '#3c2a12'; ctx.strokeStyle = 'rgba(255,240,200,0.7)'; ctx.lineWidth = 0.7;
      for (const px of [-30, -16, -2]) { ctx.beginPath(); ctx.arc(px, -1, 2.1, 0, BK_TAU); ctx.fill(); ctx.stroke(); }                                              // portholes
      ctx.strokeStyle = '#5f3c14'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(60, -9); ctx.lineTo(86, -16); ctx.stroke();             // bowsprit
      ctx.strokeStyle = '#6b4419'; ctx.lineWidth = 2.8; ctx.beginPath(); ctx.moveTo(-6, -12); ctx.lineTo(-6, -100); ctx.stroke();                                   // mast
      ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-6, -40); ctx.lineTo(-42, -34); ctx.moveTo(-6, -86); ctx.lineTo(-36, -76); ctx.stroke();                       // boom + gaff
      ctx.strokeStyle = 'rgba(90,66,30,0.55)'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(-6, -100); ctx.lineTo(86, -16); ctx.moveTo(-6, -100); ctx.lineTo(-50, -9); ctx.stroke();  // stays
      // jib (headsail on the forestay)
      ctx.beginPath(); ctx.moveTo(-6, -82); ctx.lineTo(84, -16); ctx.lineTo(22, -14); ctx.quadraticCurveTo(4, -46 + wob, -6, -82); ctx.closePath();
      const jg = ctx.createLinearGradient(-6, -82, 44, -16); jg.addColorStop(0, '#fefaf0'); jg.addColorStop(1, '#e6dabd'); ctx.fillStyle = jg; ctx.strokeStyle = '#b09666'; ctx.lineWidth = 1.1; ctx.fill(); ctx.stroke();
      // gaff mainsail (billowed) with the Malla mark
      ctx.beginPath(); ctx.moveTo(-6, -84); ctx.quadraticCurveTo(-28, -80 + wob, -36, -76); ctx.lineTo(-42, -34); ctx.quadraticCurveTo(-26, -30 + wob, -6, -38); ctx.closePath();
      const sg = ctx.createLinearGradient(-6, -84, -30, -36); sg.addColorStop(0, '#fefaf0'); sg.addColorStop(1, '#e9ddc2'); ctx.fillStyle = sg; ctx.strokeStyle = '#b09666'; ctx.lineWidth = 1.3; ctx.fill(); ctx.stroke();
      drawMallaMark(ctx, -22, -58, 26, '#365a86');
      // Malla flag + streaming pennant at the masthead
      ctx.fillStyle = '#1f4b8f'; ctx.beginPath(); ctx.moveTo(-6, -100); ctx.quadraticCurveTo(6, -98 + wob, 18, -100); ctx.lineTo(18, -89); ctx.quadraticCurveTo(6, -87 + wob, -6, -89); ctx.closePath(); ctx.fill();
      drawMallaMark(ctx, 6, -94.5, 13, '#fdf7ea');
      drawMe(t);
      if (ship.anchored) { ctx.strokeStyle = 'rgba(60,45,20,0.6)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-40, 8); ctx.lineTo(-44, 22); ctx.stroke(); ctx.fillStyle = '#5a4a2a'; ctx.beginPath(); ctx.arc(-44, 24, 2.4, 0, BK_TAU); ctx.fill(); }
      ctx.restore();
    }

    function drawCloud(c, t) {
      c.x += c.v; if (c.x > w + 100 * c.s) c.x = -100 * c.s; const bob = Math.sin(t * 0.3 + c.x * 0.01) * 2;
      ctx.save(); ctx.translate(c.x, c.y + bob); ctx.scale(c.s, c.s);
      ctx.globalAlpha = 0.10; ctx.fillStyle = '#5a82a0'; ctx.beginPath(); ctx.ellipse(14, 12, 32, 5, 0, 0, BK_TAU); ctx.fill();
      ctx.globalAlpha = 0.95; ctx.fillStyle = '#ffffff'; ctx.beginPath(); for (const p of c.puffs) { ctx.moveTo(p[0] + p[2], p[1]); ctx.arc(p[0], p[1], p[2], 0, BK_TAU); } ctx.fill(); ctx.restore(); ctx.globalAlpha = 1;
    }
    function drawGull(b, t) {
      b.x += b.v; if (b.x > w + 20) b.x = -20; if (b.x < -20) b.x = w + 20; const y = b.y + Math.sin(t * 0.9 + b.ph) * 6, f = Math.sin(t * 5 + b.ph) * 3.4;
      ctx.strokeStyle = 'rgba(70,88,102,0.82)'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(b.x - 8 * b.s, y); ctx.quadraticCurveTo(b.x - 3.5 * b.s, y - (5 + f) * b.s, b.x, y + 1); ctx.quadraticCurveTo(b.x + 3.5 * b.s, y - (5 + f) * b.s, b.x + 8 * b.s, y); ctx.stroke();
    }
    function drawCompass() {
      const x = w * 0.95, y = h * 0.9, r = mobile ? 12 : 18;
      ctx.save(); ctx.translate(x, y); ctx.globalAlpha = 0.6; ctx.strokeStyle = 'rgba(255,250,238,0.9)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 0, r, 0, BK_TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,250,238,0.85)'; for (let i = 0; i < 4; i++) { ctx.save(); ctx.rotate(i * Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, -r * 0.86); ctx.lineTo(r * 0.12, 0); ctx.lineTo(-r * 0.12, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = '#d94b3a'; ctx.beginPath(); ctx.moveTo(0, -r * 0.72); ctx.lineTo(r * 0.1, 0); ctx.lineTo(-r * 0.1, 0); ctx.closePath(); ctx.fill();      // fixed needle → N
      ctx.fillStyle = 'rgba(255,250,238,0.95)'; ctx.font = '700 ' + Math.round(r * 0.62) + "px 'Times New Roman',Georgia,serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('N', 0, -r - 6);
      ctx.restore(); ctx.globalAlpha = 1;
    }

    function drawScene(t) {
      ctx.clearRect(0, 0, w, h);
      for (const c of clouds) drawCloud(c, t);
      drawOcean(t); drawSunGlitter(t);
      for (const b of farBoats) drawFarBoat(b, t);
      drawIsland(t);
      for (const c of creatures) drawCreature(c, t);
      crestLine(h * (HOR + 0.16), t * 12, 0.32, 7, 40); crestLine(h * (HOR + 0.34), t * 10, 0.24, 9, 54);
      drawFoam(t); drawShip(t); drawCompass();
      for (const b of gulls) drawGull(b, t);
    }

    resize();
    const relayout = setTimeout(resize, 350);   // recompute island vs. buttons once the DOM settles
    const ro = new ResizeObserver(() => { resize(); if (reduce) drawScene(0); }); ro.observe(canvas);
    drawScene(0);
    const runner = makeRunner(canvas, drawScene); if (!reduce) runner.start();
    return () => { runner.stop(); ro.disconnect(); clearTimeout(relayout); };
  }, [mobile]);

  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />;
}

/* ═══ SUNSHINE BACKDROP (light) — soft blue sky, a gentle sun (no beams), the sea below */
function SunshineBackdrop({ mobile }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sunSize = mobile ? 170 : 260;
  const top = (SUN_Y * 100) + '%', left = (SUN_X * 100) + '%';
  return (
    <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#7fb1d6 0%,#96c3e2 34%,#b2d6ec 52%,#bfe0e8 62%,#bfe0e8 100%)' }} />
      <div style={{ position:'absolute', top, left, width:sunSize, height:sunSize, transform:'translate(-50%,-50%)', borderRadius:'50%',
        background:'radial-gradient(circle at 50% 50%, rgba(255,252,242,0.92) 0%, rgba(255,240,182,0.7) 34%, rgba(255,224,140,0.28) 62%, rgba(255,216,120,0) 100%)',
        animation: reduce?'none':'sunGlow 9s ease-in-out infinite' }} />
      <DayCanvas mobile={mobile} />
    </div>
  );
}

Object.assign(window, { SahajSpaceCanvas: SpaceCanvas, SahajSunshine: SunshineBackdrop });
