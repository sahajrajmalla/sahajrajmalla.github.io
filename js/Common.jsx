// Common.jsx - building blocks shared by every page. Exported on window.SahajUI.
// Keeps the per-page files short: headings, badges, figures, charts, citations,
// GitHub stats, the Gmail link, the error boundary and the table of contents.
const { useState, useEffect, useRef, useCallback } = React;

const UI_SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const UI_SERIF = "'Times New Roman',Georgia,serif";

/* ═══════════════════════════════════════════════════════ EXTRA ICONS */
(function addIcons() {
  const ico = (...els) => ({ size = 18, color = 'currentColor', strokeW = 1.8 }) =>
    React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: strokeW, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false', style: { display: 'block' } },
      els.map((e, i) => React.createElement(e[0], Object.assign({ key: i }, e[1]))));
  const extra = {
    agents: ico(['circle', { cx: 5, cy: 12, r: 2.4 }], ['circle', { cx: 19, cy: 5, r: 2.4 }], ['circle', { cx: 19, cy: 19, r: 2.4 }], ['path', { d: 'M7.2 11l9.6-5M7.2 13l9.6 5' }]),
    text: ico(['rect', { x: 3.5, y: 4.5, width: 17, height: 15, rx: 2.2 }], ['path', { d: 'M7.5 9h9M7.5 12.5h9M7.5 16h5' }]),
    star: ico(['path', { d: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8L12 3.5z' }]),
    fork: ico(['circle', { cx: 6, cy: 5, r: 2.2 }], ['circle', { cx: 18, cy: 5, r: 2.2 }], ['circle', { cx: 12, cy: 19, r: 2.2 }], ['path', { d: 'M6 7.2v1.3a3 3 0 003 3h6a3 3 0 003-3V7.2M12 11.5v5.3' }]),
    copy: ico(['rect', { x: 8.5, y: 8.5, width: 11, height: 11, rx: 2 }], ['path', { d: 'M15.5 8.5V6.5a2 2 0 00-2-2h-7a2 2 0 00-2 2v7a2 2 0 002 2h2' }]),
    check: ico(['path', { d: 'M5 12.5l4.5 4.5L19 7.5' }]),
    chevron: ico(['path', { d: 'M6 9l6 6 6-6' }]),
    code: ico(['path', { d: 'M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14' }]),
    doc: ico(['path', { d: 'M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z' }], ['path', { d: 'M14 3v5h5M9 13h6M9 17h6' }]),
  };
  window.SahajIcons = Object.assign(window.SahajIcons || {}, extra);
})();

/* ═══════════════════════════════════════════════════════ SMALL HELPERS */
const prefersReducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// The Gmail compose link the CV uses. Plain text address is always shown next to it.
const mailHref = () => window.SahajData.personal.gmail;

// Instant jump (page switches). There is no global CSS scroll-behavior, so scrollTo is instant by default.
function jumpTo(y) { window.scrollTo(0, y || 0); }

// Scroll a section into view (the CSS scroll-margin-top clears the fixed navbar and the chip bar).
// Smooth unless the visitor prefers reduced motion or the caller asks for an instant jump.
function scrollToSection(id, opts) {
  const el = id ? document.getElementById(id) : null;
  if (!el) return false;
  const instant = (opts && opts.instant) || prefersReducedMotion();
  el.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'start' });
  const h = document.getElementById(id + '-h');
  if (h && h.focus) { try { h.focus({ preventScroll: true }); } catch (e) { /* older browsers */ } }
  return true;
}

function fmtNum(n, dp) {
  const d = typeof dp === 'number' ? dp : (String(n).split('.')[1] || '').length;
  return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

/* ═══════════════════════════════════════════════════════ ERROR BOUNDARY */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { try { console.error('[sahaj] render error', err); } catch (e) { /* ignore */ } }
  render() {
    if (this.state.failed) return this.props.fallback === undefined ? null : this.props.fallback;
    return this.props.children;
  }
}

