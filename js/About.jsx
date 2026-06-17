// About.jsx — "To better know me": bio, interests, toolbox, press, swipeable photo carousel
const { useState, useEffect, useRef } = React;

/* ── Swipeable, auto-advancing photo carousel ── */
function PhotoCarousel({ slides, radius = 18 }) {
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const startX = useRef(null);
  const paused = useRef(false);
  const N = slides.length;

  useEffect(() => {
    const t = setInterval(() => { if (!paused.current) setIdx(i => (i + 1) % N); }, 4500);
    return () => clearInterval(t);
  }, [N]);

  const start = (x) => { startX.current = x; paused.current = true; };
  const move  = (x) => { if (startX.current != null) setDrag(x - startX.current); };
  const end   = () => {
    if (Math.abs(drag) > 45) setIdx(i => (i + (drag < 0 ? 1 : -1) + N) % N);
    setDrag(0); startX.current = null;
    setTimeout(() => { paused.current = false; }, 600);
  };

  return (
    <div
      style={{ position:'relative', borderRadius:`${radius}px`, overflow:'hidden', aspectRatio:'3/4', boxShadow:'0 0 0 1px rgba(201,168,76,0.28),0 22px 55px rgba(0,0,0,0.62)', cursor:'grab', userSelect:'none', touchAction:'pan-y' }}
      onTouchStart={e=>start(e.touches[0].clientX)}
      onTouchMove={e=>move(e.touches[0].clientX)}
      onTouchEnd={end}
      onMouseDown={e=>start(e.clientX)}
      onMouseMove={e=>{ if (startX.current != null) move(e.clientX); }}
      onMouseUp={end}
      onMouseLeave={()=>{ if (startX.current != null) end(); }}
    >
      <div style={{ display:'flex', width:`${N*100}%`, height:'100%', transform:`translateX(calc(${-idx*(100/N)}% + ${drag}px))`, transition: drag ? 'none' : 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }}>
        {slides.map((s,i)=>(
          <div key={i} style={{ width:`${100/N}%`, height:'100%', position:'relative' }}>
            <img src={s.src} alt={s.alt} draggable={false} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:s.pos, display:'block', pointerEvents:'none' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(4,9,26,0.82) 0%,transparent 50%)' }} />
            <div style={{ position:'absolute', bottom:'42px', left:'20px', right:'20px' }}>
              <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'clamp(15px,2vw,19px)', fontStyle:'italic', color:'#eef1fa', lineHeight:1.35, textWrap:'pretty' }}>{s.caption}</p>
              {s.sub && <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase', color:'#c9a84c', marginTop:'6px' }}>{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>
      {/* dots */}
      <div style={{ position:'absolute', bottom:'16px', left:0, right:0, display:'flex', justifyContent:'center', gap:'7px' }}>
        {slides.map((_,i)=>(
          <button key={i} onClick={()=>setIdx(i)} aria-label={`Slide ${i+1}`}
            style={{ width: i===idx ? '22px' : '7px', height:'7px', borderRadius:'4px', border:'none', cursor:'pointer', background: i===idx ? '#c9a84c' : 'rgba(255,255,255,0.4)', transition:'all 0.3s ease', padding:0 }} />
        ))}
      </div>
    </div>
  );
}

function ExpCard({ role, org, period, current, desc }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={()=>setOpen(!open)} style={{ borderLeft:`3px solid ${current?'#2255e8':'#1a3060'}`, paddingLeft:'24px', paddingBottom:'28px', cursor:'pointer', userSelect:'none' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', flexWrap:'wrap' }}>
        <div>
          <h4 style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'18px', fontWeight:700, color:'#e8edf8', marginBottom:'4px' }}>{role}</h4>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', color: current?'#4d7fff':'#a0b8d8', fontWeight: current?600:400 }}>{org}</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
          <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', color:'#7090aa', letterSpacing:'0.3px' }}>{period}</span>
          {current && <span style={{ background:'rgba(34,85,232,0.15)', border:'1px solid rgba(34,85,232,0.4)', borderRadius:'12px', padding:'2px 8px', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'10px', fontWeight:700, color:'#4d7fff', letterSpacing:'1px', textTransform:'uppercase' }}>Now</span>}
        </div>
      </div>
      {open
        ? <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', color:'#b0c0dc', lineHeight:1.7, marginTop:'10px', maxWidth:'560px' }}>{desc}</p>
        : <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'#5a7090', marginTop:'4px', letterSpacing:'0.3px' }}>Tap to expand ↓</p>}
    </div>
  );
}

