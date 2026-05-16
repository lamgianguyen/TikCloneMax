// Channels row helpers.
//
// In EF Core terms this maps to AppDbContext.Channels — but instead of an ORM
// we keep handwritten prepared statements. The trade-off: a bit more code per
// table, but every query is visible and fast (no lazy-load surprises).

const db = require('../conn');

// Prepared statements compile lazily — first use triggers the compile, then
// they're cached for the lifetime of the process.
const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

/**
 * @typedef {object} Channel
 * @property {number} ChannelId
 * @property {string} ChannelName
 * @property {string} ChannelSignature
 * @property {string|null} OwnerUserId
 * @property {string|null} Sub
 * @property {string} Email
 * @property {string|null} GoogleId
 * @property {string|null} PasswordHash
 * @property {string|null} AvatarUrl
 * @property {string|null} AffId
 * @property {string|null} AgencyId
 * @property {number} ProfileId
 * @property {string} Locale
 * @property {number} IsChatbotApproved
 * @property {number} ChallengeRunning
 * @property {string|null} ChallengeName
 * @property {string} SignupAuthProvider
 * @property {string|null} ChallengeStartAt
 * @property {number} FailedLoginCount
 * @property {string|null} LastLoginAt
 * @property {string|null} LastLoginIp
 * @property {string|null} LockedUntil
 * @property {string} CreatedAt
 * @property {string} UpdatedAt
 */

/** @returns {Channel|undefined} */
function findById(channelId) {
  return stmt('findById', `SELECT * FROM "Channels" WHERE "ChannelId" = ? LIMIT 1`).get(channelId);
}

/** @returns {Channel|undefined} */
function findByEmail(email) {
  return stmt('findByEmail', `SELECT * FROM "Channels" WHERE "Email" = ? LIMIT 1`).get(email);
}

/** @returns {Channel|undefined} */
function findByName(name) {
  return stmt('findByName', `SELECT * FROM "Channels" WHERE "ChannelName" = ? LIMIT 1`).get(name);
}

/** @returns {Channel|undefined} the first channel by ascending id — the default channel on a single-user install */
function findDefault() {
  return stmt('findDefault', `SELECT * FROM "Channels" ORDER BY "ChannelId" ASC LIMIT 1`).get();
}

function listAll() {
  return stmt('listAll', `SELECT * FROM "Channels" ORDER BY "ChannelId" ASC`).all();
}

function updateProfileId(channelId, profileId) {
  const nowIso = new Date().toISOString();
  return stmt(
    'updateProfileId',
    `UPDATE "Channels" SET "ProfileId" = ?, "UpdatedAt" = ? WHERE "ChannelId" = ?`
  ).run(profileId, nowIso, channelId);
}

function updateAffId(channelId, affId) {
  const nowIso = new Date().toISOString();
  return stmt(
    'updateAffId',
    `UPDATE "Channels" SET "AffId" = ?, "UpdatedAt" = ? WHERE "ChannelId" = ?`
  ).run(affId, nowIso, channelId);
}

function updateLogin(channelId, ip) {
  const nowIso = new Date().toISOString();
  return stmt(
    'updateLogin',
    `UPDATE "Channels" SET "LastLoginAt" = ?, "LastLoginIp" = ?, "FailedLoginCount" = 0, "LockedUntil" = NULL, "UpdatedAt" = ? WHERE "ChannelId" = ?`
  ).run(nowIso, ip, nowIso, channelId);
}

function bumpFailedLogin(channelId, lockUntilIso) {
  const nowIso = new Date().toISOString();
  return stmt(
    'bumpFailedLogin',
    `UPDATE "Channels" SET "FailedLoginCount" = "FailedLoginCount" + 1, "LockedUntil" = ?, "UpdatedAt" = ? WHERE "ChannelId" = ?`
  ).run(lockUntilIso, nowIso, channelId);
}

/**
 * Insert a new channel. Returns the newly created channel id.
 *
 * @param {Partial<Channel>} fields
 * @returns {number}
 */
function create(fields) {
  const nowIso = new Date().toISOString();
  const row = {
    ChannelName: fields.ChannelName || 'user',
    ChannelSignature: fields.ChannelSignature || '',
    OwnerUserId: fields.OwnerUserId || null,
    Sub: fields.Sub || null,
    Email: fields.Email || '',
    GoogleId: fields.GoogleId || null,
    PasswordHash: fields.PasswordHash || null,
    AvatarUrl: fields.AvatarUrl || null,
    AffId: fields.AffId || null,
    AgencyId: fields.AgencyId || null,
    ProfileId: fields.ProfileId || 1,
    Locale: fields.Locale || 'VN',
    IsChatbotApproved: fields.IsChatbotApproved ? 1 : 0,
    ChallengeRunning: fields.ChallengeRunning ? 1 : 0,
    ChallengeName: fields.ChallengeName || null,
    SignupAuthProvider: fields.SignupAuthProvider || 'local',
    ChallengeStartAt: fields.ChallengeStartAt || null,
    FailedLoginCount: fields.FailedLoginCount || 0,
    LastLoginAt: fields.LastLoginAt || null,
    LastLoginIp: fields.LastLoginIp || null,
    LockedUntil: fields.LockedUntil || null,
    CreatedAt: fields.CreatedAt || nowIso,
    UpdatedAt: fields.UpdatedAt || nowIso,
  };

  const result = stmt('create', `
    INSERT INTO "Channels"
      ("ChannelName","ChannelSignature","OwnerUserId","Sub","Email","GoogleId","PasswordHash",
       "AvatarUrl","AffId","AgencyId","ProfileId","Locale","IsChatbotApproved","ChallengeRunning",
       "ChallengeName","SignupAuthProvider","ChallengeStartAt","FailedLoginCount","LastLoginAt",
       "LastLoginIp","LockedUntil","CreatedAt","UpdatedAt")
    VALUES
      (@ChannelName,@ChannelSignature,@OwnerUserId,@Sub,@Email,@GoogleId,@PasswordHash,
       @AvatarUrl,@AffId,@AgencyId,@ProfileId,@Locale,@IsChatbotApproved,@ChallengeRunning,
       @ChallengeName,@SignupAuthProvider,@ChallengeStartAt,@FailedLoginCount,@LastLoginAt,
       @LastLoginIp,@LockedUntil,@CreatedAt,@UpdatedAt)
  `).run(row);

  return Number(result.lastInsertRowid);
}

module.exports = {
  findById,
  findByEmail,
  findByName,
  findDefault,
  listAll,
  updateProfileId,
  updateAffId,
  updateLogin,
  bumpFailedLogin,
  create,
};