// Last resort when a whole page or the app fails: plain, no animation, still gives the CV and email.
function CrashNotice({ whole }) {
  const p = (window.SahajData && window.SahajData.personal) || { cv: 'assets/cv.pdf', email: 'mallasahajraj@gmail.com', gmail: 'https://mail.google.com/mail/?view=cm&fs=1&to=mallasahajraj@gmail.com' };
  return (
    <div role="alert" style={{ minHeight: whole ? '100vh' : '60vh', display: 'grid', placeItems: 'center', padding: '96px 24px', background: 'var(--bg)', color: 'var(--ink)', textAlign: 'center' }}>
      <div style={{ maxWidth: '480px' }}>
        <h1 style={{ fontFamily: UI_SERIF, fontSize: '28px', marginBottom: '12px' }}>Something went wrong on this page.</h1>
        <p style={{ fontFamily: UI_SANS, fontSize: '15px', lineHeight: 1.7, color: 'var(--ink-3)', marginBottom: '22px' }}>
          Reloading usually fixes it. You can also open my CV or write to me at {p.email}.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => window.location.reload()} className="btn-primary">Reload</button>
          <a href={p.cv} className="btn-secondary">View CV</a>
          <a href={p.gmail} target="_blank" rel="noopener noreferrer" className="btn-secondary">Email me</a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ GITHUB STATS
   One request to the public API, cached 24 h in localStorage (every access wrapped in
   try/catch), with a committed snapshot (assets/github-stats.json) as the fallback.     */
const GH = (function () {
  const KEY = 'sahaj-gh-v1', TTL = 24 * 3600 * 1000;
  let promise = null;
  function parse(list, source) {
    const byName = {}; let stars = 0, forks = 0, forkRepos = 0;
    list.forEach(function (r) {
      byName[r.name] = { stars: r.stargazers_count || 0, forks: r.forks_count || 0, fork: !!r.fork, language: r.language || null };
      stars += r.stargazers_count || 0; forks += r.forks_count || 0; if (r.fork) forkRepos++;
    });
    return { asOf: new Date().toISOString().slice(0, 10), repos: list.length, forkRepos: forkRepos, stars: stars, forks: forks, byName: byName, source: source };
  }
  function readCache() { try { const o = JSON.parse(localStorage.getItem(KEY)); return o && o.t && o.data ? o : null; } catch (e) { return null; } }
  function writeCache(data) { try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), data: data })); } catch (e) { /* storage blocked */ } }
  function live(user) {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const to = setTimeout(function () { if (ctl) ctl.abort(); }, 6000);
    return fetch('https://api.github.com/users/' + user + '/repos?per_page=100', { headers: { Accept: 'application/vnd.github+json' }, signal: ctl ? ctl.signal : undefined })
      .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error('github ' + r.status); return r.json(); })
      .then(function (list) { if (!Array.isArray(list)) throw new Error('github shape'); return parse(list, 'live'); });
  }
  function snapshot() {
    return fetch('assets/github-stats.json').then(function (r) { if (!r.ok) throw new Error('snapshot ' + r.status); return r.json(); })
      .then(function (j) { return Object.assign({}, j, { source: 'snapshot' }); });
  }
  function load(user) {
    if (promise) return promise;
    promise = (function () {
      const c = readCache();
      if (c && Date.now() - c.t < TTL) return Promise.resolve(Object.assign({}, c.data, { source: 'cache' }));
      return live(user).then(function (d) { writeCache(d); return d; })
        .catch(function () { return c ? Object.assign({}, c.data, { source: 'stale cache' }) : snapshot(); });
    })();
    return promise;
  }
  function cachedNow() { const c = readCache(); return c ? Object.assign({}, c.data, { source: 'cache' }) : null; }
  return { load: load, cachedNow: cachedNow };
})();

function useGithubStats() {
  const [s, setS] = useState(function () { return window.__sahajGh || GH.cachedNow(); });
  useEffect(function () {
    let on = true;
    GH.load(window.SahajData.personal.githubUser).then(function (d) { window.__sahajGh = d; if (on) setS(d); }).catch(function () { /* keep hiding counts */ });
    return function () { on = false; };
  }, []);
  return s;
}

