// PhD.jsx - for supervisors and labs: statement, interests, thesis, path, publications, training.
const UI = window.SahajUI;

function Step({ num, area, desc, year, last }) {
  return (
    <li style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, alignSelf: 'stretch' }}>
        <div aria-hidden="true" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-chip)', border: '2px solid var(--accent-line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Times New Roman',Georgia,serif", fontSize: '14px', fontWeight: 700, color: 'var(--accent-2)' }}>{num}</div>
        {!last && <div aria-hidden="true" style={{ width: '2px', flex: 1, minHeight: '32px', background: 'var(--accent-line)', marginTop: '4px' }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : '28px' }}>
        <h3 style={{ fontFamily: "'Times New Roman',Georgia,serif", fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{area}</h3>
        <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13.5px', color: 'var(--ink-3)', lineHeight: 1.65, marginBottom: '4px', maxWidth: '640px' }}>{desc}</p>
        <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '12px', color: 'var(--ink-4)', letterSpacing: '0.5px' }}>{year}</span>
      </div>
    </li>
  );
}

function PhD({ onNavigate }) {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const all = d.peerReviewed.concat(d.preprints);
  const q1 = d.peerReviewed.filter(p => p.tier === 'Q1').length;
  const th = d.education.thesis;
  const sans = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const serif = "'Times New Roman',Georgia,serif";

  const trajectory = [
    { num: '1', area: 'Computer vision', desc: 'MallaNet: a compact Devanagari character recognizer (Scientific Reports, Q1).', year: 'Dec 2025' },
    { num: '2', area: 'Forecasting and applied ML', desc: 'The Kalimati price index (Scientific Reports, Q1), NEPSE returns, real estate prices and remittances.', year: 'Oct 2023 – Nov 2026' },
    { num: '3', area: 'Quantum ML', desc: 'A CNN with a simulated 10-qubit circuit for Devanagari digits (preprint).', year: 'Jun 2025' },
    { num: '4', area: 'Game-playing agents', desc: 'Dhumbal: hand-written, search and learned agents compared (Scientific Reports, Q1). The best hand-written strategy won 88.9% of rounds, and the learned agents did not beat a random player.', year: 'Aug 2026' },
    { num: '5', area: 'Orchestration', desc: 'Touchstone, a router with a critic, and a thesis on when reviewing a failed attempt is worth its cost under a budget.', year: 'Nov 2024 – present', last: true },
  ];

  const toc = [
    { id: 'statement', label: 'Statement' },
    { id: 'interests', label: 'Research interests' },
    { id: 'thesis', label: 'Thesis' },
    { id: 'path', label: 'Research path' },
    { id: 'publications', label: 'Publications', count: all.length },
    { id: 'training', label: 'Education and training' },
    { id: 'contact', label: 'Contact' },
  ];

  const header = (
    <UI.PageHeader
      eyebrow="For researchers and professors"
      title="Research profile"
      lead="I am applying to PhD programs in artificial intelligence. This page is for the supervisors and labs I would like to work with: the questions I want to spend the next few years on, my thesis, and the path that brought me here."
      color="var(--gold-ink)"
      maxLead="680px"
    />
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--bg)' }}>
      <UI.TocLayout page="phd" items={toc} onNavigate={onNavigate} maxWidth={1040} header={header}>

        <UI.Section id="statement" title="Statement" mb="56px">
          <blockquote style={{ padding: '28px 32px', background: 'var(--accent-box)', border: '1px solid var(--accent-line)', borderLeft: '4px solid var(--accent)', borderRadius: '0 12px 12px 0' }}>
            <p style={{ fontFamily: serif, fontSize: 'clamp(15px,1.6vw,19px)', fontStyle: 'italic', color: 'var(--ink-2)', lineHeight: 1.8 }}>{d.phdStatement}</p>
          </blockquote>
        </UI.Section>

        <UI.Section id="interests" title="Research interests" aside={d.researchInterestsLine} mb="56px">
          <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,240px),1fr))', gap: '12px' }}>
            {d.researchInterests.map((r, i) => (
              <li key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '18px 20px' }}>
                <h3 style={{ fontFamily: serif, fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>{r.area}</h3>
                <p style={{ fontFamily: sans, fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.65 }}>{r.desc}</p>
              </li>
            ))}
          </ul>
        </UI.Section>

        <UI.Section id="thesis" title="Undergraduate thesis" aside={th.status.toLowerCase()} mb="56px">
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px 28px' }}>
            <p style={{ fontFamily: serif, fontSize: '19px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.4, marginBottom: '10px' }}>{th.title}</p>
            <p style={{ fontFamily: sans, fontSize: '14.5px', color: 'var(--ink-2)', lineHeight: 1.7 }}>{th.question}</p>
            <p style={{ fontFamily: sans, fontSize: '13px', color: 'var(--ink-3)', marginTop: '10px' }}>Supervisors: {th.supervisors}.</p>
          </div>
        </UI.Section>

        <UI.Section id="path" title="Research path" mb="56px">
          <ol style={{ listStyle: 'none' }}>
            {trajectory.map((t, i) => <Step key={i} {...t} last={i === trajectory.length - 1} />)}
          </ol>
        </UI.Section>

        <UI.Section id="publications" title="Publications" aside={`${all.length} total, ${q1} Q1 in Scientific Reports`} mb="56px">
          <ul style={{ listStyle: 'none' }}>
            {all.map(p => (
              <li key={p.id} style={{ display: 'flex', gap: mobile ? '14px' : '20px', alignItems: 'flex-start', padding: '18px 0', borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontFamily: sans, fontSize: '12px', fontWeight: 700, color: 'var(--ink-3)', minWidth: '38px', paddingTop: '3px', flexShrink: 0 }}>{p.year.slice(-4)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <UI.TierBadge tier={p.tier} />
                    <span className="tag">{p.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: serif, fontSize: 'clamp(14px,1.4vw,16px)', fontWeight: 700, color: 'var(--ink-2)', lineHeight: 1.4, marginBottom: '4px', textWrap: 'pretty' }}>{p.title}</h3>
                  <p style={{ fontFamily: sans, fontSize: '12.5px', color: 'var(--ink-3)', lineHeight: 1.5 }}>{p.venue} · {p.authors} · {p.role}</p>
                  <p style={{ fontFamily: sans, fontSize: '13px', marginTop: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <a href={'#research/paper-' + p.id} onClick={(e) => { e.preventDefault(); onNavigate('research/paper-' + p.id); }} style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Plain-language summary</a>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Read paper<span className="sr-only"> (opens in a new tab)</span> {'↗'}</a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </UI.Section>

        <UI.Section id="training" title="Education and training" mb="56px">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: '16px' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ width: '38px', height: '38px', background: '#fff', borderRadius: '8px', border: '1px solid var(--line)', padding: '4px', display: 'inline-flex' }}>
                  <img src="assets/ku-logo-96.webp" width="96" height="96" alt="Kathmandu University logo" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </span>
                <h3 className="eyebrow" style={{ fontSize: '11px', color: 'var(--accent-2)', borderLeft: 'none', paddingLeft: 0, margin: 0 }}>Education</h3>
              </div>
              <p style={{ fontFamily: serif, fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{d.education.degree}</p>
              <p style={{ fontFamily: sans, fontSize: '13px', color: 'var(--ink-3)' }}>{d.education.university}, {d.education.place}</p>
              <p style={{ fontFamily: sans, fontSize: '12.5px', color: 'var(--ink-4)', marginTop: '4px' }}>{d.education.period}</p>
              <p style={{ fontFamily: sans, fontSize: '12.5px', color: 'var(--ink-4)' }}>{d.education.conferral}</p>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', padding: '24px' }}>
              <h3 className="eyebrow" style={{ fontSize: '11px', color: 'var(--gold-ink)', borderLeft: 'none', paddingLeft: 0, marginBottom: '14px' }}>Key training</h3>
              <ul style={{ listStyle: 'none' }}>
                {d.fellowships.slice(0, 4).map((f, i) => (
                  <li key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ fontFamily: sans, fontSize: '13.5px', fontWeight: 600, color: 'var(--ink-2)' }}>{f.name}</div>
                    <div style={{ fontFamily: sans, fontSize: '12px', color: 'var(--ink-3)' }}>{f.org} · {f.period}</div>
                  </li>
                ))}
              </ul>
              <p style={{ fontFamily: sans, fontSize: '13px', color: 'var(--ink-3)', marginTop: '14px', lineHeight: 1.6 }}>
                {d.awards.length} competition wins, the latest in {d.awards[0].year}.{' '}
                <a href="#about/awards" onClick={(e) => { e.preventDefault(); onNavigate('about/awards'); }} style={{ color: 'var(--accent-2)', fontWeight: 600 }}>See awards</a>
              </p>
            </div>
          </div>
        </UI.Section>

        <UI.Section id="contact" title="Contact" mb="0">
          <div style={{ padding: '32px', background: 'var(--accent-box)', border: '1px solid var(--accent-line)', borderRadius: '14px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Looking for a PhD supervisor</h3>
            <p style={{ fontFamily: sans, fontSize: '14px', color: 'var(--ink-3)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 24px' }}>
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
