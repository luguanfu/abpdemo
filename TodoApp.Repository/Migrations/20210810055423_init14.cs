using Microsoft.EntityFrameworkCore.Migrations;

namespace TodoApp.Repository.Migrations
{
    public partial class init14 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Todo_Shop",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilterContent",
                table: "Todo_Shop",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilterContent",
                table: "Todo_PurchaseDetail",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilterContent",
                table: "Todo_Purchase",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilterContent",
                table: "Todo_ProductStock",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilterContent",
                table: "Todo_ProductProperty",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilterContent",
                table: "Todo_Product",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilterContent",
                table: "Todo_Menu",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilterContent",
                table: "Todo_AdjustStockDetail",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilterContent",
                table: "Todo_AdjustStock",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Todo_Shop");

            migrationBuilder.DropColumn(
                name: "FilterContent",
                table: "Todo_Shop");

            migrationBuilder.DropColumn(
                name: "FilterContent",
                table: "Todo_PurchaseDetail");

            migrationBuilder.DropColumn(
                name: "FilterContent",
                table: "Todo_Purchase");

            migrationBuilder.DropColumn(
                name: "FilterContent",
                table: "Todo_ProductStock");

            migrationBuilder.DropColumn(
                name: "FilterContent",
                table: "Todo_ProductProperty");

            migrationBuilder.DropColumn(
                name: "FilterContent",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "FilterContent",
                table: "Todo_Menu");

            migrationBuilder.DropColumn(
                name: "FilterContent",
                table: "Todo_AdjustStockDetail");

            migrationBuilder.DropColumn(
                name: "FilterContent",
                table: "Todo_AdjustStock");
        }
    }
}
