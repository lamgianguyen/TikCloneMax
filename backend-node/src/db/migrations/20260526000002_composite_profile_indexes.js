// Composite (ChannelId, ProfileId) indexes for the per-profile tables.
//
// The initial schema only indexed ChannelId on Actions / Sounds / Goals /
// ChatCommands. `listByChannelProfile(channelId, profileId)` filters on both
// columns, so SQLite was hitting the ChannelId index and then linearly
// scanning every row for that channel to match the profile. With ~10 profiles
// per channel that's a 10x scan multiplier on every list call — the bundle
// hits these on every page load to render Actions / Sounds / Goals widgets.
//
// IF NOT EXISTS keeps this safe on installs that already have an equivalent
// hand-rolled index (no-op).

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.raw(
    'CREATE INDEX IF NOT EXISTS "IX_Actions_ChannelProfile" ON "Actions"("ChannelId","ProfileId")'
  );
  await knex.raw(
    'CREATE INDEX IF NOT EXISTS "IX_Sounds_ChannelProfile" ON "Sounds"("ChannelId","ProfileId")'
  );
  await knex.raw(
    'CREATE INDEX IF NOT EXISTS "IX_Goals_ChannelProfile" ON "Goals"("ChannelId","ProfileId")'
  );
  await knex.raw(
    'CREATE INDEX IF NOT EXISTS "IX_ChatCommands_ChannelProfile" ON "ChatCommands"("ChannelId","ProfileId")'
  );
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.raw('DROP INDEX IF EXISTS "IX_Actions_ChannelProfile"');
  await knex.raw('DROP INDEX IF EXISTS "IX_Sounds_ChannelProfile"');
  await knex.raw('DROP INDEX IF EXISTS "IX_Goals_ChannelProfile"');
  await knex.raw('DROP INDEX IF EXISTS "IX_ChatCommands_ChannelProfile"');
};
