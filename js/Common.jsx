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
    expand: ico(['path', { d: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5' }]),
    download: ico(['path', { d: 'M12 4v11' }], ['path', { d: 'M7 11l5 5 5-5' }], ['path', { d: 'M5 20h14' }]),
    zoomIn: ico(['circle', { cx: 11, cy: 11, r: 6.5 }], ['path', { d: 'M16 16l4.5 4.5M11 8.2v5.6M8.2 11h5.6' }]),
    zoomOut: ico(['circle', { cx: 11, cy: 11, r: 6.5 }], ['path', { d: 'M16 16l4.5 4.5M8.2 11h5.6' }]),
    replay: ico(['path', { d: 'M4 12a8 8 0 1 0 2.5-5.8' }], ['path', { d: 'M4 4v4.6h4.6' }]),
    close: ico(['path', { d: 'M6 6l12 12M18 6L6 18' }]),
    arrowLeft: ico(['path', { d: 'M19 12H5' }], ['path', { d: 'M11 6l-6 6 6 6' }]),
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

/* ═══════════════════════════════════════════════════════ SCROLL LOCK
   One counter for every overlay (the game, the image viewer). The first lock remembers the page's own
   inline overflow, the last unlock puts it back exactly, and each unlock function works only once, so
   overlays that open and close in any order can never leave the page unable to scroll.              */
const ScrollLock = (function () {
  let count = 0, saved = null;
  function lock() {
    if (count++ === 0) {
      saved = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    let released = false;
    return function unlock() {
      if (released) return;
      released = true;
      if (count > 0 && --count === 0) {
        document.body.style.overflow = saved === null ? '' : saved;
        saved = null;
      }
    };
  }
  return { lock: lock, held: function () { return count; } };
})();
function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    const unlock = ScrollLock.lock();
    return unlock;
  }, [active]);
}

/* ═══════════════════════════════════════════════════════ ERROR BOUNDARY */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) {
    try { console.error('[sahaj] render error', err); } catch (e) { /* ignore */ }
    if (this.props.onError) { try { this.props.onError(err); } catch (e) { /* ignore */ } }
  }
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

/* ═══════════════════════════════════════════════════════ IMAGE VIEWER (a lightbox)
   One viewer for the paper first pages, the project figures and the photo gallery.
   items: [{ src, w, h, alt, title, sub, note, href, hrefLabel, zoomable }]
   Esc closes, arrows move between items, + and - zoom, a click on the picture toggles zoom,
   focus is kept inside and handed back to the button that opened it, and the page behind
   cannot scroll (see ScrollLock).                                                          */
