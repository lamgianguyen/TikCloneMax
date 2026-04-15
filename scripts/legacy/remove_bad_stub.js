const fs = require('fs');
const path = require('path');

function walk(d) {
    if (!fs.existsSync(d)) return;
    const files = fs.readdirSync(d);
    for (const f of files) {
        const p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) {
            walk(p);
        } else if (/\.(html|backup|original)$/i.test(p)) {
            let c = fs.readFileSync(p, 'utf8');
            const target = "  if (typeof module === 'undefined') {\n     window.module = { exports: {} };\n  }";
            if (c.includes(target)) {
                c = c.replace(target, '');
                fs.writeFileSync(p, c);
                console.log('Removed bad stub from', p);
            } else {
                // Try a regex just in case
                const rx = /if\s*\(\s*typeof\s+module\s*===\s*['"]undefined['"]\s*\)\s*\{\s*window\.module\s*=\s*\{\s*exports:\s*\{\}\s*\}\s*;\s*\}/g;
                if (rx.test(c)) {
                    c = c.replace(rx, '');
                    fs.writeFileSync(p, c);
                    console.log('Removed bad stub via rx from', p);
                }
            }
        }
    }
}

walk(path.join(__dirname, 'downloads'));
