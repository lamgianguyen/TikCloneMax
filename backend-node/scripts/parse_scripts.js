const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../../downloads/index.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const regex = /<script\b[^>]*src="([^"]*)"/gi;
let match;
const scripts = [];
while ((match = regex.exec(content)) !== null) {
  scripts.push(match[1]);
}

console.log('Script files loaded in index.html:');
console.log(scripts);
