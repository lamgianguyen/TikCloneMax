const fs = require('fs');
const lines = fs.readFileSync('downloads/combo/app.js', 'utf8').split('\n');
const line = lines[17];
if (line) {
    const idx = 1024415 - 1;
    const snippet = line.substring(Math.max(0, idx - 1000), Math.min(line.length, idx + 1000));
    fs.writeFileSync('snippet.js', snippet);
}