function ImageViewer({ items, index, onClose, onIndex, label }) {
  const N = items.length;
  const item = items[Math.min(index, N - 1)] || items[0];
  const vw = window.useViewportWidth();
  const [zoom, setZoom] = useState(false);
  const [status, setStatus] = useState('loading');   // loading | ready | error
  const boxRef = useRef(null);
  const closeRef = useRef(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const moved = useRef(false);
  const swipe = useRef(null);
  const opener = useRef(typeof document !== 'undefined' ? document.activeElement : null);
  const zoomable = !!item.zoomable;
  const zoomed = zoomable && zoom;
  // Raster pictures zoom up to their real pixels; a drawing (vector) can zoom as far as the screen allows.
  const zoomW = item.vector ? Math.max(1400, Math.round(vw * 1.7)) : Math.min(item.w || 1600, Math.max(900, Math.round(vw * 1.7)));
  const go = (d) => { if (N > 1 && onIndex) onIndex((index + d + N) % N); };

  useScrollLock(true);

  // a new picture: back to "fit", scrolled to the top-left, and check whether the file is already cached
  useEffect(() => {
    setZoom(false);
    const s = stageRef.current; if (s) { s.scrollTop = 0; s.scrollLeft = 0; }
    const im = imgRef.current;
    setStatus(im && im.complete && im.naturalWidth > 0 ? 'ready' : 'loading');
  }, [index, item.src]);

  // focus the close button, and give focus back to the opener when the viewer goes away
  useEffect(() => {
    if (closeRef.current) { try { closeRef.current.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    return () => {
      const el = opener.current;
      if (el && el.isConnected && el.focus) setTimeout(() => { try { el.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }, 0);
    };
  }, []);

  // keep the zoomed picture reachable by keyboard: when zoom starts, the stage can take arrow keys
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key === 'Tab' && boxRef.current) {
        const f = Array.prototype.slice.call(boxRef.current.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]'));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1], a = document.activeElement;
        if (e.shiftKey && (a === first || !boxRef.current.contains(a))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (a === last || !boxRef.current.contains(a))) { e.preventDefault(); first.focus(); }
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!zoomed && N > 1 && e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (!zoomed && N > 1 && e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (zoomable && (e.key === '+' || e.key === '=')) { e.preventDefault(); setZoom(true); }
      else if (zoomable && (e.key === '-' || e.key === '_')) { e.preventDefault(); setZoom(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Where the picture really is on screen. The image element fills the stage and the picture sits "contained" inside it,
  // so a click on the dark space around the picture has to be told apart from a click on the picture.
  const pictureRect = () => {
    const im = imgRef.current; if (!im) return null;
    const r = im.getBoundingClientRect();
    if (zoomed) return r;
    const nw = im.naturalWidth || item.w || r.width, nh = im.naturalHeight || item.h || r.height;
    const k = Math.min(r.width / nw, r.height / nh), w = nw * k, h = nh * k;
    const left = r.left + (r.width - w) / 2, top = r.top + (r.height - h) / 2;
    return { left: left, top: top, right: left + w, bottom: top + h };
  };
  const overPicture = (x, y) => { const r = pictureRect(); return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; };

  // mouse: drag to pan a zoomed picture (window listeners, no pointer capture, so the click that follows still reaches the stage).
  // touch: the browser pans it, and a swipe moves between pictures.
  const suppress = useRef(0);                 // a click right after a drag is not a click
  const stopDrag = useRef(null);
  useEffect(() => () => { if (stopDrag.current) stopDrag.current(); }, []);
  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const s = stageRef.current; if (!s) return;
    if (e.pointerType === 'touch') { swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId }; return; }
    if (!zoomed) return;
    moved.current = false;
    const start = { x: e.clientX, y: e.clientY, sl: s.scrollLeft, st: s.scrollTop };
    const mv = (ev) => {
      const dx = ev.clientX - start.x, dy = ev.clientY - start.y;
      if (!moved.current && Math.abs(dx) + Math.abs(dy) > 5) moved.current = true;
      if (moved.current) { s.scrollLeft = start.sl - dx; s.scrollTop = start.st - dy; }
    };
    const stop = () => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', stop); window.removeEventListener('pointercancel', stop);
      if (moved.current) suppress.current = performance.now() + 350;
      moved.current = false; stopDrag.current = null;
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', stop); window.addEventListener('pointercancel', stop);
    stopDrag.current = stop;
  };
  const onMove = (e) => {
    if (e.pointerType === 'touch' || !stageRef.current) return;
    const over = overPicture(e.clientX, e.clientY);
    stageRef.current.style.cursor = over ? (zoomable ? (zoomed ? 'zoom-out' : 'zoom-in') : 'default') : 'pointer';
  };
  const onUp = (e) => {
    const s = swipe.current;
    if (s && s.id === e.pointerId) {
      swipe.current = null;
      const dx = e.clientX - s.x, dy = e.clientY - s.y;
      if (!zoomed && N > 1 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) { suppress.current = performance.now() + 350; go(dx < 0 ? 1 : -1); }
    }
  };
  const onCancel = (e) => { if (swipe.current && swipe.current.id === e.pointerId) swipe.current = null; };
  // A click on the picture zooms in or back out; a click anywhere else on the dark space closes the viewer.
  const onStageClick = (e) => {
    if (performance.now() < suppress.current) return;
    if (!overPicture(e.clientX, e.clientY)) { onClose(); return; }
    if (zoomable) setZoom(z => !z);
  };

  const imgStyle = zoomed
    ? { width: zoomW + 'px', maxWidth: 'none', height: 'auto' }
    : { width: '100%', height: '100%', objectFit: 'contain' };

  return ReactDOM.createPortal((
    <div ref={boxRef} className="lb" role="dialog" aria-modal="true" aria-label={label || item.title || item.alt}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="lb-bar">
        {zoomable && status !== 'error' && (
          <button type="button" className="lb-btn" onClick={() => setZoom(z => !z)} aria-pressed={zoomed}>
            {window.SahajIcons[zoomed ? 'zoomOut' : 'zoomIn']({ size: 18, strokeW: 2 })}
            <span>{zoomed ? 'Fit to screen' : 'Zoom in'}</span>
          </button>
        )}
        {item.href && (
          <a className="lb-btn" href={item.href} target="_blank" rel="noopener noreferrer">
            <span>{item.hrefLabel || 'Open'}</span>{window.SahajIcons[item.mail ? 'mail' : 'external']({ size: 16, strokeW: 2 })}{<span className="sr-only"> (opens in a new tab)</span>}
          </a>
        )}
        <button ref={closeRef} type="button" className="lb-btn" onClick={onClose} aria-label="Close">
          {window.SahajIcons.close({ size: 18, strokeW: 2.2 })}<span className="lb-close-t">Close</span>
        </button>
      </div>

      <div ref={stageRef} className={'lb-stage' + (zoomed ? ' lb-zoomed' : '')}
        tabIndex={zoomed ? 0 : undefined} role={zoomed ? 'region' : undefined} aria-label={zoomed ? 'Zoomed picture. Scroll to read it.' : undefined}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onCancel} onClick={onStageClick}
        style={{ cursor: zoomable ? (zoomed ? 'zoom-out' : 'zoom-in') : 'default' }}>
        {status !== 'error' && (
          <img ref={imgRef} key={item.src} className="lb-img" src={item.src} width={item.w} height={item.h} alt={item.alt || item.title || ''}
            draggable={false} decoding="async" style={Object.assign({ opacity: status === 'ready' ? 1 : 0 }, imgStyle)}
            onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />
        )}
        {status === 'loading' && <p className="lb-msg" role="status">Loading the picture…</p>}
        {status === 'error' && (
          <p className="lb-msg" role="alert">
            The picture did not load.{item.href ? <React.Fragment> <a href={item.href} target="_blank" rel="noopener noreferrer">{item.hrefLabel || 'Open the source'}</a> instead.</React.Fragment> : ' Please try again.'}
          </p>
        )}
      </div>

      <div className="lb-foot">
        {item.title && <p className="lb-cap">{item.title}</p>}
        {(item.sub || N > 1) && <p className="lb-sub">{item.sub}{item.sub && N > 1 ? ' · ' : ''}{N > 1 ? (index + 1) + ' / ' + N : ''}</p>}
        {item.note && <p className="lb-note">{item.note}</p>}
        {zoomable && status === 'ready' && !zoomed && <p className="lb-hint">Select the picture or Zoom in to read the small print.</p>}
      </div>

      {N > 1 && (
        <React.Fragment>
          <button type="button" className="lb-nav lb-prev" onClick={() => go(-1)} aria-label="Previous picture">{window.SahajIcons.arrowLeft({ size: 20, strokeW: 2 })}</button>
          <button type="button" className="lb-nav lb-next" onClick={() => go(1)} aria-label="Next picture">{window.SahajIcons.arrowRight({ size: 20, strokeW: 2 })}</button>
        </React.Fragment>
      )}
    </div>
  ), document.body);
}

/* ═══════════════════════════════════════════════════════ MEDIA */
// First page of a paper, as a button that opens the viewer at a readable size.
function PaperThumb({ paper, width, eager }) {
  const t = paper.thumb;
  const [open, setOpen] = useState(false);
  if (!t) return null;
  const big = t.base + '-1600.webp';
  const bigH = Math.round(1600 * t.h / t.w);
  const item = {
    src: big, w: 1600, h: bigH, alt: t.alt, title: paper.title,
    sub: paper.venue + ' · ' + paper.year, note: t.licence || null,
    href: paper.url, hrefLabel: 'Read the paper', zoomable: true,
  };
  return (
    <React.Fragment>
      <button type="button" className="paper-thumb" style={{ width: width + 'px' }} onClick={() => setOpen(true)}
        aria-label={'Enlarge the first page of ' + paper.title} aria-haspopup="dialog">
        <span className="paper-thumb-frame">
          <img src={t.base + '-480.webp'} srcSet={t.base + '-240.webp 240w, ' + t.base + '-480.webp 480w'} sizes={width + 'px'}
            width={t.w} height={t.h} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
        </span>
        <span className="paper-thumb-zoom" aria-hidden="true">{window.SahajIcons.expand({ size: 14, strokeW: 2.2 })}</span>
      </button>
      {open && <ImageViewer items={[item]} index={0} onClose={() => setOpen(false)} label={'First page of ' + paper.title} />}
    </React.Fragment>
  );
}

// A report's or a slide deck's first page, as a button that opens the viewer.
function DocThumb({ doc, width }) {
  const t = doc.thumb;
  const [open, setOpen] = useState(false);
  if (!t) return null;
  const item = {
    src: t.base + '-1200.webp', w: 1200, h: Math.round(1200 * t.h / t.w), alt: t.alt, title: doc.name,
    sub: doc.level, href: window.SahajData.requestMail('Request for report: ' + doc.name), hrefLabel: 'Request the report by mail', mail: true, zoomable: true,
  };
  return (
    <React.Fragment>
      <button type="button" className="paper-thumb" style={{ width: width + 'px' }} onClick={() => setOpen(true)}
        aria-label={'Enlarge the first page of ' + doc.name} aria-haspopup="dialog">
        <span className="paper-thumb-frame" style={{ aspectRatio: t.w + ' / ' + t.h }}>
          <img src={t.base + '-480.webp'} srcSet={t.base + '-240.webp 240w, ' + t.base + '-480.webp 480w'} sizes={width + 'px'}
            width={t.w} height={t.h} alt="" loading="lazy" decoding="async" draggable={false} />
        </span>
        <span className="paper-thumb-zoom" aria-hidden="true">{window.SahajIcons.expand({ size: 14, strokeW: 2.2 })}</span>
      </button>
      {open && <ImageViewer items={[item]} index={0} onClose={() => setOpen(false)} label={'First page of ' + doc.name} />}
    </React.Fragment>
  );
}

// A project figure; select it to see it larger. Logos stay as they are.
function ProjectFigure({ media, sizes, title }) {
  const [open, setOpen] = useState(false);
  if (!media) return null;
  const file = !!media.src;
  const img = file
    ? { src: media.src, width: media.w, height: media.h }
    : { src: media.base + '-640.webp', srcSet: media.base + '-640.webp ' + media.sm[0] + 'w, ' + media.base + '-1200.webp ' + media.lg[0] + 'w', sizes: sizes || '(max-width: 900px) 92vw, 440px', width: media.lg[0], height: media.lg[1] };
  const logo = media.kind === 'logo';
  const item = {
    src: file ? media.src : media.base + '-1200.webp', w: file ? media.w : media.lg[0], h: file ? media.h : media.lg[1],
    alt: media.alt, title: media.caption, sub: title || '', zoomable: true, vector: file && /\.svg$/i.test(media.src),
  };
  return (
    <figure className="fig">
      {logo ? (
        <div className="fig-frame fig-logo"><img {...img} alt={media.alt} loading="lazy" decoding="async" /></div>
      ) : (
        <button type="button" className="fig-frame fig-btn" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={'Enlarge: ' + media.caption}>
          <img {...img} alt={media.alt} loading="lazy" decoding="async" draggable={false} />
          <span className="fig-zoom" aria-hidden="true">{window.SahajIcons.expand({ size: 14, strokeW: 2.2 })}<span>Enlarge</span></span>
        </button>
      )}
      {media.caption && <figcaption>{media.caption}</figcaption>}
      {open && <ImageViewer items={[item]} index={0} onClose={() => setOpen(false)} label={media.caption} />}
    </figure>
  );
}

/* ═══════════════════════════════════════════════════════ CHARTS (numbers printed in the papers only)
   The bars grow and the numbers count up once the chart scrolls into view. Without motion (reduced
   motion, or no IntersectionObserver) the finished chart is drawn straight away. Replay runs it again. */
function useChartAnim() {
  const ref = useRef(null);
  const canAnimate = typeof IntersectionObserver !== 'undefined' && !prefersReducedMotion();
  const [anim, setAnim] = useState(canAnimate ? 'ready' : 'off');   // off | ready (waiting, bars empty) | play
  useEffect(() => {
    if (anim !== 'ready') return undefined;
    const el = ref.current; if (!el) return undefined;
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { setAnim('play'); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [anim]);
  const replay = () => { if (typeof IntersectionObserver !== 'undefined' && !prefersReducedMotion()) setAnim('ready'); };
  return [ref, anim, replay, canAnimate];
}

function useCountUp(target, anim, delay) {
  const [v, setV] = useState(anim === 'off' ? target : 0);
  useEffect(() => {
    if (anim === 'off') { setV(target); return undefined; }
    if (anim === 'ready') { setV(0); return undefined; }
    const ms = 1100;
    let raf = 0, t0 = 0;
    const step = (now) => {
      if (!t0) t0 = now;
      const p = Math.min(1, (now - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step); else setV(target);
    };
    const start = setTimeout(() => { raf = requestAnimationFrame(step); }, delay || 0);
    const safety = setTimeout(() => setV(target), (delay || 0) + ms + 700);   // a hidden tab pauses rAF
    return () => { clearTimeout(start); clearTimeout(safety); cancelAnimationFrame(raf); };
  }, [target, anim, delay]);
  return v;
}

// The number sits in a box as wide as the finished number, so nothing shifts while it counts.
function ChartValue({ value, dp, unit, anim, delay, srSuffix }) {
  const v = useCountUp(value, anim, delay);
  const final = fmtNum(value, dp) + (unit || '');
  return (
    <span className="chart-value">
      <span className="chart-value-box" aria-hidden="true">
        <span className="chart-value-ghost">{final}</span>
        <span className="chart-value-live">{fmtNum(v, dp)}{unit || ''}</span>
      </span>
      <span className="sr-only">{final}{srSuffix ? ' ' + srSuffix : ''}</span>
    </span>
  );
}

function ReplayButton({ onClick, show }) {
  if (!show) return null;
  return (
    <button type="button" className="chart-replay" onClick={onClick} aria-label="Replay the animation">
      {window.SahajIcons.replay({ size: 14, strokeW: 2.2 })}<span>Replay</span>
    </button>
  );
}

function BarChart({ chart }) {
  const [ref, anim, replay, canAnimate] = useChartAnim();
  const dp = chart.rows.reduce((m, r) => Math.max(m, (String(r.value).split('.')[1] || '').length), 0);
  return (
    <figure className="chart" ref={ref} data-anim={anim} aria-labelledby={'chart-' + chart.id}>
      <div className="chart-head">
        <h3 id={'chart-' + chart.id} className="chart-title">{chart.title}</h3>
        <ReplayButton onClick={replay} show={canAnimate && anim === 'play'} />
      </div>
      <p className="chart-note">{chart.note}</p>
      <ul className="chart-rows" style={{ '--vw': (chart.rows.reduce((m, r) => Math.max(m, (fmtNum(r.value, r.dp !== undefined ? r.dp : dp) + (chart.unit || '')).length), 0) + 1) + 'ch' }}>
        {chart.rows.map((r, i) => (
          <li key={r.label} className="chart-row" style={{ '--i': i }}>
            <span className="chart-label">{r.label}</span>
            <span className="chart-track" aria-hidden="true"><span className="chart-fill" style={{ '--w': Math.max(0.8, (r.value / chart.max) * 100) + '%' }} /></span>
            <ChartValue value={r.value} dp={r.dp !== undefined ? r.dp : dp} unit={chart.unit} anim={anim} delay={i * 110} />
            {r.extra && <span className="chart-extra">{r.extra}</span>}
          </li>
        ))}
      </ul>
      <figcaption className="chart-source">Scale starts at zero. Source: {chart.source}</figcaption>
    </figure>
  );
}

function PairChart({ chart }) {
  const [ref, anim, replay, canAnimate] = useChartAnim();
  const vw = chart.pairs.reduce((m, p) => Math.max(m, fmtNum(p.before, 2).length, fmtNum(p.after, 2).length), 0) + 1;
  return (
    <figure className="chart" ref={ref} data-anim={anim} aria-labelledby={'chart-' + chart.id}>
      <div className="chart-head">
        <h3 id={'chart-' + chart.id} className="chart-title">{chart.title}</h3>
        <ReplayButton onClick={replay} show={canAnimate && anim === 'play'} />
      </div>
      <p className="chart-note">{chart.note}</p>
      <ul className="chart-rows" style={{ '--vw': vw + 'ch' }}>
        {chart.pairs.map((p, i) => (
          <li key={p.label} className="chart-pair">
            <span className="chart-label">{p.label}</span>
            <span className="chart-bar-line" style={{ '--i': i * 2 }}>
              <span className="chart-tagcol" aria-hidden="true">traditional</span>
              <span className="chart-track" aria-hidden="true"><span className="chart-fill chart-fill-muted" style={{ '--w': '100%' }} /></span>
              <ChartValue value={p.before} dp={2} anim={anim} delay={i * 220} srSuffix="traditional" />
            </span>
            <span className="chart-bar-line" style={{ '--i': i * 2 + 1 }}>
              <span className="chart-tagcol" aria-hidden="true">landmark-based</span>
              <span className="chart-track" aria-hidden="true"><span className="chart-fill" style={{ '--w': (p.after / p.before) * 100 + '%' }} /></span>
              <ChartValue value={p.after} dp={2} anim={anim} delay={i * 220 + 110} srSuffix="landmark-based" />
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
  ErrorBoundary, CrashNotice, TierBadge, PageHeader, Section, PaperThumb, DocThumb, ProjectFigure, BarChart, PairChart, ImageViewer, ScrollLock, useScrollLock,
  CiteButtons, citationText, bibtex, copyText, useGithubStats, RepoStats, RepoLink, repoIsPublic,
  TocLayout, useScrollSpy, scrollToSection, jumpTo, prefersReducedMotion, mailHref, fmtNum,
};
