using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TikFinityBackend.Migrations
{
    /// <inheritdoc />
    public partial class AuthHardening_2026_04_22 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Channels_Email",
                table: "Channels");

            migrationBuilder.AddColumn<int>(
                name: "FailedLoginCount",
                table: "Channels",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAt",
                table: "Channels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LastLoginIp",
                table: "Channels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LockedUntil",
                table: "Channels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "RevokedTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Jti = table.Column<string>(type: "TEXT", maxLength: 64, nullable: false),
                    ChannelId = table.Column<int>(type: "INTEGER", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RevokedTokens", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Channels_Email",
                table: "Channels",
                column: "Email",
                unique: true,
                filter: "Email <> ''");

            migrationBuilder.CreateIndex(
                name: "IX_RevokedTokens_ExpiresAt",
                table: "RevokedTokens",
                column: "ExpiresAt");

            migrationBuilder.CreateIndex(
                name: "IX_RevokedTokens_Jti",
                table: "RevokedTokens",
                column: "Jti",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RevokedTokens");

            migrationBuilder.DropIndex(
                name: "IX_Channels_Email",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "FailedLoginCount",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "LastLoginAt",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "LastLoginIp",
                table: "Channels");

            migrationBuilder.DropColumn(
                name: "LockedUntil",
                table: "Channels");

            migrationBuilder.CreateIndex(
                name: "IX_Channels_Email",
                table: "Channels",
                column: "Email");
        }
    }
}
