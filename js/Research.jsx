// Research.jsx — 9 papers in peer-reviewed + preprints sections, no numbering
const { useState } = React;

const TAGS_ALL = ['All','Computer Vision','Quantum ML','Reinforcement Learning','Finance · ML','Geospatial AI','Forecasting','Econometrics','Privacy · Systems'];

function TierBadge({ tier }) {
  const m = {
    'Q1':         {bg:'rgba(139,92,246,0.18)',border:'rgba(139,92,246,0.5)',color:'#a78bfa'},
    'Journal':    {bg:'rgba(201,168,76,0.16)', border:'rgba(201,168,76,0.45)',color:'#d6b55e'},
    'Conference': {bg:'rgba(34,85,232,0.18)',  border:'rgba(34,85,232,0.5)', color:'#60a5fa'},
    'Preprint':   {bg:'rgba(127,160,200,0.14)', border:'rgba(127,160,200,0.4)',color:'#9fb6d4'},
  };
  const s = m[tier]||m['Conference'];
  return <span style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:'12px',padding:'3px 10px',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',fontWeight:700,color:s.color,letterSpacing:'0.8px',textTransform:'uppercase'}}>{tier}</span>;
}

function PaperCard({ paper }) {
  const [open,setOpen]=useState(false);
  const [h,setH]=useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={()=>setOpen(!open)}
      style={{background:h?'rgba(255,255,255,0.045)':'rgba(255,255,255,0.025)',border:`1px solid ${open?'rgba(34,85,232,0.5)':h?'rgba(34,85,232,0.3)':'#0e1f3d'}`,borderRadius:'14px',padding:'26px',cursor:'pointer',transition:'all 0.2s ease',transform:h?'translateY(-3px)':'translateY(0)',boxShadow:h?'0 12px 40px rgba(0,0,0,0.4)':'none',position:'relative',overflow:'hidden'}}>
      {paper.highlight&&<div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,#2255e8,#c9a84c)'}}/>}

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'16px',marginBottom:'12px'}}>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
          <TierBadge tier={paper.tier}/>
          <span style={{background:'rgba(255,255,255,0.07)',borderRadius:'10px',padding:'3px 10px',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',fontWeight:500,color:'#8899bb'}}>{paper.tag}</span>
          <span style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',color:'#7090aa'}}>{paper.year}</span>
        </div>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5a6e8e" strokeWidth="2" strokeLinecap="round" style={{transform:open?'rotate(180deg)':'rotate(0)',transition:'transform 0.2s',flexShrink:0}}><path d="M6 9l6 6 6-6"/></svg>
      </div>

      <h3 style={{fontFamily:"'Times New Roman',Georgia,serif",fontSize:'clamp(14px,1.5vw,18px)',fontWeight:700,color:'#e8edf8',lineHeight:1.4,marginBottom:'6px',textWrap:'pretty'}}>{paper.title}</h3>
      <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'12px',color:'#7090aa',marginBottom:'4px'}}>{paper.venue}</p>
      <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'12px',color:'#5a6e8e'}}>{paper.authors}</p>

      {open&&(
        <div style={{marginTop:'18px',paddingTop:'18px',borderTop:'1px solid rgba(14,31,61,0.8)'}}>
          <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'14px',color:'#b0c0dc',lineHeight:1.75,marginBottom:'18px',maxWidth:'680px'}}>{paper.abstract}</p>
          {paper.url&&paper.url!=='#'&&(
            <a href={paper.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
              style={{display:'inline-flex',alignItems:'center',gap:'6px',color:'#4d7fff',textDecoration:'none',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'13px',fontWeight:600,border:'1px solid rgba(77,127,255,0.4)',borderRadius:'7px',padding:'7px 14px',background:'rgba(34,85,232,0.08)'}}>
              Read Paper
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function Research() {
  const d = window.SahajData;
  const mobile = window.useIsMobile(820);
  const [tag,setTag]=useState('All');
  const allPapers = [...d.peerReviewed, ...d.preprints];
  const filtered = tag==='All' ? allPapers : allPapers.filter(p=>p.tag===tag);
  const isPeerFiltered = tag==='All' || d.peerReviewed.some(p=>p.tag===tag);
  const isPrepFiltered = tag==='All' || d.preprints.some(p=>p.tag===tag);
  const peer = filtered.filter(p=>d.peerReviewed.some(r=>r.id===p.id));
  const prep = filtered.filter(p=>d.preprints.some(r=>r.id===p.id));

  return (
    <div style={{minHeight:'100vh',paddingTop:'64px',background:'#060c1a'}}>
      <div style={{maxWidth:'1100px',margin:'0 auto',padding: mobile ? '44px 20px' : '64px 48px'}}>

        {/* Header */}
        <div style={{marginBottom:'20px'}}>
          <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#4d7fff',marginBottom:'12px'}}>Research</p>
          <h2 style={{fontFamily:"'Times New Roman',Georgia,serif",fontSize:'clamp(32px,4vw,58px)',fontWeight:700,color:'#e8edf8',lineHeight:1.1,letterSpacing:'-0.5px',marginBottom:'14px'}}>Published work.</h2>
          <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'clamp(14px,1.5vw,17px)',color:'#a0b8d8',lineHeight:1.7,maxWidth:'620px'}}>
            Ten papers so far, across computer vision, machine learning systems, quantum machine learning, and reinforcement learning. Most of them come with code you can run. They are loosely headed the same way: building agents that can act on what they see.
          </p>
        </div>

        {/* Stats banner */}
        <div style={{display:'grid',gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)',gap:'1px',marginBottom:'44px',background:'#0e1f3d',borderRadius:'12px',overflow:'hidden',border:'1px solid #0e1f3d'}}>
          {[
            {n:'10',  l:'Total Publications'},
            {n:'3',   l:'Peer-Reviewed'},
            {n:'1',   l:'Q1 Journal (Springer Nature)'},
            {n:'7',   l:'Preprints'},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,padding:'18px 20px',textAlign:'center',background:'rgba(255,255,255,0.025)',borderRight:i<3?'1px solid #0e1f3d':'none'}}>
              <div style={{fontFamily:"'Times New Roman',Georgia,serif",fontSize:'clamp(22px,2.8vw,36px)',fontWeight:700,color:'#e8edf8',lineHeight:1}}>{s.n}</div>
              <div style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',color:'#7090aa',marginTop:'6px',letterSpacing:'0.3px'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'36px'}}>
          {TAGS_ALL.map(t=>(
            <button key={t} onClick={()=>setTag(t)} style={{background:tag===t?'#2255e8':'rgba(255,255,255,0.04)',border:tag===t?'1px solid #2255e8':'1px solid rgba(255,255,255,0.1)',borderRadius:'20px',padding:'5px 14px',cursor:'pointer',fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'12px',fontWeight:tag===t?600:400,color:tag===t?'white':'#8899bb',transition:'all 0.2s ease'}}>{t}</button>
          ))}
        </div>

        {/* Peer-reviewed section */}
        {peer.length>0&&(
          <div style={{marginBottom:'40px'}}>
            <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#d6b55e',marginBottom:'16px'}}>Peer-Reviewed Publications</p>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {peer.map(p=><PaperCard key={p.id} paper={p}/>)}
            </div>
          </div>
        )}

        {/* Preprints section */}
        {prep.length>0&&(
          <div style={{marginBottom:'48px'}}>
            <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#9fb6d4',marginBottom:'16px'}}>Preprints</p>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {prep.map(p=><PaperCard key={p.id} paper={p}/>)}
            </div>
          </div>
        )}

        {/* Scholar link */}
        <div style={{padding:'18px 24px',background:'rgba(201,168,76,0.07)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:'12px',display:'flex',alignItems:'center',gap:'14px'}}>
          <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'14px',color:'#a08840',lineHeight:1.6}}>
            Full list on{' '}<a href={d.personal.scholar} target="_blank" rel="noopener noreferrer" style={{color:'#c9a84c',textDecoration:'none',borderBottom:'1px solid rgba(201,168,76,0.4)'}}>Google Scholar</a> · including conference proceedings, journal articles, and preprints.
          </p>
        </div>

        {/* Awards */}
        <div style={{marginTop:'64px'}}>
          <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#c9a84c',marginBottom:'24px'}}>Awards &amp; Recognition</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'10px'}}>
            {d.awards.map((a,i)=>(
              <div key={i} style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.18)',borderRadius:'10px',padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px'}}>
                <div>
                  <div style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'13px',fontWeight:600,color:'#c8d4ee',marginBottom:'3px'}}>{a.title}</div>
                  <div style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',color:'#7090aa'}}>{a.org}</div>
                </div>
                <span style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'12px',color:'#a08840',fontWeight:600,flexShrink:0}}>{a.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conference Talks */}
        <div style={{marginTop:'48px'}}>
          <p style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'11px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#4d7fff',marginBottom:'20px'}}>Conference Talks &amp; Panels</p>
          <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
            {d.talks.map((t,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:'16px',padding:'14px 0',borderBottom:'1px solid rgba(14,31,61,0.6)'}}>
                <div>
                  <div style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'14px',fontWeight:600,color:'#c8d4ee',marginBottom:'2px'}}>{t.title}</div>
                  <div style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'12px',color:'#7090aa'}}>{t.org}</div>
                </div>
                <span style={{fontFamily:"'Helvetica Neue',Helvetica,Arial,sans-serif",fontSize:'12px',color:'#7090aa',flexShrink:0}}>{t.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.SahajResearch = Research;
