const fs = require('fs');
const path = require('path');
const http = require('http');

function normalize(s) {
  if (s == null) return '';
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchSwiss() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: process.env.PORT || 5000,
        path: '/api/draw/swiss',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    req.write('{}');
    req.end();
  });
}

async function main() {
  const logosPath = path.join(__dirname, '..', 'public', 'logos', 'mapping.json');
  let mapping = {};
  if (fs.existsSync(logosPath)) {
    mapping = JSON.parse(fs.readFileSync(logosPath, 'utf8'));
  } else {
    console.error('mapping.json not found at', logosPath);
    process.exit(1);
  }

  let data;
  try {
    data = await fetchSwiss();
  } catch (e) {
    console.error('Failed to fetch swiss draw from backend:', e.message || e);
    process.exit(1);
  }

  const teams = data.teams || [];
  const total = teams.length;
  const matchedByName = [];
  const matchedById = [];
  const matchedByPath = [];
  const unmatched = [];

  teams.forEach((t) => {
    const idFallback = t.id != null ? `/logos/${t.id}.png` : null;
    if (t.path) {
      matchedByPath.push({ id: t.id, name: t.name, path: t.path });
      return;
    }
    const norm = normalize(t.name);
    if (mapping[norm]) {
      matchedByName.push({ id: t.id, name: t.name, logo: mapping[norm] });
      return;
    }
    // check fallback file exists
    const fileFallback = path.join(__dirname, '..', 'public', 'logos', `${t.id}.png`);
    if (fs.existsSync(fileFallback)) {
      matchedById.push({ id: t.id, name: t.name, logo: `/logos/${t.id}.png` });
      return;
    }
    unmatched.push({ id: t.id, name: t.name });
  });

  console.log('Total teams:', total);
  console.log('Matched by explicit path:', matchedByPath.length);
  console.log('Matched by name mapping:', matchedByName.length);
  console.log('Matched by id fallback file:', matchedById.length);
  console.log('Unmatched:', unmatched.length);
  if (unmatched.length) {
    console.log('\nUnmatched teams:');
    unmatched.forEach((u) => console.log('-', u.id, u.name));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
