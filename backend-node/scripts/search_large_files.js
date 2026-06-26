const fs = require('fs');
const path = require('path');

const files = [
  '../../downloads/js/lib-bundle.min.js',
  '../../downloads/combo/app.js',
  '../../downloads/combo/modules.js'
];

files.forEach(relPath => {
  const absPath = path.resolve(__dirname, relPath);
  if (!fs.existsSync(absPath)) {
    console.log('File does not exist:', relPath);
    return;
  }
  const content = fs.readFileSync(absPath, 'utf8');
  const index = content.indexOf('getScreenList');
  if (index !== -1) {
    console.log(`Found 'getScreenList' in ${relPath} at index ${index}`);
    // Print 100 characters around it
    console.log(content.slice(Math.max(0, index - 50), index + 100));
  } else {
    console.log(`Not found in ${relPath}`);
  }
});
