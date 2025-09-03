// scripts/fetch_ooh.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const { parseStringPromise } = require('xml2js');

const URL = 'https://www.bls.gov/ooh/xml-compilation.xml';

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  const outPath = path.join(process.cwd(), 'public', 'data', 'ooh.json');
  try {
    console.log('[NOVA] Fetching OOH XML…');
    const xml = await download(URL);
    console.log('[NOVA] Parsing…');
    const parsed = await parseStringPromise(xml, { explicitArray: true, mergeAttrs: true, trim: true });

    // Walk and collect likely occupation nodes
    const occupations = [];
    function walk(node) {
      if (!node || typeof node !== 'object') return;
      for (const key of Object.keys(node)) {
        const val = node[key];
        if (Array.isArray(val)) {
          val.forEach(child => {
            const title = child?.title?.[0] || child?.name?.[0] || null;
            const soc = child?.soc?.[0] || child?.soc_code?.[0] || null;
            const url = child?.url?.[0] || child?.link?.[0] || null;
            const summary = child?.summary?.[0] || child?.brief?.[0] || child?.intro?.[0] || null;
            const median_pay = child?.wages?.[0]?.median?.[0] || child?.pay?.[0]?.median?.[0] || null;
            if (title) occupations.push({ title, soc, url, summary, median_pay });
            walk(child);
          });
        }
      }
    }
    walk(parsed);

    // Deduplicate by title
    const seen = new Set();
    const compact = [];
    for (const o of occupations) {
      const key = (o.title || '').toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      compact.push(o);
    }

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(compact, null, 0));
    console.log('[NOVA] Wrote', outPath, 'items:', compact.length);
  } catch (err) {
    console.error('[NOVA] OOH fetch failed — keeping bundled fallback:', err.message);
    // DO NOT overwrite the bundled fallback. Exit without error so deploy continues.
    process.exit(0);
  }
})();