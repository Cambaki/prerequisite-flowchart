const fs = require('fs');
const path = require('path');

const srcPublic = path.join(__dirname, '..', 'Public');
const dest = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(dest)) fs.mkdirSync(dest);

// copy index.html
const indexSrc = path.join(srcPublic, 'index.html');
const indexDest = path.join(dest, 'index.html');
let html = fs.readFileSync(indexSrc, 'utf8');
// Inject bundle script
html = html.replace('</body>', '  <script src="bundle.js"></script>\n</body>');
fs.writeFileSync(indexDest, html, 'utf8');

// copy static assets (if any)
const publicFiles = fs.readdirSync(srcPublic).filter(f => f !== 'index.html');
for (const f of publicFiles) {
  const s = path.join(srcPublic, f);
  const d = path.join(dest, f);
  fs.copyFileSync(s, d);
}

console.log('Copied public -> dist');
