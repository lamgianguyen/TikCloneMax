const fs = require('fs');
const content = fs.readFileSync('downloads/js/lib-bundle.min.js', 'utf8');
const searchString = 'createPaymentUi';
let index = 0;

while ((index = content.indexOf(searchString, index)) !== -1) {
    const start = Math.max(0, index - 200);
    const end = Math.min(content.length, index + 200);
    console.log(`\n\n--- Math match at ${index} ---`);
    console.log(content.substring(start, end));
    index += searchString.length;
}
