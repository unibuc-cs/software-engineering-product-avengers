using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mainApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixTickets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActivityId",
                table: "Activities");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ActivityId",
                table: "Activities",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
