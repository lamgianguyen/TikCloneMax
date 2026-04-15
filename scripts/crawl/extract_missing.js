const fs = require('fs');
const readline = require('readline');
const https = require('https');
const path = require('path');

const logFile = 'debug.txt';
const results = new Set();
const missingLogFile = 'missing_assets.log';

if (fs.existsSync(missingLogFile)) {
    const lines = fs.readFileSync(missingLogFile, 'utf8').split('\n');
    lines.forEach(l => {
        if (l.trim() && l.trim().startsWith('http')) results.add(l.trim());
    })
}

// Lấy những URLs fail từ debug.txt
const lines = fs.readFileSync(logFile, 'utf8').split('\n');
lines.forEach(line => {
    if (line.includes('[FETCH]')) {
        const u = line.split('[FETCH]')[1].split(' (chưa có')[0].trim();
        results.add(`https://tikfinity.zerody.one${u}`);
    }
});

console.log("Missing assets found: ", results.size);
Array.from(results).forEach(v => console.log(v));
