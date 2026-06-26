const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../downloads/index.html');
console.log('File path:', filePath);
console.log('Exists:', fs.existsSync(filePath));

if (fs.existsSync(filePath)) {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log('Length:', content.length);
  console.log('First 200 chars:', content.slice(0, 200));
}
