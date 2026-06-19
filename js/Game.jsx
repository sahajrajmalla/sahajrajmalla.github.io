// Game.jsx — "Explore My World": pilot a rocket (avatar riding on top) between star portals.
// Controls live in a deck BELOW the play field so they never overlap the portals.
const { useEffect, useRef, useState } = React;

const VW = 820, VH = 430;

const PORTALS = [
  { id:'about',    label:'ABOUT',    x:150, y:120, color:'#4d7fff', rgb:'77,127,255' },
  { id:'research', label:'RESEARCH', x:415, y:90,  color:'#8b5cf6', rgb:'139,92,246' },
  { id:'projects', label:'PROJECTS', x:680, y:130, color:'#10b981', rgb:'16,185,129' },
  { id:'phd',      label:'FOR PhD',  x:585, y:265, color:'#c9a84c', rgb:'201,168,76' },
  { id:'contact',  label:'CONTACT',  x:230, y:270, color:'#ff6b6b', rgb:'255,107,107' },
];

function Game({ onClose, onNavigate }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);
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

    stateRef.current = { player:{ x:VW/2, y:VH-70, vx:0, vy:0, tilt:0 }, keys:{}, time:0, nearPortal:null, last:0 };

    function starPath(cx, cy, spikes, outer, inner) {
      let rot = -Math.PI/2; const step = Math.PI/spikes;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(rot)*outer, cy + Math.sin(rot)*outer);
      for (let i=0;i<spikes;i++){ rot+=step; ctx.lineTo(cx+Math.cos(rot)*inner, cy+Math.sin(rot)*inner); rot+=step; ctx.lineTo(cx+Math.cos(rot)*outer, cy+Math.sin(rot)*outer); }
      ctx.closePath();
    }

    function bg(t) {
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

    function drawPortal(p, dist, t) {
      const near = dist < 86;
      const pulse = Math.sin(t*3 + p.x)*0.12 + 0.9;
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

    function drawRocket(pl, t) {
      const x = pl.x, y = pl.y;
      const moving = Math.abs(pl.vx)+Math.abs(pl.vy) > 0.5;
      const bob = Math.sin(t*8)*1.5;
      const tilt = pl.tilt; // -0.3..0.3 based on vx
      ctx.save(); ctx.translate(x, y + bob); ctx.rotate(tilt);

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
      ctx.fillStyle = '#2255e8'; ctx.beginPath(); ctx.moveTo(-7,-6); ctx.quadraticCurveTo(0,-12,7,-6); ctx.lineTo(6,0); ctx.lineTo(-6,0); ctx.closePath(); ctx.fill();
      // window
      ctx.fillStyle = '#7fd0ff'; ctx.beginPath(); ctx.arc(0,8,5,0,6.283); ctx.fill();
      ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(-1.6,6.4,1.6,0,6.283); ctx.fill();

      // ── avatar riding on top (cartoon) ──
      const wave = Math.sin(t*6)*0.5;
      ctx.save(); ctx.translate(0,-22);
      // body / Vice City shirt
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
      ctx.fillRect(-5,-13.5,10,3); ctx.fillStyle='#c9a84c'; ctx.fillRect(-5,-11,10,1);
      // face
      ctx.fillStyle = '#1a0a0a'; ctx.beginPath(); ctx.arc(-1.6,-9,0.7,0,6.283); ctx.fill(); ctx.beginPath(); ctx.arc(1.6,-9,0.7,0,6.283); ctx.fill();
      ctx.strokeStyle='#1a0a0a'; ctx.lineWidth=0.6; ctx.beginPath(); ctx.arc(0,-7.5,1.6,0.2,Math.PI-0.2); ctx.stroke();
      ctx.restore();

      ctx.restore();

      // name tag
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = "bold 9px 'Helvetica Neue',Arial,sans-serif"; ctx.textAlign='center';
      ctx.fillText('YOU', x, y - 44 + bob);
    }

    let animId;
    function loop(ts) {
      const st = stateRef.current;
      const dt = Math.min((ts - st.last)/16.67, 3); st.last = ts; st.time += 0.016;
      const pl = st.player, k = st.keys, acc = 0.5;
      let ax=0, ay=0;
      if (k['ArrowLeft']||k['a']||k['A']) ax -= 1;
      if (k['ArrowRight']||k['d']||k['D']) ax += 1;
      if (k['ArrowUp']||k['w']||k['W']) ay -= 1;
      if (k['ArrowDown']||k['s']||k['S']) ay += 1;
      pl.vx += ax*acc*dt; pl.vy += ay*acc*dt;
      pl.vx *= Math.pow(0.85,dt); pl.vy *= Math.pow(0.85,dt);
      const sp = Math.hypot(pl.vx,pl.vy); const max=4.6; if (sp>max){ pl.vx=pl.vx/sp*max; pl.vy=pl.vy/sp*max; }
      pl.x = Math.max(28, Math.min(VW-28, pl.x+pl.vx));
      pl.y = Math.max(40, Math.min(VH-34, pl.y+pl.vy));
      pl.tilt += ((pl.vx*0.05) - pl.tilt) * 0.2;

      let nearest=null, nd=Infinity;
      for (const p of PORTALS){ const d=Math.hypot(p.x-pl.x,p.y-pl.y); if(d<nd){nd=d;nearest=p;} }
      st.nearPortal = nd<86 ? nearest : null;
      setNearLabel(st.nearPortal ? st.nearPortal.label : null);

      bg(st.time);
      for (const p of PORTALS){ drawPortal(p, Math.hypot(p.x-pl.x,p.y-pl.y), st.time); }
      drawRocket(pl, st.time);
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
      style={{ width:'48px', height:'48px', background:'rgba(34,85,232,0.4)', border:'1px solid rgba(77,127,255,0.6)', borderRadius:'12px', color:'#fff', fontSize:'18px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', userSelect:'none', WebkitUserSelect:'none', touchAction:'none' }}
    >{label}</button>
  );

  return (
    <div style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(2,4,12,0.95)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px' }}
      onClick={e=>{ if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ position:'relative', width:'min(880px,100%)', maxHeight:'calc(100vh - 20px)', background:'#040a16', border:'1px solid rgba(34,85,232,0.35)', borderRadius:'18px', overflow:'hidden', boxShadow:'0 0 0 1px rgba(34,85,232,0.2),0 40px 80px rgba(0,0,0,0.8)', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid rgba(14,31,61,0.8)', background:'rgba(6,12,26,0.8)', flexShrink:0 }}>
          <div style={{ minWidth:0 }}>
            <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'15px', fontWeight:700, color:'#eef1fa' }}>Explore My World 🚀</p>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'#7fa0c8', marginTop:'2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {nearLabel ? `★ ${nearLabel} in range — press ENTER` : 'Fly your rocket to a star to open a section'}
            </p>
          </div>
          <div style={{ display:'flex', gap:'8px', flexShrink:0 }}>
            <button onClick={()=>setShowHelp(s=>!s)} title="How to play" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', color:'#9ab0cc', fontSize:'14px', fontWeight:700 }}>?</button>
            <button onClick={onClose} aria-label="Close" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', width:'32px', height:'32px', cursor:'pointer', color:'#9ab0cc', fontSize:'17px', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          </div>
        </div>

        {/* Play field */}
        <div style={{ position:'relative', background:'#03040d' }}>
          <canvas ref={canvasRef} style={{ display:'block', width:'100%', aspectRatio:`${VW}/${VH}`, cursor:'pointer' }} />
          {showHelp && (
            <div style={{ position:'absolute', inset:0, background:'rgba(3,5,14,0.9)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }} onClick={()=>setShowHelp(false)}>
              <div style={{ maxWidth:'380px', textAlign:'center' }}>
                <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'20px', fontWeight:700, color:'#eef1fa', marginBottom:'14px' }}>How to play 🕹</p>
                <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', color:'#c8d4ee', lineHeight:1.8 }}>
                  Pilot your rocket with <strong style={{color:'#4d7fff'}}>WASD / arrow keys</strong> on desktop, or the <strong style={{color:'#4d7fff'}}>on-screen pad</strong> on mobile. Fly close to any glowing <strong style={{color:'#c9a84c'}}>★ star</strong> and press <strong style={{color:'#10b981'}}>E / ENTER</strong> (or tap the star) to open that section. Press <strong>ESC</strong> to close.
                </p>
                <button onClick={()=>setShowHelp(false)} style={{ marginTop:'18px', background:'#2255e8', color:'#fff', border:'none', borderRadius:'8px', padding:'9px 22px', cursor:'pointer', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:600 }}>Got it</button>
              </div>
            </div>
          )}
        </div>

        {/* Control deck — separate, never overlaps the play field */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', padding:'14px 20px', background:'rgba(6,11,22,0.96)', borderTop:'1px solid rgba(14,31,61,0.9)', flexShrink:0 }}>
          {/* D-pad */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
            {padBtn('↑','ArrowUp')}
            <div style={{ display:'flex', gap:'5px' }}>{padBtn('←','ArrowLeft')}{padBtn('↓','ArrowDown')}{padBtn('→','ArrowRight')}</div>
          </div>

          {/* center hint */}
          <div style={{ flex:1, textAlign:'center', minWidth:0 }}>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'#5f7ba0', lineHeight:1.5 }}>
              {nearLabel ? <span style={{color:'#c9a84c',fontWeight:700}}>★ {nearLabel} in range</span> : 'Move toward a star ★'}
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
