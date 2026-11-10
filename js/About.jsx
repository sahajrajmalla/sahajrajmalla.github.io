// About.jsx - "To better know me": intro, experience, education, awards, talks, fellowships,
// toolbox, press, interests and quote, and the photo gallery last.
const { useState, useEffect, useRef } = React;
const UI = window.SahajUI;

/* ── Swipeable photo carousel. It plays on its own (unless the visitor prefers reduced motion) and waits
      while the pointer or keyboard focus is on it, a finger is down, or the tab is hidden. The dots and swiping always work. ── */
function PhotoCarousel({ slides, radius = 18 }) {
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const startX = useRef(null);
  const dragRef = useRef(0);       // the same distance as `drag`, but readable at once (state is batched)
  const held = useRef(false);      // a finger or the mouse button is down on it
  const hover = useRef(false);     // the pointer is over it, or focus is inside it
  const N = slides.length;
  const motion = !UI.prefersReducedMotion();

  useEffect(() => {
    if (!motion) return undefined;
    const t = setInterval(() => { if (!held.current && !hover.current && !document.hidden) setIdx(i => (i + 1) % N); }, 4500);
    return () => clearInterval(t);
  }, [N, motion]);

  const down = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    startX.current = e.clientX; dragRef.current = 0; held.current = true;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
  };
  const move = (e) => { if (startX.current != null) { dragRef.current = e.clientX - startX.current; setDrag(dragRef.current); } };
  const end = () => {
    if (startX.current == null) return;
    const d = dragRef.current;
    if (Math.abs(d) > 45) setIdx(i => (i + (d < 0 ? 1 : -1) + N) % N);
    dragRef.current = 0; setDrag(0); startX.current = null; held.current = false;
  };
  // the browser took the gesture over (a scroll, say): put the photo back and do not change slide
  const cancel = () => { dragRef.current = 0; setDrag(0); startX.current = null; held.current = false; };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Photos of Sahaj"
      onMouseEnter={() => { hover.current = true; }} onMouseLeave={() => { hover.current = false; }}
      onFocus={() => { hover.current = true; }} onBlur={() => { hover.current = false; }}>
      <div
        style={{ position: 'relative', borderRadius: `${radius}px`, overflow: 'hidden', aspectRatio: '3/4', boxShadow: 'var(--carousel-ring), var(--carousel-shadow)', cursor: 'grab', userSelect: 'none', touchAction: 'pan-y' }}
        onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={cancel} onLostPointerCapture={end}
      >
        <div style={{ display: 'flex', width: `${N * 100}%`, height: '100%', transform: `translateX(calc(${-idx * (100 / N)}% + ${drag}px))`, transition: drag || UI.prefersReducedMotion() ? 'none' : 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }}>
          {slides.map((s, i) => (
            <div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${N}`} aria-hidden={i !== idx} style={{ width: `${100 / N}%`, height: '100%', position: 'relative' }}>
              <img src={s.base + '-640.webp'} width={s.w} height={s.h} alt={s.alt} draggable={false} loading={i === 0 ? 'eager' : 'lazy'} decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.pos, display: 'block', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,9,26,0.82) 0%,transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: '46px', left: '20px', right: '20px' }}>
                <p style={{ fontFamily: "'Times New Roman',Georgia,serif", fontSize: 'clamp(16px,2vw,20px)', fontStyle: 'italic', color: '#f5f0e4', lineHeight: 1.35, textWrap: 'pretty' }}>{s.caption}</p>
                {s.sub && <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#e0c56e', marginTop: '6px' }}>{s.sub}</p>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2px' }}>
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => setIdx(i)} onPointerDown={(e) => e.stopPropagation()} aria-label={`Show photo ${i + 1} of ${N}`} aria-current={i === idx}
              style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              <span style={{ display: 'block', width: i === idx ? '22px' : '7px', height: '7px', borderRadius: '4px', background: i === idx ? 'var(--gold)' : 'rgba(255,255,255,0.6)', transition: 'all 0.3s ease' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Experience row: a real button opens the summary and what the role involved. A role with nothing more to say is a plain row. ── */
function ExpCard({ role, org, place, period, current, desc, points, letter, index, prefix }) {
  const [open, setOpen] = useState(false);
  const id = (prefix || 'exp') + '-' + index;
  const more = !!(desc || letter || (points && points.length));
  const head = (
    <React.Fragment>
      <span>
        <span style={{ display: 'block', fontFamily: "'Times New Roman',Georgia,serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{role}</span>
        <span style={{ display: 'block', fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '15px', color: current ? 'var(--accent-2)' : 'var(--ink-3)', fontWeight: current ? 600 : 400 }}>{org}</span>
        {place && <span style={{ display: 'block', fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13.5px', color: 'var(--ink-3)', marginTop: '2px' }}>{place}</span>}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13.5px', color: 'var(--ink-3)', letterSpacing: '0.3px' }}>{period}</span>
        {current && <span className="badge badge-cf">Present</span>}
        {more && <span className="chev">{window.SahajIcons.chevron({ size: 16, strokeW: 2 })}</span>}
      </span>
    </React.Fragment>
  );
  return (
    <div className="exp" data-current={!!current}>
      <h3 style={{ margin: 0 }}>
        {more ? (
          <button type="button" className="exp-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{head}</button>
        ) : (
          <span className="exp-toggle" style={{ cursor: 'default' }}>{head}</span>
        )}
      </h3>
      {more && (
        <div id={id} hidden={!open} className="exp-more">
          {desc && <p className="exp-desc">{desc}</p>}
          {points && points.length > 0 && <ul className="exp-points">{points.map((t, i) => <li key={i}>{t}</li>)}</ul>}
          {letter && <p className="exp-letter"><a className="link-pill" target="_blank" rel="noopener noreferrer" href={window.SahajData.requestMail('Request for experience letter: ' + org)}>{window.SahajIcons.mail({ size: 14, strokeW: 2 })} Request the experience letter by mail</a></p>}
        </div>
      )}
    </div>
  );
}

// Black or white letters, whichever reads better on the brand colour.
function readableOn(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return (1.05 / (L + 0.05)) > ((L + 0.05) / 0.0555) ? '#fff' : '#111';
}
function SkillChip({ item }) {
  const it = typeof item === 'string' ? { name: item } : item;
  if (!it.brand) return <li className="skill-chip">{it.name}</li>;
  return (
    <li className="skill-chip">
      <span className="skill-mark" aria-hidden="true" style={{ background: it.brand, color: readableOn(it.brand) }}>{it.abbr || it.name.slice(0, 2).toUpperCase()}</span>
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
              <th key={c} scope="col" style={{ textAlign: i === cols.length - 1 ? 'right' : 'left', padding: '12px 18px', fontSize: '12.5px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-3)', borderBottom: '2px solid var(--accent-line)', whiteSpace: 'nowrap' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? 'var(--surface)' : 'transparent' }}>
              {r.map((cell, j) => (
                <td key={j} style={{ padding: '13px 18px', fontSize: j === 0 ? '15px' : j === r.length - 1 ? '13.5px' : '14px', fontWeight: j === 0 ? 600 : 400, color: j === 0 ? 'var(--ink-2)' : j === r.length - 1 ? 'var(--ink-3)' : 'var(--ink-3)', textAlign: j === r.length - 1 ? 'right' : 'left', whiteSpace: j === r.length - 1 ? 'nowrap' : 'normal', borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Photo gallery: a short preview, then "Show all N photos"; the shared viewer moves through all of them ── */
function LifeGallery({ photos, mobile }) {
  const [open, setOpen] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const N = photos.length;
  const previewN = mobile ? 4 : 6;
  const shown = expanded ? photos : photos.slice(0, previewN);
  const items = photos.map(p => ({ src: p.base + '-1600.webp', w: p.lg[0], h: p.lg[1], alt: p.caption, title: p.caption, sub: p.sub }));
  const toggle = () => {
    if (expanded) { setExpanded(false); UI.scrollToSection('photos', { instant: true }); } else setExpanded(true);
  };

  return (
    <React.Fragment>
      <ul id="gallery-grid" className="gallery-grid" style={{ listStyle: 'none' }}>
        {shown.map((p, i) => (
          <li key={p.base} style={{ breakInside: 'avoid', marginBottom: mobile ? '10px' : '14px' }}>
            <button type="button" className="tile" onClick={() => setOpen(i)} aria-haspopup="dialog" aria-label={'Open photo: ' + p.caption + ', ' + p.sub}>
              <img src={p.base + '-640.webp'} srcSet={p.base + '-640.webp ' + p.sm[0] + 'w, ' + p.base + '-1600.webp ' + p.lg[0] + 'w'} sizes="(max-width: 820px) 46vw, 30vw"
                width={p.sm[0]} height={p.sm[1]} alt="" loading="lazy" decoding="async" draggable={false} />
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
      {open !== null && <UI.ImageViewer items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} label="Photo gallery" />}
    </React.Fragment>
  );
}

/* ── Toolbox: the main tools of each group are shown; "more" opens the rest. Spoken languages sit below, at a readable size. ── */
function Toolbox() {
  const d = window.SahajData;
  const [open, setOpen] = useState({});
  const expandable = d.skillGroups.filter(g => g.more.length);
  const allOpen = expandable.every(g => open[g.label]);
  const toggleAll = () => { const next = {}; if (!allOpen) expandable.forEach(g => { next[g.label] = true; }); setOpen(next); };
  const toggle = (label) => setOpen(o => Object.assign({}, o, { [label]: !o[label] }));
  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <button type="button" className="mini-btn" onClick={toggleAll}>{allOpen ? 'Show the main tools only' : 'Show every tool'}</button>
      </div>
      <div className="tool-columns">
        {d.skillGroups.map((grp, gi) => {
          const isOpen = !!open[grp.label];
          const mid = 'tool-more-' + gi;
          return (
            <div key={grp.label} className="tool-card">
              <h3 className="tool-card-h" style={{ color: grp.color }}>{grp.label}</h3>
              <ul className="chip-list">{grp.main.map((sk, i) => <SkillChip key={i} item={sk} />)}</ul>
              {grp.more.length > 0 && (
                <React.Fragment>
                  <ul id={mid} className="chip-list chip-more" hidden={!isOpen}>{grp.more.map((sk, i) => <SkillChip key={i} item={sk} />)}</ul>
                  <button type="button" className="tool-more" aria-expanded={isOpen} aria-controls={mid} onClick={() => toggle(grp.label)}>
                    <span className="chev">{window.SahajIcons.chevron({ size: 14, strokeW: 2.2 })}</span>
                    {isOpen ? 'Show fewer' : 'Show ' + grp.more.length + ' more'}
                  </button>
                </React.Fragment>
              )}
            </div>
          );
        })}
      </div>
      <div className="tool-card">
        <h3 className="tool-card-h" style={{ color: 'var(--accent-2)' }}>Languages I speak</h3>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {d.languages.map(l => (
            <li key={l.name} className="lang-pill">
              <span className="lang-name">{l.name}</span>
              {l.note && <span className="lang-note">{l.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
}

function About({ onNavigate }) {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const padX = mobile ? '20px' : '48px';
  const edu = d.education;
  const th = edu.thesis;
  const pubCount = d.peerReviewed.length + d.preprints.length;
  const q1Count = d.peerReviewed.filter(p => p.tier === 'Q1').length;

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
                <span key={t} style={{ background: 'var(--accent-chip)', border: '1px solid var(--accent-line)', borderRadius: '20px', padding: '5px 14px', fontFamily: sans, fontSize: '14px', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>{t}</span>
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
        <UI.Section id="experience" title="Experience" aside="select a role to see what it involved">
          <div>{d.experience.map((e, i) => <ExpCard key={i} index={i} {...e} />)}</div>
          <h3 style={{ fontFamily: serif, fontSize: '20px', color: 'var(--ink)', margin: '8px 0 16px' }}>Teaching and volunteering</h3>
          <div>{d.service.map((e, i) => <ExpCard key={i} index={i} prefix="svc" {...e} place={e.note} />)}</div>
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
                <p style={{ fontFamily: sans, fontSize: '14.5px', color: 'var(--ink-3)' }}>{edu.university}, {edu.place} · {edu.period}</p>
                <p style={{ fontFamily: sans, fontSize: '13.5px', color: 'var(--ink-3)', marginTop: '2px' }}>{edu.conferral}</p>
              </div>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--line)' }}>
              <p className="eyebrow" style={{ fontSize: '12.5px', color: 'var(--accent-2)', borderLeft: 'none', paddingLeft: 0, marginBottom: '6px' }}>{th.label} · {th.status}</p>
              <p style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4, marginBottom: '6px' }}>{th.title}</p>
              <p style={{ fontFamily: sans, fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.7 }}>{th.question}</p>
              <p style={{ fontFamily: sans, fontSize: '13.5px', color: 'var(--ink-3)', marginTop: '6px' }}>Supervisors: {th.supervisors}</p>
            </div>
          </div>
        </UI.Section>

        {/* ── Awards ── */}
        <UI.Section id="awards" title="Awards and competitions" color="var(--gold-ink)" aside={`${d.awards.length}`}>
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,290px),1fr))', gap: '10px' }}>
            {d.awards.map((a, i) => (
              <li key={i} style={{ background: 'var(--gold-box)', border: '1px solid var(--gold-box-line)', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <div style={{ fontFamily: sans, fontSize: '12px', fontWeight: 800, letterSpacing: '1.2px', textTransform: 'uppercase', color: 'var(--gold-ink)', marginBottom: '3px' }}>{a.result}</div>
                  <div style={{ fontFamily: sans, fontSize: '14.5px', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '3px', lineHeight: 1.4 }}>{a.title}</div>
                  <div style={{ fontFamily: sans, fontSize: '13.5px', color: 'var(--ink-3)', lineHeight: 1.4 }}>{a.org}</div>
                </div>
                <span style={{ fontFamily: sans, fontSize: '13.5px', color: 'var(--gold-ink)', fontWeight: 600, flexShrink: 0 }}>{a.year}</span>
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
        <UI.Section id="toolbox" title="Technical toolbox" aside="the main tools of each group, with the rest one select away">
          <Toolbox />
        </UI.Section>

        {/* ── Press ── */}
        <UI.Section id="press" title="Press and media" color="var(--gold-ink)">
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {d.press.map((p, i) => (
              <li key={i}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="row-link">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: sans, fontSize: '15px', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '3px', textWrap: 'pretty' }}>{p.title}</p>
                    <p style={{ fontFamily: sans, fontSize: '13.5px', color: 'var(--ink-3)' }}>{p.outlet}{p.lang ? ` (${p.lang})` : ''}</p>
                    {p.note && <p style={{ fontFamily: sans, fontSize: '13px', color: 'var(--ink-3)', marginTop: '4px' }}>{p.note}</p>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontFamily: sans, fontSize: '13.5px', fontWeight: 600, color: 'var(--gold-ink)' }}>{p.date}</span>
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
                <span style={{ fontFamily: sans, fontSize: '15px', color: 'var(--ink-2)', fontWeight: 500 }}>{i.label}</span>
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
            <figcaption style={{ fontFamily: sans, fontSize: '12.5px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold-ink)', marginTop: '18px' }}>Krishna · Bhagavad Gita 2.47</figcaption>
          </figure>
        </UI.Section>

        {/* ── Photos, last ── */}
        <UI.Section id="photos" title="A few moments" color="var(--gold-ink)" aside="select a photo to open it" mb="0">
          <LifeGallery photos={d.gallery} mobile={mobile} />
        </UI.Section>

        {/* ── Next: the research ── */}
        <nav aria-label="Next page" style={{ marginTop: '72px' }}>
          <a href="#research" className="next-link" onClick={(e) => { e.preventDefault(); onNavigate('research'); }}>
            <span className="next-body">
              <span className="next-kicker">Next</span>
              <span className="next-title">Research</span>
              <span className="next-text">{pubCount} publications, {q1Count} of them Q1 papers in Scientific Reports. Open any first page and read the abstract.</span>
            </span>
            <span className="next-arrow" aria-hidden="true">{window.SahajIcons.arrowRight({ size: 22, strokeW: 2.2 })}</span>
          </a>
        </nav>
      </UI.TocLayout>
    </div>
  );
}

window.SahajAbout = About;
