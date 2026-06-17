// data.js — ground truth synced from academic CV (June 2026)
window.SahajData = {
  personal: {
    name: "Sahaj Raj Malla",
    nameNepali: "सहज राज मल्ल",
    title: "Undergraduate AI Researcher · Technopreneur",
    quote: "Forget Passion, Science and Technology are my Religion!",
    email: "mallasahajraj@gmail.com",
    github: "https://github.com/sahajrajmalla",
    scholar: "https://scholar.google.com/citations?user=NYVtgiYAAAAJ&hl=en",
    researchgate: "https://www.researchgate.net/profile/Sahaj-Raj-Malla",
    linkedin: "https://linkedin.com/in/sahajrajmalla",
    twitter: "https://twitter.com/sahaj_malla",
    instagram: "https://www.instagram.com/sahajrajmalla/",
    medium: "https://medium.com/@mallasahajraj",
    cv: "assets/cv.pdf",
  },

  stats: { papers: 9, awards: 9, users: 4000, repos: 80 },

  // ── PEER-REVIEWED ──────────────────────────────────────────────────────────
  peerReviewed: [
    {
      id: 1,
      title: "MallaNet: Residual Branch Merge Convolutional Neural Network with Homogeneous Filter Capsules for Devanagari Character Recognition",
      venue: "Scientific Reports",
      publisher: "Springer Nature",
      tier: "Q1",
      year: "Dec 2025",
      tag: "Computer Vision",
      url: "https://www.nature.com/articles/s41598-025-30871-z",
      highlight: true,
      authors: "S. R. Malla",
      abstract: "99.71% test accuracy on the Devanagari Handwritten Character Dataset, 56.41% fewer parameters than prior SOTA. Introduces optimised residual blocks and Homogeneous Filter Capsule layers for multiscale feature extraction.",
    },
    {
      id: 2,
      title: "A Landmark-Based Addressing Framework for Urban Navigation Using Geospatial Clustering and Pathfinding Algorithm",
      venue: "Journal of Science, Engineering and Technology (JSET), 19(1)",
      publisher: "Kathmandu University",
      tier: "Journal",
      year: "Mar 2025",
      tag: "Geospatial AI",
      url: "https://journals.ku.edu.np/kuset/article/view/593",
      authors: "S. R. Malla",
      abstract: "37.7% lower average path length and 22.9% lower travel time vs. current systems, using DBSCAN clustering, H3 indexing, and A* search over OpenStreetMap data.",
    },
    {
      id: 3,
      title: "Evaluating XGBoost Algorithm for Nepali Stock Price Prediction",
      venue: "Int. Conf. on Technologies for Computer, Electrical, Electronics & Communication",
      publisher: "IEEE",
      tier: "Conference",
      year: "Oct 2023",
      tag: "Finance · ML",
      url: "#",
      authors: "B. Kafle, S. R. Malla, A. Shrestha, S. Jaiswal",
      abstract: "XGBoost-based prediction model for the Nepali stock market (NEPSE), with temporal feature engineering and walk-forward validation.",
    },
  ],

  // ── PREPRINTS ──────────────────────────────────────────────────────────────
  preprints: [
    {
      id: 4,
      title: "Kalimati Vegetable Price Index Forecasting with a Momentum Corrected Online Stacking Ensemble",
      venue: "arXiv:2605.30720",
      publisher: "arXiv",
      tier: "Preprint",
      year: "May 2026",
      tag: "Forecasting",
      url: "https://arxiv.org/abs/2605.30720",
      authors: "S. R. Malla",
      abstract: "Built the KVPI, an inverse-volatility-weighted index over 135 daily wholesale commodities (Kathmandu, 2013–2023). Proposed ensemble reached RMSE 1.771, MAPE 0.68% at 90 days, explaining 84.5% of variance.",
    },
    {
      id: 5,
      title: "External Demand, Domestic Monetary Conditions, and Remittance Dynamics in Nepal",
      venue: "arXiv:2605.19401",
      publisher: "arXiv",
      tier: "Preprint",
      year: "May 2026",
      tag: "Econometrics",
      url: "https://arxiv.org/abs/2605.19401",
      authors: "S. R. Malla",
      abstract: "ARDL-ECM model of remittances as a share of Nepal's GDP (1993–2024). Error-correction term corrects ~26% of disequilibria annually; projects remittances at ~28.3% of GDP by 2030 under baseline conditions.",
    },
    {
      id: 6,
      title: "XGBoost Forecasting of NEPSE Index Log Returns with Walk-Forward Validation",
      venue: "arXiv:2601.08896",
      publisher: "arXiv",
      tier: "Preprint",
      year: "Jan 2026",
      tag: "Finance · ML",
      url: "https://arxiv.org/abs/2601.08896",
      authors: "S. R. Malla, S. Kayastha, R. Suwal, H. C. Bhandari, R. Adhikari",
      abstract: "Walk-forward validation framework for time-series forecasting of NEPSE index log returns with XGBoost.",
    },
    {
      id: 7,
      title: "Secure, Verifiable, and Scalable Multi-Client Data Sharing via Consensus-Based Privacy-Preserving Data Distribution",
      venue: "arXiv:2601.00418",
      publisher: "arXiv",
      tier: "Preprint",
      year: "Jan 2026",
      tag: "Privacy · Systems",
      url: "https://arxiv.org/abs/2601.00418",
      authors: "P. Panth, S. R. Malla",
      abstract: "Consensus-driven privacy-preserving framework for secure, verifiable multi-client data sharing.",
    },
    {
      id: 8,
      title: "AI Agents for the Dhumbal Card Game: A Comparative Study",
      venue: "arXiv:2510.11736",
      publisher: "arXiv",
      tier: "Preprint",
      year: "Oct 2025",
      tag: "Reinforcement Learning",
      url: "https://arxiv.org/abs/2510.11736",
      authors: "S. R. Malla",
      abstract: "Compared AI strategies for the Dhumbal card game; an aggressive heuristic agent reached an 88.3% win rate across 1,024 simulations.",
    },
    {
      id: 9,
      title: "Devanagari Digit Recognition using Quantum Machine Learning: A Hybrid Quantum-Classical Approach",
      venue: "arXiv:2506.09069",
      publisher: "arXiv",
      tier: "Preprint",
      year: "Jun 2025",
      tag: "Quantum ML",
      url: "https://arxiv.org/abs/2506.09069",
      authors: "S. R. Malla",
      abstract: "First hybrid quantum-classical architecture for Devanagari digit recognition (CNN + 10-qubit variational circuit). 99.80% test accuracy, 0.9980 average per-class F1.",
    },
  ],

  // ── PROJECTS ───────────────────────────────────────────────────────────────
  projects: [
    {
      id: 1, name: "GreatAPI", emoji: "⚡",
      tagline: "Full-stack Python web framework",
      description: "An opinionated, batteries-included Python web framework built on FastAPI. Rapid development of production-ready APIs with async task queues, database migrations, and one-command deployment.",
      tech: ["Python", "FastAPI", "Pydantic", "SQLAlchemy"],
      github: "https://github.com/sahajrajmalla/greatapi",
      type: "Open Source", color: "#4d7fff",
    },
    {
      id: 2, name: "MallaNet", emoji: "🧠",
      tagline: "Lightweight Devanagari recognition CNN",
      description: "The neural architecture from the Q1 Scientific Reports paper. State-of-the-art accuracy on handwritten Devanagari recognition with 56% fewer parameters than prior SOTA.",
      tech: ["PyTorch", "CNN", "Computer Vision"],
      github: "https://github.com/sahajrajmalla/MallaNet",
      paper: "https://www.nature.com/articles/s41598-025-30871-z",
      type: "Research", color: "#8b5cf6",
    },
    {
      id: 3, name: "SahajMails", emoji: "✉️",
      tagline: "Personalized bulk email as a Python library",
      description: "Free, secure, simple Python library for personalized bulk emails. Zero-config setup, template rendering, delivery tracking, and rate limiting built in.",
      tech: ["Python", "SMTP", "Jinja2"],
      github: "https://github.com/sahajrajmalla/sahajmails",
      type: "Open Source", color: "#10b981",
    },
    {
      id: 4, name: "Hamroniwas", emoji: "🏠",
      tagline: "Student accommodation platform · 4,000+ users",
      description: "Tech platform connecting students with verified affordable housing near Kathmandu University. Reached 4,000+ users through hands-on grassroots outreach — 500+ landlords, one door at a time.",
      tech: ["Django", "React", "PostgreSQL", "AWS"],
      type: "Startup", color: "#c9a84c",
    },
    {
      id: 5, name: "Dhumbal AI", emoji: "🃏",
      tagline: "Multi-agent RL for a Nepali card game",
      description: "Autonomous agents trained via multi-agent RL to play Dhumbal. 88.3% win rate in simulations. Rich testbed for incomplete information, strategic reasoning, and emergent agent behaviour.",
      tech: ["Python", "PyTorch", "MARL", "RL"],
      github: "https://github.com/sahajrajmalla/dhumbal-ai",
      type: "Research", color: "#ff6b6b",
    },
    {
      id: 6, name: "Quantum Neural Nets", emoji: "⚛️",
      tagline: "Variational circuits for Devanagari & classification",
      description: "Hybrid quantum-classical architecture for Devanagari digit recognition: CNN + 10-qubit variational circuit. 99.80% accuracy — first quantum approach on this task.",
      tech: ["Qiskit", "PennyLane", "Python"],
      github: "https://github.com/sahajrajmalla/Quantum-Neural-Networks-Binary-Classification",
      type: "Research", color: "#7c3aed",
    },
  ],

  // ── EXPERIENCE ─────────────────────────────────────────────────────────────
  experience: [
    {
      role: "Founder & CEO",
      org: "HamroNiwas",
      period: "Nov 2023 – Present",
      current: true,
      desc: "Built a rental and marketplace platform for students, connecting 4,000+ users and reducing search time by 90%. Conducted 500+ door-to-door visits to onboard landlords.",
    },
    {
      role: "Data Consultant",
      org: "YoungInnovations Pvt. Ltd.",
      period: "May 2025 – Jun 2025",
      current: false,
      desc: "Designed and optimised ELT pipelines with Apache Spark for large-scale dataset processing; automated workflows with Apache Airflow.",
    },
    {
      role: "Data Scientist",
      org: "Naamche Technology",
      period: "Sep 2021 – Jan 2023",
      current: false,
      desc: "Scraped and analysed 1M+ real estate listings (Florida, Texas, California). Improved investment decision accuracy by 40%+ and reduced computation time by 200%+.",
    },
    {
      role: "Data Engineer",
      org: "Devfinity Nepal",
      period: "Mar 2021 – Sep 2021",
      current: false,
      desc: "Built a Django-based data factory processing 1M+ job records daily, deployed on Azure with full ETL pipeline automation.",
    },
    {
      role: "Founder",
      org: "vyesna.com",
      period: "Apr 2020 – Mar 2021",
      current: false,
      desc: "Built a Django/React job platform with a scraped-data recommender system.",
    },
  ],

  // ── AWARDS ─────────────────────────────────────────────────────────────────
  awards: [
    { title: "Infinity Codewave 2026 Hackathon", org: "Kathmandu University", year: "May 2026" },
    { title: "Infinity Data Visualization Hackathon", org: "Kathmandu University", year: "May 2026" },
    { title: "Best Model Demo — KEC LITE 2081", org: "Kantipur Engineering College", year: "Dec 2024" },
    { title: "Seeds for the Future Nepal", org: "Huawei Technologies", year: "Sep 2023" },
    { title: "KU Hackfest — OSM Category", org: "Kathmandu University", year: "Oct 2023" },
    { title: "Infinity Codewave", org: "Dept. of Mathematics, KU", year: "Aug 2023" },
    { title: "AI Text Challenge Champion", org: "IT MEET 2022, KU", year: "Aug 2022" },
    { title: "Data Visualization Champion", org: "IT MEET 2022, KU", year: "Aug 2022" },
    { title: "Youth Innovation Challenge", org: "Social Changemakers & Innovators", year: "Aug 2022" },
  ],

  // ── FELLOWSHIPS ────────────────────────────────────────────────────────────
  fellowships: [
    { name: "Aspire Leaders Program", org: "Aspire Institute · Harvard University", period: "Jan 2025 – Mar 2025", icon: "🎓" },
    { name: "AI Fellowship 2023", org: "Fusemachines Nepal", period: "Jan 2023 – Jan 2024", icon: "🤖" },
    { name: "Womanium Quantum 2023", org: "Womanium & QWorld", period: "Jul 2023 – Aug 2023", icon: "⚛️" },
    { name: "Data Science Fellowship", org: "DataCamp & Code for Nepal", period: "Dec 2021 – Aug 2023", icon: "📊" },
    { name: "Nepal AI School (2023 & 2024)", org: "NAAMII", period: "May 2023, Dec 2024", icon: "🧬" },
    { name: "Introduction to Quantum Computing", org: "IBM & The Coding School", period: "Sep 2021 – Apr 2022", icon: "💻" },
  ],

  // ── PRESS & MEDIA ──────────────────────────────────────────────────────────
  press: [
    {
      title: "Making Devanagari Handwriting Accessible: The Story of MallaNet",
      outlet: "Business 360°",
      date: "Feb 2026",
      url: "https://www.b360nepal.com/detail/27723/making-devanagari-handwriting-accessible-the-story-of-mallanet",
    },
    {
      title: "Kathmandu University Student Builds an AI Model to Recognise Handwritten Devanagari Script",
      outlet: "Techpana",
      date: "Dec 2025",
      url: "https://techpana.com/2025/154683/",
    },
    {
      title: "South Asia's 1st Quantum AI For Devanagari Digits — 99.8% Accuracy Breakthrough",
      outlet: "ICT Frame",
      date: "Jun 2025",
      url: "https://ictframe.com/south-asias-1st-quantum-ai/",
    },
    {
      title: "Innovation on Home Soil: The Paths of Possibility Shown by Sahaj",
      outlet: "Terai Online",
      date: "Apr 2025",
      url: "https://www.teraionline.com.np/news/39604",
    },
    {
      title: "Seeds for the Future 2023 — A Technological Odyssey from Nepal to China",
      outlet: "ICT Frame",
      date: "Nov 2023",
      url: "https://ictframe.com/seeds-for-the-future-technological-odyssey-from-nepal-to-china/",
    },
  ],

  // ── CONFERENCE TALKS ───────────────────────────────────────────────────────
  talks: [
    { title: "Conference Presentation — Landmark-Based Addressing", org: "Kathmandu University", date: "Oct 2024" },
    { title: "Conference Presentation — Nepali Stock Price Prediction", org: "IEEE, Bhaktapur", date: "Oct 2024" },
    { title: "Panelist — National Youth Scientific Conference 2024", org: "National Youth Council Nepal", date: "Jun 2024" },
    { title: "Guest Speaker — Career in AI/ML", org: "CSIT Association of Nepal, Pokhara", date: "Dec 2023" },
  ],

  // ── RESEARCH INTERESTS ─────────────────────────────────────────────────────
  researchInterests: [
    { area: "Reinforcement Learning", desc: "Multi-agent, partial observability, long-horizon planning" },
    { area: "Agentic Systems", desc: "Multi-modal perception, autonomous decision-making" },
    { area: "Quantum ML", desc: "Variational circuits, hybrid quantum-classical models" },
    { area: "Computer Vision", desc: "Low-resource OCR, South Asian script recognition" },
    { area: "Time-Series Forecasting", desc: "Financial markets, ecological & sequential data" },
  ],

  // ── EDUCATION ──────────────────────────────────────────────────────────────
  education: {
    degree: "B.Sc. Computational Mathematics",
    university: "Kathmandu University",
    period: "Dec 2022 – Dec 2026 (expected)",
  },

  // ── PHD STATEMENT ──────────────────────────────────────────────────────────
  phdStatement: "I am seeking PhD opportunities with focus on reinforcement learning and multi-modal agentic systems. My research at Kathmandu University has been deliberately sequenced — computer vision, ML systems, quantum ML, game-playing agents — each step pointing toward agents that perceive, reason, and act across modalities. I bring publications across multiple subfields, industry experience shipping ML to production, and a rare perspective building AI for languages and markets the global research community often overlooks. I thrive on open collaboration, pairing novel research questions with engineering rigour and an appetite for the unknown.",

  // ── INTERESTS (ordered as requested) ───────────────────────────────────────
  interests: [
    { label: "Travel",      icon: "✈️",  color: "#4d7fff" },
    { label: "Art",         icon: "🎨",  color: "#f59e0b" },
    { label: "Philosophy",  icon: "🌀",  color: "#8b5cf6" },
    { label: "Psychology",  icon: "🧠",  color: "#ec4899" },
    { label: "Music",       icon: "♫",  color: "#c9a84c" },
    { label: "Anime",       icon: "⛩",  color: "#ff6b6b" },
    { label: "Football",    icon: "⚽",  color: "#10b981" },
    { label: "Explore",     icon: "🔭",  color: "#3dd6f5" },
  ],

  // ── SKILLS (for toolbox) ───────────────────────────────────────────────────
  skillGroups: [
    {
      label: "Languages",
      color: "#4d7fff",
      skills: [
        { name: "Python",     brand: "#3776AB", abbr: "Py" },
        { name: "C++",        brand: "#00599C", abbr: "C++" },
        { name: "R",          brand: "#276DC3", abbr: "R" },
        { name: "TypeScript", brand: "#3178C6", abbr: "TS" },
        { name: "JavaScript", brand: "#F7DF1E", abbr: "JS" },
      ],
    },
    {
      label: "ML & AI",
      color: "#8b5cf6",
      skills: [
        { name: "PyTorch",     brand: "#EE4C2C", abbr: "PT" },
        { name: "TensorFlow",  brand: "#FF6F00", abbr: "TF" },
        { name: "Scikit-learn",brand: "#F7931E", abbr: "SK" },
        { name: "HuggingFace", brand: "#FFD21E", abbr: "HF" },
        { name: "LangGraph",   brand: "#1C3C3C", abbr: "LG" },
      ],
    },
    {
      label: "Quantum",
      color: "#7c3aed",
      skills: [
        { name: "Qiskit",    brand: "#6929C4", abbr: "QK" },
        { name: "PennyLane", brand: "#2D7FF9", abbr: "PL" },
      ],
    },
    {
      label: "Web & APIs",
      color: "#10b981",
      skills: [
        { name: "FastAPI", brand: "#009688", abbr: "FA" },
        { name: "Django",  brand: "#092E20", abbr: "Dj" },
        { name: "React",   brand: "#61DAFB", abbr: "Re" },
        { name: "Next.js", brand: "#ffffff", abbr: "Nx" },
      ],
    },
    {
      label: "Data",
      color: "#f59e0b",
      skills: [
        { name: "NumPy",   brand: "#013243", abbr: "Np" },
        { name: "Pandas",  brand: "#150458", abbr: "Pd" },
        { name: "Spark",   brand: "#E25A1C", abbr: "Sp" },
        { name: "Airflow", brand: "#017CEE", abbr: "Af" },
        { name: "Jupyter", brand: "#F37626", abbr: "Jp" },
      ],
    },
    {
      label: "Cloud & DevOps",
      color: "#ff6b6b",
      skills: [
        { name: "Docker", brand: "#2496ED", abbr: "Dk" },
        { name: "AWS",    brand: "#FF9900", abbr: "AW" },
        { name: "Azure",  brand: "#0078D4", abbr: "Az" },
        { name: "Linux",  brand: "#FCC624", abbr: "Lx" },
        { name: "Git",    brand: "#F05032", abbr: "Gt" },
      ],
    },
    {
      label: "Databases",
      color: "#c9a84c",
      skills: [
        { name: "PostgreSQL", brand: "#4169E1", abbr: "Pg" },
        { name: "MongoDB",    brand: "#47A248", abbr: "Mg" },
        { name: "Redis",      brand: "#DC382D", abbr: "Rd" },
      ],
    },
  ],
};

/* ───────────────────────────────────────────────────────────────
   Shared React hooks (React is loaded globally before this file).
   ─────────────────────────────────────────────────────────────── */

// Responsive breakpoint hook — returns true when viewport width < bp.
window.useIsMobile = function (bp) {
  bp = bp || 768;
  const [m, setM] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth < bp : false
  );
  React.useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        setM(window.innerWidth < bp);
      });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [bp]);
  return m;
};

// Live viewport width hook (throttled via rAF).
window.useViewportWidth = function () {
  const [w, setW] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  React.useEffect(() => {
    let raf = null;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = null; setW(window.innerWidth); });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return w;
};
