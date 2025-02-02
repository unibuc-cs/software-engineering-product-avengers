using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mainApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixCeva5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DepartureAirport",
                table: "Flights",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DepartureAirport",
                table: "Flights");
        }
    }
}
