const fs = require('fs');
const content = fs.readFileSync('downloads/js/lib-bundle.min.js', 'utf8');

const targetIdx = 217401;
console.log(content.substring(Math.max(0, targetIdx - 150), Math.min(content.length, targetIdx + 150)));
