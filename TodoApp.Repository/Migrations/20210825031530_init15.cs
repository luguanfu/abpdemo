using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TodoApp.Repository.Migrations
{
    public partial class init15 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "Todo_User",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantProjectId",
                table: "Todo_User",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "Todo_Product",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantProjectId",
                table: "Todo_Product",
                type: "uniqueidentifier",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Todo_User");

            migrationBuilder.DropColumn(
                name: "TenantProjectId",
                table: "Todo_User");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "TenantProjectId",
                table: "Todo_Product");
        }
    }
}
