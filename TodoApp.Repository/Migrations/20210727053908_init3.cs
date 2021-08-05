using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TodoApp.Repository.Migrations
{
    public partial class init3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "Todo_Product");

            migrationBuilder.AddColumn<Guid>(
                name: "CreateBy",
                table: "Todo_Product",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreateTime",
                table: "Todo_Product",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "DeleteBy",
                table: "Todo_Product",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeleteTime",
                table: "Todo_Product",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Todo_Product",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "OrderIndex",
                table: "Todo_Product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Stock",
                table: "Todo_Product",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "UpdateBy",
                table: "Todo_Product",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdateTime",
                table: "Todo_Product",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdateVersion",
                table: "Todo_Product",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreateBy",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "CreateTime",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "DeleteBy",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "DeleteTime",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "OrderIndex",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "Stock",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "UpdateBy",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "UpdateTime",
                table: "Todo_Product");

            migrationBuilder.DropColumn(
                name: "UpdateVersion",
                table: "Todo_Product");

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "Todo_Product",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "Todo_Product",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
