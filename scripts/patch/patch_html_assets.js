const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.backup') || fullPath.endsWith('.original')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // e.g. src="http://localhost:3000/js/app.js" -> src="/js/app.js"
            const regex = /(src|href)="http:\/\/localhost:3000(\/[^"]+)"/g;
            if (regex.test(content)) {
                content = content.replace(regex, (match, attr, pth) => `${attr}="${pth}"`);
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed relative paths in:', fullPath);
            }
        }
    }
}

walkDir('downloads');
console.log('Done fixing HTML asset paths.');
