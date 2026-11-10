// PhD.jsx - for supervisors and labs. A short answer first (the question, the facts), then a map that links
// each research interest to the thesis, system and papers behind it, then the path, the full list and training.
const { useState } = React;
const UI = window.SahajUI;

const PHD_TONE = {
  orch: { color: 'var(--accent-2)', tint: 'var(--accent-soft)', name: 'Orchestration' },
  rl: { color: 'var(--purple)', tint: 'var(--badge-q1-bg)', name: 'Reinforcement learning' },
  eff: { color: 'var(--gold-ink)', tint: 'var(--gold-box)', name: 'Efficiency' },
};

function Step({ num, area, desc, year, go, onGo, last }) {
  return (
    <li style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, alignSelf: 'stretch' }}>
        <div aria-hidden="true" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-chip)', border: '2px solid var(--accent-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Times New Roman',Georgia,serif", fontSize: '15px', fontWeight: 700, color: 'var(--accent-2)' }}>{num}</div>
        {!last && <div aria-hidden="true" style={{ width: '2px', flex: 1, minHeight: '32px', background: 'var(--accent-line)', marginTop: '4px' }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : '28px', minWidth: 0 }}>
        <h3 style={{ fontFamily: "'Times New Roman',Georgia,serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{area}</h3>
        <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: '6px', maxWidth: '660px' }}>{desc}</p>
        <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13.5px', color: 'var(--ink-4)', letterSpacing: '0.3px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span>{year}</span>
          {go && <a href={'#' + go.to} onClick={(e) => { e.preventDefault(); onGo(go.to); }} style={{ color: 'var(--accent-2)', fontWeight: 600 }}>{go.label}</a>}
        </p>
      </div>
    </li>
  );
}

// One piece of work behind an interest. When an interest is selected, the cards that speak to it get its colour.
function EvidenceCard({ e, state, focusKey, gh, goTo }) {
  const tone = focusKey && state === 'yes' ? PHD_TONE[focusKey] : null;
  const kindCls = e.kind === 'Q1 paper' ? 'badge-q1' : e.kind === 'Preprint' ? 'badge-pre' : 'badge-cf';
  return (
    <article className="ev-card" data-state={state} style={tone ? { '--ev': tone.color, '--ev-tint': tone.tint } : undefined}>
      <div className="ev-top"><span className={'badge ' + kindCls}>{e.kind}</span><span className="ev-when">{e.when}</span></div>
      <h3 className="ev-title">{e.title}</h3>
      <p className="ev-take">{e.takeaway}</p>
      <ul className="ev-supports" aria-label="Speaks to">
        {e.interests.map(k => <li key={k} style={{ '--c': PHD_TONE[k].color }}><span className="ev-dot" aria-hidden="true" />{PHD_TONE[k].name}</li>)}
      </ul>
      <div className="ev-links">
        {e.go.map(g => <a key={g.to} className="link-pill" href={'#' + g.to} onClick={(ev) => { ev.preventDefault(); goTo(g.to); }}>{g.label}</a>)}
        {e.repo && <UI.RepoLink gh={gh} repo={e.repo.name} url={e.repo.url}>Code</UI.RepoLink>}
      </div>
    </article>
  );
}