const LIGHT_BRANDS = ['#F7DF1E','#FCC624','#FFD21E','#FF9900','#F7931E','#F37626','#61DAFB','#ffffff'];
function SkillBadge({ name, brand }) {
  const [h, setH] = useState(false);
  const bg = brand || '#2255e8';
  const abbr = name.length <= 2 ? name : name.slice(0,2).toUpperCase();
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 12px', background: h?`${bg}22`:`${bg}12`, border:`1px solid ${bg}${h?'66':'33'}`, borderRadius:'8px', cursor:'default', transition:'all 0.18s ease', transform: h?'translateY(-2px)':'none' }}>
      <span style={{ width:'22px', height:'22px', borderRadius:'5px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'9px', fontWeight:800, color: LIGHT_BRANDS.includes(bg)?'#111':'#fff', flexShrink:0 }}>{abbr}</span>
      <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', fontWeight:500, color: h?'#e8edf8':'#b8c6de', whiteSpace:'nowrap' }}>{name}</span>
    </div>
  );
}

function About() {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const padX = mobile ? '20px' : '48px';

  const slides = [
    { src:'assets/sahaj2.jpg',  alt:'Sahaj Raj Malla', pos:'center top', caption:'Curiosity is the engine.', sub:'AI Researcher' },
    { src:'assets/sahaj1.jpg',  alt:'Sahaj Raj Malla in the mountains', pos:'center 8%', caption:'Five windows, one room — one question.', sub:'Builder · Thinker' },
    { src:'assets/sahaj3.jpeg', alt:'Sahaj Raj Malla with Nepal flag', pos:'50% 30%', caption:'Proudly Nepali — building for the world, from here.', sub:'Nepal' },
  ];

  return (
    <div style={{ minHeight:'100vh', paddingTop:'64px', background:'#060c1a' }}>

      {/* ── Hero band ── */}
      <div style={{ background:'linear-gradient(135deg,#080f22 0%,#060c1a 100%)', borderBottom:'1px solid #0e1f3d', padding:`56px ${padX} 0`, maxWidth:'1320px', margin:'0 auto' }}>
        <div style={{ display:'flex', gap: mobile?'36px':'60px', alignItems:'flex-start', flexWrap:'wrap' }}>

          {/* Text */}
          <div style={{ flex:'1', minWidth:'280px', order: mobile?2:1 }}>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#4d7fff', marginBottom:'14px' }}>About</p>
            <h2 style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'clamp(30px,6vw,56px)', fontWeight:700, color:'#e8edf8', lineHeight:1.1, letterSpacing:'-0.5px', marginBottom:'26px' }}>
              To better know me.
            </h2>

            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'clamp(15px,1.7vw,17px)', color:'#d2dcf0', lineHeight:1.8, maxWidth:'560px', marginBottom:'20px' }}>
              I love art, philosophy, psychology, mathematics, and code. Most people see five separate rooms; I see one room with five windows, and the view through all of them is the same question — <em style={{ color:'#fff', fontStyle:'italic' }}>what is intelligence, and can we build it?</em> That question is the reason I do AI.
            </p>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'clamp(14px,1.5vw,16px)', color:'#aebcd6', lineHeight:1.8, maxWidth:'560px', marginBottom:'30px' }}>
              I taught myself to build software from scratch, went deep into industry, founded a startup serving 4,000+ users, and kept following the harder question — until it pointed at artificial intelligence.
            </p>

            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
              {['Omnivert','Curious by default','Builder','Obsessive learner','Open collaborator'].map(t=>(
                <span key={t} style={{ background:'rgba(34,85,232,0.1)', border:'1px solid rgba(34,85,232,0.3)', borderRadius:'20px', padding:'5px 14px', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', color:'#85a8f5' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div style={{ flexShrink:0, width: mobile ? 'min(330px,82vw)' : 'clamp(230px,24vw,310px)', order: mobile?1:2, paddingBottom: mobile?0:'32px', margin: mobile?'0 auto':0 }}>
            <PhotoCarousel slides={slides} />
            <p style={{ textAlign:'center', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'#5a7090', marginTop:'10px', letterSpacing:'0.3px' }}>← swipe through →</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1320px', margin:'0 auto', padding:`52px ${padX}` }}>

        {/* ── Interests ── */}
        <div style={{ marginBottom:'52px' }}>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#c9a84c', marginBottom:'22px' }}>Beyond the Lab</p>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {d.interests.map(i=>(
              <div key={i.label} style={{ display:'flex', alignItems:'center', gap:'10px', background:'rgba(255,255,255,0.035)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'11px 18px' }}>
                <span style={{ fontSize:'20px' }}>{i.icon}</span>
                <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', color:'#d2dcf0', fontWeight:500 }}>{i.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Technical Toolbox ── */}
        <div style={{ marginBottom:'60px' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'26px', flexWrap:'wrap' }}>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#4d7fff' }}>Technical Toolbox</p>
            <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'#5a7090' }}>grouped by craft</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill,minmax(300px,1fr))', gap:'18px' }}>
            {d.skillGroups.map(grp=>(
              <div key={grp.label} style={{ background:'rgba(255,255,255,0.025)', border:'1px solid #0e1f3d', borderRadius:'12px', padding:'18px 20px' }}>
                <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:grp.color, marginBottom:'12px' }}>{grp.label}</p>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {grp.skills.map(sk=><SkillBadge key={sk.name} name={sk.name} brand={sk.brand} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Experience ── */}
        <div style={{ marginBottom:'60px' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'30px', flexWrap:'wrap' }}>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#4d7fff' }}>Professional Journey</p>
            <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'#5a7090' }}>tap any role for detail</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {d.experience.map((e,i)=><ExpCard key={i} {...e} />)}
          </div>
        </div>

        {/* ── Education ── */}
        <div style={{ marginBottom:'52px' }}>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#4d7fff', marginBottom:'20px' }}>Education</p>
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid #0e1f3d', borderRadius:'12px', padding:'22px 28px', display:'flex', alignItems:'center', gap:'18px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:'rgba(34,85,232,0.15)', border:'1px solid rgba(34,85,232,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>🎓</div>
            <div>
              <h4 style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'17px', fontWeight:700, color:'#e8edf8', marginBottom:'4px' }}>{d.education.degree}</h4>
              <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', color:'#a0b8d8' }}>{d.education.university} · {d.education.period}</p>
            </div>
          </div>
        </div>

        {/* ── Fellowships ── */}
        <div style={{ marginBottom:'60px' }}>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#4d7fff', marginBottom:'20px' }}>Fellowships &amp; Training</p>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {d.fellowships.map((f,i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns: mobile ? '1fr' : '2fr 2fr 1fr', gap: mobile?'4px':'16px', alignItems: mobile?'flex-start':'center', padding:'14px 0', borderBottom:'1px solid rgba(14,31,61,0.6)' }}>
                <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', fontWeight:600, color:'#d2dcf0', display:'flex', alignItems:'center', gap:'10px' }}>
                  <span>{f.icon}</span>{f.name}
                </div>
                <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', color:'#9ab0cc', paddingLeft: mobile?'28px':0 }}>{f.org}</div>
                <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', color:'#7090aa', textAlign: mobile?'left':'right', paddingLeft: mobile?'28px':0 }}>{f.period}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Press & Media ── */}
        <div>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#c9a84c', marginBottom:'22px' }}>Press &amp; Media</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {d.press.map((p,i)=>(
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px', padding:'16px 20px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.18)', borderRadius:'10px', textDecoration:'none', transition:'all 0.2s ease' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', fontWeight:600, color:'#d2dcf0', marginBottom:'3px', textWrap:'pretty' }}>{p.title}</p>
                  <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', color:'#9ab0cc' }}>{p.outlet}</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px', flexShrink:0 }}>
                  <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', fontWeight:600, color:'#b89548' }}>{p.date}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b89548" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.SahajAbout = About;
