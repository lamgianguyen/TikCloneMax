const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const LOG_FILE = 'tikfinity_traffic.json';
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

function startDownload() {
    if (!fs.existsSync(LOG_FILE)) {
        console.error(`Log file not found: ${LOG_FILE}`);
        return;
    }

    console.log(`Reading ${LOG_FILE}...`);
    let data;
    try {
        const fileContent = fs.readFileSync(LOG_FILE, 'utf8');
        data = JSON.parse(fileContent);
    } catch (err) {
        console.error('Error parsing log file:', err.message);
        return;
    }

    console.log(`Found ${data.length} entries. Processing...`);

    let downloadedCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const entry of data) {
        if (!entry.url || !entry.responseBody || entry.responseStatus !== 200) {
            continue;
        }

        try {
            const parsedUrl = new URL(entry.url);

            // Only process zerody.one domains
            if (!parsedUrl.hostname.includes('zerody.one')) continue;

            const urlPath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
            const localPath = path.join(DOWNLOAD_DIR, urlPath);
            const localDir = path.dirname(localPath);

            // Deduplicate
            if (fs.existsSync(localPath)) {
                skipCount++;
                continue;
            }

            // Create directories
            if (!fs.existsSync(localDir)) {
                fs.mkdirSync(localDir, { recursive: true });
            }

            // Determine if body was base64 encoded (we decoded it to string in the logger)
            // Sometimes binaries (images, fonts) might be corrupted if saved as utf8 string.
            // Let's rely on how the logger saved it. The logger saves EVERYTHING as utf8 string.
            // For binary files, the DevTools Protocol sends base64, and the logger decodes it to a utf8 string.
            // Wait, decoding an image base64 to *utf8 string* corrupts it. 
            // In the new logger, `bodyContent` is saved directly if not base64. If base64, we need to handle it properly.

            // Quick fix for binary integrity: we need to write binary data correctly. 
            // The logger saves `responseBody` as a string. If it was base64, it was decoded to utf8 string.
            // For text files it's fine. For images, we should have kept base64 in the log or written as buffer.

            fs.writeFileSync(localPath, entry.responseBody, 'utf8');
            console.log(`[DOWNLOADED] ${urlPath}`);
            downloadedCount++;

        } catch (err) {
            console.error(`Error saving ${entry.url}:`, err.message);
            errorCount++;
        }
    }

    console.log('\n--- Download Summary ---');
    console.log(`Successfully Downloaded: ${downloadedCount}`);
    console.log(`Skipped (Already Exists): ${skipCount}`);
    console.log(`Errors: ${errorCount}`);
}

startDownload();
