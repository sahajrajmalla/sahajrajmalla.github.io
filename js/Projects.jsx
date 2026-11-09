// Projects.jsx - short case studies: the problem, what I built, how it was checked.
const UI = window.SahajUI;

function TypeBadge({ type }) {
  const cls = { 'Open Source': 'badge-cf', 'Research': 'badge-q1', 'Startup': 'badge-jr' }[type] || 'badge-q1';
  return <span className={'badge ' + cls}>{type}</span>;
}

function Project({ project: p, gh }) {
  return (
    <article id={p.id} data-toc-section className="project" aria-labelledby={p.id + '-h'}>
      <UI.ProjectFigure media={p.media} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ width: '38px', height: '38px', borderRadius: '10px', background: p.color + '1c', border: '1px solid ' + p.color + '55', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-2)' }}>
            {window.SahajIcons[p.icon] && window.SahajIcons[p.icon]({ size: 20, color: 'currentColor', strokeW: 1.7 })}
          </span>
          <TypeBadge type={p.type} />
          <span className="aside" style={{ fontSize: '12px' }}>{p.period}</span>
        </div>
        <h3 id={p.id + '-h'} tabIndex={-1}>{p.name}</h3>
        <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '15px', color: 'var(--ink-2)', lineHeight: 1.5, marginTop: '6px' }}>{p.tagline}</p>
        {p.context && <p className="aside" style={{ fontSize: '12.5px', marginTop: '4px' }}>{p.context}</p>}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
          {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
        </div>

        <div className="case"><h4>The problem</h4><p>{p.problem}</p></div>
        <div className="case"><h4>What I built</h4><p>{p.built}</p></div>
        <div className="case"><h4>How it was checked</h4><p>{p.checked}</p></div>

        <div className="links-row">
          {p.repo && <UI.RepoLink gh={gh} repo={p.repo} url={p.github}>GitHub</UI.RepoLink>}
          {p.paper && <a href={p.paper} target="_blank" rel="noopener noreferrer" className="link-pill link-pill-purple">Read paper {window.SahajIcons.external({ size: 13, strokeW: 2 })}</a>}
          {(p.links || []).map(l => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="link-pill">{l.label}</a>)}
        </div>
      </div>
    </article>
  );
}

function Projects({ onNavigate }) {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const gh = UI.useGithubStats();

  const toc = d.projects.map(p => ({ id: p.id, label: p.name }));

  // top two languages among repositories that are not forks, computed from the GitHub list
  let langs = '';
  if (gh && gh.byName) {
    const count = {};
    Object.keys(gh.byName).forEach(k => { const r = gh.byName[k]; if (!r.fork && r.language) count[r.language] = (count[r.language] || 0) + 1; });
    const top = Object.keys(count).sort((a, b) => count[b] - count[a]).slice(0, 2);
    langs = top.length ? 'Mostly ' + top.join(' and ') : '';
  }

  const header = (
    <React.Fragment>
      <UI.PageHeader
        eyebrow="Projects"
        title="Things I've built."
        lead="Agent systems, open-source tools, research code and one company. Each entry says what problem it takes on, what I built, and how I checked it, including where the checking is thin."
        maxLead="620px"
      />
      <div style={{ display: 'flex', gap: '12px 24px', marginBottom: '40px', padding: '18px 24px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {gh ? (
          <React.Fragment>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13px', color: 'var(--ink-3)' }}>
              <strong style={{ color: 'var(--ink)' }}>{gh.repos}</strong> public repositories{gh.forkRepos ? ` (${gh.forkRepos} are forks)` : ''}
            </span>
            <span aria-hidden="true" style={{ color: 'var(--line-2)' }}>·</span>
            <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13px', color: 'var(--ink-3)' }}>
              <strong style={{ color: 'var(--ink)' }}>{gh.stars}</strong> stars in total
            </span>
            {langs && <React.Fragment><span aria-hidden="true" style={{ color: 'var(--line-2)' }}>·</span><span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13px', color: 'var(--ink-3)' }}>{langs}</span></React.Fragment>}
          </React.Fragment>
        ) : <span style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13px', color: 'var(--ink-3)' }}>GitHub numbers are loading.</span>}
        <a href={d.personal.github} target="_blank" rel="noopener noreferrer" className="link-pill" style={{ marginLeft: mobile ? 0 : 'auto' }}>
          {window.SahajIcons.github({ size: 14, color: 'currentColor' })} View all on GitHub
        </a>
        {gh && gh.source === 'snapshot' && <span className="aside" style={{ flexBasis: '100%' }}>GitHub numbers as of {gh.asOf} (saved copy; the live request did not complete).</span>}
      </div>
    </React.Fragment>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: '64px', background: 'var(--bg)' }}>
      <UI.TocLayout page="projects" items={toc} onNavigate={onNavigate} maxWidth={1100} header={header}>
        {d.projectGroups.map(g => {
          const items = d.projects.filter(p => p.group === g.id);
          if (!items.length) return null;
          return (
            <section key={g.id} aria-labelledby={'group-' + g.id} style={{ marginBottom: '28px' }}>
              <h2 id={'group-' + g.id} className="eyebrow" style={{ color: g.id === 'startup' ? 'var(--gold-ink)' : g.id === 'research' ? 'var(--purple)' : 'var(--accent-2)', marginBottom: '4px' }}>{g.label}</h2>
              {items.map(p => <Project key={p.id} project={p} gh={gh} />)}
            </section>
          );
        })}

        <div style={{ marginTop: '24px', padding: '24px 28px', background: 'var(--accent-box)', border: '1px solid var(--accent-line)', borderRadius: '12px' }}>
          <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '15px', fontWeight: 600, color: 'var(--ink-2)', marginBottom: '4px' }}>Open to collaboration</p>
          <p style={{ fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize: '13.5px', color: 'var(--ink-3)', lineHeight: 1.7 }}>
            If a repository is useful to you, fork it or open an issue. I am glad to talk about research, startups, or whatever you are stuck on.
          </p>
        </div>
      </UI.TocLayout>
    </div>
  );
}

window.SahajProjects = Projects;
