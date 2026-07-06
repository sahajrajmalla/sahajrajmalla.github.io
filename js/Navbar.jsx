// Navbar.jsx - Fixed top navbar with logo, nav links, game button, CV link (opens PDF in same tab)
const { useState, useEffect } = React;

const NAV_LINKS = [
  { id: 'home',     label: 'Home' },
  { id: 'about',    label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'phd',      label: 'For PhD' },
  { id: 'contact',  label: 'Contact' },
];

function Navbar({ currentPage, onNavigate }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 900);
  const Logo = window.SahajLogo;
  const data = window.SahajData;
  const theme = window.useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const go = (id) => {
    onNavigate(id);
    setMenuOpen(false);
    window.location.hash = id;
  };

  const navBg = isLight
    ? (scrolled ? 'rgba(255,249,238,0.96)' : 'rgba(255,249,238,0.55)')
    : (scrolled ? 'rgba(6,12,26,0.96)' : 'rgba(6,12,26,0.4)');
  const borderColor = isLight
    ? (scrolled ? 'rgba(224,207,168,0.9)' : 'rgba(224,207,168,0.4)')
    : (scrolled ? 'rgba(26,48,96,0.9)' : 'rgba(26,48,96,0.3)');

  /* ── theme toggle button ── */
  const ThemeToggle = () => (
    <button
      onClick={() => window.__toggleTheme && window.__toggleTheme()}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        background: 'var(--surface-2)', border: '1px solid var(--line-2)', cursor: 'pointer',
        width: '36px', height: '36px', borderRadius: '8px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--ink-2)', flexShrink: 0, transition: 'all 0.2s ease',
      }}
    >
      {isLight
        ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>
        : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>}
    </button>
  );

  /* ── shared link style fn ── */
  const linkStyle = (id) => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '6px 13px',
    borderRadius: '6px',
    color: currentPage === id ? 'var(--accent-2)' : 'var(--ink-4)',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    fontSize: '14px',
    fontWeight: currentPage === id ? 600 : 400,
    letterSpacing: '0.3px',
    borderBottom: currentPage === id ? '2px solid var(--accent)' : '2px solid transparent',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      height: '64px',
      background: navBg,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: `1px solid ${borderColor}`,
      transition: 'background 0.3s ease, border-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '0 16px' : '0 28px',
      gap: '16px',
    }}>

      {/* ── Logo ── */}
      <button
        onClick={() => go('home')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: 0, marginRight: 'auto',
        }}
        aria-label="Home"
      >
        <Logo size={38} />
        {!isMobile && (
          <span style={{
            fontFamily: "'Times New Roman', Georgia, serif",
            fontSize: '16px',
            fontWeight: 400,
            letterSpacing: '0.4px',
            color: 'var(--ink)',
          }}>
            Sahaj Raj Malla
          </span>
        )}
      </button>

      {/* ── Desktop links ── */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {NAV_LINKS.map(({ id, label }) => (
            <button key={id} onClick={() => go(id)} style={linkStyle(id)}>
              {label}
            </button>
          ))}

          <span style={{ marginLeft: '8px' }}><ThemeToggle /></span>

          {/* CV - opens the PDF in the browser's native viewer, same tab */}
          <a
            href={data.personal.cv}
            style={{
              background: 'var(--accent)',
              border: 'none',
              cursor: 'pointer',
              padding: '7px 18px',
              borderRadius: '7px',
              color: 'white',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              marginLeft: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.3px',
              transition: 'background 0.2s ease',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            CV
          </a>
        </div>
      )}

      {/* ── Mobile hamburger ── */}
      {isMobile && (
        <>
          <ThemeToggle />
          <a href={data.personal.cv} style={{
            background: 'var(--accent)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '12px',
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 700,
          }}>CV</a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ink)', padding: '4px', borderRadius: '4px',
            }}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen
                ? <><path d="M18 6L6 18M6 6l12 12"/></>
                : <><path d="M4 7h16M4 12h16M4 17h16"/></>
              }
            </svg>
          </button>
        </>
      )}

      {/* ── Mobile dropdown ── */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'absolute',
          top: '64px',
          left: 0, right: 0,
          background: isLight ? 'rgba(255,249,238,0.98)' : 'rgba(8,14,30,0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--line-2)',
          padding: '12px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              style={{
                background: currentPage === id ? 'rgba(34,85,232,0.15)' : 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '13px 28px',
                color: currentPage === id ? 'var(--accent-2)' : 'var(--ink-2)',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '15px',
                fontWeight: currentPage === id ? 600 : 400,
                textAlign: 'left',
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => go('game')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '13px 28px',
              color: 'var(--accent-2)',
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '15px', fontWeight: 600, textAlign: 'left',
            }}
          >
            World
          </button>
        </div>
      )}
    </nav>
  );
}

window.SahajNavbar = Navbar;
