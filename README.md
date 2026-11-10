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
| **Home** | `#home` | Name, stats, the three Q1 papers, links, and buttons to the PhD overview, About and Research |
| **About** | `#about` | Experience, education, awards, talks, training, the toolbox (filterable) and spoken languages, press, interests, photos, and a link on to Research |
| **Research** | `#research` | The thread, four animated charts, peer-reviewed papers and preprints; each first page opens in a zoomable viewer |
| **Projects** | `#projects` | Case studies: the problem, what I built, how it was checked; figures open in the viewer |
| **For PhD** | `#phd` | The research question, facts at a glance, a map linking each interest to the work behind it, thesis, path, publications, training |
| **Contact** | `#contact` | Email (Gmail compose link, address shown) and profiles |
| **Explore My World** | button | A small game (rocket at night, ship by day) that flies to each page |

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
  Common.jsx        shared UI on window.SahajUI: error boundary, headings, badges, the image viewer,
                    figures, animated charts, counted scroll lock, citation copy, GitHub stats, table of contents
  Icons.jsx         SVG icon registry (window.SahajIcons)
  Logo.jsx          the mountain-M logo
  Navbar.jsx        top navigation, theme toggle, CV button
  Backdrops.jsx     the night space and day sea canvases behind the home hero
  Home.jsx  About.jsx  Research.jsx  Projects.jsx  PhD.jsx  Contact.jsx
  Game.jsx          the game (pointer-based pad, counted scroll lock, dialog focus handling)
  App.jsx           router (page and section hashes), transitions, footer, game button
assets/
  cv.pdf            the CV (the navbar button). Keep the file name.
  papers/           first page of each paper (-240.webp and -480.webp for cards, -1600.webp for the viewer)
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
- **First page of a paper:** render it from the published PDF, never from a draft, uncropped and unedited
  (some journals, such as CC BY-NC-ND, allow only a verbatim copy):
  ```bash
  pdftoppm -singlefile -f 1 -l 1 -r 200 -png paper.pdf page
  for w in 240 480 1600; do magick page.png -resize ${w}x page-$w.png && cwebp -q 80 -m 6 -sharp_yuv page-$w.png -o assets/papers/<id>-$w.webp; done
  ```
  Set `thumb.licence` in `data.js` to the journal's licence line (`null` when none is stated). Nothing else is printed under the image.
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
- **Script versions:** `index.html` loads each script with `?v=YYYYMMDD`. Change that value when you deploy, so
  returning visitors (GitHub Pages caches files for 10 minutes) never run old scripts with a new page. While
  testing locally, hard-reload (Cmd+Shift+R) if the browser still shows an older version.
- **Backdrops** pause when the tab is hidden, cap the device pixel ratio, and never
  throw into React: a canvas that has no size yet simply waits for one.
- **Script scope:** every `.jsx` file shares one global scope once Babel compiles it, so a
  top-level function with the same name in two files silently replaces the first. Give shared
  things unique names (the viewer is `ImageViewer`) and export them on `window.SahajUI`.
- **Game input** uses Pointer Events (with capture) and reads the keyboard by direction, and
  everything is released on blur, tab hide and close. No touch handler calls `preventDefault`.
- **Accessibility:** one `h1` per page, skip link, real buttons for every expandable
  card, `aria-expanded` and `aria-current`, modal dialogs (image viewer, game) with focus
  trapped inside and handed back on close, a counted scroll lock that cannot leave the page
  stuck, reduced-motion support (no auto-play, no chart animation), 44 px targets on the mobile chip bar.
- **SEO:** unique title and description, Open Graph and Twitter cards, JSON-LD
  (Person, ProfilePage and four ScholarlyArticle entries), canonical URL, sitemap.

---

© Sahaj Raj Malla. Code is yours to edit freely.
