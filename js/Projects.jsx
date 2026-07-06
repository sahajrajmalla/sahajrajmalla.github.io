// Projects.jsx - Project cards with expand-on-click details, no section numbers
const { useState } = React;

function TypeBadge({ type }) {
  const map = {
    'Open Source': { bg:'rgba(34,85,232,0.15)', border:'rgba(34,85,232,0.4)', color:'#60a5fa' },
    'Research':    { bg:'rgba(139,92,246,0.15)', border:'rgba(139,92,246,0.4)', color:'var(--purple)' },
    'Startup':     { bg:'rgba(201,168,76,0.15)', border:'rgba(201,168,76,0.4)', color:'var(--gold-ink)' },
  };
  const s = map[type] || map['Research'];
  return (
    <span style={{
      background:s.bg, border:`1px solid ${s.border}`, borderRadius:'10px', padding:'3px 10px',
      fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize:'10px', fontWeight:700, color:s.color, letterSpacing:'0.8px', textTransform:'uppercase',
    }}>{type}</span>
  );
}

function ProjectCard({ project }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const c = project.color;

  return (
    <div
      onClick={() => setOpen(!open)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--surface-2)' : 'var(--surface)',
        border:`1px solid ${hover || open ? c + '55' : 'var(--line)'}`,
        borderRadius:'14px',
        padding:'26px',
        cursor:'pointer',
        transition:'all 0.22s ease',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ? `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px ${c}22` : 'none',
        display:'flex', flexDirection:'column',
        position:'relative', overflow:'hidden',
      }}
    >
      {/* Top accent line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:c, opacity: hover || open ? 0.9 : 0.4, transition:'opacity 0.2s' }} />

      {/* Icon + type row */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
        <span style={{
          width:'46px', height:'46px', borderRadius:'11px',
          background:`${c}1c`, border:`1px solid ${c}40`,
          display:'flex', alignItems:'center', justifyContent:'center', color:c,
        }}>{window.SahajIcons[project.icon] && window.SahajIcons[project.icon]({ size:24, color:c, strokeW:1.7 })}</span>
        <TypeBadge type={project.type} />
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily:"'Times New Roman', Georgia, serif",
        fontSize:'clamp(16px, 1.8vw, 21px)',
        fontWeight:700, color:'var(--ink)',
        marginBottom:'6px', lineHeight:1.2,
      }}>{project.name}</h3>

      {/* Tagline */}
      <p style={{
        fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize:'13px', color:'var(--ink-4)', marginBottom:'16px', lineHeight:1.5,
      }}>{project.tagline}</p>

      {/* Tech tags */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {project.tech.map(t => (
          <span key={t} style={{
            background:'var(--surface-3)', borderRadius:'5px', padding:'3px 8px',
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'11px', color:'var(--ink-4)', fontWeight:500,
          }}>{t}</span>
        ))}
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ marginTop:'20px', paddingTop:'20px', borderTop:`1px solid ${c}22` }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'14px', color:'var(--ink-3)', lineHeight:1.75, marginBottom:'18px',
          }}>{project.description}</p>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display:'inline-flex', alignItems:'center', gap:'7px',
                  color:c, textDecoration:'none',
                  fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize:'13px', fontWeight:600,
                  border:`1px solid ${c}55`,
                  borderRadius:'7px', padding:'7px 14px',
                  background:`${c}11`,
                }}>
                {window.SahajIcons.github({ size:15, color:c })} GitHub
              </a>
            )}
            {project.paper && (
              <a href={project.paper} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display:'inline-flex', alignItems:'center', gap:'6px',
                  color:'var(--purple)', textDecoration:'none',
                  fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize:'13px', fontWeight:600,
                  border:'1px solid rgba(139,92,246,0.4)',
                  borderRadius:'7px', padding:'7px 14px',
                  background:'rgba(139,92,246,0.1)',
                }}>
                Read Paper →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Projects() {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);

  return (
    <div style={{ minHeight:'100vh', paddingTop:'64px', background:'var(--bg)' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding: mobile ? '44px 20px' : '64px 48px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:'52px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px',
            textTransform:'uppercase', color:'var(--accent-2)', marginBottom:'12px',
          }}>Projects</p>
          <h2 style={{
            fontFamily:"'Times New Roman', Georgia, serif",
            fontSize:'clamp(32px, 4vw, 58px)',
            fontWeight:700, color:'var(--ink)', lineHeight:1.1,
            letterSpacing:'-0.5px', marginBottom:'16px',
          }}>Things I've built.</h2>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'clamp(14px, 1.5vw, 17px)', color:'var(--ink-3)',
            lineHeight:1.7, maxWidth:'580px',
          }}>
            Research code, a few open-source libraries, and one company. Tap any card for the details and the links.
          </p>
        </div>

        {/* ── GitHub quick stats ── */}
        <div style={{
          display:'flex', gap:'24px', marginBottom:'52px',
          padding:'20px 28px',
          background:'var(--surface)', border:'1px solid var(--line)',
          borderRadius:'12px', flexWrap:'wrap', alignItems:'center',
        }}>
          <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', color:'var(--ink-3)' }}>
            <strong style={{ color:'var(--ink)' }}>80+</strong> repositories
          </span>
          <span style={{ color:'var(--line-2)' }}>·</span>
          <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', color:'var(--ink-3)' }}>
            <strong style={{ color:'var(--ink)' }}>130+</strong> stars
          </span>
          <span style={{ color:'var(--line-2)' }}>·</span>
          <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', color:'var(--ink-3)' }}>
            Mostly Python &amp; Jupyter
          </span>
          <a href={d.personal.github} target="_blank" rel="noopener noreferrer"
            style={{
              marginLeft:'auto', color:'var(--accent-2)', textDecoration:'none',
              fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",
              fontSize:'13px', fontWeight:600,
              display:'flex', alignItems:'center', gap:'7px',
            }}>
            {window.SahajIcons.github({ size:15, color:'var(--accent-2)' })} View all on GitHub
          </a>
        </div>

        {/* ── Project grid ── */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))',
          gap:'16px',
        }}>
          {d.projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>

        {/* ── Open source note ── */}
        <div style={{
          marginTop:'48px', padding:'24px 28px',
          background:'rgba(34,85,232,0.07)', border:'1px solid rgba(34,85,232,0.2)',
          borderRadius:'12px', display:'flex', alignItems:'center', gap:'16px',
        }}>
          <div>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'15px', fontWeight:600, color:'var(--ink-2)', marginBottom:'4px' }}>
              Open to collaboration
            </p>
            <p style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', color:'var(--ink-3)', lineHeight:1.6 }}>
              Every research project here comes with code. If a repo is useful to you, fork it or open an issue. I am glad to talk about research, startups, or whatever you are stuck on.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SahajProjects = Projects;
