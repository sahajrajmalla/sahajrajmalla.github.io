// Home.jsx - mobile-first hero; backdrops (night space / day voyage) live in Backdrops.jsx
const { useState, useEffect, useRef } = React;

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
        border:`1px solid ${h ? 'var(--accent-line)' : 'var(--pill-line)'}`,
        background: h ? 'var(--accent-soft)' : 'var(--surface)',
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
  // defer the heavy backdrop simulation until after the hero content has painted,
  // so first paint (and the loader hand-off) stays instant
  const [bgReady, setBgReady] = useState(false);
  useEffect(() => {
    // defer past first paint, but via timers (rAF is paused while the tab/iframe
    // is offscreen, which would leave the backdrop permanently unmounted)
    const t = setTimeout(() => setBgReady(true), 45);
    return () => clearTimeout(t);
  }, []);

  const SpaceCanvas = window.SahajSpaceCanvas;
  const Sunshine = window.SahajSunshine;

  const pad = mobile ? '92px 20px 64px' : '60px 48px';

  return (
    <div style={{
      minHeight:'100vh', paddingTop:'0', position:'relative',
      background: isLight
        ? 'linear-gradient(180deg,#8fbfe0 0%,#a3cce6 46%,#7fb4d6 100%)'
        : 'linear-gradient(160deg,#04091a 0%,#060c1e 55%,#050a18 100%)',
      overflow:'hidden', display:'flex', alignItems:'center',
    }}>
      {bgReady && (isLight ? <Sunshine mobile={mobile} /> : <SpaceCanvas mobile={mobile} />)}

      {/* legibility scrim - keeps text readable over the backdrop */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background: isLight
          ? (mobile
              ? 'linear-gradient(180deg,rgba(150,192,220,0.4) 0%,rgba(150,192,220,0.12) 45%,rgba(120,170,205,0.34) 100%)'
              : 'radial-gradient(ellipse 80% 96% at 30% 52%,rgba(196,222,238,0.5) 0%,rgba(190,218,236,0.22) 55%,transparent 82%)')
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
            {[{val:10,suf:'',lbl:'Publications'},{val:9,suf:'',lbl:'Awards'},{val:4000,suf:'+',lbl:'Customers served'}].map((s,i)=>(
              <div key={i}>
                <div style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'clamp(28px,7vw,52px)', fontWeight:700, color:'var(--ink)', lineHeight:1 }}>
                  <Counter target={s.val} delay={800 + i*260} />{s.suf}
                </div>
                <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', color:'var(--ink-3)', marginTop:'5px', letterSpacing:'0.4px' }}>{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div id="home-ctas" style={{ display:'flex', gap:'12px', marginBottom:'26px', flexWrap:'wrap', justifyContent: mobile ? 'center' : 'flex-start' }}>
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
          <div style={{ position:'relative', borderRadius:'18px', overflow:'hidden', aspectRatio:'4/5', boxShadow:'var(--photo-ring), var(--photo-shadow)' }}>
            <img src="assets/sahaj3.jpeg" alt="Sahaj Raj Malla" loading="eager" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 16%', display:'block' }} />
            <div style={{ position:'absolute', inset:0, background: isLight
              ? 'linear-gradient(to top,rgba(80,52,20,0.38) 0%,transparent 50%)'
              : 'linear-gradient(to top,rgba(4,9,26,0.75) 0%,transparent 55%)' }} />
          </div>
          <a href="https://www.nature.com/articles/s41598-025-30871-z" target="_blank" rel="noopener noreferrer"
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='var(--shadow-card)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}
            style={{ display:'flex', alignItems:'center', gap:'12px', marginTop:'14px', padding:'12px 14px', background:'var(--q1-bg)', border:'1px solid var(--q1-line)', borderRadius:'10px', textDecoration:'none', transition:'all 0.2s ease' }}>
            <span style={{ width:'34px', height:'34px', background:'var(--q1-chip)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', fontWeight:800, letterSpacing:'0.4px', color:'var(--purple)', flexShrink:0 }}>Q1</span>
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
          <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', fontWeight:700, letterSpacing:'1.6px', textTransform:'uppercase', color: (!isLight && expHov) ? '#fff' : 'var(--ink)' }}>{isLight ? 'Set Sail' : 'Explore My World'}</span>
          <span style={{ display:'flex', color: expHov ? 'var(--ink-2)' : 'var(--ink-4)', transition:'color 0.25s' }}>
            {window.SahajIcons && window.SahajIcons.arrowRight({ size:15, color:'currentColor', strokeW:2.2 })}
          </span>
        </button>
      )}
    </div>
  );
}

window.SahajHome = Home;
