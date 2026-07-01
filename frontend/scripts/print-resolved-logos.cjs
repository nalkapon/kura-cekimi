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

function fetchSwiss() {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: process.env.PORT||5000, path: '/api/draw/swiss', method: 'POST', headers: {'Content-Type':'application/json'} }, (res) => {
      let b=''; res.on('data',c=>b+=c); res.on('end',()=>{ try{resolve(JSON.parse(b))}catch(e){reject(e)} });
    });
    req.on('error', reject);
    req.write(JSON.stringify({})); req.end();
  });
}

async function main(){
  const mappingPath = path.join(__dirname,'..','public','logos','mapping.json');
  let mapping = {};
  if (fs.existsSync(mappingPath)) mapping = JSON.parse(fs.readFileSync(mappingPath,'utf8'));

  const data = await fetchSwiss();
  const teams = data.teams || [];
  teams.forEach(t=>{
    const byPathRaw = t.path || null;
    let resolved;
    if (byPathRaw) {
      if (/^(https?:)?\/\//.test(byPathRaw) || byPathRaw.startsWith('/')) resolved = byPathRaw;
      else if (mapping[normalize(byPathRaw)]) resolved = mapping[normalize(byPathRaw)];
      else resolved = `/logos/${byPathRaw}.png`;
    } else if (mapping[normalize(t.name)]) {
      resolved = mapping[normalize(t.name)];
    } else if (t.id!=null) {
      resolved = `/logos/${t.id}.png`;
    } else {
      resolved = '(none)';
    }

    // hard override for Galatasaray by team name (after resolution)
    if (t.name && normalize(t.name).includes('galatasaray')) resolved = '/logos/galatasaray-logo-vector.png';
    console.log(`${t.id}\t${t.name}\t=> ${resolved}`);
  });
}

main().catch(e=>{ console.error(e); process.exit(1);} );
