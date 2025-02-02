using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mainApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixItinerary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Itineraries_AspNetUsers_ApplicationUserId",
                table: "Itineraries");

            migrationBuilder.DropIndex(
                name: "IX_Itineraries_ApplicationUserId",
                table: "Itineraries");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Itineraries");

            migrationBuilder.AlterColumn<string>(
                name: "Userid",
                table: "Itineraries",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Itineraries_Userid",
                table: "Itineraries",
                column: "Userid");

            migrationBuilder.AddForeignKey(
                name: "FK_Itineraries_AspNetUsers_Userid",
                table: "Itineraries",
                column: "Userid",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Itineraries_AspNetUsers_Userid",
                table: "Itineraries");

            migrationBuilder.DropIndex(
                name: "IX_Itineraries_Userid",
                table: "Itineraries");

            migrationBuilder.AlterColumn<string>(
                name: "Userid",
                table: "Itineraries",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Itineraries",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Itineraries_ApplicationUserId",
                table: "Itineraries",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Itineraries_AspNetUsers_ApplicationUserId",
                table: "Itineraries",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
