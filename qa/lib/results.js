// qa/lib/results.js — the Lỗi-Historian. Persists a run + auto-maintains a
// CLEARLY-DELIMITED block in TEST_STATUS.md (latest run) and FIXLOG.md
// (auto-detected failures). Only the marked block is rewritten — manual content
// above/below is never touched.

const fs = require('fs');
const path = require('path');

const TS_BEGIN = '<!-- QA-AUTO:BEGIN -->';
const TS_END = '<!-- QA-AUTO:END -->';
const FX_BEGIN = '<!-- QA-AUTO-FAILURES:BEGIN -->';
const FX_END = '<!-- QA-AUTO-FAILURES:END -->';

function ymd(d) {
  // YYYY-MM-DD HH:MM (local)
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
    d.getMinutes()
  )}`;
}

function replaceBlock(content, begin, end, block) {
  const b = content.indexOf(begin);
  const e = content.indexOf(end);
  if (b !== -1 && e !== -1 && e > b) {
    return content.slice(0, b) + block + content.slice(e + end.length);
  }
  // append a fresh block at EOF
  const sep = content.endsWith('\n') ? '\n' : '\n\n';
  return content + sep + block + '\n';
}

function writeJson(resultsDir, runId, payload) {
  try {
    fs.mkdirSync(resultsDir, { recursive: true });
    const file = path.join(resultsDir, `run-${runId}.json`);
    fs.writeFileSync(file, JSON.stringify(payload, null, 2));
    // also a stable latest.json
    fs.writeFileSync(path.join(resultsDir, 'latest.json'), JSON.stringify(payload, null, 2));
    return file;
  } catch (e) {
    return `(json write failed: ${e.message})`;
  }
}

function statusTable(run) {
  const rows = run.results
    .map((r) => {
      const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
      const ev = (r.evidence || '').replace(/\|/g, '\\|').slice(0, 120);
      return `| ${r.id} | ${r.area || ''} | ${icon} ${r.status} | ${ev} |`;
    })
    .join('\n');
  const p = run.summary;
  return [
    TS_BEGIN,
    '',
    `## 🤖 AUTO QA RUN — ${run.startedAt} (run ${run.runId})`,
    '',
    `> Tự sinh bởi \`qa/run-all.js\`. PASS=${p.pass} FAIL=${p.fail} SKIP=${p.skip} · backend ${
      run.backendUp ? 'UP' : 'DOWN'
    } · ${run.durationMs}ms. Block này bị GHI ĐÈ mỗi run — đừng sửa tay.`,
    '',
    '| # | Vùng | Status | Bằng chứng |',
    '|---|---|---|---|',
    rows,
    '',
    run.perf
      ? `**Perf:** ${JSON.stringify(run.perf)}`
      : '**Perf:** (không đo được — backend down hoặc non-Windows)',
    '',
    TS_END,
  ].join('\n');
}

function failuresBlock(run) {
  const fails = run.results.filter((r) => r.status === 'FAIL');
  if (!fails.length) {
    return [
      FX_BEGIN,
      '',
      `### 🤖 AUTO-DETECTED FAILURES — ${run.startedAt}`,
      '',
      `_Không có FAIL ở run ${run.runId}. ✅_`,
      '',
      FX_END,
    ].join('\n');
  }
  const lines = fails.map((r) => {
    const sev = r.severity || 'HIGH';
    return [
      `- **[${sev}] ${r.id}** (${r.area || ''}) — ${r.name || ''}`,
      `  - Symptom: ${(r.evidence || '').slice(0, 300)}`,
      r.gate ? `  - Gate ref: ${r.gate}` : '  - Gate ref: (none yet)',
      r.fixHint ? `  - Fix hint: ${r.fixHint}` : '  - Fix hint: (investigate — see qa module)',
    ].join('\n');
  });
  return [
    FX_BEGIN,
    '',
    `### 🤖 AUTO-DETECTED FAILURES — ${run.startedAt} (run ${run.runId})`,
    '',
    '> Tự sinh bởi `qa/run-all.js`. Mỗi FAIL = 1 strike (§6.1). Sau khi fix, ghi root-cause vào',
    '> entry FIXLOG thường (ngoài block này) rồi re-run để xác nhận PASS.',
    '',
    lines.join('\n'),
    '',
    FX_END,
  ].join('\n');
}

function persist(config, run) {
  const out = { jsonFile: null, testStatus: false, fixlog: false, errors: [] };
  out.jsonFile = writeJson(config.RESULTS_DIR, run.runId, run);

  try {
    let ts = fs.existsSync(config.TEST_STATUS)
      ? fs.readFileSync(config.TEST_STATUS, 'utf8')
      : '# TEST_STATUS\n';
    ts = replaceBlock(ts, TS_BEGIN, TS_END, statusTable(run));
    fs.writeFileSync(config.TEST_STATUS, ts);
    out.testStatus = true;
  } catch (e) {
    out.errors.push(`TEST_STATUS: ${e.message}`);
  }

  try {
    let fx = fs.existsSync(config.FIXLOG) ? fs.readFileSync(config.FIXLOG, 'utf8') : '# FIXLOG\n';
    fx = replaceBlock(fx, FX_BEGIN, FX_END, failuresBlock(run));
    fs.writeFileSync(config.FIXLOG, fx);
    out.fixlog = true;
  } catch (e) {
    out.errors.push(`FIXLOG: ${e.message}`);
  }

  return out;
}

module.exports = { persist, writeJson, ymd, TS_BEGIN, TS_END, FX_BEGIN, FX_END };
