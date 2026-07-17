// About.jsx - "To better know me": bio, interests, toolbox, press, swipeable photo carousel
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
      style={{ position:'relative', borderRadius:`${radius}px`, overflow:'hidden', aspectRatio:'3/4', boxShadow:'var(--carousel-ring), var(--carousel-shadow)', cursor:'grab', userSelect:'none', touchAction:'pan-y' }}
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
              <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'clamp(15px,2vw,19px)', fontStyle:'italic', color:'#f5f0e4', lineHeight:1.35, textWrap:'pretty' }}>{s.caption}</p>
              {s.sub && <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase', color:'#e0c56e', marginTop:'6px' }}>{s.sub}</p>}
            </div>
          </div>
        ))}
      </div>
      {/* dots */}
      <div style={{ position:'absolute', bottom:'16px', left:0, right:0, display:'flex', justifyContent:'center', gap:'7px' }}>
        {slides.map((_,i)=>(
          <button key={i} onClick={()=>setIdx(i)} aria-label={`Slide ${i+1}`}
            style={{ width: i===idx ? '22px' : '7px', height:'7px', borderRadius:'4px', border:'none', cursor:'pointer', background: i===idx ? 'var(--gold)' : 'rgba(255,255,255,0.4)', transition:'all 0.3s ease', padding:0 }} />
        ))}
      </div>
    </div>
  );
}

function ExpCard({ role, org, period, current, desc }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={()=>setOpen(!open)} style={{ borderLeft:`3px solid ${current?'var(--accent)':'var(--line-2)'}`, paddingLeft:'24px', paddingBottom:'28px', cursor:'pointer', userSelect:'none' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', flexWrap:'wrap' }}>
        <div>
          <h4 style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'18px', fontWeight:700, color:'var(--ink)', marginBottom:'4px' }}>{role}</h4>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', color: current?'var(--accent-2)':'var(--ink-3)', fontWeight: current?600:400 }}>{org}</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
          <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', color:'var(--ink-4)', letterSpacing:'0.3px' }}>{period}</span>
          {current && <span style={{ background:'var(--accent-chip)', border:'1px solid var(--accent-line-strong)', borderRadius:'12px', padding:'2px 8px', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'10px', fontWeight:700, color:'var(--accent-2)', letterSpacing:'1px', textTransform:'uppercase' }}>Now</span>}
        </div>
      </div>
      {open
        ? <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', color:'var(--ink-3)', lineHeight:1.7, marginTop:'10px', maxWidth:'560px' }}>{desc}</p>
        : <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'var(--ink-4)', marginTop:'4px', letterSpacing:'0.3px' }}>Tap to expand ↓</p>}
    </div>
  );
}

const LIGHT_BRANDS = ['#F7DF1E','#FCC624','#FFD21E','#FF9900','#F7931E','#F37626','#61DAFB','var(--ink)'];
function SkillBadge({ name, brand }) {
  const [h, setH] = useState(false);
  const bg = brand || 'var(--accent)';
  const abbr = name.length <= 2 ? name : name.slice(0,2).toUpperCase();
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 12px', background: h?`${bg}22`:`${bg}12`, border:`1px solid ${bg}${h?'66':'33'}`, borderRadius:'8px', cursor:'default', transition:'all 0.18s ease', transform: h?'translateY(-2px)':'none' }}>
      <span style={{ width:'22px', height:'22px', borderRadius:'5px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'9px', fontWeight:800, color: LIGHT_BRANDS.includes(bg)?'#111':'#fff', flexShrink:0 }}>{abbr}</span>
      <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', fontWeight:500, color: h?'var(--ink)':'var(--ink-2)', whiteSpace:'nowrap' }}>{name}</span>
    </div>
  );
}

/* ── Life gallery: masonry tiles + click-to-open lightbox ── */
function GalleryTile({ photo, onClick }) {
  const [h, setH] = useState(false);
  const [seen, setSeen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold:0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <figure ref={ref} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ position:'relative', breakInside:'avoid', marginBottom:'14px', borderRadius:'12px', overflow:'hidden', cursor:'pointer', border:'1px solid var(--line)', boxShadow: h ? 'var(--tile-shadow-hover)' : 'var(--tile-shadow)', opacity: seen?1:0, animation: seen?'galleryReveal 0.6s cubic-bezier(0.2,0,0.2,1) both':'none', transition:'box-shadow 0.25s ease' }}>
      <img src={photo.src} alt={photo.caption} loading="lazy" draggable={false}
        style={{ width:'100%', display:'block', transform: h ? 'scale(1.045)' : 'scale(1)', transition:'transform 0.55s cubic-bezier(0.2,0,0.2,1)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(4,9,26,0.88) 0%, rgba(4,9,26,0.08) 46%, transparent 72%)', opacity: h ? 1 : 0.9, transition:'opacity 0.25s' }} />
      <figcaption style={{ position:'absolute', left:'13px', right:'13px', bottom:'12px' }}>
        <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'14px', fontStyle:'italic', color:'#f5f0e4', lineHeight:1.3, textWrap:'pretty' }}>{photo.caption}</p>
        <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'9.5px', letterSpacing:'1.4px', textTransform:'uppercase', color:'#e0c56e', marginTop:'5px' }}>{photo.sub}</p>
      </figcaption>
    </figure>
  );
}

