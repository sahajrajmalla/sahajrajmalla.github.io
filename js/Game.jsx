// Game.jsx - "Explore My World": pilot a rocket (avatar riding on top) between star portals.
// Controls live in a deck BELOW the play field so they never overlap the portals.
const { useEffect, useRef, useState } = React;

const VW = 820, VH = 430;

const PORTALS = [
  { id:'about',    label:'ABOUT',    x:150, y:120, color:'var(--accent-2)', rgb:'77,127,255' },
  { id:'research', label:'RESEARCH', x:415, y:90,  color:'#8b5cf6', rgb:'139,92,246' },
  { id:'projects', label:'PROJECTS', x:680, y:130, color:'#10b981', rgb:'16,185,129' },
  { id:'phd',      label:'FOR PhD',  x:585, y:265, color:'var(--gold-ink)', rgb:'201,168,76' },
  { id:'contact',  label:'CONTACT',  x:230, y:270, color:'#ff6b6b', rgb:'255,107,107' },
];

function Game({ onClose, onNavigate }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);
  const isLight = window.useTheme() === 'light';
  const onCloseRef = useRef(onClose);  onCloseRef.current = onClose;
  const onNavRef   = useRef(onNavigate); onNavRef.current = onNavigate;
  const [nearLabel, setNearLabel] = useState(null);
  const [showHelp, setShowHelp]   = useState(false);

  const setKey = (key, down) => {
    if (!stateRef.current) return;
    if (down) stateRef.current.keys[key] = true; else delete stateRef.current.keys[key];
  };
  const tryEnter = () => {
    const st = stateRef.current;
    if (st && st.nearPortal) { const id = st.nearPortal.id; onCloseRef.current(); onNavRef.current(id); }
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = VW * DPR; canvas.height = VH * DPR; ctx.setTransform(DPR,0,0,DPR,0,0);

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random()*VW, y: Math.random()*VH, r: Math.random()*1.1+0.2,
      phase: Math.random()*6.28, ps: Math.random()*0.03+0.006,
    }));

    stateRef.current = { player:{ x:VW/2, y:VH-70, vx:0, vy:0, tilt:0, heading:-Math.PI/2 }, keys:{}, time:0, nearPortal:null, last:0 };

    function starPath(cx, cy, spikes, outer, inner) {
      let rot = -Math.PI/2; const step = Math.PI/spikes;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(rot)*outer, cy + Math.sin(rot)*outer);
      for (let i=0;i<spikes;i++){ rot+=step; ctx.lineTo(cx+Math.cos(rot)*inner, cy+Math.sin(rot)*inner); rot+=step; ctx.lineTo(cx+Math.cos(rot)*outer, cy+Math.sin(rot)*outer); }
      ctx.closePath();
    }

    function bg(t, light) {
      if (light) {
        // ── blue-ocean nautical chart ──
        const pg = ctx.createLinearGradient(0,0,0,VH);
        pg.addColorStop(0,'#3f92bd'); pg.addColorStop(0.5,'#2f7ba8'); pg.addColorStop(1,'#256a95');
        ctx.fillStyle = pg; ctx.fillRect(0,0,VW,VH);
        // brighter sunlit patch
        const sea = ctx.createRadialGradient(VW*0.5,VH*0.42,40,VW*0.5,VH*0.5,VW*0.62);
        sea.addColorStop(0,'rgba(150,205,224,0.4)'); sea.addColorStop(1,'rgba(40,110,150,0)');
        ctx.fillStyle = sea; ctx.fillRect(0,0,VW,VH);
        // graticule (chart grid)
        ctx.strokeStyle='rgba(230,244,250,0.14)'; ctx.lineWidth=1;
        for (let gx=0; gx<=VW; gx+=68){ ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,VH); ctx.stroke(); }
        for (let gy=0; gy<=VH; gy+=68){ ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(VW,gy); ctx.stroke(); }
        // little wave-marks (stable positions, gentle shimmer)
        ctx.strokeStyle='rgba(240,250,255,0.5)'; ctx.lineWidth=1; ctx.lineCap='round';
        for (const s of stars) {
          s.phase += s.ps*0.5; const wob = Math.sin(s.phase)*1.1;
          ctx.beginPath(); ctx.moveTo(s.x-3,s.y);
          ctx.quadraticCurveTo(s.x-1,s.y-1.6+wob,s.x+1,s.y);
          ctx.quadraticCurveTo(s.x+3,s.y+1.6-wob,s.x+5,s.y); ctx.stroke();
        }
        // deep-water vignette
        const vg = ctx.createRadialGradient(VW*0.5,VH*0.5,VH*0.32,VW*0.5,VH*0.5,VW*0.62);
        vg.addColorStop(0,'rgba(12,50,80,0)'); vg.addColorStop(1,'rgba(12,50,80,0.34)');
        ctx.fillStyle=vg; ctx.fillRect(0,0,VW,VH);
        // corner compass rose — fixed (does NOT rotate), N marked
        ctx.save(); ctx.translate(VW-52,VH-48); ctx.globalAlpha=0.8;
        ctx.strokeStyle='rgba(255,248,232,0.9)'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(0,0,20,0,6.283); ctx.stroke();
        ctx.fillStyle='rgba(255,248,232,0.9)';
        for (let i=0;i<4;i++){ ctx.save(); ctx.rotate(i*Math.PI/2); ctx.beginPath(); ctx.moveTo(0,-18); ctx.lineTo(4,0); ctx.lineTo(-4,0); ctx.closePath(); ctx.fill(); ctx.restore(); }
        ctx.fillStyle='#e8564a'; ctx.beginPath(); ctx.moveTo(0,-16); ctx.lineTo(3,0); ctx.lineTo(-3,0); ctx.closePath(); ctx.fill();   // north needle, fixed up
        ctx.fillStyle='#fff8e8'; ctx.font="bold 11px 'Times New Roman',Georgia,serif"; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('N', 0, -25);
        ctx.restore(); ctx.globalAlpha=1;
        return;
      }
      ctx.fillStyle = '#03040d'; ctx.fillRect(0,0,VW,VH);
      // nebula wisps
      const neb = ctx.createRadialGradient(VW*0.7,VH*0.3,0,VW*0.7,VH*0.3,260);
      neb.addColorStop(0,'rgba(60,30,120,0.18)'); neb.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = neb; ctx.fillRect(0,0,VW,VH);
      const neb2 = ctx.createRadialGradient(VW*0.2,VH*0.6,0,VW*0.2,VH*0.6,220);
      neb2.addColorStop(0,'rgba(20,60,120,0.15)'); neb2.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle = neb2; ctx.fillRect(0,0,VW,VH);
      for (const s of stars) {
        s.phase += s.ps; const a = 0.3 + Math.sin(s.phase)*0.35 + 0.35;
        ctx.globalAlpha = Math.max(0,Math.min(1,a)); ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawPortal(p, dist, t, light) {
      const near = dist < 86;
      const pulse = Math.sin(t*3 + p.x)*0.12 + 0.9;
      if (light) {
        // ── an island (a section to land on) ──
        if (near) {
          ctx.save(); ctx.globalAlpha = 0.4 + Math.sin(t*3)*0.12;
          const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,58);
          g.addColorStop(0,`rgba(${p.rgb},0.85)`); g.addColorStop(1,`rgba(${p.rgb},0)`);
          ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,58,0,6.283); ctx.fill(); ctx.restore();
        }
        // shadow on the sea + surrounding surf ring
        ctx.save(); ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1.4;
        ctx.beginPath(); ctx.ellipse(p.x,p.y+6,30+Math.sin(t*2+p.x)*1.5,11,0,0,6.283); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.globalAlpha=0.18; ctx.fillStyle='#26484a';
        ctx.beginPath(); ctx.ellipse(p.x,p.y+8,27,8,0,0,6.283); ctx.fill(); ctx.restore();
        // sandy base
        ctx.fillStyle='#e8d4a2'; ctx.strokeStyle='#b89a62'; ctx.lineWidth=1.2;
        ctx.beginPath(); ctx.ellipse(p.x,p.y+5,25,9,0,0,6.283); ctx.fill(); ctx.stroke();
        // green hill
        ctx.fillStyle='#7cb184'; ctx.strokeStyle='#528a5d'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(p.x-17,p.y+3);
        ctx.quadraticCurveTo(p.x-7,p.y-15,p.x+2,p.y-6);
        ctx.quadraticCurveTo(p.x+10,p.y-19,p.x+19,p.y+3); ctx.closePath(); ctx.fill(); ctx.stroke();
        // palm
        ctx.strokeStyle='#7a5326'; ctx.lineWidth=2; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(p.x+9,p.y+1); ctx.quadraticCurveTo(p.x+13,p.y-10,p.x+11,p.y-18); ctx.stroke();
        ctx.strokeStyle='#4e8248'; ctx.lineWidth=1.4;
        const tx=p.x+11, ty=p.y-18;
        ctx.beginPath();
        ctx.moveTo(tx,ty); ctx.quadraticCurveTo(tx+9,ty-3,tx+13,ty+2);
        ctx.moveTo(tx,ty); ctx.quadraticCurveTo(tx-8,ty-3,tx-11,ty+2);
        ctx.moveTo(tx,ty); ctx.quadraticCurveTo(tx+5,ty-8,tx+10,ty-8);
        ctx.stroke();
        // section pennant tucked at the palm crown (no bare pole)
        ctx.fillStyle=p.color; ctx.beginPath(); ctx.moveTo(tx-1,ty-2); ctx.lineTo(tx-11,ty-4.5); ctx.lineTo(tx-1,ty-7); ctx.closePath(); ctx.fill();
        // label — cream with a dark halo so it reads on the blue sea
        ctx.save(); ctx.textAlign='center';
        ctx.font = `bold ${near?13:12}px 'Helvetica Neue',Arial,sans-serif`;
        ctx.lineWidth=3.4; ctx.strokeStyle='rgba(10,44,72,0.92)'; ctx.lineJoin='round';
        ctx.strokeText(p.label, p.x, p.y - 26);
        ctx.fillStyle = near ? '#fff7e6' : '#eaf4fb'; ctx.fillText(p.label, p.x, p.y - 26);
        if (near) { ctx.lineWidth=3; ctx.strokeStyle='rgba(6,40,26,0.9)'; ctx.font="bold 10px 'Helvetica Neue',Arial,sans-serif"; ctx.strokeText('LAND HERE', p.x, p.y + 22); ctx.fillStyle='#7dffc4'; ctx.fillText('LAND HERE', p.x, p.y + 22); }
        ctx.restore();
        return;
      }
      const outer = (near ? 22 : 18) * pulse, inner = outer * 0.45;
      // glow
      ctx.save(); ctx.globalAlpha = near ? 0.30 : 0.16;
      const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y, near?58:44);
      g.addColorStop(0,`rgba(${p.rgb},1)`); g.addColorStop(1,`rgba(${p.rgb},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,near?58:44,0,6.283); ctx.fill(); ctx.restore();
      // star body
      ctx.save(); ctx.translate(0,0);
      starPath(p.x, p.y, 5, outer, inner);
      ctx.fillStyle = near ? p.color : p.color+'cc'; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.stroke();
      // inner sparkle
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(p.x - outer*0.18, p.y - outer*0.18, outer*0.14, 0, 6.283); ctx.fill();
      ctx.restore();
      // label
      ctx.fillStyle = near ? '#fff' : p.color; ctx.textAlign='center';
      ctx.font = `bold ${near?12:11}px 'Helvetica Neue',Arial,sans-serif`;
      ctx.fillText(p.label, p.x, p.y - outer - 12);
      if (near) { ctx.fillStyle='rgba(255,255,255,0.65)'; ctx.font="10px 'Helvetica Neue',Arial,sans-serif"; ctx.fillText('ENTER', p.x, p.y + outer + 18); }
    }

    function rider(t) {
      const wave = Math.sin(t*6)*0.5;
      // body / shirt
      ctx.fillStyle = '#e87060'; ctx.beginPath(); ctx.ellipse(0,-2,5.5,5,0,0,6.283); ctx.fill();
      ctx.strokeStyle = 'rgba(255,210,190,0.4)'; ctx.lineWidth=0.7;
      ctx.beginPath(); ctx.moveTo(-3,-5); ctx.lineTo(-3,2); ctx.moveTo(0,-6); ctx.lineTo(0,2); ctx.moveTo(3,-5); ctx.lineTo(3,2); ctx.stroke();
      // legs hanging
      ctx.strokeStyle = '#334466'; ctx.lineWidth=2.4; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-2.5,2); ctx.lineTo(-3.5,7); ctx.moveTo(2.5,2); ctx.lineTo(3.5,7); ctx.stroke();
      // white shoes
      ctx.fillStyle='#f5f5f5'; ctx.beginPath(); ctx.arc(-3.7,7.6,1.6,0,6.283); ctx.fill(); ctx.beginPath(); ctx.arc(3.7,7.6,1.6,0,6.283); ctx.fill();
      // waving arm
      ctx.strokeStyle = '#e87060'; ctx.lineWidth=2.2;
      ctx.beginPath(); ctx.moveTo(4,-3); ctx.lineTo(8, -7 - wave*2); ctx.stroke();
      ctx.fillStyle='#c8a070'; ctx.beginPath(); ctx.arc(8,-7-wave*2,1.6,0,6.283); ctx.fill();
      // head
      ctx.fillStyle = '#c8a070'; ctx.beginPath(); ctx.arc(0,-9,4.6,0,6.283); ctx.fill();
      // dhaka topi
      ctx.fillStyle = '#1a1a30'; ctx.beginPath(); ctx.ellipse(0,-12.5,5,2,0,0,6.283); ctx.fill();
      ctx.fillRect(-5,-13.5,10,3); ctx.fillStyle='var(--gold)'; ctx.fillRect(-5,-11,10,1);
      // face
      ctx.fillStyle = '#1a0a0a'; ctx.beginPath(); ctx.arc(-1.6,-9,0.7,0,6.283); ctx.fill(); ctx.beginPath(); ctx.arc(1.6,-9,0.7,0,6.283); ctx.fill();
      ctx.strokeStyle='#1a0a0a'; ctx.lineWidth=0.6; ctx.beginPath(); ctx.arc(0,-7.5,1.6,0.2,Math.PI-0.2); ctx.stroke();
    }

    function drawRocket(pl, t, light) {
      const x = pl.x, y = pl.y;
      const moving = Math.abs(pl.vx)+Math.abs(pl.vy) > 0.5;
      const bob = Math.sin(t*8)*1.5;
      const tilt = pl.tilt;
      ctx.save(); ctx.translate(x, y + bob); ctx.rotate(tilt);

      if (light) {
        // ── my ship, seen from above, sailing the chart ──
        ctx.rotate(pl.heading + Math.PI/2);   // bow points along heading
        // wake behind the stern
        ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=1.4; ctx.lineCap='round';
        for (let i=0;i<3;i++){ const yy=15+i*6; ctx.save(); ctx.globalAlpha=(3-i)/4; ctx.beginPath(); ctx.moveTo(-4-i,yy); ctx.quadraticCurveTo(0,yy+3,4+i,yy); ctx.stroke(); ctx.restore(); }
        // hull (pointed bow up)
        ctx.beginPath();
        ctx.moveTo(0,-19);
        ctx.quadraticCurveTo(9,-5,7,14);
        ctx.quadraticCurveTo(0,19,-7,14);
        ctx.quadraticCurveTo(-9,-5,0,-19);
        ctx.closePath();
        const hg=ctx.createLinearGradient(-8,0,8,0);
        hg.addColorStop(0,'#b5701a'); hg.addColorStop(0.5,'#f4b73f'); hg.addColorStop(1,'#b5701a');
        ctx.fillStyle=hg; ctx.strokeStyle='#6f4310'; ctx.lineWidth=1.6; ctx.fill(); ctx.stroke();
        // deck well
        ctx.fillStyle='#7a4e1b'; ctx.beginPath(); ctx.ellipse(0,3,3.3,8,0,0,6.283); ctx.fill();
        // billowed sail (top-down) with a small mark
        ctx.fillStyle='#fbf4e6'; ctx.strokeStyle='#b09666'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.ellipse(0,-4,6.6,4.6,0,0,6.283); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#365a86'; ctx.beginPath(); ctx.arc(0,-4,1.5,0,6.283); ctx.fill();
        ctx.fillStyle='#5f3c14'; ctx.beginPath(); ctx.arc(0,2,1.2,0,6.283); ctx.fill();
        // bow wave
        ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=1.3;
        ctx.beginPath(); ctx.moveTo(-6,-13); ctx.quadraticCurveTo(0,-19,6,-13); ctx.stroke();
        ctx.restore();
        ctx.fillStyle='rgba(120,80,30,0.8)'; ctx.font="bold 9px 'Helvetica Neue',Arial,sans-serif"; ctx.textAlign='center';
        ctx.fillText('YOU', x, y - 26 + bob);
        return;
      }

      // exhaust flame
      const fh = 14 + Math.sin(t*16)*5 + (moving?6:0);
      const fg = ctx.createLinearGradient(0, 22, 0, 22+fh);
      fg.addColorStop(0,'rgba(255,200,60,0.95)'); fg.addColorStop(0.5,'rgba(255,120,30,0.7)'); fg.addColorStop(1,'rgba(255,60,20,0)');
      ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(-7,22); ctx.lineTo(0,22+fh); ctx.lineTo(7,22); ctx.closePath(); ctx.fill();

      // fins
      ctx.fillStyle = '#d23b3b';
      ctx.beginPath(); ctx.moveTo(-9,16); ctx.lineTo(-17,26); ctx.lineTo(-9,24); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(9,16); ctx.lineTo(17,26); ctx.lineTo(9,24); ctx.closePath(); ctx.fill();

      // body (capsule)
      const bg2 = ctx.createLinearGradient(-10,0,10,0);
      bg2.addColorStop(0,'#b9c4d8'); bg2.addColorStop(0.5,'#f2f6ff'); bg2.addColorStop(1,'#aeb9cd');
      ctx.fillStyle = bg2;
      ctx.beginPath();
      ctx.moveTo(-10,18); ctx.quadraticCurveTo(-11,-8,0,-22); ctx.quadraticCurveTo(11,-8,10,18); ctx.closePath(); ctx.fill();
      // nose band
      ctx.fillStyle = 'var(--accent)'; ctx.beginPath(); ctx.moveTo(-7,-6); ctx.quadraticCurveTo(0,-12,7,-6); ctx.lineTo(6,0); ctx.lineTo(-6,0); ctx.closePath(); ctx.fill();
      // window
      ctx.fillStyle = '#7fd0ff'; ctx.beginPath(); ctx.arc(0,8,5,0,6.283); ctx.fill();
      ctx.strokeStyle = 'var(--gold)'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(-1.6,6.4,1.6,0,6.283); ctx.fill();

      // avatar riding on top
      ctx.save(); ctx.translate(0,-22); rider(t); ctx.restore();
      ctx.restore();

      // name tag
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = "bold 9px 'Helvetica Neue',Arial,sans-serif"; ctx.textAlign='center';
      ctx.fillText('YOU', x, y - 44 + bob);
    }

    let animId;
    function loop(ts) {
      const st = stateRef.current;
      const dt = Math.min((ts - st.last)/16.67, 3); st.last = ts; st.time += 0.016;
      const pl = st.player, k = st.keys;
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const acc = light ? 0.22 : 0.22;      // rocket now sails at the same calm pace as the boat
      const max = light ? 2.3 : 2.3;
      let ax=0, ay=0;
      if (k['ArrowLeft']||k['a']||k['A']) ax -= 1;
      if (k['ArrowRight']||k['d']||k['D']) ax += 1;
      if (k['ArrowUp']||k['w']||k['W']) ay -= 1;
      if (k['ArrowDown']||k['s']||k['S']) ay += 1;
      pl.vx += ax*acc*dt; pl.vy += ay*acc*dt;
      pl.vx *= Math.pow(0.86,dt); pl.vy *= Math.pow(0.86,dt);
      const sp = Math.hypot(pl.vx,pl.vy); if (sp>max){ pl.vx=pl.vx/sp*max; pl.vy=pl.vy/sp*max; }
      pl.x = Math.max(28, Math.min(VW-28, pl.x+pl.vx));
      pl.y = Math.max(40, Math.min(VH-34, pl.y+pl.vy));
      pl.tilt += ((pl.vx*0.05) - pl.tilt) * 0.2;
      if (sp > 0.25) { const target=Math.atan2(pl.vy,pl.vx); pl.heading += Math.atan2(Math.sin(target-pl.heading),Math.cos(target-pl.heading)) * 0.2; }

      let nearest=null, nd=Infinity;
      for (const p of PORTALS){ const d=Math.hypot(p.x-pl.x,p.y-pl.y); if(d<nd){nd=d;nearest=p;} }
      st.nearPortal = nd<86 ? nearest : null;
      setNearLabel(st.nearPortal ? st.nearPortal.label : null);

      bg(st.time, light);
      for (const p of PORTALS){ drawPortal(p, Math.hypot(p.x-pl.x,p.y-pl.y), st.time, light); }
      drawRocket(pl, st.time, light);
      animId = requestAnimationFrame(loop);
    }

    const onKeyDown = (e) => {
      stateRef.current.keys[e.key] = true;
      if ((e.key==='e'||e.key==='E'||e.key==='Enter') && stateRef.current.nearPortal){
        e.preventDefault(); e.stopPropagation();
        const id=stateRef.current.nearPortal.id; onCloseRef.current(); onNavRef.current(id); return;
      }
      if (e.key==='Escape'){ e.preventDefault(); onCloseRef.current(); return; }
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Enter','e','E'].includes(e.key)) e.preventDefault();
    };
    const onKeyUp = (e) => { delete stateRef.current.keys[e.key]; };
    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX-rect.left)*(VW/rect.width), my = (e.clientY-rect.top)*(VH/rect.height);
      for (const p of PORTALS){ if (Math.hypot(p.x-mx,p.y-my)<28){ onCloseRef.current(); onNavRef.current(p.id); } }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('click', onClick);
    loop(performance.now());   // kick synchronously so a first frame paints even if rAF is throttled

    return () => { cancelAnimationFrame(animId); window.removeEventListener('keydown',onKeyDown); window.removeEventListener('keyup',onKeyUp); canvas.removeEventListener('click',onClick); };
  }, []);

  /* ── D-pad button ── */
  const padBtn = (label, key) => (
    <button
      onTouchStart={e=>{e.preventDefault(); setKey(key,true);}}
      onTouchEnd={e=>{e.preventDefault(); setKey(key,false);}}
      onTouchCancel={e=>{e.preventDefault(); setKey(key,false);}}
      onMouseDown={()=>setKey(key,true)} onMouseUp={()=>setKey(key,false)} onMouseLeave={()=>setKey(key,false)}
      style={{ width:'48px', height:'48px', background: isLight?'rgba(217,154,52,0.18)':'rgba(34,85,232,0.4)', border:`1px solid ${isLight?'rgba(217,154,52,0.6)':'rgba(77,127,255,0.6)'}`, borderRadius:'12px', color: isLight?'#8a5a12':'#fff', fontSize:'18px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', userSelect:'none', WebkitUserSelect:'none', touchAction:'none' }}
    >{label}</button>
  );

  return (
    <div style={{ position:'fixed', inset:0, zIndex:2000, background: isLight?'rgba(60,40,10,0.55)':'rgba(2,4,12,0.95)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px' }}
      onClick={e=>{ if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ position:'relative', width:'min(880px,100%)', maxHeight:'calc(100vh - 20px)', background: isLight?'#fff9ec':'#040a16', border:`1px solid ${isLight?'rgba(217,154,52,0.4)':'rgba(34,85,232,0.35)'}`, borderRadius:'18px', overflow:'hidden', boxShadow: isLight?'0 30px 70px rgba(120,80,20,0.35)':'0 0 0 1px rgba(34,85,232,0.2),0 40px 80px rgba(0,0,0,0.8)', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid var(--line)', background: isLight?'rgba(255,246,224,0.9)':'rgba(6,12,26,0.8)', flexShrink:0 }}>
          <div style={{ minWidth:0 }}>
            <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'15px', fontWeight:700, color:'var(--ink)' }}>{isLight ? 'Chart the Voyage ⚓' : 'Explore My World 🚀'}</p>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'var(--ink-4)', marginTop:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {nearLabel ? `${isLight?'⚓':'★'} ${nearLabel} in range · press ENTER` : (isLight ? 'Sail your ship to an island to open a section' : 'Fly your rocket to a star to open a section')}
            </p>
          </div>
          <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
            <button onClick={()=>setShowHelp(s=>!s)} title="How to play" style={{ background:'var(--surface-2)', border:'1px solid var(--line-2)', borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', color:'var(--ink-3)', fontSize:'14px', fontWeight:700 }}>?</button>
            <button onClick={onClose} aria-label="Close" style={{ background:'var(--surface-2)', border:'1px solid var(--line-2)', borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', color:'var(--ink-3)', fontSize:'17px', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>
        </div>

        {/* Play field */}
        <div style={{ position:'relative', background: isLight?'#2f7ba8':'#03040d' }}>
          <canvas ref={canvasRef} style={{ display:'block', width:'100%', aspectRatio:`${VW}/${VH}`, cursor:'pointer' }} />
          {showHelp && (
            <div style={{ position:'absolute', inset:0, background: isLight?'rgba(255,248,232,0.94)':'rgba(3,5,14,0.9)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }} onClick={()=>setShowHelp(false)}>
              <div style={{ maxWidth:'380px', textAlign:'center' }}>
                <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'20px', fontWeight:700, color:'var(--ink)', marginBottom:'14px' }}>How to play {isLight?'🗺️':'🕹'}</p>
                <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', color:'var(--ink-2)', lineHeight:1.8 }}>
                  {isLight ? <>Sail your <strong style={{color:'var(--gold-ink)'}}>ship</strong> across the chart with <strong style={{color:'var(--accent-2)'}}>WASD / arrow keys</strong> on desktop, or the <strong style={{color:'var(--accent-2)'}}>on-screen pad</strong> on mobile. Glide up to any <strong style={{color:'var(--gold-ink)'}}>⚓ island</strong> and press <strong style={{color:'#0e8a5f'}}>E / ENTER</strong> (or tap it) to land on that section. Press <strong>ESC</strong> to close.</> : <>Pilot your rocket with <strong style={{color:'var(--accent-2)'}}>WASD / arrow keys</strong> on desktop, or the <strong style={{color:'var(--accent-2)'}}>on-screen pad</strong> on mobile. Fly close to any glowing <strong style={{color:'var(--gold-ink)'}}>★ star</strong> and press <strong style={{color:'#10b981'}}>E / ENTER</strong> (or tap the star) to open that section. Press <strong>ESC</strong> to close.</>}
                </p>
                <button onClick={()=>setShowHelp(false)} style={{ marginTop:'18px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:'8px', padding:'9px 22px', cursor:'pointer', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:600 }}>Got it</button>
              </div>
            </div>
          )}
        </div>

        {/* Control deck - separate, never overlaps the play field */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', padding:'14px 20px', background: isLight?'rgba(255,246,224,0.96)':'rgba(6,11,22,0.96)', borderTop:'1px solid var(--line)', flexShrink:0 }}>
          {/* D-pad */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
            {padBtn('↑','ArrowUp')}
            <div style={{ display:'flex', gap:'5px' }}>{padBtn('←','ArrowLeft')}{padBtn('↓','ArrowDown')}{padBtn('→','ArrowRight')}</div>
          </div>

          {/* center hint */}
          <div style={{ flex:1, textAlign:'center', minWidth:0 }}>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'var(--ink-4)', lineHeight:1.5 }}>
              {nearLabel ? <span style={{color:'var(--gold-ink)',fontWeight:700}}>{isLight?'⚓':'★'} {nearLabel} in range</span> : (isLight ? 'Sail toward an island ⚓' : 'Move toward a star ★')}
            </p>
          </div>

          {/* ENTER */}
          <button onClick={tryEnter} disabled={!nearLabel}
            style={{ width:'74px', height:'74px', background: nearLabel ? 'radial-gradient(circle at 40% 35%,#e8c45c,#b88a2a)' : 'rgba(201,168,76,0.18)', border:`2px solid ${nearLabel?'rgba(201,168,76,0.95)':'rgba(201,168,76,0.35)'}`, borderRadius:'50%', color: nearLabel?'#1a1206':'#7a6a3a', fontSize:'11px', fontWeight:800, fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", cursor: nearLabel?'pointer':'default', letterSpacing:'0.5px', boxShadow: nearLabel?'0 0 24px rgba(201,168,76,0.5)':'none', transition:'all 0.2s ease', flexShrink:0 }}>
            ENTER
          </button>
        </div>
      </div>
    </div>
  );
}

window.SahajGame = Game;
