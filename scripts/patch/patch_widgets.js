/**
 * Trực tiếp patch widget HTML: thay <script type="module" src="..."> bằng inline code
 * Đồng thời bỏ các export statement cuối file JS (vì không chạy dưới module context)
 */

const fs = require('fs');
const path = require('path');

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

function patchWidget(widgetFile, jsBundlePath) {
    const htmlPath = path.join(DOWNLOAD_DIR, widgetFile);
    const backupPath = htmlPath + '.original';

    // Đọc file backup nếu có, KHÔNG đọc file đã patch
    let sourceHtml;
    if (fs.existsSync(backupPath)) {
        sourceHtml = fs.readFileSync(backupPath, 'utf8');
        console.log(`  📂 Đọc từ backup: ${backupPath}`);
    } else {
        sourceHtml = fs.readFileSync(htmlPath, 'utf8');
        // Lưu backup gốc
        fs.writeFileSync(backupPath, sourceHtml, 'utf8');
        console.log(`  💾 Tạo backup gốc: ${backupPath}`);
    }

    // Đọc JS bundle
    const jsPath = path.join(DOWNLOAD_DIR, jsBundlePath);
    if (!fs.existsSync(jsPath)) {
        console.log(`  ❌ Thiếu JS bundle: ${jsPath}`);
        return;
    }
    let jsCode = fs.readFileSync(jsPath, 'utf8');

    // Bỏ export statement cuối file (vì ko chạy dưới module context)
    jsCode = jsCode.replace(/export\s*\{[\s\S]*?\}\s*;?\s*$/, '');

    // Tìm và thay thế tag script chứa bundle path
    // Ví dụ: <script type="module" crossorigin src="/vue/dist/widgets/coin-jar/coin-jar.js"></script>
    let patched = sourceHtml;

    // Tìm tất cả các dạng có thể
    const patterns = [
        // type="module" crossorigin src="..."
        new RegExp(`<script[^>]*type=["']module["'][^>]*src=["'][^"']*${path.basename(jsBundlePath).replace('.', '\\.')}[^"']*["'][^>]*>\\s*</script>`, 'i'),
        // src="..." type="module"
        new RegExp(`<script[^>]*src=["'][^"']*${path.basename(jsBundlePath).replace('.', '\\.')}[^"']*["'][^>]*type=["']module["'][^>]*>\\s*</script>`, 'i'),
        // just src="..." with the bundle name
        new RegExp(`<script[^>]*src=["'][^"']*${path.basename(jsBundlePath).replace('.', '\\.')}[^"']*["'][^>]*>\\s*</script>`, 'i'),
    ];

    let replaced = false;
    for (const regex of patterns) {
        const match = patched.match(regex);
        if (match) {
            console.log(`  🔍 Tìm thấy: ${match[0].substring(0, 100)}...`);
            patched = patched.replace(match[0], `<script>\n${jsCode}\n</script>`);
            replaced = true;
            break;
        }
    }

    if (!replaced) {
        console.log(`  ⚠️ Không tìm thấy script tag cho ${path.basename(jsBundlePath)}`);
        console.log(`  📋 Thêm inline script trước </head>`);
        patched = patched.replace('</head>', `<script>\n${jsCode}\n</script>\n</head>`);
    }

    // Inline các script local khác (sharedio, socketioclient, trc.js)
    const localScripts = [
        { src: 'sharedio/sharedio.js', local: 'widget/sharedio/sharedio.js' },
        { src: 'socketioclient.js', local: 'widget/socketioclient.js' },
        { src: '/js/guard/obf/trc.js', local: 'js/guard/obf/trc.js' },
    ];

    for (const ls of localScripts) {
        const lsPath = path.join(DOWNLOAD_DIR, ls.local);
        if (!fs.existsSync(lsPath)) continue;

        const escapedSrc = ls.src.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
        const regex = new RegExp(`<script[^>]*src=["'][^"']*${escapedSrc}[^"']*["'][^>]*>\\s*</script>`, 'i');
        const match = patched.match(regex);
        if (match) {
            const lsCode = fs.readFileSync(lsPath, 'utf8');
            patched = patched.replace(match[0], `<script>\n${lsCode}\n</script>`);
            console.log(`  ✅ Inlined: ${ls.src} (${lsCode.length} bytes)`);
        }
    }

    fs.writeFileSync(htmlPath, patched, 'utf8');
    console.log(`  ✅ Đã patch: ${htmlPath} (${patched.length} bytes)`);
}

console.log('=== PATCH WIDGET HTML FILES ===\n');

console.log('📝 Patching coinjar...');
patchWidget('widget/coinjar', 'vue/dist/widgets/coin-jar/coin-jar.js');

console.log('\n📝 Patching coinmatch...');
patchWidget('widget/coinmatch', 'vue/dist/widgets/coin-match/coin-match.js');

console.log('\n📝 Patching wheelofactions...');
patchWidget('widget/wheelofactions', 'vue/dist/widgets/wheel-of-actions/wheel-of-actions.js');

console.log('\n📝 Patching socialmediarotator...');
patchWidget('widget/socialmediarotator', 'vue/dist/widgets/social-media-rotator/social-media-rotator.js');

console.log('\n=== HOÀN TẤT ===');