function Lightbox({ photo, index, total, onClose, onPrev, onNext }) {
  const navBtn = {
    position:'absolute', top:'50%', transform:'translateY(-50%)', width:'48px', height:'48px',
    borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.28)',
    color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2,
  };
  return ReactDOM.createPortal((
    <div onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(3,6,16,0.93)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px', animation:'fadeIn 0.22s ease' }}>
      <button onClick={(e)=>{e.stopPropagation();onClose();}} aria-label="Close"
        style={{ position:'absolute', top:'18px', right:'20px', width:'46px', height:'46px', borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.28)', color:'#fff', cursor:'pointer', fontSize:'24px', lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
      <button onClick={(e)=>{e.stopPropagation();onPrev();}} aria-label="Previous" style={{ ...navBtn, left:'16px' }}>
        <span style={{ display:'flex', transform:'rotate(180deg)' }}>{window.SahajIcons.arrowRight({ size:20, color:'#fff', strokeW:2 })}</span>
      </button>
      <button onClick={(e)=>{e.stopPropagation();onNext();}} aria-label="Next" style={{ ...navBtn, right:'16px' }}>
        {window.SahajIcons.arrowRight({ size:20, color:'#fff', strokeW:2 })}
      </button>
      <img src={photo.src} alt={photo.caption} onClick={(e)=>e.stopPropagation()} draggable={false}
        style={{ maxWidth:'min(92vw,1080px)', maxHeight:'78vh', objectFit:'contain', borderRadius:'10px', boxShadow:'0 30px 80px rgba(0,0,0,0.7)' }} />
      <div style={{ marginTop:'18px', textAlign:'center' }} onClick={(e)=>e.stopPropagation()}>
        <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'18px', fontStyle:'italic', color:'#f2eee2' }}>{photo.caption}</p>
        <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', letterSpacing:'1.6px', textTransform:'uppercase', color:'#b9b2a2', marginTop:'7px' }}>{photo.sub} · {index+1} / {total}</p>
      </div>
    </div>
  ), document.body);
}

function LifeGallery({ photos, mobile }) {
  const [open, setOpen] = useState(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      else if (e.key === 'ArrowRight') setOpen(i => (i + 1) % photos.length);
      else if (e.key === 'ArrowLeft') setOpen(i => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, photos.length]);

  return (
    <React.Fragment>
      <div style={{ columnCount: mobile ? 2 : 4, columnGap: mobile ? '10px' : '14px' }}>
        {photos.map((p, i) => <GalleryTile key={p.src} photo={p} onClick={()=>setOpen(i)} />)}
      </div>
      {open !== null && (
        <Lightbox photo={photos[open]} index={open} total={photos.length}
          onClose={()=>setOpen(null)}
          onPrev={()=>setOpen(i => (i - 1 + photos.length) % photos.length)}
          onNext={()=>setOpen(i => (i + 1) % photos.length)} />
      )}
    </React.Fragment>
  );
}

