const fs = require('fs');
const path = require('path');

const absPath = path.resolve(__dirname, '../../downloads/combo/app.js');
const content = fs.readFileSync(absPath, 'utf8');

const startIndex = 3222580;
console.log(content.slice(startIndex + 1500, startIndex + 4000));
