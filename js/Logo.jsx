// Logo.jsx - Two mountains forming "M" (Malla) + golden crown. Theme-aware:
// mountains inherit --ink so they flip with the theme; crown stays gold.

const SahajLogoSVG = ({ size = 44, color, glow = false }) => {
  const ink = color || 'var(--ink)';
  return (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'block', flexShrink:0, filter: glow ? 'drop-shadow(0 2px 8px var(--accent-soft))' : 'none' }}>
    {/* ── Two mountains = the letter M ── */}
    <path d="M 7 53 L 20 21 L 32 40 L 44 21 L 57 53" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M 16.5 30 L 20 21 L 23.5 30" stroke={ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    <path d="M 40.5 30 L 44 21 L 47.5 30" stroke={ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    {/* ── Golden crown atop, centered ── */}
    <path d="M 24 18 L 40 18" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="24.5" y1="18" x2="24.5" y2="10" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="28.2" y1="18" x2="28.2" y2="7"  stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="32"   y1="18" x2="32"   y2="4"  stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="35.8" y1="18" x2="35.8" y2="7"  stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="39.5" y1="18" x2="39.5" y2="10" stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="24.5" cy="9"  r="1.9" fill="var(--gold)" />
    <circle cx="28.2" cy="6"  r="1.9" fill="var(--gold)" />
    <circle cx="32"   cy="3"  r="2.3" fill="var(--gold)" />
    <circle cx="35.8" cy="6"  r="1.9" fill="var(--gold)" />
    <circle cx="39.5" cy="9"  r="1.9" fill="var(--gold)" />
  </svg>
  );
};

window.SahajLogo = SahajLogoSVG;
