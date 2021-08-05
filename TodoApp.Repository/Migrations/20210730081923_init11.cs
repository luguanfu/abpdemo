using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TodoApp.Repository.Migrations
{
    public partial class init11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DeleteFlag",
                table: "Todo_OperationLog",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "KeyId",
                table: "Todo_OperationLog",
                type: "uniqueidentifier",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeleteFlag",
                table: "Todo_OperationLog");

            migrationBuilder.DropColumn(
                name: "KeyId",
                table: "Todo_OperationLog");
        }
    }
}
