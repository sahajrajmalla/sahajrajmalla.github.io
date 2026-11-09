// App.jsx - router (page and section deep links) + page transitions + floating World FAB
//   #research              the page
//   #research/preprints    the page, scrolled to a section (deep link; works on load, reload, back, forward)
const { useState, useEffect, useCallback, useRef } = React;
const PAGES = ['home','about','research','projects','phd','contact'];
const UI = window.SahajUI;

function hashPath() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  try { return decodeURIComponent(raw); } catch (e) { return raw; }
}
function parseHash() {
  const raw = hashPath();
  if (!raw) return { page: 'home', section: null };
  const parts = raw.split('/');
  if (!PAGES.includes(parts[0])) return null;
  return { page: parts[0], section: parts[1] || null };
}

function App() {
  const initial = parseHash() || { page: 'home', section: null };
  const [page,setPage]             = useState(initial.page);
  const [transitioning,setTrans]   = useState(false);
  const [gameOpen,setGameOpen]     = useState(false);
  const [fabHover,setFabHover]     = useState(false);
  const [fabHidden,setFabHidden]   = useState(false);
  const footerRef = useRef(null);
  const mobile = window.useIsMobile(820);
  const theme = window.useTheme();
  const isLight = theme === 'light';

  const pageRef = useRef(initial.page);   // latest page, for handlers that outlive a render
  const transRef = useRef(false);
  const pending = useRef(initial.section); // section to scroll to once the next page has rendered
  const skipHash = useRef(null);          // hash we set ourselves; the hashchange it causes is already handled
  pageRef.current = page;

  // We restore scroll ourselves (deep links, back and forward).
  useEffect(()=>{ try { if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'; } catch(e) {} },[]);

  // After a page renders: go to its pending section, or to the top.
  useEffect(()=>{
    const sec = pending.current; pending.current = null;
    if(!sec){ UI.jumpTo(0); return; }
    let tries = 0, t2 = 0;
    const attempt = ()=>{
      if(UI.scrollToSection(sec,{instant:true})){
        // images and fonts can shift the layout; check once more shortly after
        t2 = setTimeout(()=>{
          const el = document.getElementById(sec); if(!el) return;
          const want = parseInt(getComputedStyle(el).scrollMarginTop,10)||0;
          if(Math.abs(el.getBoundingClientRect().top - want) > 8) UI.scrollToSection(sec,{instant:true});
        },500);
      } else if(tries++ < 20) requestAnimationFrame(attempt);
      else UI.jumpTo(0);
    };
    attempt();
    return ()=>clearTimeout(t2);
  },[page]);

  const navigate = useCallback((target)=>{
    if(target==='game'){setGameOpen(true);setTimeout(()=>{if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();},0);return;}
    const parts = String(target).split('/');
    const p = parts[0], section = parts[1] || null;
    if(!PAGES.includes(p)) return;
    const hash = section ? p+'/'+section : p;

    if(p===pageRef.current && !transRef.current){
      // same page: no fade, just scroll. The hash change (a history entry) does the work.
      if(hashPath()!==hash) window.location.hash = hash;
      else if(section) UI.scrollToSection(section);
      else window.scrollTo({top:0,behavior:UI.prefersReducedMotion()?'auto':'smooth'});
      return;
    }
    pending.current = section;
    transRef.current = true;
    setTrans(true);
    setTimeout(()=>{
      skipHash.current = hash;
      setPage(p);
      window.location.hash = hash;
      setTimeout(()=>{ transRef.current=false; setTrans(false); },40);
    },260);
  },[]);

  // back, forward, a pasted link, or a hash typed in the address bar
  useEffect(()=>{
    const onHash=()=>{
      const raw = hashPath();
      if(skipHash.current!==null && skipHash.current===raw){ skipHash.current=null; return; }
      const h = parseHash(); if(!h) return;
      if(h.page!==pageRef.current){
        pending.current = h.section;
        transRef.current = false; setTrans(false);
        setPage(h.page);
      } else if(h.section){
        UI.scrollToSection(h.section);
      } else {
        window.scrollTo({top:0,behavior:UI.prefersReducedMotion()?'auto':'smooth'});
      }
    };
    window.addEventListener('hashchange',onHash);
    return ()=>window.removeEventListener('hashchange',onHash);
  },[]);

  useEffect(()=>{
    const el=footerRef.current; if(!el) return;
    const io=new IntersectionObserver(([e])=>setFabHidden(e.isIntersecting),{threshold:0});
    io.observe(el);
    return ()=>io.disconnect();
  },[page,transitioning]);

  const Navbar   = window.SahajNavbar;
  const Home     = window.SahajHome;
  const About    = window.SahajAbout;
  const Research = window.SahajResearch;
  const Projects = window.SahajProjects;
  const PhD      = window.SahajPhD;
  const Contact  = window.SahajContact;
  const Game     = window.SahajGame;

  const PAGE_MAP = {home:Home,about:About,research:Research,projects:Projects,phd:PhD,contact:Contact};
  const CurrentPage = PAGE_MAP[page];

  return (
    <div style={{background:'var(--bg)',minHeight:'100vh',color:'var(--ink)',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>
      <a href="#main" className="skip-link" onClick={(e)=>{e.preventDefault();const m=document.getElementById('main');if(m){m.focus();m.scrollIntoView({block:'start'});}}}>Skip to content</a>
      <Navbar currentPage={page} onNavigate={navigate}/>

      <main id="main" tabIndex={-1} data-page={page} key={page} style={{opacity:transitioning?0:1,transform:transitioning?'translateY(-10px)':'none',transition:'opacity 0.26s ease,transform 0.26s ease',outline:'none'}}>
        <UI.ErrorBoundary key={page} fallback={<UI.CrashNotice/>}>
          {CurrentPage&&<CurrentPage onNavigate={navigate}/>}
        </UI.ErrorBoundary>
      </main>

      {/* Footer */}
      {!transitioning&&(
        <footer ref={footerRef} style={{borderTop:'1px solid var(--line)',padding:'24px 28px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px',background:'var(--bg)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            {window.SahajLogo&&<window.SahajLogo size={26} color="var(--ink-4)"/>}
            <span style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'13px',color:'var(--ink-4)'}}>
              © {new Date().getFullYear()} Sahaj Raj Malla
            </span>
          </div>
          <p style={{fontFamily:"'Times New Roman',Georgia,serif",fontSize:'14px',fontStyle:'italic',color:'var(--ink-4)'}}>Stay curious.</p>
          <div style={{display:'flex',gap:'14px'}}>
            {[{l:'GitHub',k:'github',u:window.SahajData.personal.github},{l:'Google Scholar',k:'scholar',u:window.SahajData.personal.scholar},{l:'LinkedIn',k:'linkedin',u:window.SahajData.personal.linkedin}].map(lk=>(
              <a key={lk.l} href={lk.u} target="_blank" rel="noopener noreferrer" aria-label={lk.l} title={lk.l} className="foot-icon">{window.SahajIcons&&window.SahajIcons[lk.k]({size:17,color:'currentColor'})}</a>
            ))}
          </div>
        </footer>
      )}

      {/* ── Floating World FAB ── */}
      <button
        onClick={()=>{setGameOpen(true);setTimeout(()=>{if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();},0);}}
        onMouseEnter={()=>setFabHover(true)}
        onMouseLeave={()=>setFabHover(false)}
        title={isLight ? 'Chart the voyage' : "Explore Sahaj's World"}
        aria-label="Open interactive world"
        style={{
          position:'fixed', bottom: mobile?'18px':'28px', right: mobile?'16px':'28px',
          width: fabHover?'134px':'58px',
          height:'58px',
          borderRadius:'29px',
          background: isLight
            ? (fabHover ? 'linear-gradient(135deg,#e8b34a,#c9852a)' : 'linear-gradient(135deg,#f0c860,#d99a34)')
            : (fabHover ? 'linear-gradient(135deg,#1d47d6,var(--accent))' : 'linear-gradient(135deg,var(--line-2),var(--accent))'),
          border: isLight ? '2px solid rgba(217,154,52,0.6)' : '2px solid rgba(77,127,255,0.5)',
          boxShadow: fabHover
            ? (isLight ? '0 10px 28px rgba(217,154,52,0.45)' : '0 8px 24px rgba(34,85,232,0.4)')
            : (isLight ? '0 5px 18px rgba(217,154,52,0.32)' : '0 4px 16px rgba(34,85,232,0.28)'),
          cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
          zIndex:900,
          overflow:'hidden',
          opacity: fabHidden?0:1,
          pointerEvents: fabHidden?'none':'auto',
          transform: fabHidden?'translateY(26px) scale(0.85)':'none',
          animation: fabHidden?'none':'fabBob 3.2s ease-in-out infinite',
          transition:'width 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease, transform 0.3s ease, background 0.25s, box-shadow 0.25s',
          padding:'0 16px',
        }}
      >
        <span style={{display:'flex',flexShrink:0}}>
          {isLight ? (
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2.5 L13.8 9 L20.5 10.2 L15.5 14.2 L17 21 L12 17.3 L7 21 L8.5 14.2 L3.5 10.2 L10.2 9 Z" fill="white" opacity="0.95"/>
              <circle cx="12" cy="12" r="1.6" fill="var(--gold)"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2"/>
              <ellipse cx="12" cy="12" rx="11" ry="3.6" stroke="white" strokeWidth="1.4" opacity="0.7" transform="rotate(-20 12 12)"/>
              <circle cx="22.3" cy="8.2" r="1.1" fill="var(--gold)" style={{transformOrigin:'12px 12px',animation:'spin 6s linear infinite'}}/>
            </svg>
          )}
        </span>
        {fabHover&&(
          <span style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'13px',fontWeight:700,color:'white',whiteSpace:'nowrap',letterSpacing:'0.3px'}}>
            Explore
          </span>
        )}
      </button>

      {/* Game overlay */}
      {gameOpen&&Game&&(
        <UI.ErrorBoundary fallback={null}>
          <Game onClose={()=>setGameOpen(false)} onNavigate={(id)=>{setGameOpen(false);navigate(id);}}/>
        </UI.ErrorBoundary>
      )}
    </div>
  );
}

const rootEl = document.getElementById('root');
if(rootEl) ReactDOM.createRoot(rootEl).render(<UI.ErrorBoundary fallback={<UI.CrashNotice whole/>}><App/></UI.ErrorBoundary>);
