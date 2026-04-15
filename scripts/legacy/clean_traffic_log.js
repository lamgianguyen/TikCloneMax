const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const LOG_FILE = path.join(__dirname, 'tikfinity_traffic.json');
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

// Các pattern rác cần loại bỏ
const junkPatterns = [
    '/2l68/ga/g/', // Google Analytics 
    'log_event',   // Log events
    '/cdn-cgi/',   // Cloudflare
    '.woff', '.ttf', // Font extensions if unwanted as "API", but we want to keep assets. Let's just filter explicit tracking.
    'google-analytics',
    'sentry'
];

function isJunk(urlStr) {
    for (const pattern of junkPatterns) {
        if (urlStr.includes(pattern)) return true;
    }
    return false;
}

function cleanLog() {
    if (!fs.existsSync(LOG_FILE)) {
        console.log('No traffic log found.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    let cleanedData = [];
    let removedDownloaded = 0;
    let removedJunk = 0;

    for (const entry of data) {
        try {
            const parsedUrl = new URL(entry.url);

            // Xóa rác
            if (isJunk(entry.url)) {
                removedJunk++;
                continue;
            }

            // Kiểm tra xem đã tải chưa
            const urlPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
            const localPath = path.join(DOWNLOAD_DIR, urlPath);

            // Nếu file đã nằm trong ổ cứng, thì coi như "đã down", xóa khỏi log
            if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
                removedDownloaded++;
                continue; // Bỏ qua, không đưa vào danh sách mới
            }

            // Giữ lại các request hợp lệ chưa down
            cleanedData.push(entry);

        } catch (e) {
            // Lỗi parse URL -> bỏ qua
        }
    }

    fs.writeFileSync(LOG_FILE, JSON.stringify(cleanedData, null, 2));

    console.log(`✅ Đã dọn dẹp file traffic log!`);
    console.log(`- Xóa ${removedJunk} request rác (Analytics, Sentry, v.v...)`);
    console.log(`- Xóa ${removedDownloaded} request đã có sẵn file trong thư mục downloads/`);
    console.log(`- Giữ lại ${cleanedData.length} request chưa tải.`);
}

cleanLog();
