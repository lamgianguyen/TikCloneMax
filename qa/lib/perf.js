// qa/lib/perf.js — process RAM/CPU sampling + render-timing parse. Windows-first,
// dependency-free (uses tasklist + PowerShell Get-Process). Degrades to {} on
// non-Windows or if the commands are unavailable — never throws.

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');

const IS_WIN = process.platform === 'win32';
const NCORES = Math.max(1, os.cpus().length);

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', timeout: 15000, windowsHide: true });
  } catch (_) {
    return '';
  }
}

// RAM per image name (MB), summed across instances. { 'node.exe': 412, 'electron.exe': 1340 }
function memByImage(images = ['node.exe', 'electron.exe']) {
  const out = {};
  if (!IS_WIN) return out;
  for (const img of images) {
    const csv = sh(`tasklist /FI "IMAGENAME eq ${img}" /FO CSV /NH`);
    let kb = 0;
    let count = 0;
    csv
      .split(/\r?\n/)
      .filter((l) => l.includes(img))
      .forEach((line) => {
        // "node.exe","1234","Console","1","412,345 K"
        const m = line.match(/"([\d.,]+)\s*K"\s*$/);
        if (m) {
          kb += Number(m[1].replace(/[.,]/g, ''));
          count += 1;
        }
      });
    out[img] = { rssMb: Math.round(kb / 1024), instances: count };
  }
  return out;
}

// CPU% across node+electron over a sampling window. Reads cumulative CPU seconds
// twice (Get-Process .CPU) `windowMs` apart, divides delta by wall*cores.
function cpuSample(windowMs = 1500, images = ['node', 'electron']) {
  if (!IS_WIN) return { cpuPct: null, note: 'cpu sampling: windows only' };
  const names = images.join(',');
  const read = () => {
    const raw = sh(
      `powershell -NoProfile -Command "(Get-Process ${names} -ErrorAction SilentlyContinue | Measure-Object CPU -Sum).Sum"`
    ).trim();
    const v = Number(raw);
    return Number.isFinite(v) ? v : null;
  };
  const a = read();
  const t0 = Date.now();
  // busy-free wait
  execSync(`powershell -NoProfile -Command "Start-Sleep -Milliseconds ${windowMs}"`, {
    timeout: windowMs + 8000,
    windowsHide: true,
  });
  const b = read();
  const wall = (Date.now() - t0) / 1000;
  if (a == null || b == null || wall <= 0) return { cpuPct: null, note: 'cpu read failed' };
  const pct = ((b - a) / (wall * NCORES)) * 100;
  return { cpuPct: Math.max(0, Math.round(pct * 10) / 10), cores: NCORES, windowMs };
}

// Tail the last N lines of the backend log (cheap, reads tail bytes only).
function tailLog(logPath, n = 400) {
  try {
    const stat = fs.statSync(logPath);
    const size = stat.size;
    const readBytes = Math.min(size, 256 * 1024);
    const fd = fs.openSync(logPath, 'r');
    const buf = Buffer.alloc(readBytes);
    fs.readSync(fd, buf, 0, readBytes, size - readBytes);
    fs.closeSync(fd);
    return buf.toString('utf8').split(/\r?\n/).slice(-n);
  } catch (_) {
    return [];
  }
}

// Parse perf signals out of the log tail: STRETCH-DIAG render ms, error/crash
// markers, reload churn. Returns { stretchMs:[], errors:n, reloads:n }.
function parseLogSignals(lines) {
  const stretchMs = [];
  let errors = 0;
  let reloads = 0;
  let warns = 0;
  const errSamples = [];
  for (const l of lines) {
    const sm = l.match(/STRETCH-DIAG[^0-9]*(\d+)\s*ms/i);
    if (sm) stretchMs.push(Number(sm[1]));
    if (/\bERROR\b|Uncaught|TypeError|unhandled|ECONN|crash/i.test(l)) {
      errors += 1;
      if (errSamples.length < 8) errSamples.push(l.slice(0, 200));
    }
    if (/\bWARN\b/i.test(l)) warns += 1;
    if (/reload-guard|BLOCKED nav|location\.reload/i.test(l)) reloads += 1;
  }
  return { stretchMs, errors, warns, reloads, errSamples };
}

module.exports = { memByImage, cpuSample, tailLog, parseLogSignals, NCORES, IS_WIN };
