# Sahaj Raj Malla — Portfolio

A fast, single-page **React** portfolio with an interactive space theme, an
explorable mini-game, and full SEO. No build step, no bundler, no `npm install`
— React + Babel load from a CDN and the app runs straight from static files.
Built to deploy on **GitHub Pages**.

**Live:** https://sahajrajmalla.com.np

---

## ✦ What's inside

| Page | Route | Purpose |
|------|-------|---------|
| **Home** | `#home` | Animated space hero, name (EN + नेपाली), live stats, social links |
| **About** | `#about` | Bio, interests, technical toolbox, journey, fellowships, press |
| **Research** | `#research` | 9 publications (peer-reviewed + preprints), awards, talks |
| **Projects** | `#projects` | Open-source tools, research code, startup |
| **For PhD** | `#phd` | Research profile written for supervisors & collaborators |
| **Contact** | `#contact` | Direct ways to reach me — no repeated content |
| **Explore My World** | 🕹 button | A mini rocket game — fly between star portals to each section |

---

## ✦ File structure

```
index.html         → entry point: SEO meta, JSON-LD, fonts, script loader
js/
  data.js          → ★ ALL CONTENT lives here (papers, awards, links, skills…)
                     + shared responsive hooks
  Logo.jsx         → the mountain-"M" + crown logo (inline SVG)
  Navbar.jsx       → top navigation + CV download button
  Home.jsx         → hero + animated space canvas
  About.jsx        → about page + swipeable photo carousel
  Research.jsx     → publications, awards, talks
  Projects.jsx     → project cards
  PhD.jsx          → academic profile
  Contact.jsx      → contact page
  Game.jsx         → the rocket / star-portal mini-game
  App.jsx          → router, page transitions, footer, floating game button
assets/
  cv.pdf           → ★ your CV (downloaded by the navbar button)
  sahaj1.jpg       → ★ photo (mountains)
  sahaj2.jpg       → ★ photo (primary / hero)
  sahaj3.jpeg      → ★ photo (Nepal flag)
CNAME              → custom domain (sahajrajmalla.com.np)
robots.txt         → crawl rules + sitemap pointer
sitemap.xml        → sitemap
404.html           → branded not-found page
.nojekyll          → tells GitHub Pages to skip Jekyll
```

> ★ = the only files you normally need to touch to keep the site current.

---

## ✦ Updating content (no code knowledge needed)

**Everything readable on the site comes from `js/data.js`.** Open it, edit the
text between the quotes, save. To add a paper, copy an existing block in
`peerReviewed` or `preprints` and change the fields.

### Swap your CV
Replace **`assets/cv.pdf`** with your new file — keep the same name and the
navbar "CV" button instantly serves the new version. No code change.

### Swap a photo
Replace **`assets/sahaj1.jpg`**, **`sahaj2.jpg`**, or **`sahaj3.jpeg`** with a
new image of the same name (portrait orientation, ~3:4, e.g. 900×1200, looks
best). The home hero and the about carousel update automatically.

---

## ✦ Deploy to GitHub Pages

Your repo `sahajrajmalla.github.io` is a **user site**, so Pages serves it from
the repository **root** — `index.html` must sit at the top level.

### One-time setup
The site files already sit at the repo **root** (`index.html`, `js/`, `assets/`,
`CNAME`…) — exactly where a user site needs them. Just publish:

1. Commit and push:
   ```bash
   git add -A
   git commit -m "New portfolio site"
   git push origin main
   ```
2. On GitHub → **Settings → Pages → Source: Deploy from a branch** →
   branch `main`, folder `/ (root)` → **Save**.
3. Confirm **Custom domain** shows `sahajrajmalla.com.np` (the `CNAME` file sets
   it). Enable **Enforce HTTPS** once available.

Live in ~1–2 minutes. Every later update is just `git push`.

### Custom domain DNS (one-time, at your registrar)
Point the domain at GitHub Pages:
```
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   sahajrajmalla.github.io
```

---

## ✦ Run locally

No build needed. Serve the folder over HTTP (opening `index.html` via `file://`
won't load the modules):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

---

## ✦ Tech & best practices baked in

- **React 18** (pinned + SRI integrity hashes) + Babel standalone — no build.
- **Fonts:** Times New Roman (display) + Helvetica Neue (body); Devanagari via
  Google Fonts.
- **SEO:** unique title/description, Open Graph, Twitter cards, JSON-LD
  `Person` schema, `robots.txt`, `sitemap.xml`, canonical URL.
- **Performance:** capped device-pixel-ratio canvas, reduced object counts on
  mobile, `prefers-reduced-motion` support, lazy/synchronous first paint.
- **Accessibility:** semantic landmarks, `aria-label`s, focus-visible rings,
  keyboard-navigable game, alt text on every image.
- **Responsive:** mobile-first layouts across every page.

---

© Sahaj Raj Malla. Code is yours to edit freely.
