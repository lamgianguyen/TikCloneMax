/**
 * Script: Nhúng (inline) các Vue JS bundle trực tiếp vào widget HTML
 * 
 * Lý do: CDP Fetch interceptor KHÔNG THỂ bắt sub-resource requests
 * từ iframe được serve bằng Fetch.fulfillRequest (synthetic response).
 * Giải pháp: Thay <script src="/vue/dist/..."> bằng <script>...code...</script>
 */

const fs = require('fs');
const path = require('path');

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

// Map: widget HTML file -> Vue JS bundle path pattern
const widgetBundles = [
    { widget: 'widget/coinjar', scriptPattern: '/vue/dist/widgets/coin-jar/coin-jar.js' },
    { widget: 'widget/coinmatch', scriptPattern: '/vue/dist/widgets/coin-match/coin-match.js' },
    { widget: 'widget/wheelofactions', scriptPattern: '/vue/dist/widgets/wheel-of-actions/wheel-of-actions.js' },
    { widget: 'widget/socialmediarotator', scriptPattern: '/vue/dist/widgets/social-media-rotator/social-media-rotator.js' },
];

// Các file JS chung mà widget HTML load bằng relative path
const commonScripts = [
    { pattern: 'sharedio/sharedio.js', relativeTo: 'widget' },
    { pattern: 'socketioclient.js', relativeTo: 'widget' },
    { pattern: '/js/guard/obf/trc.js', relativeTo: '' },
    { pattern: '/js/text-effects-integration.js', relativeTo: '' },
    { pattern: '/js/text-effects-labels.js', relativeTo: '' },
    { pattern: '/js/tts.js', relativeTo: '' },
    { pattern: 'mediawrapper.js', relativeTo: 'widget' },
    { pattern: 'winwheel.min.js', relativeTo: 'widget' },
];

function inlineScript(html, scriptSrc, jsFilePath) {
    if (!fs.existsSync(jsFilePath)) {
        console.log(`  ⚠️ File không tồn tại: ${jsFilePath}`);
        return html;
    }

    const jsCode = fs.readFileSync(jsFilePath, 'utf8');

    // Tìm tag script chứa src này (có thể có type="module", crossorigin, etc.)
    // Pattern: <script ... src="...scriptSrc..." ...></script>
    const escapedSrc = scriptSrc.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
    const regex = new RegExp(`<script[^>]*src=["']([^"']*${escapedSrc}[^"']*)["'][^>]*>\\s*</script>`, 'i');

    const match = html.match(regex);
    if (match) {
        // Thay thế bằng inline script (bỏ type="module" vì code đã bundled)
        const inlineTag = `<script>\n${jsCode}\n</script>`;
        html = html.replace(match[0], inlineTag);
        console.log(`  ✅ Đã inline: ${scriptSrc} (${jsCode.length} bytes)`);
    } else {
        console.log(`  ⚠️ Không tìm thấy tag script cho: ${scriptSrc}`);
    }

    return html;
}

function processWidget(widgetRelPath, bundleSrcPattern) {
    const htmlPath = path.join(DOWNLOAD_DIR, widgetRelPath);

    if (!fs.existsSync(htmlPath)) {
        console.log(`❌ Widget không tồn tại: ${htmlPath}`);
        return;
    }

    console.log(`\n📝 Xử lý: ${widgetRelPath}`);

    // Backup
    const backupPath = htmlPath + '.backup';
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(htmlPath, backupPath);
        console.log(`  💾 Backup: ${backupPath}`);
    }

    let html = fs.readFileSync(htmlPath, 'utf8');

    // 1. Inline Vue JS bundle
    const bundleLocalPath = path.join(DOWNLOAD_DIR, bundleSrcPattern.startsWith('/') ? bundleSrcPattern.substring(1) : bundleSrcPattern);
    html = inlineScript(html, bundleSrcPattern, bundleLocalPath);

    // 2. Inline các script chung có trong HTML này
    for (const common of commonScripts) {
        if (html.includes(common.pattern)) {
            let localPath;
            if (common.pattern.startsWith('/')) {
                localPath = path.join(DOWNLOAD_DIR, common.pattern.substring(1));
            } else {
                localPath = path.join(DOWNLOAD_DIR, common.relativeTo, common.pattern);
            }
            html = inlineScript(html, common.pattern, localPath);
        }
    }

    // Ghi file đã inline
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`  ✅ Đã ghi: ${htmlPath}`);
}

// Xử lý tất cả widget
console.log('=== BẮT ĐẦU INLINE JS VÀO WIDGET HTML ===\n');

for (const { widget, scriptPattern } of widgetBundles) {
    processWidget(widget, scriptPattern);
}

// Kiểm tra thêm các widget khác có script kiểu /vue/dist/... không
console.log('\n\n=== KIỂM TRA CÁC WIDGET KHÁC ===');

const allWidgets = fs.readdirSync(path.join(DOWNLOAD_DIR, 'widget'));
for (const name of allWidgets) {
    const widgetPath = path.join(DOWNLOAD_DIR, 'widget', name);
    if (!fs.statSync(widgetPath).isFile()) continue;

    const content = fs.readFileSync(widgetPath, 'utf8');
    if (!content.startsWith('<!DOCTYPE') && !content.startsWith('<html') && !content.startsWith('<head')) continue;

    // Tìm các external script cần inline
    const scriptMatches = content.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi);
    const externalScripts = [];
    for (const m of scriptMatches) {
        const src = m[1];
        // Bỏ qua CDN bên ngoài
        if (src.includes('code.jquery.com') || src.includes('cdnjs.cloudflare.com') ||
            src.includes('cdn.jsdelivr') || src.includes('unpkg.com') ||
            src.includes('static.cloudflareinsights.com')) continue;
        externalScripts.push(src);
    }

    if (externalScripts.length > 0) {
        console.log(`\n  widget/${name}:`);
        for (const src of externalScripts) {
            let localPath;
            if (src.startsWith('/')) {
                localPath = path.join(DOWNLOAD_DIR, src.split('?')[0].substring(1));
            } else if (src.startsWith('http')) {
                continue; // Skip full URLs
            } else {
                localPath = path.join(DOWNLOAD_DIR, 'widget', src.split('?')[0]);
            }
            const exists = fs.existsSync(localPath);

            // Kiểm tra xem script đã được inline chưa (không có trong danh sách widgetBundles)
            const alreadyHandled = widgetBundles.some(wb => wb.widget === `widget/${name}`);

            if (!exists) {
                console.log(`    ❌ ${src} → THIẾU FILE: ${localPath}`);
            } else if (!alreadyHandled) {
                console.log(`    📌 ${src} → CẦN INLINE (${fs.statSync(localPath).size} bytes)`);
                // Auto-inline
                let html = fs.readFileSync(widgetPath, 'utf8');
                const backupPath = widgetPath + '.backup';
                if (!fs.existsSync(backupPath)) {
                    fs.copyFileSync(widgetPath, backupPath);
                }
                html = inlineScript(html, src, localPath);
                fs.writeFileSync(widgetPath, html, 'utf8');
            } else {
                console.log(`    ✅ ${src} → đã xử lý`);
            }
        }
    }
}

console.log('\n\n=== HOÀN TẤT ===');
console.log('Tất cả Vue JS bundle đã được nhúng trực tiếp vào HTML.');
console.log('Các file .backup đã được tạo để phục hồi nếu cần.');
