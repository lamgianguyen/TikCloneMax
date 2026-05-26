// Backfill the FK + ChannelId index that the initial schema missed on
// RevokedTokens. Two problems on the original table:
//
//   1. No FK to Channels(ChannelId) → deleting a Channel left orphan revoke
//      rows around until they aged out via ExpiresAt.
//   2. No index on ChannelId → "revoke all tokens for channel X" did a full
//      table scan, which gets painful once the table accumulates rows.
//
// SQLite cannot ALTER TABLE ADD CONSTRAINT FOREIGN KEY directly, so the
// supported workaround is the well-known rename-create-copy-drop dance:
// rename the existing table, create the new one with the FK in place, copy
// rows over, then drop the old table. The Jti unique constraint and the
// ExpiresAt index get recreated as part of that.

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  // foreign_keys must be OFF during the swap so the temporary state with
  // both the old and new tables present does not trip a constraint check.
  // PRAGMA foreign_keys cannot run inside a transaction in SQLite, so do
  // the rebuild outside of knex.transaction.
  await knex.raw('PRAGMA foreign_keys = OFF');
  try {
    await knex.raw('ALTER TABLE "RevokedTokens" RENAME TO "RevokedTokens_old"');

    await knex.schema.createTable('RevokedTokens', (t) => {
      t.increments('Id').primary();
      t.text('Jti').notNullable();
      t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
      t.dateTime('RevokedAt').notNullable();
      t.dateTime('ExpiresAt').notNullable();
    });

    await knex.raw(`
      INSERT INTO "RevokedTokens" ("Id","Jti","ChannelId","RevokedAt","ExpiresAt")
      SELECT "Id","Jti","ChannelId","RevokedAt","ExpiresAt" FROM "RevokedTokens_old"
    `);

    await knex.schema.dropTableIfExists('RevokedTokens_old');

    await knex.raw('CREATE UNIQUE INDEX "IX_RevokedTokens_Jti" ON "RevokedTokens"("Jti")');
    await knex.raw('CREATE INDEX "IX_RevokedTokens_ExpiresAt" ON "RevokedTokens"("ExpiresAt")');
    await knex.raw('CREATE INDEX "IX_RevokedTokens_ChannelId" ON "RevokedTokens"("ChannelId")');
  } finally {
    await knex.raw('PRAGMA foreign_keys = ON');
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  // Reverse the rebuild — drop the FK by recreating without it. Index on
  // ChannelId goes away with the table.
  await knex.raw('PRAGMA foreign_keys = OFF');
  try {
    await knex.raw('ALTER TABLE "RevokedTokens" RENAME TO "RevokedTokens_old"');

    await knex.schema.createTable('RevokedTokens', (t) => {
      t.increments('Id').primary();
      t.text('Jti').notNullable();
      t.integer('ChannelId').notNullable();
      t.dateTime('RevokedAt').notNullable();
      t.dateTime('ExpiresAt').notNullable();
    });

    await knex.raw(`
      INSERT INTO "RevokedTokens" ("Id","Jti","ChannelId","RevokedAt","ExpiresAt")
      SELECT "Id","Jti","ChannelId","RevokedAt","ExpiresAt" FROM "RevokedTokens_old"
    `);

    await knex.schema.dropTableIfExists('RevokedTokens_old');

    await knex.raw('CREATE UNIQUE INDEX "IX_RevokedTokens_Jti" ON "RevokedTokens"("Jti")');
    await knex.raw('CREATE INDEX "IX_RevokedTokens_ExpiresAt" ON "RevokedTokens"("ExpiresAt")');
  } finally {
    await knex.raw('PRAGMA foreign_keys = ON');
  }
};
