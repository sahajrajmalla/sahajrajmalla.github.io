// App.jsx — router + page transitions + floating World FAB
const { useState, useEffect, useCallback, useRef } = React;
const PAGES = ['home','about','research','projects','phd','contact'];

function App() {
  const [page,setPage]             = useState('home');
  const [transitioning,setTrans]   = useState(false);
  const [gameOpen,setGameOpen]     = useState(false);
  const [fabHover,setFabHover]     = useState(false);
  const [fabHidden,setFabHidden]   = useState(false);
  const footerRef = useRef(null);
  const mobile = window.useIsMobile(820);
  const pending = useRef(null);

  useEffect(()=>{
    const h = window.location.hash.replace('#','');
    if(PAGES.includes(h)) setPage(h);
  },[]);

  const navigate = useCallback((id)=>{
    if(id==='game'){setGameOpen(true);setTimeout(()=>{if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();},0);return;}
    if(!PAGES.includes(id)) return;
    if(id===page&&!transitioning) return;
    pending.current=id;
    setTrans(true);
    setTimeout(()=>{
      setPage(pending.current);
      window.location.hash=pending.current;
      window.scrollTo(0,0);
      setTimeout(()=>setTrans(false),40);
    },260);
  },[page,transitioning]);

  useEffect(()=>{
    const handler=()=>{
      const h=window.location.hash.replace('#','');
      if(PAGES.includes(h)){setPage(h);setTrans(false);window.scrollTo(0,0);}
    };
    window.addEventListener('hashchange',handler);
    return ()=>window.removeEventListener('hashchange',handler);
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
    <div style={{background:'#060c1a',minHeight:'100vh',color:'#e8edf8',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif"}}>
      <Navbar currentPage={page} onNavigate={navigate}/>

      <main style={{opacity:transitioning?0:1,transform:transitioning?'translateY(-10px)':'translateY(0)',transition:'opacity 0.26s ease,transform 0.26s ease'}}>
        {CurrentPage&&<CurrentPage onNavigate={navigate}/>}
      </main>

      {/* Footer */}
      {!transitioning&&(
        <footer ref={footerRef} style={{borderTop:'1px solid #0a1628',padding:'24px 28px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'16px',background:'#04080f'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            {window.SahajLogo&&<window.SahajLogo size={26} color="rgba(200,212,238,0.35)"/>}
            <span style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'13px',color:'#8aaccc'}}>
              © {new Date().getFullYear()} Sahaj Raj Malla
            </span>
          </div>
          <p style={{fontFamily:"'Times New Roman',Georgia,serif",fontSize:'14px',fontStyle:'italic',color:'#7e9cba'}}>Stay curious.</p>
          <div style={{display:'flex',gap:'14px'}}>
            {[{l:'GitHub',k:'github',u:window.SahajData.personal.github},{l:'Google Scholar',k:'scholar',u:window.SahajData.personal.scholar},{l:'LinkedIn',k:'linkedin',u:window.SahajData.personal.linkedin}].map(lk=>(
              <a key={lk.l} href={lk.u} target="_blank" rel="noopener noreferrer" aria-label={lk.l} title={lk.l}
                onMouseEnter={e=>e.currentTarget.style.color='#cfe0ff'} onMouseLeave={e=>e.currentTarget.style.color='#7e9cba'}
                style={{color:'#7e9cba',display:'flex',transition:'color 0.2s'}}>{window.SahajIcons&&window.SahajIcons[lk.k]({size:17,color:'currentColor'})}</a>
            ))}
          </div>
        </footer>
      )}

      {/* ── Floating World FAB ── */}
      <button
        onClick={()=>{setGameOpen(true);setTimeout(()=>{if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();},0);}}
        onMouseEnter={()=>setFabHover(true)}
        onMouseLeave={()=>setFabHover(false)}
        title="Explore Sahaj's World"
        aria-label="Open interactive world"
        style={{
          position:'fixed', bottom: mobile?'18px':'28px', left: mobile?'16px':'28px',
          width: fabHover?'130px':'58px',
          height:'58px',
          borderRadius:'29px',
          background: fabHover
            ? 'linear-gradient(135deg,#1d47d6,#2255e8)'
            : 'linear-gradient(135deg,#0e2761,#2255e8)',
          border:'2px solid rgba(77,127,255,0.5)',
          boxShadow: fabHover
            ? '0 8px 24px rgba(34,85,232,0.4)'
            : '0 4px 16px rgba(34,85,232,0.28)',
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2"/>
            <ellipse cx="12" cy="12" rx="11" ry="3.6" stroke="white" strokeWidth="1.4" opacity="0.7" transform="rotate(-20 12 12)"/>
            <circle cx="22.3" cy="8.2" r="1.1" fill="#c9a84c" style={{transformOrigin:'12px 12px',animation:'spin 6s linear infinite'}}/>
          </svg>
        </span>
        {fabHover&&(
          <span style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'13px',fontWeight:700,color:'white',whiteSpace:'nowrap',letterSpacing:'0.3px'}}>
            Explore
          </span>
        )}
      </button>

      {/* Game overlay */}
      {gameOpen&&Game&&(
        <Game onClose={()=>setGameOpen(false)} onNavigate={(id)=>{setGameOpen(false);navigate(id);}}/>
      )}
    </div>
  );
}

const rootEl = document.getElementById('root');
if(rootEl) ReactDOM.createRoot(rootEl).render(<App/>);
