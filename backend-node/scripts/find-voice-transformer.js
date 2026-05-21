// One-off bundle archaeology: find where /api/tts/voices response gets
// transformed into the modal's voices array. Looking for patterns like
// `data.voices.map`, `.data?.voices`, `.filter(v => v.provider...)`
const fs = require('fs');
const path = require('path');

const APP = path.resolve(__dirname, '..', '..', 'downloads', 'combo', 'app.js');
const t = fs.readFileSync(APP, 'utf8');

const cleanup = (s) =>
  s.replace(/\\x[0-9a-f]{2}/g, '?').replace(/_0x[0-9a-f]+/g, 'X');

const patterns = [
  '.data.voices',
  'voices.map',
  'voices.filter',
  'voices.forEach',
  '?.voices',
  '].voices',
  'aiVoiceId',
  'aiVoices',
  'singingVoices',
  'freeVoices',
];

for (const p of patterns) {
  let i = 0;
  let count = 0;
  while ((i = t.indexOf(p, i)) >= 0 && count < 3) {
    count++;
    const before = t.substring(Math.max(0, i - 3), i);
    if (before === "','" || before === "['") {
      i += p.length;
      continue;
    }
    console.log('=== ' + p + ' at ' + i + ' ===');
    console.log(cleanup(t.substring(Math.max(0, i - 200), i + 300)));
    console.log('---');
    i += p.length;
  }
  if (count) console.log('TOTAL ' + p + ':', count, '\n');
}
