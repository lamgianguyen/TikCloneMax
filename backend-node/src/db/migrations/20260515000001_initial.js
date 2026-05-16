// Initial schema — consolidates the three C# EF migrations plus the runtime
// `EnsureProfileColumns` ALTER TABLEs into one fresh schema. A new install of
// the Node backend builds the DB in one step; an existing install migrated
// from the C# backend keeps its data because table/column names match exactly.
//
// Source migrations being collapsed:
//   - 20260317022209_InitialCreate_SQLite (16 tables)
//   - 20260422094051_AuthHardening_2026_04_22 (Channels columns + RevokedTokens)
//   - 20260504041142_AddWebhooks (Webhooks table)
//   - Program.cs::EnsureProfileColumns (ProfileId on 5 tables + reindexed DynamicSettings)

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('Channels', (t) => {
    t.increments('ChannelId').primary();
    t.text('ChannelName').notNullable();
    t.text('ChannelSignature').notNullable().defaultTo('');
    t.text('OwnerUserId').nullable();
    t.text('Sub').nullable();
    t.text('Email').notNullable().defaultTo('');
    t.text('GoogleId').nullable();
    t.text('PasswordHash').nullable();
    t.text('AvatarUrl').nullable();
    t.text('AffId').nullable();
    t.text('AgencyId').nullable();
    t.integer('ProfileId').notNullable().defaultTo(1);
    t.text('Locale').notNullable().defaultTo('VN');
    t.boolean('IsChatbotApproved').notNullable().defaultTo(false);
    t.boolean('ChallengeRunning').notNullable().defaultTo(false);
    t.text('ChallengeName').nullable();
    t.text('SignupAuthProvider').notNullable().defaultTo('local');
    t.dateTime('ChallengeStartAt').nullable();
    // AuthHardening additions
    t.integer('FailedLoginCount').notNullable().defaultTo(0);
    t.dateTime('LastLoginAt').nullable();
    t.text('LastLoginIp').nullable();
    t.dateTime('LockedUntil').nullable();
    t.dateTime('CreatedAt').notNullable();
    t.dateTime('UpdatedAt').notNullable();
  });
  await knex.schema.raw('CREATE UNIQUE INDEX "IX_Channels_ChannelName" ON "Channels"("ChannelName")');
  await knex.schema.raw('CREATE UNIQUE INDEX "IX_Channels_Email" ON "Channels"("Email") WHERE "Email" <> \'\'');
  await knex.schema.raw('CREATE UNIQUE INDEX "IX_Channels_GoogleId" ON "Channels"("GoogleId") WHERE "GoogleId" IS NOT NULL');

  await knex.schema.createTable('Subscriptions', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.boolean('IsPro').notNullable().defaultTo(false);
    t.text('Plan').notNullable().defaultTo('free');
    t.boolean('Active').notNullable().defaultTo(false);
    t.dateTime('ProExpireAt').nullable();
    t.text('ProExpireSetBy').nullable();
    t.dateTime('CreatedAt').notNullable();
    t.dateTime('UpdatedAt').notNullable();
  });
  await knex.schema.raw('CREATE UNIQUE INDEX "IX_Subscriptions_ChannelId" ON "Subscriptions"("ChannelId")');

  await knex.schema.createTable('Profiles', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.text('Name').notNullable();
    t.integer('Sort').notNullable().defaultTo(0);
  });
  await knex.schema.raw('CREATE INDEX "IX_Profiles_ChannelId" ON "Profiles"("ChannelId")');

  // DynamicSettings — ProfileId baked in from the start (was added by runtime
  // ALTER in C# but we collapse here). Unique on (Channel, Profile, Key).
  await knex.schema.createTable('DynamicSettings', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.integer('ProfileId').notNullable().defaultTo(1);
    t.text('Key').notNullable();
    t.text('Value').notNullable().defaultTo('');
  });
  await knex.schema.raw('CREATE UNIQUE INDEX "IX_DynamicSettings_ChannelId_ProfileId_Key" ON "DynamicSettings"("ChannelId","ProfileId","Key")');

  await knex.schema.createTable('Actions', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.integer('ProfileId').notNullable().defaultTo(1);
    t.text('Name').notNullable();
    t.text('Type').notNullable();
    t.text('TriggerValue').nullable();
    t.text('ConfigJson').nullable();
    t.boolean('Enabled').notNullable().defaultTo(true);
    t.integer('Sort').notNullable().defaultTo(0);
    t.dateTime('CreatedAt').notNullable();
  });
  await knex.schema.raw('CREATE INDEX "IX_Actions_ChannelId" ON "Actions"("ChannelId")');

  await knex.schema.createTable('Sounds', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.integer('ProfileId').notNullable().defaultTo(1);
    t.text('Name').notNullable();
    t.text('FileName').nullable();
    t.text('Url').nullable();
    t.integer('Volume').notNullable().defaultTo(100);
    t.boolean('Enabled').notNullable().defaultTo(true);
    t.integer('Sort').notNullable().defaultTo(0);
    t.text('Category').nullable();
    t.dateTime('CreatedAt').notNullable();
  });
  await knex.schema.raw('CREATE INDEX "IX_Sounds_ChannelId" ON "Sounds"("ChannelId")');

  await knex.schema.createTable('ChannelModules', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.text('ModuleId').notNullable();
    t.text('Name').notNullable();
    t.boolean('Enabled').notNullable().defaultTo(true);
    t.integer('Sort').notNullable().defaultTo(0);
  });
  await knex.schema.raw('CREATE UNIQUE INDEX "IX_ChannelModules_ChannelId_ModuleId" ON "ChannelModules"("ChannelId","ModuleId")');

  await knex.schema.createTable('Transactions', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.text('TransactionId').notNullable();
    t.text('Type').notNullable();
    t.text('Amount').notNullable();
    t.text('Currency').notNullable().defaultTo('USD');
    t.text('Status').notNullable().defaultTo('completed');
    t.text('PaymentMethod').nullable();
    t.text('PaymentProvider').nullable();
    t.text('ExternalId').nullable();
    t.dateTime('CreatedAt').notNullable();
  });
  await knex.schema.raw('CREATE INDEX "IX_Transactions_ChannelId" ON "Transactions"("ChannelId")');
  await knex.schema.raw('CREATE UNIQUE INDEX "IX_Transactions_TransactionId" ON "Transactions"("TransactionId")');

  await knex.schema.createTable('Notifications', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.text('Subject').notNullable();
    t.text('Body').notNullable();
    t.text('Category').notNullable().defaultTo('general');
    t.text('DataJson').nullable();
    t.boolean('IsRead').notNullable().defaultTo(false);
    t.boolean('IsSeen').notNullable().defaultTo(false);
    t.dateTime('CreatedAt').notNullable();
    t.text('TransactionId').notNullable().defaultTo('');
  });
  await knex.schema.raw('CREATE INDEX "IX_Notifications_ChannelId" ON "Notifications"("ChannelId")');

  await knex.schema.createTable('Overlays', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.text('Name').notNullable();
    t.text('Type').notNullable();
    t.text('ConfigJson').nullable();
    t.boolean('Enabled').notNullable().defaultTo(true);
    t.integer('Sort').notNullable().defaultTo(0);
    t.dateTime('CreatedAt').notNullable();
  });
  await knex.schema.raw('CREATE INDEX "IX_Overlays_ChannelId" ON "Overlays"("ChannelId")');

  await knex.schema.createTable('Widgets', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.text('Name').notNullable();
    t.text('Type').notNullable();
    t.text('ConfigJson').nullable();
    t.boolean('Enabled').notNullable().defaultTo(true);
    t.integer('Sort').notNullable().defaultTo(0);
    t.dateTime('CreatedAt').notNullable();
  });
  await knex.schema.raw('CREATE INDEX "IX_Widgets_ChannelId" ON "Widgets"("ChannelId")');

  await knex.schema.createTable('ChatCommands', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.integer('ProfileId').notNullable().defaultTo(1);
    t.text('Command').notNullable();
    t.text('Response').notNullable();
    t.integer('Cooldown').notNullable().defaultTo(0);
    t.boolean('Enabled').notNullable().defaultTo(true);
    t.integer('Sort').notNullable().defaultTo(0);
    t.dateTime('CreatedAt').notNullable();
  });
  await knex.schema.raw('CREATE INDEX "IX_ChatCommands_ChannelId" ON "ChatCommands"("ChannelId")');

  await knex.schema.createTable('Goals', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.integer('ProfileId').notNullable().defaultTo(1);
    t.text('Name').notNullable();
    t.text('Type').notNullable();
    t.integer('Target').notNullable().defaultTo(0);
    t.integer('Current').notNullable().defaultTo(0);
    t.boolean('Enabled').notNullable().defaultTo(true);
    t.dateTime('CreatedAt').notNullable();
  });
  await knex.schema.raw('CREATE INDEX "IX_Goals_ChannelId" ON "Goals"("ChannelId")');

  await knex.schema.createTable('Timers', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.text('Name').notNullable();
    t.integer('IntervalSeconds').notNullable().defaultTo(60);
    t.text('ActionJson').nullable();
    t.boolean('Enabled').notNullable().defaultTo(true);
    t.integer('Sort').notNullable().defaultTo(0);
    t.dateTime('CreatedAt').notNullable();
  });
  await knex.schema.raw('CREATE INDEX "IX_Timers_ChannelId" ON "Timers"("ChannelId")');

  await knex.schema.createTable('Webhooks', (t) => {
    t.increments('Id').primary();
    t.integer('ChannelId').notNullable().references('ChannelId').inTable('Channels').onDelete('CASCADE');
    t.text('Name').notNullable();
    t.text('Url').notNullable();
    t.text('Method').notNullable().defaultTo('POST');
    t.text('EventTypesCsv').notNullable().defaultTo('');
    t.text('HeadersJson').nullable();
    t.text('TemplateJson').nullable();
    t.boolean('Enabled').notNullable().defaultTo(true);
    t.integer('RetryCount').notNullable().defaultTo(0);
    t.integer('TimeoutSeconds').notNullable().defaultTo(10);
    t.dateTime('CreatedAt').notNullable();
  });
  await knex.schema.raw('CREATE INDEX "IX_Webhooks_ChannelId" ON "Webhooks"("ChannelId")');

  await knex.schema.createTable('RevokedTokens', (t) => {
    t.increments('Id').primary();
    t.text('Jti').notNullable();
    t.integer('ChannelId').notNullable();
    t.dateTime('RevokedAt').notNullable();
    t.dateTime('ExpiresAt').notNullable();
  });
  await knex.schema.raw('CREATE UNIQUE INDEX "IX_RevokedTokens_Jti" ON "RevokedTokens"("Jti")');
  await knex.schema.raw('CREATE INDEX "IX_RevokedTokens_ExpiresAt" ON "RevokedTokens"("ExpiresAt")');
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  // Drop in reverse FK order. Cascade does the rest.
  const tables = [
    'RevokedTokens', 'Webhooks', 'Timers', 'Goals', 'ChatCommands', 'Widgets',
    'Overlays', 'Notifications', 'Transactions', 'ChannelModules', 'Sounds',
    'Actions', 'DynamicSettings', 'Profiles', 'Subscriptions', 'Channels',
  ];
  for (const t of tables) {
    await knex.schema.dropTableIfExists(t);
  }
};
