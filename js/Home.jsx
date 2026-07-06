// Home.jsx - mobile-first hero with rich, performant space canvas
const { useState, useEffect, useRef } = React;

/* ═══════════════════════════════════════════════════════════ SPACE CANVAS */
function SpaceCanvas({ mobile }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, animId = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const STAR_N = mobile ? 90 : 190;

    let stars = [];
    let shoot = null;            // shooting star
    let comet = { x: -200, y: 0, active: false, t: 0 };
    const ufo = { x: -120, y: 0 };
    const rocket = { x: 0, y: 0 };
    const sat = { x: -80, y: 0 };
    let P = {};                  // computed positions

    function rand(a, b) { return a + Math.random() * (b - a); }

    function makeStars() {
      stars = [];
      for (let i = 0; i < STAR_N; i++) stars.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.1 + 0.2, speed: Math.random() * 0.1 + 0.02,
        phase: Math.random() * Math.PI * 2, ps: Math.random() * 0.022 + 0.004,
        big: i < (mobile ? 10 : 22),
      });
    }

    // constellation (upper area, away from left text)
    const CON = [{x:0.60,y:0.06},{x:0.64,y:0.10},{x:0.69,y:0.07},{x:0.66,y:0.14},{x:0.72,y:0.12}];
    const CON_E = [[0,1],[1,2],[1,3],[2,4]];

    function resize() {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      P = {
        earth:    { x: w * 0.90, y: h * 0.14, r: mobile ? 18 : 26 },
        saturn:   { x: w * 0.085, y: h * 0.82, r: mobile ? 13 : 18 },
        mars:     { x: w * 0.045, y: h * 0.40, r: mobile ? 7 : 10 },
        black:    { x: w * 0.965, y: h * 0.60, r: mobile ? 11 : 15 },
        worm:     { x: w * 0.93, y: h * 0.91, r: mobile ? 14 : 19 },
      };
      ufo.y = h * 0.20;
      rocket.x = w * 0.74; rocket.y = h + 80;
      sat.y = h * 0.08;
      makeStars();
    }

    /* ---- draw helpers ---- */
    function drawStars(t) {
      for (const s of stars) {
        s.phase += s.ps;
        const a = Math.max(0, Math.min(1, 0.3 + Math.sin(s.phase) * 0.35 + 0.35));
        if (s.big) {
          ctx.save(); ctx.globalAlpha = a * 0.5;
          ctx.fillStyle = '#9fbcff';
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 2.6, 0, 6.283); ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = a; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
        s.y -= s.speed; if (s.y < -4) { s.y = h + 4; s.x = Math.random() * w; }
      }
      ctx.globalAlpha = 1;
    }

    function drawConstellation() {
      const pts = CON.map(p => ({ x: p.x * w, y: p.y * h }));
      ctx.strokeStyle = 'rgba(180,210,255,0.16)'; ctx.lineWidth = 0.8;
      for (const [a, b] of CON_E) { ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke(); }
      ctx.fillStyle = 'rgba(210,230,255,0.8)';
      for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 6.283); ctx.fill(); }
    }

    function planet(x, y, r, c0, c1) {
      const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      g.addColorStop(0, c0); g.addColorStop(1, c1);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    }

    function drawEarth(t) {
      const { x, y, r } = P.earth; const bob = Math.sin(t * 0.6) * 3; const cy = y + bob;
      ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = '#508cff';
      ctx.beginPath(); ctx.arc(x, cy, r * 1.7, 0, 6.283); ctx.fill(); ctx.restore();
      planet(x, cy, r, '#4a8ee8', '#0e2a55');
      ctx.fillStyle = '#2a7a3a';
      ctx.beginPath(); ctx.arc(x - r*0.22, cy - r*0.3, r*0.36, 0, 6.283); ctx.fill();
      ctx.beginPath(); ctx.arc(x + r*0.28, cy + r*0.2, r*0.26, 0, 6.283); ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.22; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.ellipse(x - r*0.1, cy - r*0.46, r*0.4, r*0.1, 0.3, 0, 6.283); ctx.fill(); ctx.restore();
      // moon orbit
      const mr = r * 2.1, ma = t * 0.7;
      const mx = x + Math.cos(ma) * mr, my = cy + Math.sin(ma) * mr * 0.5;
      planet(mx, my, r * 0.26, '#d8d8e0', '#75758a');
    }

    function drawSaturn() {
      const { x, y, r } = P.saturn;
      ctx.save(); ctx.strokeStyle = 'rgba(200,158,78,0.4)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(x, y, r * 2.2, r * 0.4, 0.32, Math.PI, 0); ctx.stroke(); ctx.restore();
      planet(x, y, r, '#f0c070', '#a05f28');
      ctx.save(); ctx.strokeStyle = 'rgba(210,170,90,0.75)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(x, y, r * 2.2, r * 0.4, 0.32, 0, Math.PI); ctx.stroke(); ctx.restore();
    }

    function drawMars() { const { x, y, r } = P.mars; planet(x, y, r, '#e07a4a', '#7a2f18'); }

    function drawBlack(t) {
      const { x, y, r } = P.black; const pulse = 0.8 + Math.sin(t * 1.5) * 0.2;
      ctx.save();
      for (let i = 4; i > 0; i--) {
        const ir = r * 0.4 + i * r * 0.6;
        ctx.globalAlpha = 0.05 * (5 - i) * pulse;
        ctx.fillStyle = i % 2 ? '#ff7a28' : '#a03cc8';
        ctx.beginPath(); ctx.arc(x, y, ir, 0, 6.283); ctx.fill();
      }
      ctx.restore();
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x, y, r * 0.62, 0, 6.283); ctx.fill();
    }

    function drawWorm(t) {
      const { x, y, r } = P.worm;
      ctx.save();
      for (let i = 5; i > 0; i--) {
        const pr = r * (i / 5);
        ctx.globalAlpha = 0.06 * (6 - i) * (0.7 + Math.sin(t * 2 + i) * 0.3);
        ctx.fillStyle = i % 2 ? '#7a00ff' : '#3c00b4';
        ctx.beginPath(); ctx.arc(x, y, pr, 0, 6.283); ctx.fill();
      }
      ctx.restore();
      ctx.fillStyle = 'rgba(0,0,10,0.95)'; ctx.beginPath(); ctx.arc(x, y, r * 0.26, 0, 6.283); ctx.fill();
    }

    function drawUFO(t) {
      ufo.x += 0.22; if (ufo.x > w + 110) ufo.x = -110;
      const x = ufo.x, y = ufo.y + Math.sin(t * 1.8) * 4;
      ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#00ff64';
      ctx.beginPath(); ctx.arc(x, y, 30, 0, 6.283); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#7a8a9c'; ctx.beginPath(); ctx.ellipse(x, y + 4, 19, 7, 0, 0, 6.283); ctx.fill();
      ctx.fillStyle = 'rgba(150,220,255,0.6)'; ctx.beginPath(); ctx.ellipse(x, y - 1, 10, 8, 0, Math.PI, 0); ctx.fill();
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = Math.sin(t * 5 + i * 1.2) > 0 ? '#00ff88' : '#024';
        ctx.beginPath(); ctx.arc(x - 11 + i * 11, y + 4, 2, 0, 6.283); ctx.fill();
      }
    }

    function drawSat(t) {
      sat.x += 0.4; if (sat.x > w + 60) sat.x = -60;
      const x = sat.x, y = sat.y + Math.sin(t) * 3;
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#c8d0e0'; ctx.fillRect(-3, -3, 6, 6);
      ctx.fillStyle = '#2a64c8'; ctx.fillRect(-12, -2.5, 7, 5); ctx.fillRect(5, -2.5, 7, 5);
      ctx.strokeStyle = '#9fb0c8'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(-12, 0); ctx.moveTo(5, 0); ctx.lineTo(12, 0); ctx.stroke();
      ctx.restore();
    }

    function drawRocket(t) {
      rocket.y -= 0.16; if (rocket.y < -90) rocket.y = h + 80;
      const x = rocket.x + Math.sin(t * 1.4) * 2, y = rocket.y;
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#dde4f0'; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-7, 6); ctx.lineTo(7, 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ff4444'; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-3.5, -12); ctx.lineTo(3.5, -12); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#4488ff'; ctx.beginPath(); ctx.arc(0, -6, 3.4, 0, 6.283); ctx.fill();
      ctx.fillStyle = '#cc3333';
      ctx.beginPath(); ctx.moveTo(-7, 6); ctx.lineTo(-13, 13); ctx.lineTo(-7, 10); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(7, 6); ctx.lineTo(13, 13); ctx.lineTo(7, 10); ctx.closePath(); ctx.fill();
      const fh = 9 + Math.sin(t * 14) * 3;
      ctx.fillStyle = 'rgba(255,160,40,0.85)'; ctx.beginPath(); ctx.moveTo(-4, 7); ctx.lineTo(0, 7 + fh); ctx.lineTo(4, 7); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function drawComet(t) {
      if (!comet.active) { if (Math.random() < 0.0025) { comet.active = true; comet.x = -40; comet.y = rand(h * 0.1, h * 0.5); comet.t = 0; } return; }
      comet.x += 3.2; comet.t += 1; if (comet.x > w + 60) comet.active = false;
      const x = comet.x, y = comet.y + comet.x * 0.12;
      const grad = ctx.createLinearGradient(x, y, x - 70, y - 9);
      grad.addColorStop(0, 'rgba(180,220,255,0.9)'); grad.addColorStop(1, 'rgba(180,220,255,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 70, y - 9); ctx.stroke();
      ctx.fillStyle = '#dff0ff'; ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.283); ctx.fill();
    }

    function drawShoot() {
      if (!shoot) { if (Math.random() < 0.004) shoot = { x: rand(0, w * 0.7), y: rand(0, h * 0.25), vx: rand(7, 13), vy: rand(3, 6), life: 55 }; return; }
      const a = shoot.life / 55;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#ffffc8'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - shoot.vx * 9, shoot.y - shoot.vy * 9); ctx.stroke(); ctx.restore();
      shoot.x += shoot.vx; shoot.y += shoot.vy; shoot.life--; if (shoot.life <= 0) shoot = null;
    }

    let t0 = 0;
    function loop(ts) {
      const t = ts * 0.001;
      ctx.clearRect(0, 0, w, h);
      drawStars(t); drawConstellation();
      drawEarth(t); drawSaturn(); drawMars(); drawBlack(t); drawWorm(t);
      if (!mobile) { drawUFO(t); drawSat(t); }
      drawRocket(t); drawComet(t); drawShoot();
      animId = requestAnimationFrame(loop);
    }

    function drawStatic() {
      // reduced-motion: one calm frame
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) { ctx.globalAlpha = 0.7; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1; drawConstellation(); drawEarth(0); drawSaturn(); drawMars(); drawBlack(0); drawWorm(0);
    }

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduce) drawStatic(); });
    ro.observe(canvas);
    drawStatic();                       // immediate first frame - never blank
    if (!reduce) loop(performance.now()); // kick the loop synchronously (rescheduled via rAF)
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, [mobile]);

  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }} />;
}

