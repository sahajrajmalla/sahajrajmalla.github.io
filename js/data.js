// data.js - the content of the site.
// Source of truth: the final CV (Nov 2026) and the papers and repositories themselves.
// Anything a visitor reads here should trace to one of them. Numbers that come from
// GitHub are not stored here; they are read from the GitHub API (see Common.jsx).
window.SahajData = {
  // A mail to me with the subject and a short body filled in. Reports and letters are sent on request, never hosted for download.
  requestMail: function (subject, body) {
    return "mailto:mallasahajraj@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  },
  personal: {
    name: "Sahaj Raj Malla",
    nameNepali: "सहज राज मल्ल",
    title: "Undergraduate AI Researcher · Technopreneur",
    quote: "Forget Passion, Science and Technology are my Religion!",
    email: "mallasahajraj@gmail.com",
    // Opens a Gmail compose window, the same link the CV uses.
    gmail: "https://mail.google.com/mail/?view=cm&fs=1&to=mallasahajraj@gmail.com",
    github: "https://github.com/sahajrajmalla",
    githubUser: "sahajrajmalla",
    orcid: "https://orcid.org/0000-0001-5980-6066",
    scholar: "https://scholar.google.com/citations?user=NYVtgiYAAAAJ&hl=en",
    researchgate: "https://www.researchgate.net/profile/Sahaj-Raj-Malla",
    linkedin: "https://www.linkedin.com/in/sahajrajmalla",
    twitter: "https://twitter.com/sahajrajmalla",
    instagram: "https://www.instagram.com/sahajrajmalla/",
    medium: "https://medium.com/@mallasahajraj",
    cv: "assets/cv.pdf",
  },

  // HamroNiwas user count as printed on the CV. Everything else that is a count is computed.
  // 6+ years: the "Years Experience" figure from the first version of the site, kept as Sahaj asked on 2026-11-10 (first data job: Mar 2021)
  stats: { users: 4500, years: 6 },

  researchInterestsLine: "Multimodal agent orchestration, reinforcement learning, and compute-efficient decision-making.",

  // ── PEER-REVIEWED (CV order) ───────────────────────────────────────────────
  peerReviewed: [
    {
      id: "dhumbal",
      title: "Heuristic optimization of AI agents for Dhumbal",
      shortName: "Dhumbal AI",
      venue: "Scientific Reports 16, 33849",
      publisher: "Springer Nature",
      tier: "Q1",
      year: "Aug 2026",
      tag: "Game-Playing Agents",
      url: "https://www.nature.com/articles/s41598-026-68206-1",
      doi: "10.1038/s41598-026-68206-1",
      authors: "S. R. Malla",
      highlight: true,
      short: "Compared AI strategies for the Dhumbal card game; an aggressive heuristic agent reached an 88.9% win rate.",
      thumb: { base: "assets/papers/dhumbal", w: 480, h: 630, alt: "First page of the article Heuristic optimization of AI agents for Dhumbal in Scientific Reports", licence: "Journal licence: CC BY 4.0" },
      summary: "Dhumbal is a Nepali card game with hidden hands. I wrote a simulator and played four hand-written strategies, two tree-search methods, two reinforcement learning agents and a random player against each other.",
      question: "Which kind of AI player does best when you cannot see the other hands?",
      found: "Over 1,024 simulated rounds the Aggressive hand-written strategy won 88.9% (95% CI 86.9 to 90.8). The best search agent, ISMCTS, won 9.3%, and PPO won 0.2%, under the settings tested.",
      limits: "The learning agents did not beat a random player. The paper says their state representation and reward design were too weak, so read PPO and DQN as baselines, not as the limit of reinforcement learning. All games are AI against AI, and the Aggressive strategy may only suit Dhumbal's rules. The game is played for money, so the paper also states that the agents are for research and not for real-money play.",
      code: { repo: "dhumbal-ai", url: "https://github.com/sahajrajmalla/dhumbal-ai" },
      links: [{ label: "Archived code (Zenodo)", url: "https://doi.org/10.5281/zenodo.20847013" }],
      bib: { type: "article", key: "malla2026dhumbal", authors: ["Malla, Sahaj Raj"], journal: "Scientific Reports", volume: "16", pages: "33849", year: "2026", doi: "10.1038/s41598-026-68206-1" },
      citeVenue: "Scientific Reports 16, 33849 (2026)",
    },
    {
      id: "mallanet",
      shortName: "MallaNet",
      title: "MallaNet residual branch merge convolutional neural network with homogeneous filter capsules for Devanagari character recognition",
      venue: "Scientific Reports 16, 1175",
      publisher: "Springer Nature",
      tier: "Q1",
      year: "Dec 2025",
      tag: "Computer Vision",
      url: "https://www.nature.com/articles/s41598-025-30871-z",
      doi: "10.1038/s41598-025-30871-z",
      authors: "S. R. Malla",
      highlight: true,
      short: "99.71% test accuracy on the Devanagari Handwritten Character Dataset, 56.41% fewer parameters than prior SOTA; introduces optimized residual blocks and Homogeneous Filter Capsule layers for multiscale feature extraction.",
      thumb: { base: "assets/papers/mallanet", w: 480, h: 630, alt: "First page of the article MallaNet residual branch merge convolutional neural network, Scientific Reports", licence: "Journal licence: CC BY 4.0" },
      summary: "MallaNet reads handwritten Devanagari characters. Residual blocks keep a deep network trainable, and capsule-style layers read the image at three scales before their predictions are merged.",
      question: "How accurate can a compact model be on a 46-class handwritten script, trained on modest hardware?",
      found: "99.71% test accuracy and 99.71% macro F1 on the Devanagari Handwritten Character Dataset (92,000 images). The best reported accuracy I compared with is 99.72%, from a model of about 39 million parameters (the paper's own estimate). MallaNet has 17.3 million, which is 56.41% fewer.",
      limits: "It sits slightly below that 99.72%. Only DHCD and MNIST were tested, not continuous text or degraded documents. Look-alike characters score a little lower, and a Colab T4 GPU limited how far I could tune.",
      code: { repo: "MallaNet", url: "https://github.com/sahajrajmalla/MallaNet" },
      links: [],
      bib: { type: "article", key: "malla2026mallanet", authors: ["Malla, Sahaj Raj"], journal: "Scientific Reports", volume: "16", pages: "1175", year: "2026", doi: "10.1038/s41598-025-30871-z", note: "First published online 3 December 2025" },
      citeVenue: "Scientific Reports 16, 1175 (2026)",
    },
    {
      id: "kalimati",
      shortName: "Agricultural Commodity Price Index",
      title: "Combining rather than selecting multi-horizon forecasting of an agricultural commodity price index",
      venue: "Scientific Reports (early access)",
      publisher: "Springer Nature",
      tier: "Q1",
      year: "Nov 2026",
      tag: "Forecasting",
      url: "https://www.nature.com/articles/s41598-026-79143-4",
      doi: "10.1038/s41598-026-79143-4",
      authors: "S. R. Malla",
      highlight: true,
      short: "Developed multi-horizon forecasting for a new agricultural commodity price index; direct change-target forecasting reduced errors by 33–53%, while shrinkage forecast combination improved accuracy by 1.3–11.2%.",
      thumb: { base: "assets/papers/kalimati", w: 480, h: 638, alt: "First page of the article Combining rather than selecting multi-horizon forecasting of an agricultural commodity price index, Scientific Reports (Article in Press)", licence: "Journal licence: CC BY-NC-ND 4.0" },
      summary: "Wholesale food prices in Nepal swing sharply, and single vegetables have short, gappy records. So I built an index from 135 daily wholesale series at Kathmandu's Kalimati market (2013 to 2023) and forecast it at four horizons with twelve kinds of model.",
      question: "If you compare many forecasting models, can you pick the winner in advance, or is it better to combine them?",
      found: "A shrunk combination beat the model that validation would have chosen by 1.3, 1.5, 2.0 and 11.2% across the four horizons, and beat a no-change benchmark by 2.1, 3.2, 7.8 and 22.2%. The models that won on the test window ranked third, seventh, fifth and fourth on validation, so none could have been chosen beforehand. A direct change target cut error by 33 to 53% compared with the common recursive, level-target approach.",
      limits: "One market, one index and one test window (July 2022 to September 2023). This is the early-access version, and the final version may change.",
      code: null,
      links: [],
      bib: { type: "article", key: "malla2026combining", authors: ["Malla, Sahaj Raj"], journal: "Scientific Reports", year: "2026", doi: "10.1038/s41598-026-79143-4", note: "Early access, published online 5 November 2026" },
      citeVenue: "Scientific Reports (2026), early access",
    },
    {
      id: "landmark",
      title: "A landmark-based addressing framework for urban navigation using geospatial clustering and pathfinding algorithm",
      venue: "Kathmandu University Journal of Science, Engineering and Technology, 19(1)",
      publisher: "Kathmandu University",
      tier: "Journal",
      year: "Mar 2025",
      tag: "Geospatial AI",
      url: "https://journals.ku.edu.np/kuset/article/view/593",
      doi: null,
      authors: "S. R. Malla",
      short: "In simulation, 37.7% lower average path length and 22.9% lower travel time vs. current systems.",
      thumb: { base: "assets/papers/landmark", w: 480, h: 678, alt: "First page of the article A landmark-based addressing framework for urban navigation, Kathmandu University Journal of Science, Engineering and Technology", licence: "Journal licence: CC BY-SA 4.0" },
      summary: "Many places in Kathmandu have no usable street address, so people say things like \"near the big temple\". The paper turns that habit into a system: an address made of a landmark code plus a distance and direction, built with OpenStreetMap, H3 hexagon indexing, DBSCAN clustering and A* search.",
      question: "Could landmark-based addresses get people to buildings faster in a city without reliable street addresses?",
      found: "In a simulation on 149,054 buildings in Kathmandu, average path length fell 37.7% (69.22 to 43.12 nodes) and travel time fell 22.9% (550.86 to 424.92 seconds) compared with traditional addressing approaches.",
      limits: "These are simulation results on map data, not a deployment. The paper lists real-time traffic data, larger areas and finer compass directions as future work.",
      code: { repo: "landmark-based-urban-navigation", url: "https://github.com/sahajrajmalla/landmark-based-urban-navigation" },
      links: [],
      bib: { type: "article", key: "malla2025landmark", authors: ["Malla, Sahaj Raj"], journal: "Kathmandu University Journal of Science, Engineering and Technology", volume: "19", number: "1", year: "2025", url: "https://journals.ku.edu.np/kuset/article/view/593" },
      citeVenue: "Kathmandu University Journal of Science, Engineering and Technology 19(1) (2025)",
    },
    {
      id: "xgb2023",
      title: "Evaluating XGBoost Algorithm for Nepali Stock Price Prediction",
      venue: "Int. Conf. on Technologies for Computer, Electrical, Electronics & Communication (ICT-CEEL 2023)",
      publisher: "ICT-CEEL 2023",
      tier: "Conference",
      year: "Oct 2023",
      tag: "Finance · ML",
      url: "https://ictceel.khwopaconference.com/uploads/conferencepaper/fullpaper/1020.pdf",
      doi: null,
      authors: "B. Kafle, A. Shrestha, S. R. Malla, S. Jaiswal",
      role: "Third author",
      short: "XGBoost regression over 241,023 daily observations for 204 NEPSE-listed companies (2013–2023).",
      thumb: { base: "assets/papers/xgb2023", w: 480, h: 621, alt: "First page of the conference paper Evaluating XGBoost Algorithm for Nepali Stock Price Prediction", licence: null },
      summary: "A student team at Kathmandu University tested XGBoost, a tree-boosting method, on Nepal Stock Exchange prices: 241,023 daily observations for 204 listed companies (2013 to 2023), with moving averages, RSI and MACD as features.",
      question: "How well does XGBoost predict Nepali stock prices?",
      found: "The paper reports an average test MSE of 0.000233 and MAPE of 0.0642, and finds the 5-day simple moving average to be the most important feature.",
      limits: "Evaluation uses a train, validation and test split, not walk forward testing. I am the third author. My later NEPSE preprint revisits the problem on the index with walk forward validation.",
      code: null,
      links: [],
      bib: { type: "inproceedings", key: "kafle2023xgboost", authors: ["Kafle, Bishesh", "Shrestha, Aayush", "Malla, Sahaj Raj", "Jaiswal, Swikar"], booktitle: "International Conference on Technologies for Computer, Electrical, Electronics and Communication (ICT-CEEL 2023)", year: "2023", month: "oct", url: "https://ictceel.khwopaconference.com/uploads/conferencepaper/fullpaper/1020.pdf" },
      citeVenue: "Int. Conf. on Technologies for Computer, Electrical, Electronics & Communication (ICT-CEEL 2023), Oct 2023",
    },
  ],

  // ── PREPRINTS (CV order) ───────────────────────────────────────────────────
  preprints: [
    {
      id: "quantum",
      title: "Devanagari Digit Recognition using Quantum Machine Learning",
      venue: "arXiv:2506.09069",
      publisher: "arXiv",
      tier: "Preprint",
      year: "Jun 2025",
      tag: "Quantum ML",
      url: "https://arxiv.org/abs/2506.09069",
      doi: null,
      authors: "S. R. Malla",
      short: "Hybrid quantum-classical architecture for Devanagari digit recognition (CNN + simulated 10-qubit variational circuit); 99.80% test accuracy, 0.9980 average per-class F1.",
      thumb: { base: "assets/papers/quantum", w: 480, h: 678, alt: "First page of the arXiv preprint Devanagari Digit Recognition using Quantum Machine Learning", licence: "Preprint licence: arXiv non-exclusive licence" },
      summary: "A small CNN extracts features from handwritten Devanagari digits, then a 10-qubit variational quantum circuit classifies them. The circuit is simulated on a classical computer with PennyLane.",
      question: "Can a variational quantum circuit do the classification step on top of a CNN for Devanagari digits?",
      found: "99.80% test accuracy and 0.9980 average per-class F1 on the digit subset of DHCD, against 99.03% for an equivalent classical CNN. Of 2,339,092 parameters, 100 are in the quantum circuit.",
      limits: "All quantum operations were simulated, so nothing here shows how it would run on noisy hardware. Digits only, not the full 46-class character set. Preprint, not peer reviewed.",
      code: { repo: "devanagari-digit-recognition-using-quantum-machine-learning", url: "https://github.com/sahajrajmalla/devanagari-digit-recognition-using-quantum-machine-learning" },
      links: [],
      bib: { type: "misc", key: "malla2025quantum", authors: ["Malla, Sahaj Raj"], year: "2025", eprint: "2506.09069", archivePrefix: "arXiv", primaryClass: "quant-ph", url: "https://arxiv.org/abs/2506.09069" },
      citeVenue: "arXiv:2506.09069 (2025)",
    },
    {
      id: "arthavyu",
      title: "ArthaVyu: A Stacking Ensemble Framework for Multi-Source Real Estate Price Prediction in Nepal",
      venue: "Research Square",
      publisher: "Research Square",
      tier: "Preprint",
      year: "Jun 2026",
      tag: "Finance · ML",
      url: "https://doi.org/10.21203/rs.3.rs-10073591/v1",
      doi: "10.21203/rs.3.rs-10073591/v1",
      authors: "S. R. Malla",
      short: "Stacking ensemble framework for multi-source real estate price prediction in Nepal; unifies 24,673 property listings from seven platforms, reaching test R² 0.7439 and MedAPE 26.91%.",
      thumb: { base: "assets/papers/arthavyu", w: 480, h: 621, alt: "First page of the Research Square preprint ArthaVyu: A Stacking Ensemble Framework for Multi-Source Real Estate Price Prediction in Nepal", licence: "Preprint licence: CC BY 4.0" },
      summary: "Property listings in Nepal sit on many websites in different formats, with land measured in traditional units. ArthaVyu merges 24,673 listings from seven platforms, converts the units, and predicts prices with a stacking ensemble.",
      question: "Can messy listings from many sources be merged into one dataset that supports usable price predictions?",
      found: "On 2,610 held-out listings the model reaches a test R² of 0.7439 and a median absolute percentage error of 26.91%. SHAP values show which features move the predicted price.",
      limits: "The model is cross-sectional: it does not model price trends or macroeconomic indicators. Missing GPS coordinates are filled with a single central point, which may blur locations. Preprint, not peer reviewed.",
      code: null,
      links: [],
      bib: { type: "misc", key: "malla2026arthavyu", authors: ["Malla, Sahaj Raj"], howpublished: "Research Square preprint", year: "2026", doi: "10.21203/rs.3.rs-10073591/v1" },
      citeVenue: "Research Square preprint (2026)",
    },
    {
      id: "nepse",
      title: "XGBoost Forecasting of NEPSE Index Log Returns with Walk Forward Validation",
      venue: "arXiv:2601.08896",
      publisher: "arXiv",
      tier: "Preprint",
      year: "Jan 2026",
      tag: "Finance · ML",
      url: "https://arxiv.org/abs/2601.08896",
      doi: null,
      authors: "S. R. Malla, S. Kayastha, R. Suwal, H. C. Bhandari, R. Adhikari",
      role: "First author of five",
      short: "Walk-forward validation framework for time-series forecasting of NEPSE index log returns with XGBoost.",
      thumb: { base: "assets/papers/nepse", w: 480, h: 640, alt: "First page of the arXiv preprint XGBoost Forecasting of NEPSE Index Log Returns with Walk Forward Validation", licence: "Preprint licence: CC BY 4.0" },
      summary: "One-step-ahead forecasts of the NEPSE index's daily log returns with XGBoost, tested the way a forecast would be used: train on the past, predict the next day, move forward, repeat.",
      question: "Does XGBoost beat standard baselines for next-day NEPSE index returns when the test avoids look-ahead?",
      found: "The best setup, an expanding window with 20 lags, reached log-return RMSE 0.013450, MAE 0.009814 and directional accuracy of 65.15%, ahead of tuned ARIMA and Ridge baselines. R² stays modest.",
      limits: "Price-derived features only, with no macroeconomic or news inputs, and daily data only. Preprint, not peer reviewed.",
      code: { repo: "nepse-xgboost-forecasting", url: "https://github.com/sahajrajmalla/nepse-xgboost-forecasting" },
      links: [],
      bib: { type: "misc", key: "malla2026nepse", authors: ["Malla, Sahaj Raj", "Kayastha, Shreeyash", "Suwal, Rumi", "Bhandari, Harish Chandra", "Adhikari, Rajendra"], year: "2026", eprint: "2601.08896", archivePrefix: "arXiv", primaryClass: "cs.LG", url: "https://arxiv.org/abs/2601.08896" },
      citeVenue: "arXiv:2601.08896 (2026)",
    },
    {
      id: "panth",
      title: "Secure, Verifiable, and Scalable Multi-Client Data Sharing via Consensus-Based Privacy-Preserving Data Distribution",
      venue: "arXiv:2601.00418",
      publisher: "arXiv",
      tier: "Preprint",
      year: "Jan 2026",
      tag: "Privacy · Systems",
      url: "https://arxiv.org/abs/2601.00418",
      doi: null,
      authors: "P. Panth, S. R. Malla",
      role: "Second author",
      short: "Consensus-driven privacy-preserving framework for secure, verifiable multi-client data sharing.",
      thumb: { base: "assets/papers/panth", w: 480, h: 678, alt: "First page of the arXiv preprint Secure, Verifiable, and Scalable Multi-Client Data Sharing", licence: "Preprint licence: CC BY 4.0" },
      summary: "Prajwal Panth led this work and I am the second author. It proposes a protocol (CPPDD) for several parties to share data securely: each party masks its data, and the masks only come off if everyone takes part. Checksums let the group detect a party that deviates and abort.",
      question: "Can a group release shared data only when all of its members take part, without a coordinator running the whole time?",
      found: "The paper gives formal proofs of correctness, integrity and semantic security under standard assumptions, and tests scalability on MNIST-derived vectors.",
      limits: "The security proofs assume a setup coordinator that does not collude and goes offline after distribution. Preprint, not peer reviewed.",
      code: null,
      links: [],
      bib: { type: "misc", key: "panth2026consensus", authors: ["Panth, Prajwal", "Malla, Sahaj Raj"], year: "2026", eprint: "2601.00418", archivePrefix: "arXiv", primaryClass: "cs.CR", url: "https://arxiv.org/abs/2601.00418" },
      citeVenue: "arXiv:2601.00418 (2026)",
    },
    {
      id: "remit",
      title: "External Demand, Domestic Monetary Conditions, and Remittance Dynamics in Nepal",
      venue: "arXiv:2605.19401",
      publisher: "arXiv",
      tier: "Preprint",
      year: "May 2026",
      tag: "Econometrics",
      url: "https://arxiv.org/abs/2605.19401",
      doi: null,
      authors: "S. R. Malla",
      short: "ARDL-ECM model of remittances as a share of Nepal's GDP (1993–2024) using PCA-derived monetary indices.",
      thumb: { base: "assets/papers/remit", w: 480, h: 678, alt: "First page of the arXiv preprint External Demand, Domestic Monetary Conditions, and Remittance Dynamics in Nepal", licence: "Preprint licence: CC BY 4.0" },
      summary: "I look at what moves remittances as a share of Nepal's GDP, using annual data from 1993 to 2024. Principal component analysis builds one index for demand in destination countries and one for domestic monetary conditions, which go into an ARDL error-correction model.",
      question: "What drives remittances in Nepal: demand abroad or monetary conditions at home?",
      found: "A strong positive long-run effect of external demand and a significant negative effect of tighter domestic monetary conditions. The error-correction term closes about 26% of a gap each year. A baseline scenario reaches about 28.3% of GDP by 2030, with high sensitivity to demand shocks.",
      limits: "Only 32 annual observations, so statistical power is limited. Official data miss informal channels, and the combined indices can hide differences between individual countries. Preprint, not peer reviewed.",
      code: null,
      links: [],
      bib: { type: "misc", key: "malla2026remittance", authors: ["Malla, Sahaj Raj"], year: "2026", eprint: "2605.19401", archivePrefix: "arXiv", primaryClass: "econ.GN", url: "https://arxiv.org/abs/2605.19401" },
      citeVenue: "arXiv:2605.19401 (2026)",
    },
  ],

  // ── CHARTS (Research page). Every number below is printed in the paper named in `source`. ──
  charts: [
    {
      id: "dhumbal-win",
      paper: "dhumbal",
      title: "Dhumbal: win rate over 1,024 simulated rounds",
      note: "The hand-written Aggressive agent against the best search agent, a learned agent and a random player. The learned agent finished below the random player.",
      unit: "%",
      max: 100,
      rows: [
        { label: "Aggressive (hand-written)", value: 88.9, extra: "95% CI 86.9 to 90.8" },
        { label: "ISMCTS (search)", value: 9.3 },
        { label: "Random", value: 1.7 },
        { label: "PPO (learned)", value: 0.2 },
      ],
      source: "Malla (2026), Scientific Reports 16, 33849: abstract and results.",
    },
    {
      id: "mallanet-params",
      paper: "mallanet",
      title: "MallaNet: parameters against the best reported model",
      note: "Test accuracy is almost the same: 99.71% for MallaNet and 99.72% for the model it is compared with. The 39 million figure is the paper's own estimate.",
      unit: "M",
      max: 40,
      rows: [
        { label: "MallaNet", value: 17.3, extra: "99.71% accuracy" },
        { label: "Mishra et al. (estimate)", value: 39, dp: 0, extra: "99.72% accuracy" },
      ],
      source: "Malla (2026), Scientific Reports 16, 1175: abstract and results (17,320,579 parameters).",
    },
    {
      id: "kalimati-gain",
      paper: "kalimati",
      title: "Agricultural Commodity Price Index: gain from combining models over choosing one",
      note: "Improvement of the shrunk combination over the model that validation would have selected, at each of the four horizons in the order the abstract lists them.",
      unit: "%",
      max: 12,
      rows: [
        { label: "Horizon 1", value: 1.3 },
        { label: "Horizon 2", value: 1.5 },
        { label: "Horizon 3", value: 2.0 },
        { label: "Horizon 4", value: 11.2 },
      ],
      source: "Malla (2026), Scientific Reports, early access: abstract.",
    },
    {
      id: "landmark-route",
      paper: "landmark",
      title: "Landmark addressing: average route in simulation",
      note: "Before and after, on 149,054 buildings in Kathmandu. These are simulation results.",
      unit: "",
      pairs: [
        { label: "Path length (nodes)", before: 69.22, after: 43.12 },
        { label: "Travel time (seconds)", before: 550.86, after: 424.92 },
      ],
      source: "Malla (2025), Kathmandu University Journal of Science, Engineering and Technology 19(1): abstract.",
    },
  ],

  // ── PROJECTS ───────────────────────────────────────────────────────────────
  // group: where it sits on the Projects page. repo: name in the public GitHub list (never a private repo).
  projectGroups: [
    { id: "agents", label: "Agents and AI tooling" },
    { id: "research", label: "Research code and models" },
    { id: "coursework", label: "Coursework reports" },
    { id: "startup", label: "Startup" },
  ],
  projects: [
    {
      id: "touchstone", group: "agents", name: "Touchstone", icon: "agents", color: "#10b981", type: "Research",
      tagline: "Multi-agent question answering with routing and critic review",
      period: "Nov 2024 – Present",
      context: "Kathmandu University project, supervised by Dr. Harish Chandra Bhandari",
      tech: ["Python", "LangGraph", "Elasticsearch", "RAG"],
      repo: "touchstone", github: "https://github.com/sahajrajmalla/touchstone",
      media: { src: "assets/projects/touchstone-graph.svg", w: 760, h: 460, alt: "Diagram of the Touchstone graph: a classifier routes a question to a science, history, literature or general agent, which may call retrieval and web search tools; a critique agent then approves the answer or sends it back to the same agent.", caption: "How a question moves through Touchstone." },
      problem: "A question-answering system for coursework has to decide who should answer, and whether the answer is good enough to send.",
      built: "A LangGraph system. A classifier sends each question to a science, history, literature or general agent. The agent can search a local knowledge base (Elasticsearch) and the web. A critique agent then approves the answer or sends it back to the same agent for another try.",
      report: { label: "Project report (KRRS)", file: { name: "Sem5_KRRS_Report.pdf", pages: 25, size: "1.2 MB" } },
      checked: "The repository has basic unit and integration tests for the graph and its configuration. The project report walks one test case end to end: classifying the question took 1.56 s, the history agent 13.62 s, document retrieval 3.48 s and the critique 7.85 s. Evaluation is thin, one worked example, and what the router and the critic are worth is the question my thesis takes up.",
    },
    {
      id: "greatapi", group: "agents", name: "GreatAPI", icon: "greatapi", color: "#4d7fff", type: "Open Source",
      tagline: "A batteries-included FastAPI framework",
      period: "Jun 2022 – Present",
      kind: "library",
      tech: ["Python", "FastAPI", "SQLAlchemy", "Alembic"],
      repo: "greatapi", github: "https://github.com/sahajrajmalla/greatapi",
      links: [{ label: "PyPI", url: "https://pypi.org/project/greatapi/" }],
      media: { base: "assets/projects/greatapi", sm: [640, 380], lg: [1200, 712], alt: "The GreatAPI admin dashboard in dark mode, showing request counts, token use, cost and recent activity", caption: "The GreatAPI admin dashboard." },
      problem: "FastAPI gives you routing and validation, then stops. Every team builds the same next layer by hand: an admin, a login, migrations, a job queue and API keys.",
      built: "A framework with a generated admin, Argon2 passwords with HttpOnly sessions and CSRF protection, Alembic migrations behind simple commands, a database-backed job queue with retries (no Redis or Celery), API keys with scopes and rate limits, and server-sent-event streaming. An optional AI extra adds model calls and agents, and every call and step is recorded in the admin.",
      checked: "Continuous integration and CodeQL scanning run on GitHub Actions, and the package is on PyPI (version 2.0.1).",
    },
    {
      id: "sahajmails", group: "agents", name: "SahajMails", icon: "mail", color: "#4d7fff", type: "Open Source",
      tagline: "Personalized bulk email that runs on your machine",
      period: "Nov 2025 – Present",
      kind: "library",
      tech: ["Python", "SMTP", "Jinja2"],
      repo: "sahajmails", github: "https://github.com/sahajrajmalla/sahajmails",
      links: [{ label: "PyPI", url: "https://pypi.org/project/sahajmails/" }],
      media: { base: "assets/projects/sahajmails", sm: [640, 348], lg: [1200, 652], alt: "The SahajMails campaigns screen listing three campaigns with a New campaign button", caption: "The SahajMails campaigns screen." },
      problem: "Sending personal outreach from your own mailbox usually means giving your contact list to a service, or writing a script and hoping nothing sends twice.",
      built: "A local web app and Python library. You load a spreadsheet, write a template with placeholders like {{ first_name }}, preview every contact, and send through your own mailbox or provider. Contacts and passwords stay on your computer. An optional AI step fills one labelled gap in an email, and you review every generated line before anything sends.",
      checked: "A pre-flight pass renders every contact and reports what will break, and a dry-run mode sends nothing. Every attempt is journalled, so a crashed send resumes without mailing anyone twice. Continuous integration runs on GitHub Actions, and the package is on PyPI (version 2.0.2).",
    },
    {
      id: "patrakar", group: "research", name: "Patrakar", icon: "text", color: "#8b5cf6", type: "Research",
      tagline: "Nepali news classifier (DistilBERT)",
      period: "Aug 2022 – Sep 2022",
      context: "Associated with IT MEET, Kathmandu University",
      tech: ["Python", "PyTorch", "Transformers"],
      repo: "nepali-news-classification", github: "https://github.com/sahajrajmalla/nepali-news-classification",
      links: [{ label: "Hugging Face", url: "https://huggingface.co/sahajrajmalla/patrakar" }],
      media: { base: "assets/projects/patrakar", sm: [640, 373], lg: [1140, 664], alt: "Kaggle private leaderboard for the TEXT IT Meet 22 competition, with Sahaj Raj Malla in first place at a score of 0.95475", caption: "Final private leaderboard of the Kaggle competition: first place, score 0.95475." },
      problem: "A text challenge at IT MEET 2022 asked for a classifier that sorts Nepali news into nine categories.",
      built: "A DistilBERT sequence-classification model fine-tuned on the competition data. It labels news as politics, opinion, bank, entertainment, economy, health, literature, sports or tourism.",
      checked: "The model card reports 95.475% accuracy on 5,670 test samples. The final private leaderboard of the Kaggle competition shows the same score in first place.",
    },
    {
      id: "mallanet", group: "research", name: "MallaNet", icon: "mallanet", color: "#8b5cf6", type: "Research",
      tagline: "A compact Devanagari character recognizer",
      period: "Scientific Reports, Dec 2025",
      tech: ["PyTorch", "CNN", "Capsules"],
      repo: "MallaNet", github: "https://github.com/sahajrajmalla/MallaNet",
      paper: "https://www.nature.com/articles/s41598-025-30871-z",
      media: { base: "assets/projects/mallanet", sm: [640, 464], lg: [1200, 870], alt: "Diagram of the MallaNet architecture: three residual blocks with pooling feed three Homogeneous Filter Capsule layers whose logits are merged by a weighted sum and passed to a softmax", caption: "The MallaNet architecture." },
      problem: "Handwritten Devanagari has 46 character classes with many look-alikes, and the strongest earlier model I compared with is large, about 39 million parameters by the paper's estimate.",
      built: "MallaNet: three residual blocks with pooling, three Homogeneous Filter Capsule layers that read the image at three scales, and a learned weighted merge of their predictions. It has 17,320,579 parameters and was trained from scratch on a Google Colab T4 GPU.",
      checked: "99.71% test accuracy and 99.71% macro F1 on DHCD (92,000 images, 46 classes). Swapping the capsule layers for the original vector capsules gave 99.64%, and accuracy held at 99.42% under Gaussian noise (sigma 0.05). The best reported accuracy I compared with is 99.72%, so MallaNet sits a hair below it with 56.41% fewer parameters. Only DHCD and MNIST were tested.",
    },
    {
      id: "dhumbal", group: "research", name: "Dhumbal AI", icon: "cards", color: "#8b5cf6", type: "Research",
      tagline: "Agents for a hidden-information card game",
      period: "Scientific Reports, Aug 2026",
      tech: ["Python", "TensorFlow", "MCTS", "DQN", "PPO"],
      repo: "dhumbal-ai", github: "https://github.com/sahajrajmalla/dhumbal-ai",
      paper: "https://www.nature.com/articles/s41598-026-68206-1",
      links: [{ label: "Zenodo archive", url: "https://doi.org/10.5281/zenodo.20847013" }],
      media: { base: "assets/projects/dhumbal", sm: [640, 339], lg: [1200, 636], alt: "Bar chart of tournament win rates over 1,024 rounds: Aggressive 88.9%, ISMCTS 9.3%, PPO 0.2%, Random 1.7%, next to a chart of cumulative economic performance", caption: "Tournament win rates and cumulative economic performance." },
      problem: "Dhumbal has hidden hands, multi-card discards and a risky declaration called Jhyap, and little academic work on how to play it well.",
      built: "A Python simulator of the game for two to five players, and nine agents: four hand-written strategies, MCTS and ISMCTS, DQN and PPO, and a random player. Evaluation reports win rate, economic outcome and decision time, with effect sizes and 95% confidence intervals.",
      checked: "A fixed random seed (42), 1,024 simulated rounds per tournament and a bootstrap sensitivity check. The Aggressive strategy won 88.9% of rounds and PPO won 0.2%. The paper states that the learning agents' setup was too weak, so those numbers are baselines, not a verdict on reinforcement learning.",
    },
    {
      id: "quantum", group: "research", name: "Quantum digit recognition", icon: "atom", color: "#8b5cf6", type: "Research",
      tagline: "A CNN with a simulated 10-qubit circuit",
      period: "arXiv, Jun 2025",
      tech: ["PyTorch", "PennyLane", "Python"],
      repo: "devanagari-digit-recognition-using-quantum-machine-learning", github: "https://github.com/sahajrajmalla/devanagari-digit-recognition-using-quantum-machine-learning",
      paper: "https://arxiv.org/abs/2506.09069",
      media: { base: "assets/projects/quantum", sm: [640, 457], lg: [1200, 858], alt: "Circuit diagram of one layer of the 10-qubit variational quantum circuit: amplitude embedding, RY and RZ rotations on every qubit, a ring of CNOT gates and measurement of two qubits", caption: "One layer of the 10-qubit variational circuit." },
      problem: "Can a small variational quantum circuit do the classification step on top of a CNN for Devanagari digits?",
      built: "A CNN extracts features from 28 by 28 images, a 10-qubit variational circuit (amplitude embedding, RY and RZ rotations, a ring of CNOT gates) classifies them, and a linear layer reads out the result. The circuit is simulated with PennyLane. Of 2,339,092 parameters, 100 are quantum.",
      checked: "99.80% test accuracy and 0.9980 average per-class F1 on the digit subset of DHCD, against 99.03% for an equivalent classical CNN. All quantum operations were simulated, so this says nothing about noisy hardware.",
    },
    {
      id: "hamroniwas", group: "startup", name: "HamroNiwas", icon: "house", color: "#c9a84c", type: "Startup",
      tagline: "Rental and marketplace platform for Nepali students",
      period: "Nov 2023 – Present",
      context: "Founder",
      tech: ["Next.js", "React", "Django", "Django REST Framework"],
      media: { src: "assets/projects/hamroniwas-logo.svg", w: 1234, h: 294, kind: "logo", alt: "HamroNiwas logo" },
      problem: "Searching for a room or for goods takes students too long.",
      built: "A web platform with a Next.js and React front end, a Django REST backend with token authentication, and a separate Django service for chat and notifications.",
      checked: "The outcomes are as on my CV: 4,500+ users and a 90% reduction in search time.",
    },
  ],

  // ── COURSEWORK REPORTS (Kathmandu University) ──────────────────────────────
  // Public copies of the reports, with ID numbers, roll numbers, phone numbers and e-mail addresses hidden.
  // thumb: the cover page. A team project says so; classmates are not named.
  coursework: [
    { id: "qperceptron", name: "Non-linearities in quantum perceptrons", kind: "Report", level: "Semester 4 · second-year project", period: "Jan 2025",
      tagline: "Which part of a quantum perceptron does the nonlinear work?",
      summary: "I took three nonlinear mechanisms in quantum perceptrons, phase encoding, interference and measurement, and tested each one on its own across three architectures, on XOR, spirals and Iris.",
      result: "Phase encoding alone reached 67.1% on XOR against 50.0% for a classical perceptron, with 82% fewer parameters. Interference raised spiral accuracy by 12.4%. Measurement allowed multiclass answers (69.2% on Iris) at a cost of 47.0% information. A simulated gate error of 1.5% cut spiral accuracy by 13.2%.",
      limits: "Everything is simulated. Nothing ran on quantum hardware.",
      tech: ["Python", "Qiskit", "PennyLane"],
      file: { name: "Sem4_Original_Math_Project_2025___Sahaj_Raj_Malla.pdf", pages: 39, size: "2.3 MB" },
      thumb: { base: "assets/projects/docs/qperceptron", w: 480, h: 679, alt: "Cover page of the report Analyzing Non-Linearities in Quantum Perceptrons" } },
    { id: "qfa", name: "Quantum finite automata simulator", kind: "Report", level: "COMP 316 · Semester 5", period: "Jul 2025",
      tagline: "Quantum automata and Grover's search in one small simulator",
      summary: "A simulator for measure-once and measure-many quantum finite automata, plus Grover's search algorithm, built with Qiskit and NumPy.",
      result: "The measure-once automaton accepted strings whose length is divisible by 3 with probability above 0.9 and rejected the rest below 0.2. The measure-many automaton recognized prime-length strings above 0.85. Grover's search on 2 qubits found the marked state with probability 0.85.",
      limits: "Small cases on a simulator. Real quantum hardware is listed as future work.",
      tech: ["Python", "Qiskit", "NumPy"],
      file: { name: "Sem5_Quantum_DFA_Report.pdf", pages: 17, size: "400 KB" },
      thumb: { base: "assets/projects/docs/qfa", w: 480, h: 679, alt: "Cover page of the report Quantum Finite Automata Simulator" } },
    { id: "nsea", name: "NSEA reproduction", kind: "Report", level: "Semester 6 · team project", period: "",
      tagline: "A small-scale reproduction of a quantum-safe ERP framework",
      summary: "A team reproduction of the NSEA framework (Lin and Lin, 2025), which combines post-quantum encryption (CRYSTALS-Kyber), neuro-symbolic reasoning and a resilience metric for ERP systems. The full system needs industrial infrastructure, so we wrote a reduced Python prototype of its core mechanisms.",
      result: "The prototype runs in under 1.5 seconds and passes all 11 unit tests written against the paper's claims.",
      limits: "The schema-matching part uses random embeddings, so it shows the idea and not the paper's accuracy, and the encryption latency is simulated.",
      tech: ["Python", "NumPy", "CRYSTALS-Kyber"],
      file: { name: "Sem6_Harish_sir_project_report.pdf", pages: 15, size: "214 KB" },
      thumb: { base: "assets/projects/docs/nsea", w: 480, h: 679, alt: "Cover page of the report Reproduction and Small-Scale Implementation of the NSEA Framework" } },
    { id: "nepsereport", name: "NEPSE index forecasting report", kind: "Report", level: "Semester 6 · team project", period: "Jan 2026",
      tagline: "The project report behind the NEPSE preprint",
      summary: "One-step-ahead forecasts of the NEPSE index's daily log returns with XGBoost, tuned with Optuna and tested by walk-forward validation under expanding and rolling windows.",
      result: "The best setup, an expanding window with 20 lags, reached log-return RMSE 0.013450 and directional accuracy of 65.15%, ahead of tuned ARIMA and Ridge baselines.",
      limits: "R² stays modest, as it does for noisy returns.",
      tech: ["Python", "XGBoost", "Optuna"],
      paper: "nepse",
      file: { name: "Sem6_Xboost_project_report.pdf", pages: 32, size: "788 KB" },
      thumb: { base: "assets/projects/docs/nepsereport", w: 480, h: 679, alt: "Cover page of the report XGBoost Forecasting of NEPSE Index Log-Returns with Walk-Forward Validation" } },
    { id: "svd", name: "SVD for image compression", kind: "Report", level: "MATH 451 · Semester 7 · team project", period: "Nov 2026",
      tagline: "Low-rank compression of Mars images, compared with JPEG",
      summary: "A seminar on truncated singular value decomposition as a way to compress HiRISE images of Mars, with the theory and experiments measured by relative Frobenius error, PSNR and SSIM.",
      result: "The Eckart-Young-Mirsky error bound held to machine precision. Singular values decayed fastest for natural images (99.4% of the energy at rank 20), then Mars images (97.8%), then noisy synthetic star fields (89.2%). At the same file size JPEG scored higher PSNR, so the case for SVD rests on its provable error bound.",
      limits: "Only exact SVD was tested. Randomised SVD for larger images is listed as future work.",
      tech: ["Python", "NumPy", "SciPy", "scikit-learn"],
      file: { name: "Sem7_SVD_project_seminar.pdf", pages: 19, size: "1.2 MB" },
      thumb: { base: "assets/projects/docs/svd", w: 480, h: 679, alt: "First page of the seminar report Singular Value Decomposition for Image Compression on Mars Images" } },
    { id: "lattice", name: "Lattice-based encryption", kind: "Slides", level: "MATH 402 · Semester 7 · team project", period: "",
      tagline: "A post-quantum cryptosystem and its algebraic foundations",
      summary: "A slide deck for Modern Algebra that explains why lattice problems survive quantum attacks and ties each part of a Module-LWE scheme to an algebraic object: group, ring, quotient ring and module.",
      result: "It runs from the shortest and closest vector problems to a hand-worked Ring-LWE example, and on to CRYSTALS-Kyber, standardized as ML-KEM.",
      limits: "A conceptual walk-through with a toy example, not an implementation.",
      tech: ["Ring-LWE", "Module-LWE", "CRYSTALS-Kyber"],
      file: { name: "Sem7_Lattice_Based_Encryption.pdf", pages: 19, size: "383 KB" },
      thumb: { base: "assets/projects/docs/lattice", w: 480, h: 270, alt: "Title slide of the deck Lattice-Based Encryption" } },
  ],

  // ── EXPERIENCE (CV, with the detail the CV has no room for) ────────────────
  // `desc` is the CV line. `points` is what the role involved, taken from the employer's or organiser's own letter or
  // certificate, from the project pages on this site, or from the CV. No letters are published; they are shared on request.
  experience: [
    { role: "Founder", org: "HamroNiwas", place: "Banepa, Nepal", period: "Nov 2023 – Present", current: true,
      desc: "Built a rental and marketplace platform for Nepali students, connecting 4,500+ users and reducing search time by 90%.",
      points: [
        "Started it because finding a room or goods takes students too long.",
        "Built the web platform: a Next.js and React front end and a Django REST backend with token authentication.",
        "Added a separate Django service for chat and notifications.",
      ] },
    { letter: true, role: "Data Engineer Consultant", org: "YoungInnovations Pvt. Ltd.", place: "Lalitpur, Nepal", period: "May 2025 – Jun 2025",
      desc: "Built ELT pipelines with Apache Spark for large-scale dataset processing; automated workflows with Apache Airflow.",
      points: [
        "Worked on a large-scale healthcare data ingestion project that takes in high-volume records from several different sources.",
        "Developed and optimized the ELT pipelines that ingest and transform that data, using Apache Spark.",
        "Automated the workflows with Apache Airflow.",
        "Integrated the data sources and checked data quality, on a tight timeline.",
      ] },
    { letter: true, role: "Data Scientist", org: "Naamche, Inc. (now reAlpha Nepal)", place: "Lalitpur, Nepal", period: "Sep 2021 – Jan 2023",
      desc: "Scraped and analyzed 1M+ real estate listings (Florida, Texas, California); produced investment-decision reports, speeding report computation roughly threefold.",
      points: [
        "Promoted from Junior Data Scientist to Level 1.",
        "Managed the scraping infrastructure that collected the listings, and explored the scraped data to help the data scientists who used it downstream.",
        "Built the transformation pipelines that cleaned and prepared the data for analysis.",
        "Built Notion Extended, a Chrome extension that brought OpenAI GPT-3 into Notion.",
        "Ran sentiment analysis and named entity recognition on customer reviews to find the themes and issues that kept coming up.",
        "Worked on an image similarity project that flags similar photos.",
      ] },
    { letter: true, role: "Data Engineer Trainee", org: "Devfinity Nepal", place: "Kathmandu, Nepal", period: "Mar 2021 – Sep 2021",
      desc: "Built a Django-based data factory processing 1M+ job records daily, deployed on Azure.",
      points: [] },
  ],

  // ── TEACHING & VOLUNTEERING (CV, with detail) ──────────────────────────────
  service: [
    { letter: true, role: "Teaching Assistant, Annual Nepal AI School", org: "NAAMII, Lalitpur, Nepal", period: "Dec 2024 – Jan 2025",
      desc: "Teaching assistant for the lab sessions of the 10-day Fifth Annual Nepal AI School (ANAIS 2024), organized by NAAMII.",
      points: [
        "Held at Premier International IB Continuum School in Lalitpur, from 27 December 2024 to 6 January 2025.",
        "Lab 1: geometric deep learning and graph neural networks (symmetry and group theory, invariance and equivariance, message passing, PyTorch Geometric).",
        "Lab 2: foundation models and self-supervised learning (contrastive learning, pre-training, a mini-GPT, fine-tuning large models).",
        "Lab 3: parameter-efficient fine-tuning (soft prompt tuning, adapters, LoRA).",
        "Lab 4: mixture-of-experts transformers (text generation on the TinyStories dataset).",
      ] },
    { role: "Website Manager and Executive Member", org: "Kathmandu University Robotics Club, Dhulikhel, Nepal", period: "May 2023 – May 2024" },
    { letter: true, role: "Lead Quantum Computing Researcher", org: "OneQuantum, Munich, Germany", period: "Mar 2021 – Mar 2023", note: "Remote, volunteer role.",
      desc: "Research lead for quantum computing projects at One Quantum Nepal, a not-for-profit initiative that works to make quantum technologies open to everyone.",
      points: [
        "Led the research on a project applying quantum computing to human trafficking: wrote the quantum algorithms in Python, documented progress in a structured report, and presented the results at weekly meetups.",
        "In the Summer of Quantum project, led the coding of Grover's search algorithm in Python and ran it on a real IBM quantum computer through IBM Quantum Experience.",
        "Later became technical lead on a project that applies quantum optimization algorithms, such as QAOA, to human trafficking in Nepal.",
        "Gave two talks on quantum computing and coding to an audience of about 20 members, and helped other members with the basics of quantum physics and programming.",
      ] },
    { letter: true, role: "Data Scientist and Software Developer", org: "Robotics Association of Nepal, Kathmandu, Nepal", period: "Mar 2021 – Mar 2022",
      desc: "Worked as a data scientist and full-stack developer for the association.",
      points: [
        "Built machine learning models for object detection, and data pipelines to support robotics prototypes.",
        "With the Mission Oxygen team during the COVID-19 pandemic, built a Django and React web platform that showed oxygen supply and ICU bed availability in real time.",
        "Organized robotics and AI workshops for students.",
      ] },
  ],

  // ── AWARDS (CV order) ──────────────────────────────────────────────────────
  awards: [
    { result: "Winner", title: "Infinity Codewave Hackathon", org: "Kathmandu University", year: "May 2026" },
    { result: "Winner", title: "Infinity Data Visualization Hackathon", org: "Kathmandu University", year: "May 2026" },
    { result: "Winner", title: "Computer Engineering Model Demonstration", org: "Kantipur Engineering College", year: "Dec 2024" },
    { result: "Winner", title: "KU Hackfest (OSM Category)", org: "Kathmandu University Computer Club", year: "Oct 2023" },
    { result: "Winner", title: "Seeds for the Future Nepal", org: "Huawei Technologies Co., Ltd.", year: "Sep 2023" },
    { result: "Winner", title: "Infinity Codewave", org: "Department of Mathematics, Kathmandu University", year: "Aug 2023" },
    { result: "Winner", title: "AI Competition (Text Challenge)", org: "IT MEET, Kathmandu University", year: "Aug 2022" },
    { result: "Winner", title: "AI Competition (Data Visualization)", org: "IT MEET, Kathmandu University", year: "Aug 2022" },
    { result: "Winner", title: "Youth Innovation Challenge", org: "Social Changemakers and Innovators", year: "Aug 2022" },
  ],

  // ── TRAINING & FELLOWSHIPS (CV) ────────────────────────────────────────────
  fellowships: [
    { name: "Aspire Leaders Program", org: "Aspire Institute", period: "Jan 2025 – Mar 2025" },
    { name: "Annual Nepal AI School", org: "NAAMII", period: "May 2023, Dec 2024" },
    { name: "AI Fellowship", org: "Fusemachines Nepal", period: "Jan 2023 – Jan 2024" },
    { name: "Womanium Quantum", org: "Womanium and QWorld", period: "Jul 2023 – Aug 2023" },
    { name: "Data Science Fellowship with DataCamp", org: "Code for Nepal", period: "Dec 2021 – Aug 2023" },
    { name: "Introduction to Quantum Computing", org: "The Coding School and IBM", period: "Sep 2021 – Apr 2022" },
  ],

  // ── PRESS & MEDIA (CV) ─────────────────────────────────────────────────────
  press: [
    { title: "AI Agent for the Dhumbal Card Game", outlet: "Techpana", lang: "in Nepali", date: "Sep 2026", url: "https://techpana.com/2026/158879" },
    { title: "Making Devanagari Handwriting Accessible: The Story of MallaNet", outlet: "Business 360°", date: "Feb 2026", url: "https://www.b360nepal.com/detail/27723/making-devanagari-handwriting-accessible-the-story-of-mallanet" },
    { title: "AI Model to Recognize Handwritten Devanagari Script", outlet: "Techpana", lang: "in Nepali", date: "Dec 2025", url: "https://techpana.com/2025/154683/" },
    { title: "South Asia's 1st Quantum AI for Devanagari Digits", outlet: "ICT Frame", date: "Jun 2025", url: "https://ictframe.com/south-asias-1st-quantum-ai/", note: "Headline as published. The quantum circuit in the paper was simulated." },
    { title: "Paths of Possibility Shown by Sahaj", outlet: "Terai Online", lang: "in Nepali", date: "Apr 2025", url: "https://www.teraionline.com.np/news/39604" },
    { title: "A Journey with \"Seeds for the Future 2023\"", outlet: "ICT Frame", date: "Nov 2023", url: "https://ictframe.com/seeds-for-the-future-technological-odyssey-from-nepal-to-china/" },
  ],

  // ── CONFERENCE TALKS & PANELS (CV) ─────────────────────────────────────────
  talks: [
    { title: "Conference Presentation, Landmark-Based Addressing", org: "Kathmandu University, Dhulikhel, Nepal", date: "Oct 2024" },
    { title: "Panelist, National Youth Scientific Conference", org: "National Youth Council Nepal, Kathmandu, Nepal", date: "Jun 2024" },
    { title: "Guest Speaker, Career in AI/ML", org: "CSIT Association of Nepal, Pokhara, Nepal", date: "Dec 2023" },
    { title: "Conference Presentation, Nepali Stock Price Prediction", org: "ICT-CEEL 2023, Bhaktapur, Nepal", date: "Oct 2023" },
  ],

  // ── LANGUAGES (CV) ─────────────────────────────────────────────────────────
  languages: [
    { name: "English", note: "IELTS Academic, overall 7.5" },
    { name: "Nepali" },
    { name: "Hindi" },
    { name: "Newari" },
  ],

  // ── RESEARCH INTERESTS (the CV line, split) ────────────────────────────────
  researchInterests: [
    { key: "orch", area: "Multimodal agent orchestration", desc: "Which specialist to call, what feedback to read, and when to stop. Touchstone is a working router and critic; my thesis studies the budgeted version of the question." },
    { key: "rl", area: "Reinforcement learning", desc: "Decisions under hidden information. In Dhumbal my learned agents lost to a hand-written strategy and to a random player, and I want to understand why." },
    { key: "eff", area: "Compute-efficient decision-making", desc: "Compact models and honest evaluation under a budget. MallaNet has 17.3 million parameters and was trained on a Google Colab T4 GPU." },
  ],

  // ── FOR PhD: the work behind the three interests ───────────────────────────
  // `interests` says which questions an item speaks to, using the keys above. `paper` ties it to a paper id so the
  // publication list can mark it. Takeaways repeat what the paper, report or repository itself reports.
  phdEvidence: [
    { id: "thesis", kind: "Thesis", when: "Oct 2026 – Present", title: "When to Call Whom: the value of diagnostic feedback in budgeted AI orchestration",
      takeaway: "With a fixed budget, when should an agent review a failed attempt before trying another method? This is the narrow, measurable form of my main question.",
      interests: ["orch", "eff"] },
    { id: "touchstone", kind: "System", when: "Nov 2024 – Present", title: "Touchstone: routing and critic review for question answering",
      takeaway: "A classifier routes each question to a specialist agent, and a critique agent approves the answer or sends it back. My thesis asks when that kind of review is worth its cost under a budget.",
      interests: ["orch"] },
    { id: "dhumbal", kind: "Q1 paper", when: "Aug 2026", title: "Heuristic optimization of AI agents for Dhumbal",
      takeaway: "A hand-written strategy won 88.9% of rounds and my learned agents did not beat a random player. The paper says their setup was too weak, so I read it as a question: when is a cheap specialist enough?",
      interests: ["rl", "eff"], paper: "dhumbal" },
    { id: "mallanet", kind: "Q1 paper", when: "Dec 2025", title: "MallaNet: a compact Devanagari character recognizer",
      takeaway: "17.3 million parameters against about 39 million for the best earlier result I compared with, at 99.71% accuracy against 99.72%, trained on a Google Colab T4 GPU.",
      interests: ["eff"], paper: "mallanet" },
    { id: "kalimati", kind: "Q1 paper", when: "Nov 2026", title: "Agricultural Commodity Price Index: combining rather than selecting forecasts",
      takeaway: "The models that won on the test window ranked third to seventh on validation, so none could have been chosen in advance. Combining models beat choosing one.",
      interests: ["orch", "eff"], paper: "kalimati" },
    { id: "nepse", kind: "Preprint", when: "Jan 2026", title: "XGBoost forecasting of NEPSE index returns with walk-forward validation",
      takeaway: "Forecasts tested the way they would be used: train on the past, predict the next day, move forward, repeat. A lesson in evaluating honestly under a budget.",
      interests: ["eff"], paper: "nepse" },
  ],

  // ── EDUCATION (CV) ─────────────────────────────────────────────────────────
  education: {
    degree: "B.Sc. in Computational Mathematics",
    university: "Kathmandu University",
    place: "Dhulikhel, Nepal",
    period: "Nov 2022 – Feb 2027 (expected)",
    conferral: "Expected degree conferral: Jun 2027",
    thesis: {
      label: "Undergraduate thesis",
      title: "When to Call Whom: The Value of Diagnostic Feedback in Budgeted AI Orchestration",
      question: "With a fixed budget, when should an agent review a failed attempt before trying another method?",
      supervisors: "Dr. Samir Shrestha and Dr. Saraswati Acharya",
      status: "Oct 2026 – Present",
    },
  },

  // ── PHD STATEMENT ──────────────────────────────────────────────────────────
  phdStatement: "I am applying to PhD programs in artificial intelligence to study multimodal agent orchestration, reinforcement learning, and compute-efficient decision-making. The question I keep coming back to is this: when a system can call several specialists, which one should it call, what feedback should it read, and when should it stop? My undergraduate thesis asks a narrow form of that question. My papers on vision, forecasting and game-playing agents are where I learned to build the parts and to evaluate them.",

  // ── INTERESTS ──────────────────────────────────────────────────────────────
  interests: [
    { label: "Travel", icon: "travel" },
    { label: "Art", icon: "art" },
    { label: "Philosophy", icon: "philosophy" },
    { label: "Psychology", icon: "psychology" },
    { label: "Music", icon: "music" },
    { label: "Anime", icon: "anime" },
    { label: "Football", icon: "football" },
    { label: "Explore", icon: "explore" },
  ],

  // ── LIFE GALLERY (About page) ──────────────────────────────────────────────
  // base: file stem in assets/. sm: size of the -640 file. lg: size of the -1600 file (real pixels).
  gallery: [
    { base: "assets/life/sahaj11", sm: [640, 640], lg: [1440, 1440], caption: "High in the Himalaya", sub: "Trekking" },
    { base: "assets/life/sahaj21", sm: [640, 1235], lg: [720, 1389], caption: "Beneath the pagoda", sub: "Bhaktapur" },
    { base: "assets/life/sahaj10", sm: [640, 853], lg: [1200, 1600], caption: "Somewhere grand", sub: "Travels" },
    { base: "assets/life/sahaj5", sm: [640, 961], lg: [1066, 1600], caption: "On the panel", sub: "Speaking" },
    { base: "assets/life/sahaj13", sm: [640, 480], lg: [1600, 1200], caption: "Horseback in Mustang", sub: "Mustang" },
    { base: "assets/life/sahaj7", sm: [640, 853], lg: [960, 1280], caption: "Golden hour", sub: "Sunset" },
    { base: "assets/life/sahaj6", sm: [640, 534], lg: [1600, 1335], caption: "Bicycle kick on the pitch", sub: "Football" },
    { base: "assets/life/sahaj17", sm: [640, 853], lg: [1200, 1600], caption: "Wearing the startup", sub: "HamroNiwas" },
    { base: "assets/life/sahaj18", sm: [640, 853], lg: [1200, 1600], caption: "Top of the climb", sub: "Outdoors" },
    { base: "assets/life/sahaj20", sm: [640, 853], lg: [1200, 1600], caption: "Stone guardians", sub: "Heritage" },
    { base: "assets/life/sahaj8", sm: [640, 853], lg: [1200, 1600], caption: "A rainy day abroad", sub: "On the road" },
    { base: "assets/life/sahaj9", sm: [640, 853], lg: [960, 1280], caption: "Trail with a view", sub: "Hiking" },
    { base: "assets/life/sahaj19", sm: [640, 853], lg: [1200, 1600], caption: "Night ride under a full moon", sub: "After hours" },
    { base: "assets/life/sahaj15", sm: [640, 480], lg: [1600, 1200], caption: "On the steps at KU", sub: "Campus" },
    { base: "assets/life/sahaj4", sm: [583, 1280], lg: [583, 1280], caption: "Newari woodcraft, up close", sub: "Heritage" },
    { base: "assets/life/sahaj16", sm: [640, 853], lg: [1200, 1600], caption: "Out on the bike", sub: "Riding" },
    { base: "assets/life/sahaj12", sm: [640, 853], lg: [1200, 1600], caption: "World's highest swing, Kushma", sub: "Travels" },
  ],

  // ── TOOLBOX (About page) ───────────────────────────────────────────────────
  // `main` is shown; `more` opens on request. The CV's groups come first and keep their items; the older site's lists
  // and what the public repositories and project folders show (dependency files, imports) fill the rest.
  // Items with a brand colour render as a badge.
  skillGroups: [
    { label: "Agents and RL", color: "var(--purple)",
      main: ["Policy training", "Policy evaluation", "Offline RL", { name: "Gymnasium" }, { name: "MuJoCo" }],
      more: ["MCTS and ISMCTS", "DQN", "PPO", "Custom Gym environments"] },
    { label: "ML and deep learning", color: "var(--purple)",
      main: [{ name: "PyTorch", brand: "#EE4C2C", abbr: "PT" }, { name: "TensorFlow", brand: "#FF6F00", abbr: "TF" }, { name: "JAX" }, { name: "Hugging Face Transformers", brand: "#FFD21E", abbr: "HF" }, { name: "scikit-learn", brand: "#F7931E", abbr: "SK" }],
      more: [{ name: "Keras" }, { name: "PyTorch Lightning" }, { name: "XGBoost" }, { name: "LightGBM" }, { name: "CatBoost" }, { name: "Optuna" }, { name: "SHAP" }, { name: "OpenCV" }, { name: "Weights & Biases" }, "CNNs and residual networks", "Capsule networks"] },
    { label: "LLM systems", color: "var(--purple)",
      main: [{ name: "LangGraph", brand: "#1C3C3C", abbr: "LG" }, { name: "LangChain" }, "RAG", "LoRA fine-tuning", "Mixed-precision training"],
      more: ["BM25", { name: "Sentence-Transformers" }, "OpenAI and Anthropic APIs", { name: "Ollama" }, "Document extraction with LLMs"] },
    { label: "Efficient ML", color: "var(--purple)",
      main: ["Parameter-efficient model design", "Model quantization", "Inference profiling"], more: [] },
    { label: "Quantum ML", color: "var(--purple)",
      main: [{ name: "PennyLane", brand: "#2D7FF9", abbr: "PL" }, { name: "Qiskit", brand: "#6929C4", abbr: "QK" }],
      more: ["Variational quantum circuits", "Hybrid quantum-classical models"] },
    { label: "Data and forecasting", color: "var(--gold-ink)",
      main: [{ name: "Apache Spark", brand: "#E25A1C", abbr: "Sp" }, { name: "Apache Airflow", brand: "#017CEE", abbr: "Af" }, { name: "Pandas", brand: "#150458", abbr: "Pd" }, { name: "NumPy", brand: "#013243", abbr: "Np" }, { name: "statsmodels" }],
      more: ["ELT pipelines", { name: "Polars" }, { name: "Delta Lake" }, "Parquet", { name: "SciPy" }, { name: "Matplotlib" }, { name: "Plotly" }, { name: "Streamlit" }, { name: "Jupyter", brand: "#F37626", abbr: "Jp" }, { name: "Prophet" }, { name: "StatsForecast" }, { name: "NeuralForecast" }, { name: "PyMC" }, "Walk-forward validation", "Forecast combination", "Web scraping"] },
    { label: "Geospatial", color: "var(--gold-ink)",
      main: ["OpenStreetMap", { name: "H3" }, { name: "GeoPandas" }],
      more: [{ name: "Shapely" }, { name: "Rasterio" }, { name: "Folium" }, "DBSCAN", "A* search"] },
    { label: "Applied mathematics", color: "var(--accent-2)",
      main: ["Numerical optimization", "Statistical modeling", "Graph algorithms"],
      more: [{ name: "NetworkX" }, { name: "SymPy" }] },
    { label: "Languages", color: "var(--accent-2)",
      main: [{ name: "Python", brand: "#3776AB", abbr: "Py" }, { name: "C++", brand: "#00599C", abbr: "C++" }, { name: "TypeScript", brand: "#3178C6", abbr: "TS" }, { name: "SQL" }],
      more: [{ name: "JavaScript", brand: "#F7DF1E", abbr: "JS" }, { name: "R", brand: "#276DC3", abbr: "R" }, { name: "C" }, "HTML and CSS"] },
    { label: "Web and APIs", color: "var(--accent-2)",
      main: [{ name: "FastAPI", brand: "#009688", abbr: "FA" }, { name: "Django", brand: "#092E20", abbr: "Dj" }, { name: "React", brand: "#61DAFB", abbr: "Re" }, { name: "Next.js", brand: "#111111", abbr: "Nx" }, "REST APIs"],
      more: [{ name: "Django REST Framework" }, { name: "Pydantic" }, { name: "SQLAlchemy" }, { name: "Alembic" }, { name: "Celery" }, "WebSockets", { name: "Tailwind CSS" }, "JWT and Argon2 password hashing"] },
    { label: "Cloud, databases and tooling", color: "var(--ink-3)",
      main: [{ name: "AWS", brand: "#FF9900", abbr: "AW" }, { name: "Azure", brand: "#0078D4", abbr: "Az" }, { name: "Linux", brand: "#FCC624", abbr: "Lx" }, { name: "Docker", brand: "#2496ED", abbr: "Dk" }, { name: "Git", brand: "#F05032", abbr: "Gt" }, { name: "PostgreSQL", brand: "#4169E1", abbr: "Pg" }, { name: "MongoDB", brand: "#47A248", abbr: "Mg" }, { name: "Redis", brand: "#DC382D", abbr: "Rd" }, { name: "FAISS" }],
      more: [{ name: "Docker Compose" }, { name: "IBM Cloud" }, { name: "SQLite" }, { name: "Elasticsearch" }, { name: "GitHub Actions" }, { name: "pre-commit" }, { name: "Ruff" }, { name: "mypy" }, { name: "pytest" }, { name: "Make" }, "PyPI packaging"] },
    { label: "Also explored", color: "var(--ink-3)",
      main: ["Flutter", "Ethereum dApps", "RSA cryptography", "SystemVerilog hardware design"], more: [] },
  ],
};

/* ───────────────────────────────────────────────────────────────
   Shared React hooks (React is loaded globally before this file).
   ─────────────────────────────────────────────────────────────── */

// Responsive breakpoint hook - returns true when viewport width < bp.
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

// Theme hook - reads current data-theme and re-renders on toggle (event from index.html).
window.useTheme = function () {
  const get = function () {
    return (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'dark';
  };
  const [t, setT] = React.useState(get());
  React.useEffect(function () {
    const onChange = function () { setT(get()); };
    window.addEventListener('sahajtheme', onChange);
    // also respond if the OS preference changes while on system default
    let mq = null;
    if (window.matchMedia) {
      mq = window.matchMedia('(prefers-color-scheme: light)');
      if (mq.addEventListener) mq.addEventListener('change', onChange);
    }
    return function () {
      window.removeEventListener('sahajtheme', onChange);
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onChange);
    };
  }, []);
  return t;
};

// Reveal-on-scroll wrapper - fades + rises children into view once. Respects reduced-motion.
window.Reveal = function ({ children, delay = 0, y = 16, style }) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(function () {
    const el = ref.current; if (!el) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setSeen(true); return; }
    const io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return function () { io.disconnect(); };
  }, []);
  return React.createElement('div', {
    ref: ref,
    style: Object.assign({
      opacity: seen ? 1 : 0,
      transform: seen ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      willChange: 'opacity, transform',
    }, style || {}),
  }, children);
};
