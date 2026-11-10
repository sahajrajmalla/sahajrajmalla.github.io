# Sahaj Raj Malla: personal site

A static **React 18** site with a space and sea theme, an explorable mini-game, and structured data
for search. GitHub Pages serves the files in this repository as they are. The sources in `js/` are compiled
ahead of time into two small files, so a visitor downloads no compiler and the first load is about 250 KB
(React 46 KB, the app 68 KB, both gzipped).

**Live:** https://sahajrajmalla.com.np

> **GitHub Pages serves `main` from the repository root, so any push or merge to
> `main` is a deployment.** Work on a branch and merge only when the site is ready.
> **Run `npm run build` before you commit a change to anything in `js/`**, or the site keeps serving the old code.

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
index.html          entry point: metadata, JSON-LD, theme tokens, shared CSS, and the two script tags the build writes
build.mjs           the build (esbuild): compiles js/*.jsx, minifies, names the output by content hash, edits index.html
package.json        npm run build, npm run dev
js/                 SOURCES (edit these)
  data.js           ALL CONTENT (papers, projects, coursework reports, experience, awards, skills, gallery ...)
                    + shared hooks (useIsMobile, useViewportWidth, useTheme, Reveal)
  Common.jsx        shared UI on window.SahajUI: error boundary, headings, badges, the image viewer, figures,
                    animated charts, counted scroll lock, citation copy, GitHub stats, table of contents
  Icons.jsx  Logo.jsx  Navbar.jsx  Backdrops.jsx  (the night space and day sea canvases behind the home hero)
  Home.jsx  About.jsx  Research.jsx  Projects.jsx  PhD.jsx  Contact.jsx
  Game.jsx          the game (pointer-based pad, counted scroll lock, dialog focus handling)
  App.jsx           router (page and section hashes), transitions, footer, game button
assets/js/          BUILD OUTPUT (do not edit): app.<hash>.js and vendor.<hash>.js (React)
vendor/             React 18.3.1 production builds, pinned (their SHA-384 matches the unpkg files the site used before)
assets/
  cv.pdf            the CV (the navbar button). Keep the file name.
  on-request/       NOT in git, NOT served (git-ignored): reports/ (redacted copies) and letters/ (originals), kept only so they are easy to attach when someone asks by mail
  fonts/            Tiro Devanagari Hindi (woff2) and its SIL Open Font License
  papers/           first page of each paper (-240.webp and -480.webp for cards, -1600.webp for the viewer)
  projects/         figures for the project case studies; projects/docs/ has the report covers
  life/             gallery photos (-640.webp tiles, -1600.webp for the viewer)
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
- **A coursework report:** add the PDF to `assets/on-request/reports/` (git-ignored; the page only shows a mail-request button), copy a block in `coursework`
  (`file` holds the name, page count and size), and render the cover as `assets/projects/docs/<id>-240.webp`,
  `-480.webp` and `-1200.webp`. Before it goes in, hide ID numbers, roll numbers, phone numbers and e-mails.
- **An experience entry:** `desc` is the CV line, `points` is what the role involved. Experience letters are not
  published; they are shared on request.
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

```bash
npm install            # once: installs esbuild
npm run build          # compile js/ into assets/js/ and update index.html (do this after every edit to js/)
python3 -m http.server 4599
# open http://localhost:4599
```

To see an edit without building each time, run `npm run dev` once: `index.html` then loads the sources through
Babel in the browser (slower, and it needs a network connection for Babel). Run `npm run build` again before you
commit, because the committed `index.html` must be the production one.

---

## Notes

- **No runtime compiler.** `build.mjs` precompiles the JSX and wraps each file in its own function, so top-level
  names in one file can never replace those in another; files talk through `window` only. Output names carry a hash
  of their content, so a returning visitor never runs old scripts against a new page (GitHub Pages caches files for
  10 minutes, and its headers cannot be changed).
- **Nothing third-party on load.** React and the Devanagari font are served from this site. The only outside call is
  the GitHub API on the Research and Projects pages (one request, kept 24 h in `localStorage`, with a saved copy
  as the fallback). The Home page makes none.
- **Fast first paint:** scripts are deferred, the hero photo and the Devanagari font are preloaded on the Home route,
  every image is WebP with its size set and lazy except the hero, and PDFs and large page images load only when
  opened.
- **Backdrops** pause when the tab is hidden, cap the device pixel ratio, and never
  throw into React: a canvas that has no size yet simply waits for one.
- **Script scope:** in `--dev` mode (Babel in the browser) every `.jsx` file still shares one global scope, so a
  top-level name used in two files silently replaces the first. The production build isolates each file, and
  `build.mjs` warns about a name used in a file that does not declare it. Give shared things unique names (the
  viewer is `ImageViewer`) and export them on `window.SahajUI`.
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
