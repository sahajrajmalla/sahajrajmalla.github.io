// Contact.jsx — Clean contact page, no section numbers, bright text
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
        background: h ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.025)',
        border:`1px solid ${h ? 'rgba(34,85,232,0.45)' : '#0e1f3d'}`,
        borderRadius:'12px', textDecoration:'none',
        transition:'all 0.2s ease',
        transform: h ? 'translateX(4px)' : 'translateX(0)',
      }}
    >
      <span style={{
        width:'40px', height:'40px', borderRadius:'10px',
        background: h ? 'rgba(34,85,232,0.2)' : 'rgba(34,85,232,0.1)',
        border:'1px solid rgba(34,85,232,0.25)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'18px', flexShrink:0,
        transition:'background 0.2s',
      }}>{icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize:'14px', fontWeight:600, color:'#e8edf8', marginBottom:'2px',
        }}>{label}</div>
        <div style={{
          fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize:'12px', color:'#7090aa',
        }}>{desc}</div>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a6080" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
        <path d="M5 12h14M13 6l6 6-6 6"/>
      </svg>
    </a>
  );
}

function Contact() {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);

  const links = [
    { label:'LinkedIn',       url: d.personal.linkedin,           icon:'💼', desc:'Connect professionally' },
    { label:'GitHub',         url: d.personal.github,             icon:'⌨️', desc:'Explore the code' },
    { label:'Google Scholar', url: d.personal.scholar,            icon:'🎓', desc:'Academic publications' },
    { label:'ResearchGate',   url: d.personal.researchgate,       icon:'🔬', desc:'Research profile' },
    { label:'X / Twitter',    url: d.personal.twitter,            icon:'𝕏', desc:'@sahaj_malla' },
    { label:'Instagram',      url: d.personal.instagram,          icon:'📷', desc:'@sahajrajmalla' },
    { label:'Medium',         url: d.personal.medium,             icon:'📝', desc:'Writing & tutorials' },
  ];

  const openTo = [
    { tag:'PhD Opportunities',      icon:'🎓', color:'#8b5cf6' },
    { tag:'Research Collaboration', icon:'🔬', color:'#4d7fff' },
    { tag:'Open Source',            icon:'⚡', color:'#10b981' },
    { tag:'Startup / Product Work', icon:'🚀', color:'#c9a84c' },
    { tag:'Speaking / Teaching',    icon:'🗣', color:'#ff6b6b' },
  ];

  return (
    <div style={{ minHeight:'100vh', paddingTop:'64px', background:'#060c1a' }}>
      <div style={{ maxWidth:'900px', margin:'0 auto', padding: mobile ? '44px 20px' : '64px 48px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:'56px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'11px', fontWeight:700, letterSpacing:'3px',
            textTransform:'uppercase', color:'#4d7fff', marginBottom:'12px',
          }}>Contact</p>
          <h2 style={{
            fontFamily:"'Times New Roman', Georgia, serif",
            fontSize:'clamp(32px, 4.5vw, 64px)',
            fontWeight:700, color:'#e8edf8', lineHeight:1.05,
            letterSpacing:'-0.5px', marginBottom:'16px',
          }}>Let's build together.</h2>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'clamp(14px, 1.5vw, 17px)', color:'#b0c0dc',
            lineHeight:1.7, maxWidth:'560px',
          }}>
            Whether you're a researcher, a startup founder, an engineer, or just curious — I'd love to hear from you. Best way is email; I usually reply within 24 hours.
          </p>
        </div>

        {/* ── Open to ── */}
        <div style={{ marginBottom:'48px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'11px', fontWeight:700, letterSpacing:'3px',
            textTransform:'uppercase', color:'#c9a84c', marginBottom:'16px',
          }}>Currently Open To</p>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {openTo.map(o => (
              <div key={o.tag} style={{
                display:'flex', alignItems:'center', gap:'8px',
                background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:'20px', padding:'7px 16px',
              }}>
                <span style={{ fontSize:'15px' }}>{o.icon}</span>
                <span style={{
                  fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize:'13px', color:'#c8d4ee', fontWeight:500,
                }}>{o.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Email hero ── */}
        <a href={`mailto:${d.personal.email}`}
          style={{
            display:'block', marginBottom:'32px',
            padding:'28px 32px',
            background:'linear-gradient(135deg, rgba(34,85,232,0.15) 0%, rgba(139,92,246,0.1) 100%)',
            border:'1px solid rgba(34,85,232,0.35)',
            borderRadius:'16px', textDecoration:'none',
          }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'11px', fontWeight:700, letterSpacing:'2px',
            textTransform:'uppercase', color:'#4d7fff', marginBottom:'8px',
          }}>Best way to reach me</p>
          <p style={{
            fontFamily:"'Times New Roman', Georgia, serif",
            fontSize:'clamp(18px, 2.4vw, 28px)',
            fontWeight:700, color:'#e8edf8', letterSpacing:'-0.3px',
          }}>{d.personal.email}</p>
        </a>

        {/* ── Social links grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:'10px' }}>
          {links.map(lk => <SocialLink key={lk.label} {...lk} />)}
        </div>

        {/* ── Footer note ── */}
        <div style={{
          marginTop:'64px', paddingTop:'32px',
          borderTop:'1px solid #0e1f3d',
          display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px',
        }}>
          <p style={{
            fontFamily:"'Times New Roman', Georgia, serif",
            fontSize:'13px', fontStyle:'italic', color:'#5a7090',
          }}>
            "Curiosity is the engine. Obsession is the fuel."
          </p>
          <a href={d.personal.cv} download="Sahaj_Raj_Malla_CV.pdf"
            style={{
              display:'inline-flex', alignItems:'center', gap:'7px',
              color:'#4d7fff', textDecoration:'none',
              fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize:'13px', fontWeight:600,
              border:'1px solid rgba(77,127,255,0.35)',
              borderRadius:'7px', padding:'8px 16px',
              background:'rgba(34,85,232,0.08)',
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v14M5 9l7 7 7-7"/><line x1="3" y1="21" x2="21" y2="21"/>
            </svg>
            Download CV
          </a>
        </div>
      </div>
    </div>
  );
}

window.SahajContact = Contact;
