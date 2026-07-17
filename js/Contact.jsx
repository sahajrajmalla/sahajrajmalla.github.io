// Contact.jsx - Clean contact page, no section numbers, bright text
const { useState } = React;

function SocialLink({ label, url, icon, desc }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={url}
      target={url.startsWith('mailto') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display:'flex', alignItems:'center', gap:'16px',
        padding:'18px 22px',
        background: h ? 'var(--surface-2)' : 'var(--surface)',
        border:`1px solid ${h ? 'var(--accent-line-strong)' : 'var(--line)'}`,
        borderRadius:'12px', textDecoration:'none',
        transition:'all 0.2s ease',
        transform: h ? 'translateX(4px)' : 'translateX(0)',
      }}
    >
      <span style={{
        width:'40px', height:'40px', borderRadius:'10px',
        background: h ? 'var(--accent-chip-2)' : 'var(--accent-chip)',
        border:'1px solid var(--accent-line)',
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'var(--ink-2)',
        flexShrink:0,
        transition:'background 0.2s',
      }}>{window.SahajIcons[icon] && window.SahajIcons[icon]({ size:19, color:'var(--ink-2)' })}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize:'14px', fontWeight:600, color:'var(--ink)', marginBottom:'2px',
        }}>{label}</div>
        <div style={{
          fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize:'12px', color:'var(--ink-4)',
        }}>{desc}</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
        <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
    </a>
  );
}

function Contact() {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const isLight = window.useTheme() === 'light';

  const links = [
    { label:'LinkedIn',       url: d.personal.linkedin,           icon:'linkedin',     desc:'Connect professionally' },
    { label:'GitHub',         url: d.personal.github,             icon:'github',       desc:'Browse the code' },
    { label:'Google Scholar', url: d.personal.scholar,            icon:'scholar',      desc:'Academic publications' },
    { label:'ResearchGate',   url: d.personal.researchgate,       icon:'researchgate', desc:'Research profile' },
    { label:'X / Twitter',    url: d.personal.twitter,            icon:'x',            desc:'@sahaj_malla' },
    { label:'Instagram',      url: d.personal.instagram,          icon:'instagram',    desc:'@sahajrajmalla' },
    { label:'Medium',         url: d.personal.medium,             icon:'medium',       desc:'Writing & tutorials' },
  ];

  const openTo = [
    { tag:'PhD Opportunities' },
    { tag:'Research Collaboration' },
    { tag:'Open Source' },
    { tag:'Speaking / Teaching' },
  ];

  return (
    <div style={{ minHeight:'100vh', paddingTop:'64px', background:'var(--bg)' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding: mobile ? '44px 20px' : '64px 48px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:'56px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px',
            textTransform:'uppercase', color:'var(--accent-2)', marginBottom:'12px',
          }}>Contact</p>
          <h2 style={{
            fontFamily:"'Times New Roman', Georgia, serif",
            fontSize:'clamp(32px, 4.5vw, 64px)',
            fontWeight:700, color:'var(--ink)', lineHeight:1.05,
            letterSpacing:'-0.5px', marginBottom:'16px',
          }}>Get in touch.</h2>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'clamp(14px, 1.5vw, 17px)', color:'var(--ink-3)',
            lineHeight:1.7, maxWidth:'560px',
          }}>
            Email is the best way to reach me, and I usually reply within a day. Researcher, founder, student, or just curious, you are welcome to write.
          </p>
        </div>

        {/* ── Open to ── */}
        <div style={{ marginBottom:'48px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px',
            textTransform:'uppercase', color:'var(--gold-ink)', marginBottom:'16px',
          }}>Currently Open To</p>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {openTo.map(o => (
              <div key={o.tag} style={{
                display:'flex', alignItems:'center', gap:'8px',
                background:'var(--surface)', border:'1px solid var(--line-2)',
                borderRadius:'20px', padding:'7px 16px',
              }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--gold)', flexShrink:0 }}></span>
                <span style={{
                  fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize:'13px', color:'var(--ink-2)', fontWeight:500, whiteSpace:'nowrap',
                }}>{o.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Email hero ── */}
        <a href={`mailto:${d.personal.email}`}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=isLight?'0 12px 30px rgba(31,95,208,0.16)':'0 12px 30px rgba(34,85,232,0.28)';}}
          onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='none';}}
          style={{
            display:'block', marginBottom:'32px',
            padding:'28px 32px',
            background: isLight
              ? 'linear-gradient(135deg, #fffef8 0%, #fff4dc 100%)'
              : 'linear-gradient(135deg, rgba(34,85,232,0.15) 0%, rgba(139,92,246,0.1) 100%)',
            border: isLight ? '1px solid rgba(184,134,42,0.4)' : '1px solid var(--accent-line)',
            borderRadius:'16px', textDecoration:'none',
            transition:'transform 0.2s ease, box-shadow 0.2s ease',
          }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'11px', fontWeight:700, letterSpacing:'2px',
            textTransform:'uppercase', color: isLight ? 'var(--gold-ink)' : 'var(--accent-2)', marginBottom:'8px',
          }}>Best way to reach me</p>
          <p style={{
            fontFamily:"'Times New Roman', Georgia, serif",
            fontSize:'clamp(18px, 2.4vw, 28px)',
            fontWeight:700, color:'var(--ink)', letterSpacing:'-0.3px',
          }}>{d.personal.email}</p>
        </a>

        {/* ── Social links grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'10px' }}>
          {links.map(lk => <SocialLink key={lk.label} {...lk} />)}
        </div>

        {/* ── Footer note ── */}
        <div style={{
          marginTop:'64px', paddingTop:'32px',
          borderTop:'1px solid var(--line)',
          display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px',
        }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'13px', color:'var(--ink-4)',
          }}>
            Think like an Artist.
          </p>
          <a href={d.personal.cv}
            style={{
              display:'inline-flex', alignItems:'center', gap:'7px',
              color:'var(--accent-2)', textDecoration:'none',
              fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize:'13px', fontWeight:600,
              border:'1px solid var(--accent-line)',
              borderRadius:'7px', padding:'8px 16px',
              background:'var(--accent-chip)',
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M14 3v5h5M9 13h6M9 17h6M8 3h7l5 5v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
            </svg>
            View CV
          </a>
        </div>
      </div>
    </div>
  );
}

window.SahajContact = Contact;
