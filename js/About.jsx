// About.jsx - "To better know me": intro, experience, education, awards, talks, fellowships,
// toolbox, press, interests and quote, and the photo gallery last.
const { useState, useEffect, useRef } = React;
const UI = window.SahajUI;

/* ── Swipeable photo carousel. Auto-advance only when motion is allowed; there is a pause button. ── */
function PhotoCarousel({ slides, radius = 18 }) {
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const [playing, setPlaying] = useState(() => !UI.prefersReducedMotion());
  const startX = useRef(null);
  const held = useRef(false);
  const N = slides.length;

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => { if (!held.current) setIdx(i => (i + 1) % N); }, 4500);
    return () => clearInterval(t);
  }, [N, playing]);

  const start = (x) => { startX.current = x; held.current = true; };
  const move  = (x) => { if (startX.current != null) setDrag(x - startX.current); };
  const end   = () => {
    if (Math.abs(drag) > 45) setIdx(i => (i + (drag < 0 ? 1 : -1) + N) % N);
    setDrag(0); startX.current = null;
    setTimeout(() => { held.current = false; }, 600);
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Photos of Sahaj">
      <div
        style={{ position: 'relative', borderRadius: `${radius}px`, overflow: 'hidden', aspectRatio: '3/4', boxShadow: 'var(--carousel-ring), var(--carousel-shadow)', cursor: 'grab', userSelect: 'none', touchAction: 'pan-y' }}
        onTouchStart={e => start(e.touches[0].clientX)}
        onTouchMove={e => move(e.touches[0].clientX)}
        onTouchEnd={end}
        onMouseDown={e => start(e.clientX)}
        onMouseMove={e => { if (startX.current != null) move(e.clientX); }}
        onMouseUp={end}
        onMouseLeave={() => { if (startX.current != null) end(); }}
      >
        <div style={{ display: 'flex', width: `${N * 100}%`, height: '100%', transform: `translateX(calc(${-idx * (100 / N)}% + ${drag}px))`, transition: drag || UI.prefersReducedMotion() ? 'none' : 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }}>
          {slides.map((s, i) => (
            <div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${N}`} aria-hidden={i !== idx} style={{ width: `${100 / N}%`, height: '100%', position: 'relative' }}>
              <img src={s.base + '-640.webp'} width={s.w} height={s.h} alt={s.alt} draggable={false} loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.pos, display: 'block', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,9,26,0.82) 0%,transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: '46px', left: '20px', right: '20px' }}>
                <p style={{ fontFamily: "'Times New Roman',Georgia,serif", fontSize: 'clamp(15px,2vw,19px)', fontStyle: 'italic', color: '#f5f0e4', lineHeight: 1.35, textWrap: 'pretty' }}>{s.caption}</p>
                {s.sub && <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#e0c56e', marginTop: '6px' }}>{s.sub}</p>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2px' }}>
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => setIdx(i)} aria-label={`Show photo ${i + 1} of ${N}`} aria-current={i === idx}
              style={{ width: '30px', height: '30px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              <span style={{ display: 'block', width: i === idx ? '22px' : '7px', height: '7px', borderRadius: '4px', background: i === idx ? 'var(--gold)' : 'rgba(255,255,255,0.55)', transition: 'all 0.3s ease' }} />
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
        <button type="button" className="mini-btn" onClick={() => setPlaying(p => !p)} aria-pressed={!playing}>{playing ? 'Pause' : 'Play'} slideshow</button>
      </div>
    </div>
  );
}

/* ── Experience row: a real button reveals the description ── */
function ExpCard({ role, org, place, period, current, desc, index }) {
  const [open, setOpen] = useState(false);
  const id = 'exp-' + index;
  return (
    <div className="exp" data-current={!!current}>
      <h3 style={{ margin: 0 }}>
        <button type="button" className="exp-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          <span>
            <span style={{ display: 'block', fontFamily: "'Times New Roman',Georgia,serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{role}</span>
            <span style={{ display: 'block', fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '14px', color: current ? 'var(--accent-2)' : 'var(--ink-3)', fontWeight: current ? 600 : 400 }}>{org}</span>
            <span style={{ display: 'block', fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '12.5px', color: 'var(--ink-4)', marginTop: '2px' }}>{place}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '12.5px', color: 'var(--ink-3)', letterSpacing: '0.3px' }}>{period}</span>
            {current && <span className="badge badge-cf">Now</span>}
            <span className="chev">{window.SahajIcons.chevron({ size: 16, strokeW: 2 })}</span>
          </span>
        </button>
      </h3>
      <p id={id} hidden={!open} style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7, marginTop: '10px', maxWidth: '600px' }}>{desc}</p>
    </div>
  );
}

const LIGHT_BRANDS = ['#F7DF1E', '#FCC624', '#FFD21E', '#FF9900', '#F7931E', '#F37626', '#61DAFB'];
function SkillChip({ item }) {
  const it = typeof item === 'string' ? { name: item } : item;
  if (!it.brand) return <li className="skill-chip">{it.name}</li>;
  return (
    <li className="skill-chip">
      <span className="skill-mark" aria-hidden="true" style={{ background: it.brand, color: LIGHT_BRANDS.includes(it.brand) ? '#111' : '#fff' }}>{it.abbr || it.name.slice(0, 2).toUpperCase()}</span>
      {it.name}
    </li>
  );
}

function DataTable({ caption, cols, rows }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--line)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", minWidth: '520px' }}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr style={{ background: 'var(--surface-2)' }}>
            {cols.map((c, i) => (
              <th key={c} scope="col" style={{ textAlign: i === cols.length - 1 ? 'right' : 'left', padding: '12px 18px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-3)', borderBottom: '2px solid var(--accent-line)', whiteSpace: 'nowrap' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? 'var(--surface)' : 'transparent' }}>
              {r.map((cell, j) => (
                <td key={j} style={{ padding: '13px 18px', fontSize: j === 0 ? '14px' : j === r.length - 1 ? '12.5px' : '13px', fontWeight: j === 0 ? 600 : 400, color: j === 0 ? 'var(--ink-2)' : j === r.length - 1 ? 'var(--ink-3)' : 'var(--ink-3)', textAlign: j === r.length - 1 ? 'right' : 'left', whiteSpace: j === r.length - 1 ? 'nowrap' : 'normal', borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Photo gallery: a short preview, then "Show all N photos"; the lightbox moves through all of them ── */
function Lightbox({ photos, index, onClose, onIndex }) {
  const photo = photos[index];
  const N = photos.length;
  const boxRef = useRef(null);
  const closeRef = useRef(null);
  const prev = () => onIndex((index - 1 + N) % N);
  const next = () => onIndex((index + 1) % N);

  useEffect(() => {
    if (closeRef.current) closeRef.current.focus();
    const before = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = before; };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Tab' && boxRef.current) {
        const f = boxRef.current.querySelectorAll('button');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const navBtn = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.28)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 };
  return ReactDOM.createPortal((
    <div ref={boxRef} role="dialog" aria-modal="true" aria-label={`Photo ${index + 1} of ${N}: ${photo.caption}`} onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(3,6,16,0.93)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', animation: 'fadeIn 0.22s ease' }}>
      <button ref={closeRef} type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close"
        style={{ position: 'absolute', top: '18px', right: '20px', width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.28)', color: '#fff', cursor: 'pointer', fontSize: '24px', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous photo" style={{ ...navBtn, left: '16px' }}>
        <span style={{ display: 'flex', transform: 'rotate(180deg)' }}>{window.SahajIcons.arrowRight({ size: 20, color: '#fff', strokeW: 2 })}</span>
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next photo" style={{ ...navBtn, right: '16px' }}>
        {window.SahajIcons.arrowRight({ size: 20, color: '#fff', strokeW: 2 })}
      </button>
      <img src={photo.base + '-1600.webp'} width={photo.lg[0]} height={photo.lg[1]} alt={photo.caption} onClick={(e) => e.stopPropagation()} draggable={false} decoding="async"
        style={{ maxWidth: 'min(92vw,1080px)', maxHeight: '78vh', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }} />
      <div style={{ marginTop: '18px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <p style={{ fontFamily: "'Times New Roman',Georgia,serif", fontSize: '18px', fontStyle: 'italic', color: '#f2eee2' }}>{photo.caption}</p>
        <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '11px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#c9c2b2', marginTop: '7px' }}>{photo.sub} · {index + 1} / {N}</p>
      </div>
    </div>
  ), document.body);
}

function LifeGallery({ photos, mobile }) {
  const [open, setOpen] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const opener = useRef(null);
  const N = photos.length;
  const previewN = mobile ? 4 : 6;
  const shown = expanded ? photos : photos.slice(0, previewN);

  const openAt = (i) => { opener.current = document.activeElement; setOpen(i); };
  const close = () => { setOpen(null); const el = opener.current; if (el && el.focus) setTimeout(() => el.focus(), 0); };
  const toggle = () => {
    if (expanded) { setExpanded(false); UI.scrollToSection('photos', { instant: true }); } else setExpanded(true);
  };

  return (
    <React.Fragment>
      <ul id="gallery-grid" className="gallery-grid" style={{ listStyle: 'none' }}>
        {shown.map((p, i) => (
          <li key={p.base} style={{ breakInside: 'avoid', marginBottom: mobile ? '10px' : '14px' }}>
            <button type="button" className="tile" onClick={() => openAt(i)}>
              <img src={p.base + '-640.webp'} srcSet={p.base + '-640.webp ' + p.sm[0] + 'w, ' + p.base + '-1600.webp ' + p.lg[0] + 'w'} sizes="(max-width: 820px) 46vw, 30vw"
                width={p.sm[0]} height={p.sm[1]} alt={p.caption} loading="lazy" decoding="async" draggable={false} />
              <span className="tile-shade" aria-hidden="true" />
              <span className="tile-cap" aria-hidden="true"><span className="tile-cap-t">{p.caption}</span><span className="tile-cap-s">{p.sub}</span></span>
            </button>
          </li>
        ))}
      </ul>
      {N > previewN && (
        <button type="button" className="btn-secondary show-all" aria-expanded={expanded} aria-controls="gallery-grid" onClick={toggle}>
          {expanded ? 'Show fewer photos' : `Show all ${N} photos`}
        </button>
      )}
      {open !== null && <Lightbox photos={photos} index={open} onClose={close} onIndex={setOpen} />}
    </React.Fragment>
  );
}

function About({ onNavigate }) {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const padX = mobile ? '20px' : '48px';
  const edu = d.education;
  const th = edu.thesis;

  const slides = [
    { base: 'assets/sahaj2', w: 640, h: 480, alt: 'Sahaj Raj Malla seated at a table', pos: 'center 18%', caption: 'Where the work happens.', sub: 'At my desk' },
    { base: 'assets/sahaj1', w: 640, h: 853, alt: 'Sahaj Raj Malla in a street hung with prayer flags', pos: 'center 10%', caption: 'Out in the hills.', sub: 'Off the clock' },
    { base: 'assets/life/sahaj14', w: 640, h: 853, alt: 'Sahaj Raj Malla in front of the Kathmandu University building', pos: 'center 50%', caption: 'Where it all began.', sub: 'Kathmandu University' },
  ];

  const toc = [
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'awards', label: 'Awards', count: d.awards.length },
    { id: 'talks', label: 'Talks and panels' },
    { id: 'fellowships', label: 'Training and fellowships' },
    { id: 'toolbox', label: 'Toolbox' },
    { id: 'press', label: 'Press' },
    { id: 'interests', label: 'Interests and quote' },
    { id: 'photos', label: 'Photos', count: d.gallery.length },
  ];

  const sans = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const serif = "'Times New Roman',Georgia,serif";

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--bg)' }}>

      {/* ── Intro ── */}
      <div style={{ borderBottom: '1px solid var(--line)', padding: `56px ${padX} 0`, maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: mobile ? '36px' : '60px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '280px', order: mobile ? 2 : 1 }}>
            <p className="eyebrow" style={{ color: 'var(--accent-2)', marginBottom: '14px' }}>About</p>
            <h1 className="page-title" style={{ fontSize: 'clamp(30px,6vw,56px)', marginBottom: '26px' }}>To better know me.</h1>
            <p style={{ fontFamily: sans, fontSize: 'clamp(15px,1.7vw,17px)', color: 'var(--ink-2)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '20px' }}>
              I am studying computational mathematics, but I spend about as much time on art, philosophy, and psychology. For me they keep circling the same question: <em style={{ color: 'var(--accent-2)', fontStyle: 'italic' }}>what is intelligence, and can we build it?</em> That is what pulled me into AI.
            </p>
            <p style={{ fontFamily: sans, fontSize: 'clamp(14px,1.5vw,16px)', color: 'var(--ink-3)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '30px' }}>
              I taught myself to code, worked in industry for about two years as a data engineer and data scientist, and started HamroNiwas, a rental and marketplace platform for Nepali students that now has {d.stats.users.toLocaleString('en-US')}+ users. Research is where I keep ending up, so it is where I have put my focus.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '34px' }}>
              {['Self-taught', 'Omnivert', 'Researcher', 'Founder'].map(t => (
                <span key={t} style={{ background: 'var(--accent-chip)', border: '1px solid var(--accent-line)', borderRadius: '20px', padding: '5px 14px', fontFamily: sans, fontSize: '13px', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ flexShrink: 0, width: mobile ? 'min(330px,82vw)' : 'clamp(230px,24vw,310px)', order: mobile ? 1 : 2, paddingBottom: mobile ? '24px' : '32px', margin: mobile ? '0 auto' : 0 }}>
            <PhotoCarousel slides={slides} />
          </div>
        </div>
      </div>

      <UI.TocLayout page="about" items={toc} onNavigate={onNavigate} maxWidth={1100}>

        {/* ── Experience ── */}
        <UI.Section id="experience" title="Experience" aside="select a role for detail">
          <div>{d.experience.map((e, i) => <ExpCard key={i} index={i} {...e} />)}</div>
          <h3 style={{ fontFamily: serif, fontSize: '20px', color: 'var(--ink)', margin: '8px 0 16px' }}>Teaching and volunteering</h3>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '10px' }}>
            {d.service.map((s, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', padding: '12px 18px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px' }}>
                <span>
                  <span style={{ display: 'block', fontFamily: sans, fontSize: '14px', fontWeight: 600, color: 'var(--ink-2)' }}>{s.role}</span>
                  <span style={{ display: 'block', fontFamily: sans, fontSize: '12.5px', color: 'var(--ink-3)', marginTop: '2px' }}>{s.org}{s.note ? ` · ${s.note}` : ''}</span>
                </span>
                <span style={{ fontFamily: sans, fontSize: '12.5px', color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{s.period}</span>
              </li>
            ))}
          </ul>
        </UI.Section>

        {/* ── Education ── */}
        <UI.Section id="education" title="Education">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '22px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '11px', background: '#ffffff', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '5px' }}>
                <img src="assets/ku-logo-96.webp" width="96" height="96" alt="Kathmandu University logo" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{edu.degree}</h3>
                <p style={{ fontFamily: sans, fontSize: '13.5px', color: 'var(--ink-3)' }}>{edu.university}, {edu.place} · {edu.period}</p>
                <p style={{ fontFamily: sans, fontSize: '12.5px', color: 'var(--ink-4)', marginTop: '2px' }}>{edu.conferral}</p>
              </div>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--line)' }}>
              <p className="eyebrow" style={{ fontSize: '11px', color: 'var(--accent-2)', borderLeft: 'none', paddingLeft: 0, marginBottom: '6px' }}>{th.label} ({th.status.toLowerCase()})</p>
              <p style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4, marginBottom: '6px' }}>{th.title}</p>
              <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7 }}>{th.question}</p>
              <p style={{ fontFamily: sans, fontSize: '12.5px', color: 'var(--ink-4)', marginTop: '6px' }}>Supervisors: {th.supervisors}</p>
            </div>
          </div>
        </UI.Section>

        {/* ── Awards ── */}
        <UI.Section id="awards" title="Awards and competitions" color="var(--gold-ink)" aside={`${d.awards.length}`}>
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,290px),1fr))', gap: '10px' }}>
            {d.awards.map((a, i) => (
              <li key={i} style={{ background: 'var(--gold-box)', border: '1px solid var(--gold-box-line)', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <div style={{ fontFamily: sans, fontSize: '10.5px', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--gold-ink)', marginBottom: '3px' }}>{a.result}</div>
                  <div style={{ fontFamily: sans, fontSize: '13.5px', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '3px', lineHeight: 1.4 }}>{a.title}</div>
                  <div style={{ fontFamily: sans, fontSize: '12px', color: 'var(--ink-3)', lineHeight: 1.4 }}>{a.org}</div>
                </div>
                <span style={{ fontFamily: sans, fontSize: '12px', color: 'var(--gold-ink)', fontWeight: 600, flexShrink: 0 }}>{a.year}</span>
              </li>
            ))}
          </ul>
        </UI.Section>

        {/* ── Talks ── */}
        <UI.Section id="talks" title="Conference talks and panels">
          <DataTable caption="Conference talks and panels" cols={['Talk', 'Venue', 'Date']} rows={d.talks.map(t => [t.title, t.org, t.date])} />
        </UI.Section>

        {/* ── Fellowships ── */}
        <UI.Section id="fellowships" title="Training and fellowships">
          <DataTable caption="Training and fellowships" cols={['Program', 'Institution', 'Period']} rows={d.fellowships.map(f => [f.name, f.org, f.period])} />
        </UI.Section>

        {/* ── Toolbox ── */}
        <UI.Section id="toolbox" title="Technical toolbox" aside="grouped as on my CV">
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
            {d.skillGroups.map(grp => (
              <div key={grp.label} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '18px 20px' }}>
                <h3 style={{ fontFamily: sans, fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: grp.color, marginBottom: '12px' }}>{grp.label}</h3>
                <ul style={{ listStyle: 'none', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {grp.skills.map((sk, i) => <SkillChip key={i} item={sk} />)}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--ink-3)', marginTop: '20px' }}><strong style={{ color: 'var(--ink-2)', fontWeight: 600 }}>Languages:</strong> {d.languages}</p>
        </UI.Section>

        {/* ── Press ── */}
        <UI.Section id="press" title="Press and media" color="var(--gold-ink)">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {d.press.map((p, i) => (
              <li key={i}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="row-link">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: sans, fontSize: '14px', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '3px', textWrap: 'pretty' }}>{p.title}</p>
                    <p style={{ fontFamily: sans, fontSize: '12.5px', color: 'var(--ink-3)' }}>{p.outlet}{p.lang ? ` (${p.lang})` : ''}</p>
                    {p.note && <p style={{ fontFamily: sans, fontSize: '12px', color: 'var(--ink-4)', marginTop: '4px' }}>{p.note}</p>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontFamily: sans, fontSize: '12px', fontWeight: 600, color: 'var(--gold-ink)' }}>{p.date}</span>
                    {window.SahajIcons.external({ size: 13, color: 'var(--gold-ink)', strokeW: 2 })}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </UI.Section>

        {/* ── Interests and the quote ── */}
        <UI.Section id="interests" title="Off the clock" color="var(--gold-ink)">
          <ul style={{ listStyle: 'none', display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '48px' }}>
            {d.interests.map(i => (
              <li key={i.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '11px 18px' }}>
                <span style={{ display: 'flex', color: 'var(--gold-ink)', flexShrink: 0 }}>{window.SahajIcons[i.icon] && window.SahajIcons[i.icon]({ size: 17, color: 'var(--gold-ink)', strokeW: 1.7 })}</span>
                <span style={{ fontFamily: sans, fontSize: '14px', color: 'var(--ink-2)', fontWeight: 500 }}>{i.label}</span>
              </li>
            ))}
          </ul>
          <figure style={{ margin: '0 auto', maxWidth: '860px', textAlign: 'center', padding: '0 12px' }}>
            <blockquote lang="sa" style={{ fontFamily: "'Tiro Devanagari Hindi','Noto Serif Devanagari',serif", fontSize: 'clamp(20px,3vw,33px)', color: 'var(--ink)', lineHeight: 1.6, letterSpacing: '0.2px', textWrap: 'balance' }}>
              कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br />
              मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
            </blockquote>
            <p style={{ fontFamily: serif, fontSize: 'clamp(15px,1.8vw,19px)', fontStyle: 'italic', color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: '620px', margin: '22px auto 0', textWrap: 'pretty' }}>
              You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to inaction.
            </p>
            <figcaption style={{ fontFamily: sans, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-ink)', marginTop: '18px' }}>Krishna · Bhagavad Gita 2.47</figcaption>
          </figure>
        </UI.Section>

        {/* ── Photos, last ── */}
        <UI.Section id="photos" title="A few moments" color="var(--gold-ink)" aside="select a photo to open it" mb="0">
          <LifeGallery photos={d.gallery} mobile={mobile} />
        </UI.Section>
      </UI.TocLayout>
    </div>
  );
}

window.SahajAbout = About;
