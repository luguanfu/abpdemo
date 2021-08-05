using Microsoft.EntityFrameworkCore.Migrations;

namespace TodoApp.Repository.Migrations
{
    public partial class init5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todo_Menu_Todo_Menu_MenuId",
                table: "Todo_Menu");

            migrationBuilder.DropIndex(
                name: "IX_Todo_Menu_MenuId",
                table: "Todo_Menu");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "Todo_User");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "Todo_User");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "Todo_User",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "Todo_User",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todo_Menu_MenuId",
                table: "Todo_Menu",
                column: "MenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_Todo_Menu_Todo_Menu_MenuId",
                table: "Todo_Menu",
                column: "MenuId",
                principalTable: "Todo_Menu",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