/* ═══ SUNSHINE BACKDROP (light mode) - centered sun, rays radiating outward, beams of knowledge */
function SunshineBackdrop({ mobile }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sunSize = mobile ? 260 : 400;
  const rays = mobile ? 1000 : 1500;
  return (
    <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {/* warm sky wash */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(170deg,#fff6e2 0%,#ffedcb 40%,#ffe0b6 72%,#ffd2ab 100%)' }} />
      {/* radiating rays - centered on the sun */}
      <div style={{ position:'absolute', top:'46%', left:'52%', width:rays, height:rays, transform:'translate(-50%,-50%)',
        background:'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,196,92,0.42) 0deg 3.4deg, transparent 3.4deg 12deg)',
        borderRadius:'50%', animation: reduce?'none':'rayspin 120s linear infinite',
        maskImage:'radial-gradient(circle,#000 6%,rgba(0,0,0,0.5) 30%,transparent 60%)', WebkitMaskImage:'radial-gradient(circle,#000 6%,rgba(0,0,0,0.5) 30%,transparent 60%)' }} />
      {/* sun core - centered */}
      <div style={{ position:'absolute', top:'46%', left:'52%', width:sunSize, height:sunSize, transform:'translate(-50%,-50%)', borderRadius:'50%',
        background:'radial-gradient(circle at 50% 50%, rgba(255,253,246,0.98) 0%, rgba(255,236,158,0.85) 30%, rgba(255,216,110,0.4) 60%, rgba(255,207,94,0) 100%)',
        filter:'blur(2px)', animation: reduce?'none':'sunGlow 8s ease-in-out infinite' }} />
      {/* soft floating light orbs */}
      <div style={{ position:'absolute', bottom:'14%', left:'10%', width:'120px', height:'120px', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.5),rgba(255,255,255,0))', animation: reduce?'none':'orbFloat 12s ease-in-out infinite' }} />
      <div style={{ position:'absolute', top:'18%', left:'22%', width:'70px', height:'70px', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,240,200,0.55),rgba(255,240,200,0))', animation: reduce?'none':'orbFloat 9s ease-in-out infinite 1.5s' }} />
      <div style={{ position:'absolute', top:'22%', right:'16%', width:'90px', height:'90px', borderRadius:'50%', background:'radial-gradient(circle,rgba(255,236,180,0.45),rgba(255,236,180,0))', animation: reduce?'none':'orbFloat 14s ease-in-out infinite 0.8s' }} />
      {/* gentle warm ground glow */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, height:'40%', background:'linear-gradient(180deg,transparent,rgba(255,188,116,0.24))' }} />
    </div>
  );
}

/* ═══ KNOWLEDGE PAPERS (light mode) - drifting, clickable; a click opens one of Sahaj's papers at random */
function PaperGlyph() {
  return (
    <svg width="42" height="52" viewBox="0 0 42 52" fill="none" style={{ display:'block', filter:'drop-shadow(0 6px 12px rgba(150,100,25,0.28))' }}>
      <path d="M3 2.5 h26 l10 10 v37 a1.5 1.5 0 0 1 -1.5 1.5 h-33 a1.5 1.5 0 0 1 -1.5 -1.5 v-45.5 a1.5 1.5 0 0 1 1.5 -1.5 z" fill="#fffdf7" stroke="var(--gold-2)" strokeWidth="1.6"/>
      <path d="M29 2.5 v9 a1 1 0 0 0 1 1 h9" fill="rgba(255,236,190,0.9)" stroke="var(--gold-2)" strokeWidth="1.4"/>
      <line x1="8" y1="20" x2="31" y2="20" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
      <line x1="8" y1="26" x2="33" y2="26" stroke="#bfa878" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="32" x2="33" y2="32" stroke="#bfa878" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="38" x2="25" y2="38" stroke="#bfa878" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="44" x2="29" y2="44" stroke="#bfa878" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function KnowledgePapers({ mobile }) {
  const d = window.SahajData;
  const papers = [].concat(d.peerReviewed || [], d.preprints || []).filter(p => p.url && p.url !== '#');
  const openRandom = () => {
    if (!papers.length) return;
    const p = papers[Math.floor(Math.random() * papers.length)];
    window.open(p.url, '_blank', 'noopener,noreferrer');
  };
  // positions kept clear of the hero copy + CTAs so papers never block a click
  const spots = mobile
    ? [ {l:'8%',t:'7%',a:'paperDrift1',d:16}, {l:'80%',t:'6%',a:'paperDrift2',d:19}, {l:'10%',t:'90%',a:'paperDrift3',d:22}, {l:'82%',t:'91%',a:'paperDrift1',d:18} ]
    : [ {l:'22%',t:'6%',a:'paperDrift1',d:17}, {l:'48%',t:'5%',a:'paperDrift2',d:21}, {l:'69%',t:'8%',a:'paperDrift3',d:19},
        {l:'95%',t:'34%',a:'paperDrift1',d:23}, {l:'2%',t:'44%',a:'paperDrift2',d:18}, {l:'7%',t:'91%',a:'paperDrift3',d:20}, {l:'86%',t:'92%',a:'paperDrift2',d:24} ];
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:2 }}>
      {spots.map((s,i)=>(
        <button key={i} onClick={openRandom} tabIndex={-1} aria-label="Open one of Sahaj's papers"
          title="✦ Open a paper"
          onMouseEnter={e=>{e.currentTarget.style.transform='scale(1.2) rotate(-3deg)';e.currentTarget.style.opacity='1';}}
          onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.opacity='';}}
          style={{ position:'absolute', left:s.l, top:s.t, background:'none', border:'none', padding:0, cursor:'pointer',
            pointerEvents:'auto', opacity:0.9, transition:'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s',
            animation: reduce?'none':`${s.a} ${s.d}s ease-in-out infinite ${i*0.6}s`, willChange:'transform' }}>
          <PaperGlyph />
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ COUNTER */
function Counter({ target, delay = 0 }) {
  const [n, setN] = useState(0); const started = useRef(false);
  useEffect(() => {
    if (started.current) return; started.current = true;
    const t = setTimeout(() => {
      const s = performance.now(), dur = 1500; let fr;
      const step = (now) => { const p = Math.min((now - s) / dur, 1); setN(Math.floor((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) fr = requestAnimationFrame(step); };
      fr = requestAnimationFrame(step);
    }, delay);
    // safety net: guarantee the final value even if rAF is throttled (e.g. background tab)
    const safety = setTimeout(() => setN(target), delay + 2200);
    return () => { clearTimeout(t); clearTimeout(safety); };
  }, [target, delay]);
  return n;
}

/* ═══════════════════════════════════════════════════════ SOCIAL ICONS */
const SOCIAL_ICONS = {
  GitHub: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z"/></svg>,
  Scholar: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 8.5l11 6.5 9-5.3V16h2V8.5L12 2zM5 13.2V17c0 1.7 3.1 3.5 7 3.5s7-1.8 7-3.5v-3.8l-7 4.1-7-4.1z"/></svg>,
  LinkedIn: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 3H3.6C3 3 2.5 3.5 2.5 4.1v15.8c0 .6.5 1.1 1.1 1.1h16.8c.6 0 1.1-.5 1.1-1.1V4.1c0-.6-.5-1.1-1.1-1.1zM8.3 18.3H5.6V9.7h2.7v8.6zM6.9 8.6a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zM18.4 18.3h-2.7v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3H10V9.7h2.6v1.2h.1c.4-.7 1.2-1.4 2.6-1.4 2.7 0 3.2 1.8 3.2 4.1v4.7z"/></svg>,
  ResearchGate: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 2H4.4A2.4 2.4 0 0 0 2 4.4v15.2A2.4 2.4 0 0 0 4.4 22h15.2a2.4 2.4 0 0 0 2.4-2.4V4.4A2.4 2.4 0 0 0 19.6 2zM9.6 15.6H8.2v-4.1c0-.5-.3-.8-.8-.8H6.2v4.9H4.8V9.4h2.8c1.2 0 1.9.7 1.9 1.9 0 .8-.4 1.4-1 1.7l1.1 2.6zm5.6-3.1c0 1.8-1.1 3.2-2.9 3.2s-2.9-1.4-2.9-3.2 1.1-3.2 2.9-3.2 2.9 1.4 2.9 3.2z"/></svg>,
  Email: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
};

function SocialPill({ label, url }) {
  const [h, setH] = useState(false);
  return (
    <a href={url} target={url.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      aria-label={label}
      style={{
        display:'flex', alignItems:'center', gap:'7px',
        color: h ? 'var(--ink)' : 'var(--ink-2)', textDecoration:'none',
        fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', fontWeight:500,
        padding:'7px 14px', borderRadius:'20px',
        border:`1px solid ${h ? 'rgba(77,127,255,0.55)' : 'rgba(160,184,216,0.3)'}`,
        background: h ? 'rgba(34,85,232,0.14)' : 'var(--surface)',
        transition:'all 0.2s ease', letterSpacing:'0.3px',
      }}>
      <span style={{ color: h ? 'var(--accent-2)' : 'var(--ink-3)', display:'flex' }}>{SOCIAL_ICONS[label]}</span>
      {label}
    </a>
  );
}

/* ═══════════════════════════════════════════════════════ HOME */
function Home({ onNavigate }) {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const theme = window.useTheme();
  const isLight = theme === 'light';
  const [hov, setHov] = useState(null);
  const [expHov, setExpHov] = useState(false);

  const pad = mobile ? '92px 20px 64px' : '60px 48px';

  return (
    <div style={{
      minHeight:'100vh', paddingTop:'0', position:'relative',
      background: isLight
        ? 'linear-gradient(165deg,#fff3d6 0%,#ffe6bd 40%,#ffcaa6 100%)'
        : 'linear-gradient(160deg,#04091a 0%,#060c1e 55%,#050a18 100%)',
      overflow:'hidden', display:'flex', alignItems:'center',
    }}>
      {isLight ? <SunshineBackdrop mobile={mobile} /> : <SpaceCanvas mobile={mobile} />}
      {isLight && <KnowledgePapers mobile={mobile} />}

      {/* legibility scrim - keeps text readable over the backdrop */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background: isLight
          ? (mobile
              ? 'linear-gradient(180deg,rgba(255,247,230,0.5) 0%,rgba(255,247,230,0.15) 45%,rgba(255,240,220,0.4) 100%)'
              : 'radial-gradient(ellipse 72% 92% at 28% 52%,rgba(255,248,232,0.82) 0%,rgba(255,244,224,0.4) 52%,transparent 78%)')
          : (mobile
              ? 'linear-gradient(180deg,rgba(4,9,26,0.55) 0%,rgba(4,9,26,0.35) 40%,rgba(4,9,26,0.6) 100%)'
              : 'radial-gradient(ellipse 70% 90% at 30% 50%,rgba(4,9,26,0.82) 0%,rgba(4,9,26,0.4) 55%,transparent 80%)'),
      }} />

      {/* Content */}
      <div style={{
        maxWidth:'1320px', margin:'0 auto', padding:pad, width:'100%',
        display:'flex', alignItems:'center', gap: mobile ? '32px' : '64px',
        position:'relative', zIndex:1, flexDirection: mobile ? 'column' : 'row',
        textAlign: mobile ? 'center' : 'left',
      }}>

        {/* Left / text */}
        <div style={{ flex:'1 1 400px', minWidth:0, order: mobile ? 2 : 1 }}>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: mobile ? '10px' : '11px', fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:'var(--accent-2)', marginBottom:'20px' }}>
            AI Researcher · Kathmandu University
          </p>

          <h1 style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'clamp(40px,8vw,82px)', fontWeight:700, color:'var(--ink)', lineHeight:1.04, letterSpacing:'-1px', marginBottom:'10px' }}>
            Sahaj Raj Malla
          </h1>

          <p style={{ fontFamily:"'Tiro Devanagari Hindi','Noto Serif Devanagari',serif", fontSize:'clamp(20px,5vw,34px)', fontWeight:400, color:'var(--gold-ink)', letterSpacing:'0.5px', marginBottom:'24px' }}>
            सहज राज मल्ल
          </p>

          <div style={{ width:'56px', height:'2px', background:'linear-gradient(90deg,var(--accent),var(--gold))', marginBottom:'24px', borderRadius:'2px', marginLeft: mobile ? 'auto' : 0, marginRight: mobile ? 'auto' : 0 }} />

          <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'clamp(16px,2.2vw,20px)', fontStyle:'italic', color:'var(--ink-3)', lineHeight:1.6, marginBottom: mobile ? '32px' : '44px', maxWidth:'500px', marginLeft: mobile ? 'auto' : 0, marginRight: mobile ? 'auto' : 0 }}>
            "Forget Passion, Science and Technology are my Religion!"
          </p>

          {/* Stats */}
          <div style={{ display:'flex', gap: mobile ? '28px' : '36px', marginBottom: mobile ? '32px' : '44px', flexWrap:'wrap', justifyContent: mobile ? 'center' : 'flex-start' }}>
            {[{val:10,suf:'',lbl:'Publications'},{val:9,suf:'',lbl:'Awards'},{val:4000,suf:'+',lbl:'Users reached'}].map((s,i)=>(
              <div key={i}>
                <div style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'clamp(28px,7vw,52px)', fontWeight:700, color:'var(--ink)', lineHeight:1 }}>
                  <Counter target={s.val} delay={800 + i*260} />{s.suf}
                </div>
                <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', color:'var(--ink-3)', marginTop:'5px', letterSpacing:'0.4px' }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display:'flex', gap:'12px', marginBottom:'26px', flexWrap:'wrap', justifyContent: mobile ? 'center' : 'flex-start' }}>
            <button onClick={()=>onNavigate('phd')} onMouseEnter={()=>setHov('res')} onMouseLeave={()=>setHov(null)}
              style={{ background: hov==='res' ? '#1d47d6' : 'var(--accent)', color:'white', border:'none', cursor:'pointer', padding:'13px 28px', borderRadius:'8px', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'15px', fontWeight:600, display:'flex', alignItems:'center', gap:'8px', whiteSpace:'nowrap', boxShadow: hov==='res' ? '0 6px 20px rgba(34,85,232,0.38)' : '0 3px 12px rgba(34,85,232,0.24)', transform: hov==='res' ? 'translateY(-2px)' : 'none', transition:'all 0.2s ease' }}>
              My PhD Overview
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
            <button onClick={()=>onNavigate('research')} onMouseEnter={()=>setHov('abt')} onMouseLeave={()=>setHov(null)}
              style={{ background: hov==='abt' ? 'var(--surface-3)' : 'var(--surface-2)', color: hov==='abt' ? 'var(--ink)' : 'var(--ink-2)', border: hov==='abt' ? '1px solid var(--accent-line)' : '1px solid var(--line-2)', cursor:'pointer', padding:'13px 28px', borderRadius:'8px', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'15px', fontWeight:600, whiteSpace:'nowrap', transform: hov==='abt' ? 'translateY(-2px)' : 'none', transition:'all 0.2s ease' }}>
              View Research
            </button>
          </div>

          {/* Social pills */}
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', justifyContent: mobile ? 'center' : 'flex-start' }}>
            <SocialPill label="GitHub" url={d.personal.github} />
            <SocialPill label="Scholar" url={d.personal.scholar} />
            <SocialPill label="LinkedIn" url={d.personal.linkedin} />
            <SocialPill label="ResearchGate" url={d.personal.researchgate} />
            <SocialPill label="Email" url={`mailto:${d.personal.email}`} />
          </div>
        </div>

        {/* Right / photo */}
        <div style={{ flexShrink:0, width: mobile ? 'min(360px,86vw)' : 'clamp(290px,32vw,420px)', order: mobile ? 1 : 2 }}>
          <div style={{ position:'relative', borderRadius:'18px', overflow:'hidden', aspectRatio:'4/5', boxShadow:'0 0 0 1px rgba(77,127,255,0.3),0 24px 60px rgba(0,0,0,0.65)' }}>
            <img src="assets/sahaj2.jpg" alt="Sahaj Raj Malla" loading="eager" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 18%', display:'block' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(4,9,26,0.75) 0%,transparent 55%)' }} />
          </div>
          <a href="https://www.nature.com/articles/s41598-025-30871-z" target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', gap:'12px', marginTop:'14px', padding:'12px 14px', background:'rgba(139,92,246,0.12)', border:'1px solid rgba(139,92,246,0.32)', borderRadius:'10px', textDecoration:'none', transition:'all 0.2s ease' }}>
            <span style={{ width:'34px', height:'34px', background:'rgba(139,92,246,0.22)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', fontWeight:800, letterSpacing:'0.4px', color:'var(--purple)', flexShrink:0 }}>Q1</span>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'10px', fontWeight:800, color:'var(--purple)', letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:'2px' }}>Q1 · Scientific Reports · 2025</div>
              <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', color:'var(--ink-2)', fontWeight:500 }}>MallaNet (Nature Portfolio)</div>
            </div>
          </a>
        </div>
      </div>

      {/* Explore → opens game */}
      {!mobile && (
        <button onClick={()=>onNavigate('game')}
          onMouseEnter={()=>setExpHov(true)} onMouseLeave={()=>setExpHov(false)}
          style={{ position:'absolute', bottom:'26px', left:'50%', transform:'translateX(-50%)', cursor:'pointer', display:'flex', alignItems:'center', gap:'11px', padding:'10px 20px 10px 16px', borderRadius:'24px', zIndex:2,
            background: isLight
              ? (expHov ? 'rgba(255,240,205,0.92)' : 'rgba(255,249,236,0.72)')
              : (expHov ? 'rgba(34,85,232,0.22)' : 'rgba(10,20,42,0.55)'),
            border:`1px solid ${expHov ? 'rgba(201,168,76,0.8)' : (isLight ? 'rgba(201,150,50,0.5)' : 'rgba(201,168,76,0.42)')}`,
            boxShadow: isLight
              ? (expHov ? '0 10px 26px rgba(201,150,50,0.32)' : '0 5px 16px rgba(180,140,60,0.18)')
              : (expHov ? '0 8px 28px rgba(34,85,232,0.4)' : '0 4px 18px rgba(0,0,0,0.45)'),
            backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
            animation:'heroFloat 3.4s ease-in-out infinite', transition:'background 0.25s, border-color 0.25s, box-shadow 0.25s' }}>
          <span style={{ display:'flex', color: expHov ? 'var(--gold-2)' : 'var(--gold)', transition:'color 0.25s' }}>
            {isLight
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5 L13.7 9 L20.3 10.3 L15.4 14.3 L16.8 21 L12 17.4 L7.2 21 L8.6 14.3 L3.7 10.3 L10.3 9 Z"/></svg>
              : (window.SahajIcons && window.SahajIcons.planet({ size:20, color:'currentColor', strokeW:1.7 }))}
          </span>
          <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', fontWeight:700, letterSpacing:'1.6px', textTransform:'uppercase', color: (!isLight && expHov) ? '#fff' : 'var(--ink)' }}>{isLight ? 'Follow the Curiosity' : 'Explore My World'}</span>
          <span style={{ display:'flex', color: expHov ? 'var(--ink-2)' : 'var(--ink-4)', transition:'color 0.25s' }}>
            {window.SahajIcons && window.SahajIcons.arrowRight({ size:15, color:'currentColor', strokeW:2.2 })}
          </span>
        </button>
      )}
    </div>
  );
}

window.SahajHome = Home;