function About() {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const padX = mobile ? '20px' : '48px';

  const slides = [
    { src:'assets/sahaj2.jpg',  alt:'Sahaj Raj Malla', pos:'center 18%', caption:'Where the work happens.', sub:'At my desk' },
    { src:'assets/sahaj1.jpg',  alt:'Sahaj Raj Malla outdoors', pos:'center 10%', caption:'Out in the hills.', sub:'Off the clock' },
    { src:'assets/life/sahaj14.jpg', alt:'Kathmandu University campus', pos:'center 50%', caption:'Where it all began.', sub:'Kathmandu University' },
  ];

  return (
    <div style={{ minHeight:'100vh', paddingTop:'64px', background:'var(--bg)' }}>

      {/* ── Hero band ── */}
      <div style={{ background:'linear-gradient(135deg,var(--bg) 0%,var(--bg) 100%)', borderBottom:'1px solid var(--line)', padding:`56px ${padX} 0`, maxWidth:'1320px', margin:'0 auto' }}>
        <div style={{ display:'flex', gap: mobile?'36px':'60px', alignItems:'flex-start', flexWrap:'wrap' }}>

          {/* Text */}
          <div style={{ flex:'1', minWidth:'280px', order: mobile?2:1 }}>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px', textTransform:'uppercase', color:'var(--accent-2)', marginBottom:'14px' }}>About</p>
            <h2 style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'clamp(30px,6vw,56px)', fontWeight:700, color:'var(--ink)', lineHeight:1.1, letterSpacing:'-0.5px', marginBottom:'26px' }}>
              To better know me.
            </h2>

            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'clamp(15px,1.7vw,17px)', color:'var(--ink-2)', lineHeight:1.8, maxWidth:'560px', marginBottom:'20px' }}>
              I studied computational mathematics, but I spend about as much time on art, philosophy, and psychology. For me they keep circling the same question: <em style={{ color:'var(--accent-2)', fontStyle:'italic' }}>what is intelligence, and can we build it?</em> That is what pulled me into AI.
            </p>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'clamp(14px,1.5vw,16px)', color:'var(--ink-3)', lineHeight:1.8, maxWidth:'560px', marginBottom:'30px' }}>
              I taught myself to code, worked a few years in industry as a data engineer and data scientist, and started a company that now serves more than 4,000 students. Research is where I keep ending up, so it is where I have put my focus.
            </p>

            <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'34px' }}>
              {['Self-taught','Omnivert','Researcher','Founder'].map(t=>(
                <span key={t} style={{ background:'var(--accent-chip)', border:'1px solid var(--accent-line)', borderRadius:'20px', padding:'5px 14px', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', color:'var(--ink-2)', whiteSpace:'nowrap' }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Carousel */}
          <div style={{ flexShrink:0, width: mobile ? 'min(330px,82vw)' : 'clamp(230px,24vw,310px)', order: mobile?1:2, paddingBottom: mobile?0:'32px', margin: mobile?'0 auto':0 }}>
            <PhotoCarousel slides={slides} />
            <p style={{ textAlign:'center', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'var(--ink-4)', marginTop:'10px', letterSpacing:'0.3px' }}>← swipe through →</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1320px', margin:'0 auto', padding:`52px ${padX}` }}>

        {/* ── Interests ── */}
        <div style={{ marginBottom:'52px' }}>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px', textTransform:'uppercase', color:'var(--gold-ink)', marginBottom:'22px' }}>Off the clock</p>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {d.interests.map(i=>(
              <div key={i.label} style={{ display:'flex', alignItems:'center', gap:'10px', background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'12px', padding:'11px 18px' }}>
                <span style={{ display:'flex', color:'var(--gold-ink)', flexShrink:0 }}>{window.SahajIcons[i.icon] && window.SahajIcons[i.icon]({ size:17, color:'var(--gold-ink)', strokeW:1.7 })}</span>
                <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', color:'var(--ink-2)', fontWeight:500 }}>{i.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── A few moments (life gallery) ── */}
        <div style={{ marginBottom:'52px' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'22px', flexWrap:'wrap' }}>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px', textTransform:'uppercase', color:'var(--gold-ink)' }}>A Few Moments</p>
            <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'var(--ink-4)' }}>tap a photo to open</span>
          </div>
          <LifeGallery photos={d.gallery} mobile={mobile} />
        </div>

        {/* ── Pull quote (Bhagavad Gita 2.47) ── */}
        <figure style={{ margin:'0 auto 56px', maxWidth:'860px', textAlign:'center', padding:'0 12px' }}>
          <blockquote style={{ fontFamily:"'Tiro Devanagari Hindi','Noto Serif Devanagari',serif", fontSize:'clamp(20px,3vw,33px)', color:'var(--ink)', lineHeight:1.6, letterSpacing:'0.2px', textWrap:'balance' }}>
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br/>
            मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
          </blockquote>
          <p style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'clamp(15px,1.8vw,19px)', fontStyle:'italic', color:'var(--ink-3)', lineHeight:1.7, maxWidth:'620px', margin:'22px auto 0', textWrap:'pretty' }}>
            You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to inaction.
          </p>
          <figcaption style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gold-ink)', marginTop:'18px' }}>Krishna · Bhagavad Gita 2.47</figcaption>
        </figure>

        {/* ── Technical Toolbox ── */}
        <div style={{ marginBottom:'60px' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:'12px', marginBottom:'26px', flexWrap:'wrap' }}>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px', textTransform:'uppercase', color:'var(--accent-2)' }}>Technical Toolbox</p>
            <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'var(--ink-4)' }}>grouped by area</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill,minmax(300px,1fr))', gap:'18px' }}>
            {d.skillGroups.map(grp=>(
              <div key={grp.label} style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'12px', padding:'18px 20px' }}>
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
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px', textTransform:'uppercase', color:'var(--accent-2)' }}>Experience</p>
            <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'var(--ink-4)' }}>tap any role for detail</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {d.experience.map((e,i)=><ExpCard key={i} {...e} />)}
          </div>
        </div>

        {/* ── Education ── */}
        <div style={{ marginBottom:'52px' }}>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px', textTransform:'uppercase', color:'var(--accent-2)', marginBottom:'20px' }}>Education</p>
          <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'12px', padding:'22px 28px', display:'flex', alignItems:'center', gap:'18px' }}>
            <div style={{ width:'52px', height:'52px', borderRadius:'11px', background:'#ffffff', border:'1px solid var(--line)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:'5px' }}><img src="assets/ku-logo.png" alt="Kathmandu University logo" style={{ width:'100%', height:'100%', objectFit:'contain' }} /></div>
            <div>
              <h4 style={{ fontFamily:"'Times New Roman',Georgia,serif", fontSize:'17px', fontWeight:700, color:'var(--ink)', marginBottom:'4px' }}>{d.education.degree}</h4>
              <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', color:'var(--ink-3)' }}>{d.education.university} · {d.education.period}</p>
            </div>
          </div>
        </div>

        {/* ── Fellowships ── */}
        <div style={{ marginBottom:'60px' }}>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px', textTransform:'uppercase', color:'var(--accent-2)', marginBottom:'20px' }}>Fellowships &amp; Training</p>
          <div style={{ overflowX:'auto', borderRadius:'12px', border:'1px solid var(--line)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", minWidth:'520px' }}>
              <thead>
                <tr style={{ background:'var(--surface-2)' }}>
                  <th style={{ textAlign:'left', padding:'12px 18px', fontSize:'11px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:'var(--ink-4)', borderBottom:'2px solid var(--accent-line)' }}>Fellowship</th>
                  <th style={{ textAlign:'left', padding:'12px 18px', fontSize:'11px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:'var(--ink-4)', borderBottom:'2px solid var(--accent-line)' }}>Institution</th>
                  <th style={{ textAlign:'right', padding:'12px 18px', fontSize:'11px', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', color:'var(--ink-4)', borderBottom:'2px solid var(--accent-line)', whiteSpace:'nowrap' }}>Period</th>
                </tr>
              </thead>
              <tbody>
                {d.fellowships.map((f,i)=>(
                  <tr key={i} style={{ background: i%2? 'var(--surface)':'transparent', transition:'background 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--surface-3)'}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2?'var(--surface)':'transparent'}>
                    <td style={{ padding:'13px 18px', fontSize:'14px', fontWeight:600, color:'var(--ink-2)', borderBottom:i<d.fellowships.length-1?'1px solid var(--line)':'none' }}>{f.name}</td>
                    <td style={{ padding:'13px 18px', fontSize:'13px', color:'var(--ink-3)', borderBottom:i<d.fellowships.length-1?'1px solid var(--line)':'none' }}>{f.org}</td>
                    <td style={{ padding:'13px 18px', fontSize:'12px', color:'var(--ink-4)', textAlign:'right', whiteSpace:'nowrap', borderBottom:i<d.fellowships.length-1?'1px solid var(--line)':'none' }}>{f.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Press & Media ── */}
        <div>
          <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px', textTransform:'uppercase', color:'var(--gold-ink)', marginBottom:'22px' }}>Press &amp; Media</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {d.press.map((p,i)=>(
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.boxShadow='0 10px 26px rgba(150,110,30,0.16)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor='';e.currentTarget.style.boxShadow='';}}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px', padding:'16px 20px', background:'var(--gold-box)', border:'1px solid var(--gold-box-line)', borderRadius:'10px', textDecoration:'none', transition:'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'14px', fontWeight:600, color:'var(--ink-2)', marginBottom:'3px', textWrap:'pretty' }}>{p.title}</p>
                  <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', color:'var(--ink-3)' }}>{p.outlet}</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'4px', flexShrink:0 }}>
                  <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', fontWeight:600, color:'var(--gold-ink)' }}>{p.date}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold-ink)" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
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
