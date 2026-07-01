const fs = require('fs');
const path = require('path');

function normalize(s) {
  return s
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const logosDir = path.join(__dirname, '..', 'public', 'logos');
const outFile = path.join(logosDir, 'mapping.json');

if (!fs.existsSync(logosDir)) {
  console.error('Logos directory not found:', logosDir);
  process.exit(1);
}

const files = fs.readdirSync(logosDir).filter((f) => fs.statSync(path.join(logosDir, f)).isFile());
const mapping = {};

files.forEach((f) => {
  const ext = path.extname(f).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif'].includes(ext)) return;
  const name = path.basename(f, ext);
  const key = normalize(name);
  mapping[key] = '/logos/' + f;
});

fs.writeFileSync(outFile, JSON.stringify(mapping, null, 2), 'utf8');
console.log('Wrote', outFile, 'with', Object.keys(mapping).length, 'entries');
