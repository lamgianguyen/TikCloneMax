// One-shot extractor: pulls each `var XXX = """ ... """;` injection block out
// of backend/Program.cs into a standalone text file under templates/.
//
// Rationale: BuildIndexHtml() injects ~4500 lines of JS/CSS strings into the
// served bundle. Retyping every byte into JS template literals would invite
// transcription bugs; instead we read the C# source verbatim and ship the
// payloads as plain text that the Node middleware concatenates at request
// time. Same strings, no manual edit needed when this runs.
//
// Re-run this whenever the C# Program.cs injection blocks change (until the
// C# backend is retired post-migration).

const fs = require('fs');
const path = require('path');

const PROGRAM_CS = path.resolve(__dirname, '..', '..', 'backend', 'Program.cs');
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'templates');

if (!fs.existsSync(PROGRAM_CS)) {
  console.error(`[extract] Program.cs not found at ${PROGRAM_CS}`);
  process.exit(1);
}
fs.mkdirSync(OUT_DIR, { recursive: true });

const src = fs.readFileSync(PROGRAM_CS, 'utf8');

// Each block: `    var NAME = """\n ... \n    """;`
// Note: some use `$$"""` (interpolated). For our purposes we want the raw text
// between triple-quotes; interpolation placeholders like `{{defaultChannelId}}`
// will be substituted at runtime by the Node middleware.
const re = /^[ \t]+var\s+([A-Za-z_]\w*)\s*=\s*\$?\$?"""\s*\r?\n([\s\S]*?)^[ \t]+"""\s*;/gm;
const blocks = [];
let m;
while ((m = re.exec(src))) {
  blocks.push({ name: m[1], content: m[2] });
}

if (blocks.length === 0) {
  console.error('[extract] no injection blocks found — check the regex against current Program.cs');
  process.exit(2);
}

for (const b of blocks) {
  // Strip the 4-space C# indent that was inside each raw string literal.
  // The C# raw string keeps internal indentation as-is, but every line shares
  // a leading "    " (matching the var declaration's indent). We chop it off.
  const lines = b.content.split('\n');
  const minIndent = lines
    .filter((l) => l.trim().length > 0)
    .reduce((min, l) => {
      const i = l.match(/^[ \t]*/)[0].length;
      return Math.min(min, i);
    }, Infinity);
  const stripped = lines
    .map((l) => (l.length >= minIndent ? l.slice(minIndent) : l))
    .join('\n')
    .replace(/\r\n/g, '\n');

  const outPath = path.join(OUT_DIR, `${b.name}.txt`);
  fs.writeFileSync(outPath, stripped, 'utf8');
  console.log(`[extract] ${b.name.padEnd(24)} ${stripped.length.toString().padStart(7)} bytes  → ${path.relative(process.cwd(), outPath)}`);
}

console.log(`\n[extract] done — ${blocks.length} blocks written to ${OUT_DIR}`);