// A repo link is shown only while it is in the public list. Until the list arrives we show it.
function repoIsPublic(gh, name) {
  if (!name) return false;
  if (!gh || !gh.byName) return true;
  return !!gh.byName[name] || gh.repos >= 100;
}

function RepoStats({ gh, repo }) {
  const r = gh && gh.byName && gh.byName[repo];
  if (!r) return null;
  const parts = [];
  if (r.stars > 0) parts.push({ k: 'star', n: r.stars, label: r.stars === 1 ? '1 star' : r.stars + ' stars' });
  if (r.forks > 0) parts.push({ k: 'fork', n: r.forks, label: r.forks === 1 ? '1 fork' : r.forks + ' forks' });
  if (!parts.length) return null;
  return (
    <span className="repo-stats" role="img" aria-label={parts.map(p => p.label).join(', ')}>
      {parts.map(p => (
        <span key={p.k} className="repo-stat" aria-hidden="true">
          {window.SahajIcons[p.k]({ size: 12, color: 'currentColor', strokeW: 2 })}{p.n}
        </span>
      ))}
    </span>
  );
}

// A GitHub link with its star and fork counts. `children` is the label.
function RepoLink({ gh, repo, url, children }) {
  if (!repoIsPublic(gh, repo)) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="link-pill">
      {window.SahajIcons.github({ size: 14, color: 'currentColor' })}
      <span>{children || 'GitHub'}</span>
      <RepoStats gh={gh} repo={repo} />
    </a>
  );
}

/* ═══════════════════════════════════════════════════════ CITATIONS */
function citationText(p) {
  return p.authors + '. ' + p.title + '. ' + p.citeVenue + '. ' + (p.doi ? 'https://doi.org/' + p.doi : p.url);
}
function bibtex(p) {
  const b = p.bib, esc = s => String(s).replace(/&/g, '\\&');
  const f = (k, v) => (v ? '  ' + k + ' = {' + esc(v) + '},' : null);
  const lines = ['@' + b.type + '{' + b.key + ','];
  [
    f('author', b.authors.join(' and ')),
    f('title', '{' + p.title + '}'),
    f('journal', b.journal), f('booktitle', b.booktitle), f('howpublished', b.howpublished),
    f('volume', b.volume), f('number', b.number), f('pages', b.pages),
    f('year', b.year), f('month', b.month),
    f('eprint', b.eprint), f('archivePrefix', b.archivePrefix), f('primaryClass', b.primaryClass),
    f('doi', b.doi), f('url', b.url), f('note', b.note),
  ].forEach(l => { if (l) lines.push(l); });
  lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
  lines.push('}');
  return lines.join('\n');
}
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}
function legacyCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:-100px;opacity:0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); document.body.removeChild(ta); return ok;
  } catch (e) { return false; }
}

