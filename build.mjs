// build.mjs - turns the sources in js/ into the files the site serves, and points index.html at them.
//
//   node build.mjs          production (what gets committed and deployed): the .jsx files are compiled ahead of time,
//                           minified and joined into assets/js/app.<hash>.js; React is joined into assets/js/vendor.<hash>.js.
//                           The names carry a hash of their content, so a returning visitor can never run old scripts
//                           with a new page. Visitors download no compiler and compile nothing.
//   node build.mjs --dev    development: index.html loads the sources through Babel in the browser, so an edit shows after
//                           a reload with no build. Run the production build again before committing.
//
// Every source file is wrapped in its own function, so top-level names in one file can never replace those in another.
// Files talk to each other only through window (SahajUI, SahajData, SahajIcons, ...).
import { transform } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

// order matters: data and shared UI first, App last
const FILES = [
  'js/data.js', 'js/Icons.jsx', 'js/Logo.jsx', 'js/Common.jsx', 'js/Navbar.jsx', 'js/Backdrops.jsx',
  'js/Home.jsx', 'js/About.jsx', 'js/Research.jsx', 'js/Projects.jsx', 'js/PhD.jsx', 'js/Contact.jsx',
  'js/Game.jsx', 'js/App.jsx',
];
const VENDOR = ['vendor/react.production.min.js', 'vendor/react-dom.production.min.js'];   // React 18.3.1, pinned, from unpkg
const OUT = 'assets/js';
const dev = process.argv.includes('--dev');

const read = (f) => readFileSync(f, 'utf8');
const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);

// A heuristic guard: a top-level name used bare in a file that does not declare it would work only through the old shared
// global scope, and fail once each file has its own. Names declared in several files (UI, useState...) are skipped.
function crossFileNames() {
  const decl = {};
  const re = /^(?:async\s+)?(?:function\*?|const|let|var|class)\s+([A-Za-z_$][\w$]*)/gm;
  for (const f of FILES) { let m; const src = read(f); while ((m = re.exec(src))) (decl[m[1]] = decl[m[1]] || []).push(f); }
  const warn = [];
  for (const [name, files] of Object.entries(decl)) {
    if (files.length > 1 || name.length < 4) continue;
    // used as a call, or as a JSX element: that cannot be plain text
    const use = new RegExp('(?<![.\\w$])' + name.replace(/\$/g, '\\$') + '\\s*\\(|<' + name.replace(/\$/g, '\\$') + '[\\s/>]');
    const local = new RegExp('(?:const|let|var|function)\\s+' + name.replace(/\$/g, '\\$') + '\\b');   // the using file has its own local of that name
    for (const f of FILES) {
      if (f === files[0]) continue;
      const code = read(f).replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      if (use.test(code) && !local.test(code)) warn.push(`${name} (declared in ${files[0]}) is used in ${f}`);
    }
  }
  return warn;
}

async function buildProduction() {
  const parts = [];
  for (const f of FILES) {
    const src = read(f);
    const { code } = await transform(src, { loader: f.endsWith('.jsx') ? 'jsx' : 'js', jsx: 'transform', target: 'es2019', sourcefile: f, legalComments: 'none' });
    parts.push(`(function(){\n${code}\n})();`);
  }
  const { code: app } = await transform(parts.join('\n'), { minify: true, target: 'es2019', legalComments: 'none' });
  const vendor = VENDOR.map(read).join('\n;\n');

  mkdirSync(OUT, { recursive: true });
  for (const f of readdirSync(OUT)) if (/^(app|vendor)\.[0-9a-f]+\.js$/.test(f)) unlinkSync(`${OUT}/${f}`);
  const appName = `app.${hash(app)}.js`, vendorName = `vendor.${hash(vendor)}.js`;
  writeFileSync(`${OUT}/${appName}`, app);
  writeFileSync(`${OUT}/${vendorName}`, vendor);

  const sizes = (label, s) => console.log(`  ${label.padEnd(26)} ${kb(Buffer.byteLength(s)).padStart(9)}   gzip ${kb(gzipSync(s).length).padStart(8)}`);
  console.log('Production build');
  sizes(appName, app); sizes(vendorName, vendor);
  return {
    head: `<script defer src="${OUT}/${vendorName}"></script>\n<script defer src="${OUT}/${appName}"></script>`,
    body: '<!-- the app is loaded from the head (deferred) -->',
  };
}

function devBlocks() {
  console.log('Development build: Babel in the browser, sources loaded directly');
  const babel = '<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>';
  const head = VENDOR.map((f) => `<script src="${f}"></script>`).join('\n') + '\n' + babel;
  const body = FILES.map((f) => (f.endsWith('.jsx') ? `<script type="text/babel" src="${f}"></script>` : `<script src="${f}"></script>`)).join('\n');
  return { head, body };
}

const warnings = crossFileNames();
if (warnings.length) { console.warn('Check these (a name used in a file that does not declare it):\n  ' + warnings.join('\n  ')); }
const blocks = dev ? devBlocks() : await buildProduction();

let html = read('index.html');
const fill = (name, text) => {
  const re = new RegExp(`(<!-- build:${name}:start -->)[\\s\\S]*?(<!-- build:${name}:end -->)`);
  if (!re.test(html)) throw new Error(`index.html has no build:${name} markers`);
  html = html.replace(re, `$1\n${text}\n$2`);
};
fill('head', blocks.head);
fill('body', blocks.body);
writeFileSync('index.html', html);
console.log('index.html updated (' + (dev ? 'dev' : 'production') + ').');
