using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Praxis.Data.Migrations
{
    public partial class AddOrderLog : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CompanyNotified",
                table: "Orders",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "OrderLogs",
                columns: table => new
                {
                    OrderLogId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    OrderId = table.Column<int>(nullable: false),
                    OldStatus = table.Column<int>(nullable: false),
                    NewStatus = table.Column<int>(nullable: false),
                    ChangeDate = table.Column<DateTime>(nullable: false),
                    Notes = table.Column<string>(nullable: true),
                    CustomerNotified = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderLogs", x => x.OrderLogId);
                    table.ForeignKey(
                        name: "FK_OrderLogs_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderLogs_OrderId",
                table: "OrderLogs",
                column: "OrderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderLogs");

            migrationBuilder.DropColumn(
                name: "CompanyNotified",
                table: "Orders");
        }
    }
}