function PhD({ onNavigate }) {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const gh = UI.useGithubStats();
  const [focus, setFocus] = useState(null);
  const all = d.peerReviewed.concat(d.preprints);
  const q1 = d.peerReviewed.filter(p => p.tier === 'Q1').length;
  const th = d.education.thesis;
  const edu = d.education;
  const sans = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const serif = "'Times New Roman',Georgia,serif";
  const interests = d.researchInterests;
  const evidence = d.phdEvidence;
  const isMatch = (e) => !!focus && e.interests.indexOf(focus) >= 0;
  const ordered = focus ? evidence.filter(isMatch).concat(evidence.filter(e => !isMatch(e))) : evidence;
  const paperEv = {};
  evidence.forEach(e => { if (e.paper) paperEv[e.paper] = e; });
  const focusArea = focus ? interests.filter(i => i.key === focus)[0].area : '';
  const ielts = ((d.languages[0].note || '').match(/[\d.]+$/) || [''])[0];
  const goTo = (to) => onNavigate(to);

  const trajectory = [
    { num: '1', area: 'Computer vision', desc: 'MallaNet: a compact Devanagari character recognizer (Scientific Reports, Q1).', year: 'Dec 2025', go: { label: 'MallaNet summary', to: 'research/paper-mallanet' } },
    { num: '2', area: 'Forecasting and applied ML', desc: 'The Kalimati price index (Scientific Reports, Q1), NEPSE returns, real estate prices and remittances.', year: 'Oct 2023 – Nov 2026', go: { label: 'Kalimati summary', to: 'research/paper-kalimati' } },
    { num: '3', area: 'Quantum ML', desc: 'A CNN with a simulated 10-qubit circuit for Devanagari digits (preprint).', year: 'Jun 2025', go: { label: 'Quantum summary', to: 'research/paper-quantum' } },
    { num: '4', area: 'Game-playing agents', desc: 'Dhumbal: hand-written, search and learned agents compared (Scientific Reports, Q1). The best hand-written strategy won 88.9% of rounds, and the learned agents did not beat a random player.', year: 'Aug 2026', go: { label: 'Dhumbal summary', to: 'research/paper-dhumbal' } },
    { num: '5', area: 'Orchestration', desc: 'Touchstone, a router with a critic, and a thesis on when reviewing a failed attempt is worth its cost under a budget.', year: 'Nov 2024 – present', go: { label: 'Touchstone project', to: 'projects/touchstone' } },
  ];

  const glance = [
    { v: edu.degree.replace('B.Sc. in ', 'B.Sc. '), l: edu.university + ', degree expected ' + edu.conferral.replace('Expected degree conferral: ', '') },
    { v: all.length + ' publications', l: q1 + ' Q1 papers in Scientific Reports, ' + d.preprints.length + ' preprints' },
    { v: th.title.split(':')[0], l: 'Undergraduate thesis, ' + th.status.toLowerCase() },
    { v: 'IELTS ' + ielts, l: 'Academic, overall band' },
  ];

  const toc = [
    { id: 'statement', label: 'Statement' },
    { id: 'interests', label: 'How my work connects' },
    { id: 'thesis', label: 'Thesis' },
    { id: 'path', label: 'Research path' },
    { id: 'publications', label: 'Publications', count: all.length },
    { id: 'training', label: 'Education and training' },
    { id: 'contact', label: 'Contact' },
  ];

  const header = (
    <React.Fragment>
      <UI.PageHeader
        eyebrow="For researchers and professors"
        title="Research profile"
        lead="I am applying to PhD programs in artificial intelligence. This page is for the supervisors and labs I would like to work with: the questions I want to spend the next few years on, my thesis, and the path that brought me here."
        color="var(--gold-ink)"
        maxLead="700px"
      />
      <p className="phd-tagline">{d.researchInterestsLine}</p>
      <ul className="glance" aria-label="At a glance">
        {glance.map(g => <li key={g.v}><span className="glance-v">{g.v}</span><span className="glance-l">{g.l}</span></li>)}
      </ul>
      <div className="phd-cta">
        <a href={d.personal.gmail} target="_blank" rel="noopener noreferrer" className="btn-primary">Email me</a>
        <a href={d.personal.cv} className="btn-secondary">View CV</a>
        <a href={d.personal.scholar} target="_blank" rel="noopener noreferrer" className="btn-secondary">Google Scholar</a>
      </div>
    </React.Fragment>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--bg)' }}>
      <UI.TocLayout page="phd" items={toc} onNavigate={onNavigate} maxWidth={1100} header={header}>

        <UI.Section id="statement" title="Statement" mb="56px">
          <blockquote style={{ padding: mobile ? '22px 22px' : '28px 32px', background: 'var(--accent-box)', border: '1px solid var(--accent-line)', borderLeft: '4px solid var(--accent)', borderRadius: '0 12px 12px 0' }}>
            <p style={{ fontFamily: serif, fontSize: 'clamp(17px,1.8vw,20px)', fontStyle: 'italic', color: 'var(--ink-2)', lineHeight: 1.8 }}>{d.phdStatement}</p>
          </blockquote>
        </UI.Section>

        <UI.Section id="interests" title="How my work connects" aside="select an interest to see the work behind it" mb="56px">
          <div className="ev-tabs" role="group" aria-label="Research interests">
            {interests.map(i => {
              const t = PHD_TONE[i.key];
              const n = evidence.filter(e => e.interests.indexOf(i.key) >= 0).length;
              return (
                <button key={i.key} type="button" className="ev-tab" aria-pressed={focus === i.key} style={{ '--c': t.color, '--tint': t.tint }} onClick={() => setFocus(focus === i.key ? null : i.key)}>
                  <span className="ev-tab-count">{n} {n === 1 ? 'piece' : 'pieces'} of work</span>
                  <span className="ev-tab-name">{i.area}</span>
                  <span className="ev-tab-desc">{i.desc}</span>
                </button>
              );
            })}
          </div>
          <p className="ev-status" role="status" aria-live="polite">
            {focus ? 'The work behind "' + focusArea + '" is listed first. Select it again to clear.' : 'Select an interest to put the work behind it first.'}
          </p>
          <div className="ev-grid">
            {ordered.map(e => <EvidenceCard key={e.id} e={e} state={focus ? (isMatch(e) ? 'yes' : 'no') : 'all'} focusKey={focus} gh={gh} goTo={goTo} />)}
          </div>
        </UI.Section>

        <UI.Section id="thesis" title="Undergraduate thesis" aside={th.status.toLowerCase()} mb="56px">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: mobile ? '22px' : '26px 30px' }}>
            <p style={{ fontFamily: serif, fontSize: 'clamp(19px,2vw,22px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4, marginBottom: '10px' }}>{th.title}</p>
            <p style={{ fontFamily: sans, fontSize: '16px', color: 'var(--ink-2)', lineHeight: 1.7 }}>{th.question}</p>
            <p style={{ fontFamily: sans, fontSize: '14.5px', color: 'var(--ink-3)', marginTop: '10px' }}>Supervisors: {th.supervisors}.</p>
            <div className="ev-links" style={{ marginTop: '16px' }}>
              <a className="link-pill" href="#projects/touchstone" onClick={(e) => { e.preventDefault(); goTo('projects/touchstone'); }}>Touchstone, the system it builds on</a>
              <a className="link-pill" href="#research/thread" onClick={(e) => { e.preventDefault(); goTo('research/thread'); }}>How my papers lead to it</a>
            </div>
          </div>
        </UI.Section>

        <UI.Section id="path" title="Research path" mb="56px">
          <ol style={{ listStyle: 'none' }}>
            {trajectory.map((t, i) => <Step key={i} {...t} onGo={goTo} last={i === trajectory.length - 1} />)}
          </ol>
        </UI.Section>

        <UI.Section id="publications" title="Publications" aside={`${all.length} total, ${q1} Q1 in Scientific Reports`} mb="56px">
          <ul style={{ listStyle: 'none' }}>
            {all.map(p => {
              const ev = paperEv[p.id];
              const hit = !!(focus && ev && ev.interests.indexOf(focus) >= 0);
              return (
                <li key={p.id} className="pub-row" data-hit={hit ? 'yes' : undefined} style={Object.assign({ display: 'flex', gap: mobile ? '14px' : '20px', alignItems: 'flex-start' }, hit ? { '--ev': PHD_TONE[focus].color } : {})}>
                  <div style={{ fontFamily: sans, fontSize: '13.5px', fontWeight: 700, color: 'var(--ink-3)', minWidth: '40px', paddingTop: '3px', flexShrink: 0 }}>{p.year.slice(-4)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <UI.TierBadge tier={p.tier} />
                      <span className="tag">{p.tag}</span>
                      {hit && <span className="tag" style={{ color: PHD_TONE[focus].color, fontWeight: 700 }}>{PHD_TONE[focus].name}</span>}
                    </div>
                    <h3 style={{ fontFamily: serif, fontSize: 'clamp(16px,1.6vw,18px)', fontWeight: 700, color: 'var(--ink-2)', lineHeight: 1.4, marginBottom: '4px', textWrap: 'pretty' }}>{p.title}</h3>
                    <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.5 }}>{p.venue} · {p.authors}{p.role ? ' · ' + p.role : ''}</p>
                    <p style={{ fontFamily: sans, fontSize: '14.5px', marginTop: '8px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
                      <a href={'#research/paper-' + p.id} onClick={(e) => { e.preventDefault(); goTo('research/paper-' + p.id); }} style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Plain-language summary</a>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Read paper<span className="sr-only"> (opens in a new tab)</span> {'↗'}</a>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </UI.Section>

        <UI.Section id="training" title="Education and training" mb="56px">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,290px),1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ width: '42px', height: '42px', background: '#fff', borderRadius: '8px', border: '1px solid var(--line)', padding: '4px', display: 'inline-flex' }}>
                  <img src="assets/ku-logo-96.webp" width="96" height="96" alt="Kathmandu University logo" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </span>
                <h3 className="eyebrow" style={{ fontSize: '12.5px', color: 'var(--accent-2)', borderLeft: 'none', paddingLeft: 0, margin: 0 }}>Education</h3>
              </div>
              <p style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{edu.degree}</p>
              <p style={{ fontFamily: sans, fontSize: '14.5px', color: 'var(--ink-3)' }}>{edu.university}, {edu.place}</p>
              <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--ink-3)', marginTop: '4px' }}>{edu.period}</p>
              <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--ink-3)' }}>{edu.conferral}</p>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
              <h3 className="eyebrow" style={{ fontSize: '12.5px', color: 'var(--gold-ink)', borderLeft: 'none', paddingLeft: 0, marginBottom: '14px' }}>Key training</h3>
              <ul style={{ listStyle: 'none' }}>
                {d.fellowships.slice(0, 4).map((f, i) => (
                  <li key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ fontFamily: sans, fontSize: '15px', fontWeight: 600, color: 'var(--ink-2)' }}>{f.name}</div>
                    <div style={{ fontFamily: sans, fontSize: '13.5px', color: 'var(--ink-3)' }}>{f.org} · {f.period}</div>
                  </li>
                ))}
              </ul>
              <p style={{ fontFamily: sans, fontSize: '14.5px', color: 'var(--ink-3)', marginTop: '14px', lineHeight: 1.6 }}>
                {d.awards.length} competition wins, the latest in {d.awards[0].year}.{' '}
                <a href="#about/awards" onClick={(e) => { e.preventDefault(); goTo('about/awards'); }} style={{ color: 'var(--accent-2)', fontWeight: 600 }}>See awards</a>
              </p>
            </div>
          </div>
        </UI.Section>

        <UI.Section id="contact" title="Contact" mb="0">
          <div style={{ padding: mobile ? '26px 22px' : '34px', background: 'var(--accent-box)', border: '1px solid var(--accent-line)', borderRadius: '14px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: serif, fontSize: '24px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Looking for a PhD supervisor</h3>
            <p style={{ fontFamily: sans, fontSize: '15.5px', color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 24px' }}>
              If your group works on agent orchestration, sequential decision-making, compute-efficient learning, or multimodal systems, I would like to hear from you. Email is the fastest way to reach me.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a href={d.personal.gmail} target="_blank" rel="noopener noreferrer" className="btn-primary">Email me</a>
              <a href={d.personal.cv} className="btn-secondary">View CV</a>
              <a href={d.personal.scholar} target="_blank" rel="noopener noreferrer" className="btn-secondary">Google Scholar</a>
            </div>
          </div>
        </UI.Section>
      </UI.TocLayout>
    </div>
  );
}

window.SahajPhD = PhD;
