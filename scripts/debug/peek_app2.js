const fs = require('fs');
const content = fs.readFileSync('downloads/combo/app.js', 'utf8');
let out = '';
[96977, 312668, 534330, 537841, 795995].forEach(idx => {
    out += '\n--- index ' + idx + ' ---\n';
    out += content.substring(Math.max(0, idx - 150), Math.min(content.length, idx + 150));
});
fs.writeFileSync('peek.log', out);
