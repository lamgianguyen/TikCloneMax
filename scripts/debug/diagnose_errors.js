/**
 * Script chẩn đoán lỗi: Phân tích log và tải file thiếu
 * - Đọc missing_assets.log
 * - Lọc ra các URL tikfinity.zerody.one (bỏ google, analytics, cdn-cgi)
 * - Kiểm tra file nào đã có local, file nào thiếu
 * - Thử tải các file thiếu về
 * - Ghi báo cáo ra file report_loi.txt
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
const TIKFINITY_ORIGIN = 'https://tikfinity.zerody.one';

// Các pattern rác bỏ qua
const junkPatterns = [
    'google.com', 'googleadservices', 'google-analytics', 'googleapis.com',
    'sentry', 'cdn-cgi', '2l68', 'log_event', 'pagead', 'doubleclick',
    'facebook', 'fbcdn', 'tiktok.com', 'youtube.com'
];

function isJunk(url) {
    for (const p of junkPatterns) {
        if (url.includes(p)) return true;
    }
    return false;
}

function fetchFile(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return fetchFile(res.headers.location).then(resolve).catch(reject);
            }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: Buffer.concat(chunks)
                });
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log('=== BẮT ĐẦU CHẨN ĐOÁN LỖI ===\n');

    // 1. Đọc missing_assets.log
    let missingUrls = [];
    try {
        const raw = fs.readFileSync('missing_assets.log', 'utf8');
        // Tách bằng \\n (literal) hoặc newline
        missingUrls = raw.split(/\\\\n|\n/).map(s => s.trim()).filter(Boolean);
    } catch (e) {
        console.log('Không tìm thấy missing_assets.log');
    }

    // 2. Lọc chỉ lấy URL tikfinity
    const tikfinityUrls = [...new Set(missingUrls.filter(u => u.includes('tikfinity.zerody.one') && !isJunk(u)))];

    console.log(`Tổng URL trong log: ${missingUrls.length}`);
    console.log(`URL tikfinity (không rác): ${tikfinityUrls.length}\n`);

    const report = [];
    report.push('# BÁO CÁO LỖI - CÁC FILE THIẾU');
    report.push(`Thời gian: ${new Date().toLocaleString('vi-VN')}`);
    report.push(`Tổng URL phân tích: ${tikfinityUrls.length}`);
    report.push('');

    const daTai = [];
    const taiOk = [];
    const taiLoi = [];
    const khongCanTai = [];

    for (const url of tikfinityUrls) {
        try {
            const parsedUrl = new URL(url);
            let urlPath = parsedUrl.pathname;

            // Bỏ query params cho tên file local
            const safeUrlPath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
            const localPath = path.join(DOWNLOAD_DIR, safeUrlPath);

            // Kiểm tra file đã có chưa
            if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
                const size = fs.statSync(localPath).size;
                daTai.push({ url, localPath, size });
                continue;
            }

            // Thử tải về
            console.log(`⬇️  Đang tải: ${urlPath}...`);
            try {
                const result = await fetchFile(url);

                if (result.statusCode === 200 && result.body.length > 0) {
                    // Tạo thư mục
                    const dir = path.dirname(localPath);
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                    fs.writeFileSync(localPath, result.body);
                    console.log(`  ✅ Đã tải: ${urlPath} (${result.body.length} bytes)`);
                    taiOk.push({ url, localPath, size: result.body.length, status: result.statusCode });
                } else {
                    console.log(`  ❌ Lỗi ${result.statusCode}: ${urlPath}`);
                    taiLoi.push({ url, localPath, status: result.statusCode, reason: `HTTP ${result.statusCode}` });
                }
            } catch (fetchErr) {
                console.log(`  ❌ Lỗi mạng: ${urlPath} - ${fetchErr.message}`);
                taiLoi.push({ url, localPath, status: 0, reason: fetchErr.message });
            }
        } catch (e) {
            console.log(`  ⚠️ URL không hợp lệ: ${url}`);
        }
    }

    // 3. Tạo báo cáo
    report.push('---');
    report.push(`## ĐÃ CÓ SẴN LOCAL (${daTai.length} file)`);
    for (const f of daTai) {
        report.push(`  ✅ ${f.url}`);
        report.push(`     → ${f.localPath} (${f.size} bytes)`);
    }

    report.push('');
    report.push(`## VỪA TẢI THÀNH CÔNG (${taiOk.length} file)`);
    for (const f of taiOk) {
        report.push(`  ✅ ${f.url}`);
        report.push(`     → ${f.localPath} (${f.size} bytes)`);
    }

    report.push('');
    report.push(`## KHÔNG TẢI ĐƯỢC (${taiLoi.length} file) ← CẦN FIX THỦ CÔNG`);
    for (const f of taiLoi) {
        report.push(`  ❌ ${f.url}`);
        report.push(`     Lý do: ${f.reason}`);
        report.push(`     Đường dẫn local cần tạo: ${f.localPath}`);
    }

    // 4. Kiểm tra thêm các widget HTML cần thiết
    report.push('');
    report.push('---');
    report.push('## KIỂM TRA CÁC WIDGET OVERLAY');

    const widgetNames = [
        'coinjar', 'coinmatch', 'streambuddies', 'chat', 'gifts', 'userinfo',
        'commandinfo', 'carousel', 'myactions', 'wheel', 'topgifter', 'topliker',
        'coindrop', 'timer', 'songrequests', 'viewercount', 'ranking',
        'socialmediarotator', 'firework', 'emojify', 'transactionviewer',
        'likefountain', 'fallingsnow', 'activity-feed', 'wheelofactions', 'cannon', 'goal'
    ];

    for (const name of widgetNames) {
        const widgetPath = path.join(DOWNLOAD_DIR, 'widget', name);
        const exists = fs.existsSync(widgetPath);
        const isFile = exists && fs.statSync(widgetPath).isFile();
        const isDir = exists && fs.statSync(widgetPath).isDirectory();

        if (isFile) {
            const size = fs.statSync(widgetPath).size;
            const head = fs.readFileSync(widgetPath, 'utf8').substring(0, 50).trim();
            const isHtml = head.toLowerCase().startsWith('<!doctype') || head.toLowerCase().startsWith('<html');
            report.push(`  ${isHtml ? '✅' : '⚠️'} widget/${name} (${size} bytes, ${isHtml ? 'HTML OK' : 'KHÔNG PHẢI HTML: ' + head.substring(0, 30)})`);
        } else if (isDir) {
            report.push(`  📁 widget/${name}/ (thư mục, cần kiểm tra index.html bên trong)`);
        } else {
            report.push(`  ❌ widget/${name} — CHƯA CÓ, cần tải về`);
            // Thử tải
            const widgetUrl = `${TIKFINITY_ORIGIN}/widget/${name}?cid=2228412&preview=1`;
            try {
                console.log(`⬇️  Đang tải widget: ${name}...`);
                const result = await fetchFile(widgetUrl);
                if (result.statusCode === 200 && result.body.length > 0) {
                    fs.writeFileSync(widgetPath, result.body);
                    console.log(`  ✅ Đã tải widget: ${name} (${result.body.length} bytes)`);
                    report.push(`     → VỪA TẢI THÀNH CÔNG (${result.body.length} bytes)`);
                } else {
                    report.push(`     → KHÔNG TẢI ĐƯỢC (HTTP ${result.statusCode})`);
                }
            } catch (e) {
                report.push(`     → LỖI MẠNG: ${e.message}`);
            }
        }
    }

    // 5. Kiểm tra các JS bundle của Vue widgets
    report.push('');
    report.push('## KIỂM TRA VUE JS BUNDLES');

    const vueBundles = [
        'vue/dist/widgets/coin-jar/coin-jar.js',
        'vue/dist/widgets/coin-match/coin-match.js',
        'vue/dist/widgets/wheel-of-actions/wheel-of-actions.js',
        'vue/dist/widgets/social-media-rotator/social-media-rotator.js',
    ];

    for (const bundle of vueBundles) {
        const bundlePath = path.join(DOWNLOAD_DIR, bundle);
        if (fs.existsSync(bundlePath)) {
            const size = fs.statSync(bundlePath).size;
            report.push(`  ✅ ${bundle} (${size} bytes)`);
        } else {
            report.push(`  ❌ ${bundle} — THIẾU, đang tải...`);
            try {
                const result = await fetchFile(`${TIKFINITY_ORIGIN}/${bundle}`);
                if (result.statusCode === 200) {
                    const dir = path.dirname(bundlePath);
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                    fs.writeFileSync(bundlePath, result.body);
                    report.push(`     → VỪA TẢI THÀNH CÔNG (${result.body.length} bytes)`);
                } else {
                    report.push(`     → KHÔNG TẢI ĐƯỢC (HTTP ${result.statusCode})`);
                }
            } catch (e) {
                report.push(`     → LỖI MẠNG: ${e.message}`);
            }
        }
    }

    // 6. Kiểm tra các JS/CSS chung hay thiếu
    report.push('');
    report.push('## KIỂM TRA CÁC FILE JS/CSS CHUNG');

    const commonFiles = [
        'js/guard/obf/trc.js',
        'widget/sharedio/sharedio.js',
        'widget/socketioclient.js',
        'widget/mediawrapper.js',
        'widget/winwheel.min.js',
        'js/text-effects-integration.js',
        'js/text-effects-labels.js',
        'js/tts.js',
        'fa/css/all.min.css',
        'sounds/shortcut.mp3',
        'widget/img/gold_crown.svg',
        'widget/img/cannon.png',
        'widget/img/wheel_back.png',
        'widget/img/coin.gif',
        'widget/img/badges/1-place.png',
        'widget/img/badges/2-place.png',
        'widget/img/badges/3-place.png',
        'widget/sounds/coindrop.mp3',
        'widget/sounds/collect.mp3',
        'widget/sounds/tick.mp3',
        'widget/eventcarousel/index.html',
        'widget/eventcarousel/script.js',
        'assets/lotties/11438-starburst-animation.json',
        'widget/vite/src/heart-fountain/index.html',
        'widget/vite/assets/heartFountain-BnZsuEF4.js',
        'widget/vite/assets/modulepreload-polyfill-B5Qt9EMX.js',
        'widget/vite/assets/heartFountain-C_6knMMh.css',
        'widget/vite/assets/activityFeed-DsYkAilU.js',
    ];

    for (const file of commonFiles) {
        const filePath = path.join(DOWNLOAD_DIR, file);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const size = fs.statSync(filePath).size;
            report.push(`  ✅ ${file} (${size} bytes)`);
        } else {
            report.push(`  ❌ ${file} — THIẾU, đang tải...`);
            try {
                const result = await fetchFile(`${TIKFINITY_ORIGIN}/${file}`);
                if (result.statusCode === 200 && result.body.length > 0) {
                    const dir = path.dirname(filePath);
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                    fs.writeFileSync(filePath, result.body);
                    report.push(`     → VỪA TẢI THÀNH CÔNG (${result.body.length} bytes)`);
                } else {
                    report.push(`     → KHÔNG TẢI ĐƯỢC (HTTP ${result.statusCode})`);
                }
            } catch (e) {
                report.push(`     → LỖI MẠNG: ${e.message}`);
            }
        }
    }

    // 7. Kiểm tra các API mock
    report.push('');
    report.push('## KIỂM TRA CÁC API MOCK');

    const apiFiles = [
        { path: 'api/me', desc: 'Thông tin user' },
        { path: 'api/getAllGifts', desc: 'Danh sách gift' },
        { path: 'api/getAllGiftsCached', desc: 'Gift cached' },
        { path: 'api/getChannelEmotes', desc: 'Channel emotes' },
        { path: 'api/getTranslations', desc: 'Bản dịch' },
        { path: 'api/getSystemConfig', desc: 'Cấu hình hệ thống' },
        { path: 'api/logError', desc: 'Log lỗi' },
        { path: 'api/pro/setUpgradeIntent', desc: 'Upgrade intent' },
        { path: 'api/pro/tazapay/methods', desc: 'Phương thức thanh toán' },
        { path: 'api/rest/channeluser', desc: 'Channel user list' },
    ];

    for (const api of apiFiles) {
        const apiPath = path.join(DOWNLOAD_DIR, api.path);
        if (fs.existsSync(apiPath) && fs.statSync(apiPath).isFile()) {
            const size = fs.statSync(apiPath).size;
            const content = fs.readFileSync(apiPath, 'utf8').substring(0, 100);
            report.push(`  ✅ ${api.path} — ${api.desc} (${size} bytes)`);
        } else {
            report.push(`  ❌ ${api.path} — ${api.desc} — THIẾU, tạo mock...`);
            const dir = path.dirname(apiPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            // Tạo mock mặc định
            let mockData = '{}';
            if (api.path.includes('getAllGifts')) mockData = '[]';
            if (api.path.includes('getChannelEmotes')) mockData = '{"status":200,"message":"OK","emotes":[]}';
            if (api.path.includes('getTranslations')) mockData = '{}';
            if (api.path.includes('getSystemConfig')) mockData = '{"status":200,"config":{}}';
            if (api.path.includes('logError')) mockData = '{"status":"ok"}';
            if (api.path.includes('setUpgradeIntent')) mockData = '{"status":"ok"}';
            if (api.path.includes('tazapay/methods')) mockData = '{"methods":[]}';
            if (api.path.includes('channeluser')) mockData = '{"users":[],"total":0}';

            fs.writeFileSync(apiPath, mockData, 'utf8');
            report.push(`     → ĐÃ TẠO MOCK: ${mockData.substring(0, 80)}`);
        }
    }

    // Ghi báo cáo
    const reportText = report.join('\n');
    fs.writeFileSync('report_loi.txt', reportText, 'utf8');

    console.log('\n=== KẾT QUẢ ===');
    console.log(`Đã có sẵn: ${daTai.length}`);
    console.log(`Vừa tải OK: ${taiOk.length}`);
    console.log(`Không tải được: ${taiLoi.length}`);
    console.log(`\nBáo cáo chi tiết: report_loi.txt`);
}

main().catch(console.error);
