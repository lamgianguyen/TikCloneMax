const fs = require('fs');
const path = require('path');

const files = [
  '../../downloads/js/guard/obf/trc.js',
  '../../downloads/js/guard/obf/trcws.js'
];

files.forEach(relPath => {
  const absPath = path.resolve(__dirname, relPath);
  if (!fs.existsSync(absPath)) {
    console.log('File does not exist:', relPath);
    return;
  }
  const content = fs.readFileSync(absPath, 'utf8');
  if (content.includes('getScreenList')) {
    console.log(`Found 'getScreenList' in ${relPath}`);
  } else {
    console.log(`Not found in ${relPath}`);
  }
});
