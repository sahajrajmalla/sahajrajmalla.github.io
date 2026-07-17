// PhD.jsx - Academic-focused page for professors & PhD supervisors
const { useState } = React;

function TrajectoryStep({ num, area, desc, year, last }) {
  return (
    <div style={{ display:'flex', gap:'20px', alignItems:'flex-start' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
        <div style={{
          width:'36px', height:'36px', borderRadius:'50%',
          background:'var(--accent-chip)', border:'2px solid var(--accent-line-strong)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:"'Times New Roman', Georgia, serif",
          fontSize:'14px', fontWeight:700, color:'var(--accent-2)',
        }}>{num}</div>
        {!last && <div style={{ width:'2px', flex:1, minHeight:'32px', background:'var(--accent-line)', marginTop:'4px' }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : '28px' }}>
        <h4 style={{
          fontFamily:"'Times New Roman', Georgia, serif",
          fontSize:'17px', fontWeight:700, color:'var(--ink)', marginBottom:'4px',
        }}>{area}</h4>
        <p style={{
          fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize:'13px', color:'var(--ink-3)', lineHeight:1.6, marginBottom:'4px',
        }}>{desc}</p>
        <span style={{
          fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize:'11px', color:'var(--ink-4)', letterSpacing:'0.5px',
        }}>{year}</span>
      </div>
    </div>
  );
}

function TierPill({ tier }) {
  const map = {
    'Q1':         { bg:'var(--badge-q1-bg)', border:'var(--badge-q1-line)', color:'var(--purple)' },
    'Journal':    { bg:'var(--badge-jr-bg)', border:'var(--badge-jr-line)', color:'var(--badge-jr-ink)' },
    'Conference': { bg:'var(--badge-cf-bg)', border:'var(--badge-cf-line)', color:'var(--badge-cf-ink)' },
    'Preprint':   { bg:'var(--badge-pre-bg)', border:'var(--badge-pre-line)', color:'var(--ink-3)' },
  };
  const s = map[tier] || map['Conference'];
  return (
    <span style={{
      background:s.bg, border:`1px solid ${s.border}`, borderRadius:'10px', padding:'2px 9px',
      fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",
      fontSize:'10px', fontWeight:700, color:s.color, letterSpacing:'0.8px', textTransform:'uppercase',
    }}>{tier}</span>
  );
}

function PhD({ onNavigate }) {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const [openPaper, setOpenPaper] = useState(null);

  // Combine peer-reviewed + preprints for the academic list
  const allPapers = [...(d.peerReviewed || []), ...(d.preprints || [])];

  const trajectory = [
    { num:'1', area:'Computer Vision', desc:'Devanagari script recognition with MallaNet (Q1, Scientific Reports, Nature)', year:'2024–2025' },
    { num:'2', area:'ML Systems & Forecasting', desc:'Ensemble methods, time-series, econometric modelling', year:'2023–2026' },
    { num:'3', area:'Quantum ML', desc:'Hybrid variational circuits for Devanagari digit recognition (99.80% accuracy)', year:'2025' },
    { num:'4', area:'Game-Playing Agents', desc:'Agent strategy comparison in incomplete-information environments (88.3% win rate)', year:'2025' },
    { num:'5', area:'→ PhD Focus', desc:'Reinforcement learning for multi-modal agentic systems', year:'2026+', last:true },
  ];

  return (
    <div style={{ minHeight:'100vh', paddingTop:'64px', background:'var(--bg)' }}>
      <div style={{ maxWidth:'1040px', margin:'0 auto', padding: mobile ? '44px 20px' : '64px 48px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom:'12px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px',
            textTransform:'uppercase', color:'var(--gold-ink)', marginBottom:'12px',
          }}>For Researchers &amp; Professors</p>
          <h2 style={{
            fontFamily:"'Times New Roman', Georgia, serif",
            fontSize:'clamp(32px, 4vw, 58px)',
            fontWeight:700, color:'var(--ink)', lineHeight:1.1,
            letterSpacing:'-0.5px', marginBottom:'16px',
          }}>Research Profile</h2>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'clamp(14px, 1.5vw, 17px)', color:'var(--ink-3)',
            lineHeight:1.7, maxWidth:'680px',
          }}>
            I'm applying for a direct PhD in artificial intelligence. I wrote this page for the supervisors and labs I'd like to work with: the questions I want to spend the next few years on, and the path that brought me here.
          </p>
        </div>

        {/* ── Research statement ── */}
        <div style={{
          margin:'48px 0',
          padding:'32px 36px',
          background:'var(--accent-box)',
          border:'1px solid var(--accent-line)',
          borderLeft:'4px solid var(--accent)',
          borderRadius:'0 12px 12px 0',
        }}>
          <p style={{
            fontFamily:"'Times New Roman', Georgia, serif",
            fontSize:'clamp(15px, 1.6vw, 19px)',
            fontStyle:'italic', color:'var(--ink-2)',
            lineHeight:1.8,
          }}>
            "{d.phdStatement}"
          </p>
        </div>

        {/* ── Research interests grid ── */}
        <div style={{ marginBottom:'64px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px',
            textTransform:'uppercase', color:'var(--accent-2)', marginBottom:'24px',
          }}>Research Interests</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'12px' }}>
            {d.researchInterests.map((r, i) => (
              <div key={i} style={{
                background:'var(--surface)', border:'1px solid var(--line)',
                borderRadius:'12px', padding:'18px 20px',
              }}>
                <h4 style={{
                  fontFamily:"'Times New Roman', Georgia, serif",
                  fontSize:'16px', fontWeight:700, color:'var(--ink)', marginBottom:'6px',
                }}>{r.area}</h4>
                <p style={{
                  fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize:'12px', color:'var(--ink-4)', lineHeight:1.6,
                }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Research trajectory ── */}
        <div style={{ marginBottom:'64px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px',
            textTransform:'uppercase', color:'var(--accent-2)', marginBottom:'32px',
          }}>Research Trajectory</p>
          <div>
            {trajectory.map((t, i) => (
              <TrajectoryStep key={i} {...t} last={i === trajectory.length - 1} />
            ))}
          </div>
        </div>

        {/* ── All Publications (academic format) ── */}
        <div style={{ marginBottom:'64px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px',
            textTransform:'uppercase', color:'var(--accent-2)', marginBottom:'24px',
          }}>Publications ({allPapers.length})</p>
          <div style={{ display:'flex', flexDirection:'column' }}>
            {allPapers.map((p, i) => (
              <div
                key={i}
                onClick={() => setOpenPaper(openPaper === i ? null : i)}
                style={{
                  padding:'20px 0',
                  borderBottom:'1px solid var(--line)',
                  cursor:'pointer',
                  display:'flex', gap:'20px', alignItems:'flex-start',
                }}
              >
                {/* Year */}
                <div style={{
                  fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize:'12px', fontWeight:700, color:'var(--ink-4)',
                  minWidth:'40px', paddingTop:'3px', flexShrink:0,
                }}>{p.year ? p.year.slice(-4) : ''}</div>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', gap:'8px', marginBottom:'8px', flexWrap:'wrap', alignItems:'center' }}>
                    <TierPill tier={p.tier} />
                    <span style={{
                      fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontSize:'11px', color:'var(--ink-4)',
                    }}>{p.tag}</span>
                  </div>
                  <h4 style={{
                    fontFamily:"'Times New Roman', Georgia, serif",
                    fontSize:'clamp(13px, 1.4vw, 16px)',
                    fontWeight:700, color:'var(--ink-2)', lineHeight:1.4,
                    marginBottom:'4px', textWrap:'pretty',
                  }}>{p.title}</h4>
                  <p style={{
                    fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize:'12px', color:'var(--ink-4)',
                  }}>{p.venue} · {p.publisher}</p>

                  {openPaper === i && (
                    <div style={{ marginTop:'12px' }}>
                      <p style={{
                        fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize:'13px', color:'var(--ink-3)', lineHeight:1.7, marginBottom:'12px',
                      }}>{p.abstract}</p>
                      {p.url && p.url !== '#' && (
                        <a href={p.url} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{
                            color:'var(--accent-2)', textDecoration:'none',
                            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                            fontSize:'13px', fontWeight:600,
                            borderBottom:'1px solid rgba(77,127,255,0.4)',
                          }}>
                          View paper →
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-4)" strokeWidth="2" strokeLinecap="round"
                  style={{ transform: openPaper === i ? 'rotate(180deg)' : 'rotate(0)', transition:'transform 0.2s', flexShrink:0, marginTop:'4px' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* ── Education + Key Training ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'16px', marginBottom:'48px' }}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'12px', padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
              <img src="assets/ku-logo.png" alt="Kathmandu University" style={{ width:'34px', height:'34px', objectFit:'contain', flexShrink:0 }} />
              <p style={{
                fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase',
                color:'var(--accent-2)', margin:0,
              }}>Education</p>
            </div>
            <h4 style={{ fontFamily:"'Times New Roman', Georgia, serif", fontSize:'17px', fontWeight:700, color:'var(--ink)', marginBottom:'4px' }}>{d.education.degree}</h4>
            <p style={{ fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize:'13px', color:'var(--ink-3)' }}>{d.education.university}</p>
            <p style={{ fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize:'12px', color:'var(--ink-4)', marginTop:'4px' }}>{d.education.period}</p>
          </div>
          <div style={{ background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'12px', padding:'24px' }}>
            <p style={{
              fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase',
              color:'var(--gold-ink)', marginBottom:'14px',
            }}>Key Training</p>
            {d.fellowships.slice(0, 4).map((f, i) => (
              <div key={i} style={{ marginBottom:'10px' }}>
                <div style={{ fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize:'13px', fontWeight:600, color:'var(--ink-2)' }}>{f.name}</div>
                <div style={{ fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif", fontSize:'11px', color:'var(--ink-4)' }}>{f.org} · {f.period}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Awards ── */}
        <div style={{ marginBottom:'48px' }}>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'13px', fontWeight:800, letterSpacing:'1.6px', borderLeft:'3px solid currentColor', paddingLeft:'11px',
            textTransform:'uppercase', color:'var(--gold-ink)', marginBottom:'20px',
          }}>Awards &amp; Competitions ({d.awards.length})</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'10px' }}>
            {d.awards.map((a, i) => (
              <div key={i} style={{
                background:'var(--gold-box)', border:'1px solid var(--gold-box-line)',
                borderRadius:'10px', padding:'13px 16px',
                display:'flex', justifyContent:'space-between', alignItems:'center', gap:'10px',
              }}>
                <div>
                  <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'13px', fontWeight:600, color:'var(--ink-2)', marginBottom:'2px' }}>{a.title}</div>
                  <div style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'11px', color:'var(--ink-4)' }}>{a.org}</div>
                </div>
                <span style={{ fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif", fontSize:'12px', color:'var(--gold-ink)', fontWeight:600, flexShrink:0 }}>{a.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          padding:'32px', background:'var(--accent-box)', border:'1px solid var(--accent-line)',
          borderRadius:'14px', textAlign:'center',
        }}>
          <h3 style={{ fontFamily:"'Times New Roman', Georgia, serif", fontSize:'22px', fontWeight:700, color:'var(--ink)', marginBottom:'10px' }}>
            Looking for a PhD supervisor
          </h3>
          <p style={{
            fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize:'14px', color:'var(--ink-3)', lineHeight:1.7, marginBottom:'24px', maxWidth:'560px', margin:'0 auto 24px',
          }}>
            If your group works on reinforcement learning, agentic systems, or applied ML for low-resource settings, I would like to hear from you. I have published in several of these areas and shipped ML in industry. Email is the fastest way to reach me.
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
            <a href={`mailto:${d.personal.email}`} style={{
              background:'var(--accent)', color:'white', textDecoration:'none',
              padding:'11px 26px', borderRadius:'8px',
              fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize:'14px', fontWeight:700,
            }}>Email Me</a>
            <a href={d.personal.cv} style={{
              background:'var(--surface-2)', color:'var(--ink-2)', textDecoration:'none',
              padding:'11px 26px', borderRadius:'8px',
              border:'1px solid var(--line-2)',
              fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize:'14px', fontWeight:500,
            }}>View CV</a>
            <a href={d.personal.scholar} target="_blank" rel="noopener noreferrer" style={{
              background:'var(--surface-2)', color:'var(--ink-2)', textDecoration:'none',
              padding:'11px 26px', borderRadius:'8px',
              border:'1px solid var(--line-2)',
              fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize:'14px', fontWeight:500,
            }}>Google Scholar</a>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SahajPhD = PhD;
