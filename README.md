# Sahaj Raj Malla: personal site

A static **React 18** site with a space and sea theme, an explorable mini-game,
and structured data for search. There is no build step and no `npm install`:
React and Babel load from a CDN (pinned versions, SRI hashes) and the app runs
straight from the files in this folder.

**Live:** https://sahajrajmalla.com.np

> **GitHub Pages serves `main` from the repository root, so any push or merge to
> `main` is a deployment.** Work on a branch and merge only when the site is ready.

---

## Pages and routes

| Page | Route | What it holds |
|------|-------|---------------|
| **Home** | `#home` | Name, stats, the three Q1 papers with first-page thumbnails, links |
| **About** | `#about` | Experience, education, awards, talks, training, toolbox, press, interests, photos |
| **Research** | `#research` | The thread, four charts, peer-reviewed papers and preprints |
| **Projects** | `#projects` | Case studies: the problem, what I built, how it was checked |
| **For PhD** | `#phd` | Statement, interests, thesis, path, publications, training |
| **Contact** | `#contact` | Email (Gmail compose, address shown, copy button) and profiles |
| **Explore My World** | button | A small rocket game that flies to each page |

Sections are deep links: `#research/peer-reviewed`, `#about/awards`,
`#projects/touchstone`, `#phd/thesis`. A paper card has its own link too
(`#research/paper-dhumbal` opens that card). Links work on load, reload, back and
forward. About, Research, Projects and For PhD show a table of contents (a sticky
side rail on wide screens, a chip bar under the navbar on narrower ones).

---

## Files

```
index.html          entry point: metadata, JSON-LD, theme tokens, shared CSS, script loader
js/
  data.js           ALL CONTENT (papers, projects, experience, awards, skills, gallery ...)
                    + shared hooks (useIsMobile, useViewportWidth, useTheme, Reveal)
  Common.jsx        shared UI on window.SahajUI: error boundary, headings, badges, figures,
                    charts, citation copy, GitHub stats, table of contents
  Icons.jsx         SVG icon registry (window.SahajIcons)
  Logo.jsx          the mountain-M logo
  Navbar.jsx        top navigation, theme toggle, CV button
  Backdrops.jsx     the night space and day sea canvases behind the home hero
  Home.jsx  About.jsx  Research.jsx  Projects.jsx  PhD.jsx  Contact.jsx
  Game.jsx          the rocket game
  App.jsx           router (page and section hashes), transitions, footer, game button
assets/
  cv.pdf            the CV (the navbar button). Keep the file name.
  papers/           first page of each paper (-240.webp, -480.webp); kalimati-card.svg
  projects/         figures for the project case studies
  life/             gallery photos (-640.webp tiles, -1600.webp for the lightbox)
  github-stats.json dated snapshot of the public repo list (fallback only)
CNAME  robots.txt  sitemap.xml  404.html  .nojekyll
```

---

## Updating content

**Everything readable on the site comes from `js/data.js`.** Edit the text between
the quotes. Facts come from the CV first, then the papers themselves.

- **A paper:** copy a block in `peerReviewed` or `preprints`. Fill `summary`,
  `question`, `found` and `limits` from the paper's abstract and limitations
  section. Add `code` only for a public repository that holds that paper's code.
  Counts on the site (papers, Q1, preprints, papers with code) are computed.
- **A project:** copy a block in `projects`. Use `repo` only for public repositories.
- **The CV:** replace `assets/cv.pdf` (same name). Then check the changed items in
  `data.js` against it.
- **First page of a paper:** render it from the published PDF, never from a draft:
  ```bash
  pdftoppm -singlefile -f 1 -l 1 -r 150 -png paper.pdf page
  magick page.png -resize 480x page-480.png && cwebp -q 80 -m 6 page-480.png -o assets/papers/<id>-480.webp
  ```
  Repeat at 240 px for `-240.webp`. Check the article's licence before reusing figures.
- **GitHub numbers:** the site makes one request to the GitHub API (60 per hour per
  IP), keeps the answer in `localStorage` for 24 hours, and falls back to
  `assets/github-stats.json`. To refresh the snapshot:
  ```bash
  curl -s "https://api.github.com/users/sahajrajmalla/repos?per_page=100" | jq -c '{asOf:(now|strftime("%Y-%m-%d")), user:"sahajrajmalla", repos:length, forkRepos:(map(select(.fork))|length), stars:(map(.stargazers_count)|add), forks:(map(.forks_count)|add), byName:(map({key:.name, value:{stars:.stargazers_count, forks:.forks_count, fork:.fork, language:.language}})|from_entries)}' > assets/github-stats.json
  ```
  The list contains public repositories only.

---

## Run locally

Serve the folder over HTTP (opening `index.html` as a file will not load the scripts):

```bash
python3 -m http.server 4599
# open http://localhost:4599
```

---

## Notes

- **React 18.3.1 production builds** and Babel standalone 7.29.0, pinned, with SRI
  hashes. Babel compiles the `.jsx` files in the browser, so it prints a console
  notice about precompiling; this is the cost of having no build step.
- **Backdrops** pause when the tab is hidden, cap the device pixel ratio, and never
  throw into React: a canvas that has no size yet simply waits for one.
- **Accessibility:** one `h1` per page, skip link, real buttons for every expandable
  card, `aria-expanded` and `aria-current`, a dialog lightbox with focus handling,
  reduced-motion support, 44 px targets on the mobile chip bar.
- **SEO:** unique title and description, Open Graph and Twitter cards, JSON-LD
  (Person, ProfilePage and four ScholarlyArticle entries), canonical URL, sitemap.

---

© Sahaj Raj Malla. Code is yours to edit freely.
