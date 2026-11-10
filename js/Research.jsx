// Research.jsx - the thread, four charts, then the papers. Awards and talks live on About.
const { useState, useEffect } = React;
const UI = window.SahajUI;

/* ── one paper: first page, one-line result, and a disclosure with the plain-language read ── */
function PaperCard({ paper, gh }) {
  const [open, setOpen] = useState(false);
  const mobile = window.useIsMobile(820);
  const id = 'paper-' + paper.id;

  // A deep link such as #research/paper-dhumbal opens that card.
  useEffect(() => {
    const check = () => { if (window.location.hash.replace(/^#\/?/, '').split('/')[1] === id) setOpen(true); };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, [id]);

  return (
    <article className="card" data-open={open} id={id} style={{ scrollMarginTop: 'var(--toc-offset)' }}>
      {paper.highlight && <div className="card-top" />}
      <div className="card-head" style={{ position: 'relative', display: 'flex', gap: mobile ? '14px' : '20px', alignItems: 'flex-start' }}>
        <UI.PaperThumb paper={paper} width={mobile ? 76 : 108} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '10px' }}>
            <UI.TierBadge tier={paper.tier} />
            <span className="tag">{paper.tag}</span>
            <span className="aside">{paper.year}</span>
          </div>
          <h3 className="card-title">
            <button type="button" className="card-toggle" aria-expanded={open} aria-controls={id + '-more'} onClick={() => setOpen(!open)}>
              <span>{paper.title}</span>
              <span className="chev">{window.SahajIcons.chevron({ size: 16, strokeW: 2 })}</span>
            </button>
          </h3>
          <p className="card-meta" style={{ marginTop: '6px' }}>{paper.venue}</p>
          <p className="card-meta">{paper.authors}{paper.role ? ' · ' + paper.role : ''}</p>
          <p className="card-short">{paper.short}</p>
        </div>
      </div>

      <div id={id + '-more'} hidden={!open} className="detail">
        <dl>
          <div><dt>In plain words</dt><dd>{paper.summary}</dd></div>
          <div><dt>The question</dt><dd>{paper.question}</dd></div>
          <div><dt>What I found</dt><dd>{paper.found}</dd></div>
          <div><dt>Limits</dt><dd>{paper.limits}</dd></div>
        </dl>
        <div className="links-row">
          <a href={paper.url} target="_blank" rel="noopener noreferrer" className="link-pill link-pill-purple">
            Read paper {window.SahajIcons.external({ size: 13, strokeW: 2 })}
          </a>
          {paper.doi && <a href={'https://doi.org/' + paper.doi} target="_blank" rel="noopener noreferrer" className="link-pill">DOI {paper.doi}</a>}
          {paper.code && <UI.RepoLink gh={gh} repo={paper.code.repo} url={paper.code.url}>Code</UI.RepoLink>}
          {(paper.links || []).map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="link-pill">{l.label}</a>)}
        </div>
        <UI.CiteButtons paper={paper} />
        {paper.thumb.licence && <p className="credit-line">{paper.thumb.licence}</p>}
      </div>
    </article>
  );
}

function Research({ onNavigate }) {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const gh = UI.useGithubStats();
  const [tag, setTag] = useState('All');

  const all = d.peerReviewed.concat(d.preprints);
  const tags = ['All'].concat(Array.from(new Set(all.map(p => p.tag))));
  const match = p => tag === 'All' || p.tag === tag;
  const peer = d.peerReviewed.filter(match);
  const prep = d.preprints.filter(match);
  const q1 = d.peerReviewed.filter(p => p.tier === 'Q1').length;
  const withCode = all.filter(p => p.code).length;
  const th = d.education.thesis;

  const toc = [{ id: 'thread', label: 'The thread' }, { id: 'numbers', label: 'Results in numbers' }]
    .concat(peer.length ? [{ id: 'peer-reviewed', label: 'Peer-reviewed', count: peer.length }] : [])
    .concat(prep.length ? [{ id: 'preprints', label: 'Preprints', count: prep.length }] : []);

  const stats = [
    { n: all.length, l: 'Publications' },
    { n: d.peerReviewed.length, l: 'Peer-reviewed' },
    { n: q1, l: 'Q1 papers in Scientific Reports' },
    { n: d.preprints.length, l: 'Preprints' },
  ];

  const header = (
    <React.Fragment>
      <UI.PageHeader
        eyebrow="Research"
        title="Published work."
        lead={`${all.length} papers: ${d.peerReviewed.length} peer-reviewed, ${q1} of them Q1 papers in Scientific Reports, and ${d.preprints.length} preprints. They cover vision, forecasting, game-playing agents and a few applied problems in Nepal. ${withCode} of the ${all.length} link to public code.`}
      />
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '1px', marginBottom: '48px', background: 'var(--line)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--line)' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '18px 20px', textAlign: 'center', background: 'var(--surface)' }}>
            <div style={{ fontFamily: "'Times New Roman',Georgia,serif", fontSize: 'clamp(22px,2.8vw,36px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '12.5px', color: 'var(--ink-3)', marginTop: '6px', letterSpacing: '0.3px' }}>{s.l}</div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--bg)' }}>
      <UI.TocLayout page="research" items={toc} onNavigate={onNavigate} maxWidth={1100} header={header}>

        <UI.Section id="thread" title="How the work fits together">
          <div className="prose">
            <p>I started with vision. MallaNet asks how small a model can be and still read a hard script well: 17.3 million parameters, against about 39 million for the best earlier result I compared with, trained on a Google Colab T4 GPU.</p>
            <p>Forecasting taught me to distrust a tidy comparison. In the Agricultural Commodity Price Index study, the models that won on the test window ranked third to seventh on validation, so nobody could have picked them beforehand. Combining models worked better than choosing one.</p>
            <p>Dhumbal put me in front of decisions under hidden information. A hand-written strategy won 88.9% of rounds, and my reinforcement learning agents did not beat a random player. The paper says their setup was too weak to count against reinforcement learning, so I read the result as a question: when is a cheap specialist enough, and how do you find out?</p>
            <p>My thesis asks a version of that question for an agent with a budget. Touchstone, a router with a critic, is a related system I built earlier.</p>
          </div>
          <aside style={{ marginTop: '24px', padding: '22px 26px', background: 'var(--accent-box)', border: '1px solid var(--accent-line)', borderLeft: '4px solid var(--accent)', borderRadius: '0 12px 12px 0', maxWidth: '760px' }} aria-label="Undergraduate thesis">
            <p className="eyebrow" style={{ color: 'var(--accent-2)', fontSize: '12.5px', borderLeft: 'none', paddingLeft: 0, marginBottom: '8px' }}>{th.label} · {th.status}</p>
            <p style={{ fontFamily: "'Times New Roman',Georgia,serif", fontSize: '19px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35, marginBottom: '8px' }}>{th.title}</p>
            <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '15px', color: 'var(--ink-3)', lineHeight: 1.7 }}>{th.question}</p>
            <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13.5px', color: 'var(--ink-3)', marginTop: '8px' }}>Supervisors: {th.supervisors}</p>
          </aside>
        </UI.Section>

        <UI.Section id="numbers" title="Results in numbers" aside="every number is printed in the paper named under its chart">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: '16px' }}>
            {d.charts.map(c => c.pairs ? <UI.PairChart key={c.id} chart={c} /> : <UI.BarChart key={c.id} chart={c} />)}
          </div>
        </UI.Section>

        <div role="group" aria-label="Filter papers by topic" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {tags.map(t => (
            <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)}
              style={{ background: tag === t ? 'var(--accent)' : 'var(--surface)', border: tag === t ? '1px solid var(--accent)' : '1px solid var(--line-2)', borderRadius: '20px', padding: '8px 16px', minHeight: '40px', cursor: 'pointer', fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '14px', fontWeight: tag === t ? 600 : 400, color: tag === t ? 'white' : 'var(--ink-3)', transition: 'all 0.2s ease' }}>{t}</button>
          ))}
        </div>

        {peer.length > 0 && (
          <UI.Section id="peer-reviewed" title="Peer-reviewed publications" color="var(--badge-jr-ink)" aside={tag === 'All' ? `${peer.length} papers, ${q1} Q1` : `${peer.length}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {peer.map(p => <PaperCard key={p.id} paper={p} gh={gh} />)}
            </div>
            <p className="aside" style={{ marginTop: '14px', fontSize: '13.5px', lineHeight: 1.6, maxWidth: '660px' }}>
              Q1 means the top quartile of the journal's subject category in the 2025 SCImago Journal Rank (Scientific Reports: Multidisciplinary, SJR 0.893).
            </p>
          </UI.Section>
        )}

        {prep.length > 0 && (
          <UI.Section id="preprints" title="Preprints" color="var(--ink-3)" aside={`${prep.length}, not peer reviewed`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {prep.map(p => <PaperCard key={p.id} paper={p} gh={gh} />)}
            </div>
          </UI.Section>
        )}

        <div style={{ padding: '18px 24px', background: 'var(--gold-box)', border: '1px solid var(--gold-box-line)', borderRadius: '12px' }}>
          <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '15px', color: 'var(--gold-ink)', lineHeight: 1.6 }}>
            The full list is on{' '}<a href={d.personal.scholar} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-2)', fontWeight: 600, borderBottom: '1px solid var(--accent-2)', textDecoration: 'none' }}>Google Scholar</a>. Awards and talks are on the <a href="#about/awards" onClick={(e) => { e.preventDefault(); onNavigate('about/awards'); }} style={{ color: 'var(--accent-2)', fontWeight: 600, borderBottom: '1px solid var(--accent-2)', textDecoration: 'none' }}>About page</a>.
          </p>
        </div>
      </UI.TocLayout>
    </div>
  );
}

window.SahajResearch = Research;