function CiteButtons({ paper }) {
  const [msg, setMsg] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const run = (kind) => {
    copyText(kind === 'bib' ? bibtex(paper) : citationText(paper)).then(ok => {
      setMsg(ok ? (kind === 'bib' ? 'BibTeX copied' : 'Citation copied') : 'Copy failed. Select the text from the paper page instead.');
      clearTimeout(timer.current); timer.current = setTimeout(() => setMsg(''), 2600);
    });
  };
  return (
    <div className="cite-row">
      <button type="button" className="mini-btn" onClick={() => run('cite')}>{window.SahajIcons.copy({ size: 14 })}Copy citation</button>
      <button type="button" className="mini-btn" onClick={() => run('bib')}>{window.SahajIcons.copy({ size: 14 })}Copy BibTeX</button>
      <span role="status" aria-live="polite" className="cite-msg">{msg}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════ TYPE: badges, headings */
function TierBadge({ tier }) {
  const cls = { Q1: 'badge-q1', Journal: 'badge-jr', Conference: 'badge-cf', Preprint: 'badge-pre' }[tier] || 'badge-cf';
  return <span className={'badge ' + cls}>{tier}</span>;
}

function PageHeader({ eyebrow, title, lead, color, maxLead }) {
  return (
    <header style={{ marginBottom: '28px' }}>
      <p className="eyebrow" style={{ color: color || 'var(--accent-2)' }}>{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      {lead && <p className="page-lead" style={{ maxWidth: maxLead || '640px' }}>{lead}</p>}
    </header>
  );
}

// A titled section. `id` is the deep-link target (#page/id) and appears in the table of contents.
function Section({ id, title, color, aside, mb, children }) {
  return (
    <section id={id} data-toc-section aria-labelledby={id + '-h'} style={{ marginBottom: mb === undefined ? '60px' : mb }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '22px' }}>
        <h2 id={id + '-h'} tabIndex={-1} className="eyebrow sec-h" style={{ color: color || 'var(--accent-2)' }}>{title}</h2>
        {aside && <span className="aside">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════ MEDIA */
function PaperThumb({ paper, width, eager, caption }) {
  const t = paper.thumb;
  if (!t) return null;
  const isCard = !!t.src;
  const img = isCard
    ? { src: t.src }
    : { src: t.base + '-480.webp', srcSet: t.base + '-240.webp 240w, ' + t.base + '-480.webp 480w', sizes: width + 'px' };
  return (
    <figure className="paper-thumb" style={{ width: width + 'px' }}>
      <div className="paper-thumb-frame">
        <img {...img} width={t.w} height={t.h} alt={t.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      </div>
      <figcaption className={caption ? 'paper-thumb-cap' : 'sr-only'}>{isCard ? 'Title card' : 'First page'}</figcaption>
    </figure>
  );
}

function ProjectFigure({ media, sizes }) {
  if (!media) return null;
  const file = !!media.src;
  const img = file
    ? { src: media.src, width: media.w, height: media.h }
    : { src: media.base + '-640.webp', srcSet: media.base + '-640.webp ' + media.sm[0] + 'w, ' + media.base + '-1200.webp ' + media.lg[0] + 'w', sizes: sizes || '(max-width: 900px) 92vw, 440px', width: media.lg[0], height: media.lg[1] };
  return (
    <figure className="fig">
      <div className={'fig-frame' + (media.kind === 'logo' ? ' fig-logo' : '')}>
        <img {...img} alt={media.alt} loading="lazy" decoding="async" />
      </div>
      <figcaption><span>{media.caption}</span> <span className="credit">{media.credit}</span></figcaption>
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════ CHARTS (numbers printed in the papers only) */
function BarChart({ chart }) {
  const dp = chart.rows.reduce((m, r) => Math.max(m, (String(r.value).split('.')[1] || '').length), 0);
  return (
    <figure className="chart" aria-labelledby={'chart-' + chart.id}>
      <h3 id={'chart-' + chart.id} className="chart-title">{chart.title}</h3>
      <p className="chart-note">{chart.note}</p>
      <ul className="chart-rows">
        {chart.rows.map(r => (
          <li key={r.label} className="chart-row">
            <span className="chart-label">{r.label}</span>
            <span className="chart-track" aria-hidden="true"><span className="chart-fill" style={{ width: Math.max(0.8, (r.value / chart.max) * 100) + '%' }} /></span>
            <span className="chart-value">{fmtNum(r.value, r.dp !== undefined ? r.dp : dp)}{chart.unit}</span>
            {r.extra && <span className="chart-extra">{r.extra}</span>}
          </li>
        ))}
      </ul>
      <figcaption className="chart-source">Scale starts at zero. Source: {chart.source}</figcaption>
    </figure>
  );
}

function PairChart({ chart }) {
  return (
    <figure className="chart" aria-labelledby={'chart-' + chart.id}>
      <h3 id={'chart-' + chart.id} className="chart-title">{chart.title}</h3>
      <p className="chart-note">{chart.note}</p>
      <ul className="chart-rows">
        {chart.pairs.map(p => (
          <li key={p.label} className="chart-pair">
            <span className="chart-label">{p.label}</span>
            <span className="chart-pair-bars">
              <span className="chart-bar-line"><span className="chart-track" aria-hidden="true"><span className="chart-fill chart-fill-muted" style={{ width: '100%' }} /></span><span className="chart-value">{fmtNum(p.before, 2)}<span className="chart-tag"> traditional</span></span></span>
              <span className="chart-bar-line"><span className="chart-track" aria-hidden="true"><span className="chart-fill" style={{ width: (p.after / p.before) * 100 + '%' }} /></span><span className="chart-value">{fmtNum(p.after, 2)}<span className="chart-tag"> landmark-based</span></span></span>
            </span>
          </li>
        ))}
      </ul>
      <figcaption className="chart-source">Scale starts at zero. Source: {chart.source}</figcaption>
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════ TABLE OF CONTENTS */
function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0] || null);
  const key = ids.join('|');
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const off = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--toc-offset'), 10) || 100) + 8;
      let cur = null, last = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        last = id;
        if (el.getBoundingClientRect().top <= off) cur = id; else break;
      }
      if (last && window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 4) cur = last;
      setActive(cur || ids[0] || null);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [key]);
  return active;
}

// Wraps a long page. Wide screens: sticky side rail. Narrower: sticky chip bar under the navbar.
function TocLayout({ page, items, onNavigate, maxWidth, header, children }) {
  const vw = window.useViewportWidth();
  const wide = vw >= 1100;
  const mobile = vw < 820;
  const active = useScrollSpy(items.map(i => i.id));
  const barRef = useRef(null);

  // keep the active chip visible inside the horizontally scrolling bar
  useEffect(() => {
    const bar = barRef.current; if (!bar) return;
    const cur = bar.querySelector('[aria-current="location"]'); if (!cur) return;
    const left = cur.offsetLeft - (bar.clientWidth - cur.offsetWidth) / 2;
    if (bar.scrollTo) bar.scrollTo({ left: Math.max(0, left), behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); else bar.scrollLeft = left;
  }, [active, wide]);

  const go = (id) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return; // let the browser open a new tab
    e.preventDefault();
    if (onNavigate) onNavigate(page + '/' + id);
  };
  const links = (cls) => items.map(it => (
    <a key={it.id} href={'#' + page + '/' + it.id} onClick={go(it.id)} className={cls} aria-current={active === it.id ? 'location' : undefined}>
      <span>{it.label}</span>{it.count !== undefined && <span className="toc-count" aria-hidden="true">{it.count}</span>}
    </a>
  ));
  const show = items.length > 1;
  const pad = mobile ? '44px 20px' : '64px 48px';

  if (wide && show) {
    return (
      <div style={{ '--page-pad': '48px', maxWidth: (maxWidth + 250) + 'px', margin: '0 auto', padding: pad, display: 'grid', gridTemplateColumns: '190px minmax(0,1fr)', gap: '48px', alignItems: 'start' }}>
        <nav aria-label="On this page" className="toc-rail">
          <p className="toc-title" aria-hidden="true">On this page</p>
          {links('toc-link')}
        </nav>
        <div style={{ minWidth: 0 }}>{header}{children}</div>
      </div>
    );
  }
  return (
    <div style={{ '--page-pad': mobile ? '20px' : '48px', maxWidth: maxWidth + 'px', margin: '0 auto', padding: pad }}>
      {header}
      {show && <nav aria-label="On this page" className="toc-bar" ref={barRef}>{links('toc-chip')}</nav>}
      {children}
    </div>
  );
}

window.SahajUI = {
  ErrorBoundary, CrashNotice, TierBadge, PageHeader, Section, PaperThumb, ProjectFigure, BarChart, PairChart,
  CiteButtons, citationText, bibtex, copyText, useGithubStats, RepoStats, RepoLink, repoIsPublic,
  TocLayout, useScrollSpy, scrollToSection, jumpTo, prefersReducedMotion, mailHref, fmtNum,
};
