// /api/uploadFile, /api/uploadMedia, /api/upload, /api/rest/upload,
// /api/uploads/list, /api/uploads/delete, DELETE /api/uploads/:category/:file
//
// Direct port of `backend/Controllers/UploadController.cs`. Files are written
// to `downloads/uploads/<bucket>/<uuid>-<safe-name>.<ext>` so the static
// middleware mounted in index.js serves them back via `/uploads/...` paths.
//
// Security notes:
//   - 25 MB cap per file (mirrors Tikfinity Pro's documented limit)
//   - Extension whitelist by bucket (no .exe, .html, etc.)
//   - Filename sanitized to a-zA-Z0-9_- then UUID-prefixed
//   - Delete path is guarded against `../` traversal via path.resolve check

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const config = require('../config');
const logger = require('../logger');

const router = express.Router();

const MAX_BYTES = 25 * 1024 * 1024;

const ALLOWED = {
  sound: new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac']),
  // SECURITY (pre-release audit 2026-06-16): `.svg` REMOVED. An uploaded .svg with
  // an inline <script>, opened at /uploads/image/<f>.svg, runs JS in the app origin
  // → can read tf_login_token + hit same-origin destructive endpoints (verified live
  // Chromium). Avatars/gift images are raster — SVG not needed. /uploads serving also
  // sends nosniff + CSP sandbox (index.js) as defense-in-depth for any legacy .svg.
  image: new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']),
  video: new Set(['.mp4', '.webm', '.mov', '.m4v']),
  animation: new Set(['.json', '.lottie']),
};

function uploadsRoot() {
  return path.resolve(config.FRONTEND_PATH, 'uploads');
}

function resolveBucket(ext) {
  const lower = ext.toLowerCase();
  for (const [bucket, set] of Object.entries(ALLOWED)) {
    if (set.has(lower)) return bucket;
  }
  return null;
}

function normalizeCategory(category) {
  switch ((category || '').toLowerCase()) {
    case 'sound':
    case 'audio':
    case 'music':
      return 'sound';
    case 'image':
    case 'img':
    case 'picture':
      return 'image';
    case 'video':
    case 'movie':
    case 'clip':
      return 'video';
    case 'animation':
    case 'anim':
    case 'lottie':
      return 'animation';
    default:
      return 'misc';
  }
}

function sanitizeFilename(name) {
  const cleaned = [];
  for (const c of name) {
    if (c === '_' || c === '-' || /[a-zA-Z0-9]/.test(c)) {
      cleaned.push(c);
      if (cleaned.length >= 64) break;
    } else if (/\s/.test(c) && cleaned.length > 0 && cleaned[cleaned.length - 1] !== '_') {
      cleaned.push('_');
    }
  }
  return cleaned.length === 0 ? 'file' : cleaned.join('');
}

// multer disk storage that picks the bucket + safe name at write time so we
// never have an inflight half-named file.
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const ext = path.extname(file.originalname);
    const bucket = resolveBucket(ext);
    if (!bucket) return cb(new Error(`unsupported extension ${ext}`));
    const dir = path.join(uploadsRoot(), bucket);
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (err) {
      return cb(err);
    }
    file.tfBucket = bucket;
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const safe = sanitizeFilename(path.basename(file.originalname, ext));
    const uniqueName = `${crypto.randomUUID().replace(/-/g, '')}-${safe}${ext}`;
    file.tfUniqueName = uniqueName;
    cb(null, uniqueName);
  },
});

const uploader = multer({
  storage,
  limits: { fileSize: MAX_BYTES, files: 1 },
});

function handleUploadError(err, _req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ status: 413, error: 'file too large', maxBytes: MAX_BYTES });
    }
    return res.status(400).json({ status: 400, error: err.message });
  }
  if (err && /unsupported extension/.test(err.message)) {
    return res.status(400).json({ status: 400, error: err.message });
  }
  return next(err);
}

// POST /api/uploadFile, /api/uploadMedia, /api/upload, /api/rest/upload
for (const route of ['/uploadFile', '/uploadMedia', '/upload', '/rest/upload']) {
  router.post(route, uploader.single('file'), handleUploadError, (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ status: 400, error: 'no file' });

    const bucket = file.tfBucket || resolveBucket(path.extname(file.originalname)) || 'misc';
    const uniqueName = file.tfUniqueName || file.filename;
    const publicUrl = `/uploads/${bucket}/${uniqueName}`;
    logger.info(`[Upload] saved ${bucket}/${uniqueName} (${file.size} bytes)`);
    res.json({
      status: 200,
      message: 'OK',
      url: publicUrl,
      fileName: uniqueName,
      originalName: file.originalname,
      sizeBytes: file.size,
      category: bucket,
    });
  });
}

// GET /api/uploads/list?category=sound
router.get('/uploads/list', (req, res) => {
  const bucket = normalizeCategory(req.query.category || 'sound');
  const dir = path.join(uploadsRoot(), bucket);
  if (!fs.existsSync(dir)) return res.json({ status: 200, files: [] });

  try {
    const entries = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => {
        const full = path.join(dir, e.name);
        const st = fs.statSync(full);
        return {
          fileName: e.name,
          url: `/uploads/${bucket}/${e.name}`,
          sizeBytes: st.size,
          createdAt: st.birthtime.toISOString(),
        };
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 500);
    res.json({ status: 200, files: entries });
  } catch (err) {
    logger.error({ err, bucket }, '[Upload] list failed');
    res.status(500).json({ status: 500, error: 'list failed' });
  }
});

function deleteFile(category, fileName) {
  if (!category || !fileName) {
    return { status: 400, body: { status: 400, error: 'category + fileName required' } };
  }
  const bucket = normalizeCategory(category);
  const safeName = path.basename(fileName);
  if (safeName !== fileName) {
    return { status: 400, body: { status: 400, error: 'invalid filename' } };
  }
  const root = uploadsRoot();
  const target = path.resolve(root, bucket, safeName);
  if (!target.startsWith(root + path.sep)) {
    return { status: 400, body: { status: 400, error: 'invalid path' } };
  }
  if (fs.existsSync(target)) {
    try {
      fs.unlinkSync(target);
    } catch (err) {
      logger.warn({ err, target }, '[Upload] delete failed');
      return { status: 500, body: { status: 500, error: 'delete failed' } };
    }
  }
  return { status: 200, body: { status: 200 } };
}

router.delete('/uploads/:category/:fileName', (req, res) => {
  const result = deleteFile(req.params.category, req.params.fileName);
  res.status(result.status).json(result.body);
});

router.post('/uploads/delete', (req, res) => {
  const category = req.body?.category || req.body?.Category;
  const fileName = req.body?.fileName || req.body?.FileName;
  const result = deleteFile(category, fileName);
  res.status(result.status).json(result.body);
});

module.exports = router;
