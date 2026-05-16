// Transaction log — gift purchases / Pro upgrades. Mostly insert-only.

const db = require('../conn');

const _stmts = {};
function stmt(key, sql) {
  if (!_stmts[key]) _stmts[key] = db.prepare(sql);
  return _stmts[key];
}

function listByChannel(channelId, { limit = 100 } = {}) {
  return stmt(
    'listByChannel',
    `SELECT * FROM "Transactions" WHERE "ChannelId" = ? ORDER BY "CreatedAt" DESC LIMIT ?`
  ).all(channelId, limit);
}

function findByTransactionId(transactionId) {
  return stmt(
    'findByTransactionId',
    `SELECT * FROM "Transactions" WHERE "TransactionId" = ? LIMIT 1`
  ).get(transactionId);
}

function create(row) {
  const nowIso = row.CreatedAt || new Date().toISOString();
  return stmt('create', `
    INSERT INTO "Transactions"
      ("ChannelId","TransactionId","Type","Amount","Currency","Status","PaymentMethod","PaymentProvider","ExternalId","CreatedAt")
    VALUES (?,?,?,?,?,?,?,?,?,?)
  `).run(
    row.ChannelId,
    row.TransactionId,
    row.Type || '',
    String(row.Amount ?? '0'),
    row.Currency || 'USD',
    row.Status || 'completed',
    row.PaymentMethod ?? null,
    row.PaymentProvider ?? null,
    row.ExternalId ?? null,
    nowIso
  );
}

module.exports = { listByChannel, findByTransactionId, create };
