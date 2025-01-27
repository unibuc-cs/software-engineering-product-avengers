using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mainApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class ticketsReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserHousing_Housing_HousingId",
                table: "UserHousing");

            migrationBuilder.DropTable(
                name: "ItinerariesLocations");

            migrationBuilder.DropTable(
                name: "Itineraries");

            migrationBuilder.DropTable(
                name: "Locations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Housing",
                table: "Housing");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Flights");

            migrationBuilder.RenameTable(
                name: "Housing",
                newName: "Hotels");

            migrationBuilder.RenameColumn(
                name: "Seat",
                table: "Seats",
                newName: "SeatNumber");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Hotels",
                table: "Hotels",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Intineraries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalPrice = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Intineraries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Intineraries_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Location",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<int>(type: "int", nullable: false),
                    OpeningHours = table.Column<TimeOnly>(type: "time", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationLat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationLng = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Location", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ItineraryLocation",
                columns: table => new
                {
                    LocationsId = table.Column<int>(type: "int", nullable: false),
                    itinerariesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItineraryLocation", x => new { x.LocationsId, x.itinerariesId });
                    table.ForeignKey(
                        name: "FK_ItineraryLocation_Intineraries_itinerariesId",
                        column: x => x.itinerariesId,
                        principalTable: "Intineraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItineraryLocation_Location_LocationsId",
                        column: x => x.LocationsId,
                        principalTable: "Location",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Intineraries_UserId",
                table: "Intineraries",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ItineraryLocation_itinerariesId",
                table: "ItineraryLocation",
                column: "itinerariesId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserHousing_Hotels_HousingId",
                table: "UserHousing",
                column: "HousingId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserHousing_Hotels_HousingId",
                table: "UserHousing");

            migrationBuilder.DropTable(
                name: "ItineraryLocation");

            migrationBuilder.DropTable(
                name: "Intineraries");

            migrationBuilder.DropTable(
                name: "Location");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Hotels",
                table: "Hotels");

            migrationBuilder.RenameTable(
                name: "Hotels",
                newName: "Housing");

            migrationBuilder.RenameColumn(
                name: "SeatNumber",
                table: "Seats",
                newName: "Seat");

            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "Flights",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Housing",
                table: "Housing",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Itineraries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Time = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalPrice = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Itineraries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Itineraries_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Locations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationLat = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationLng = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OpeningHours = table.Column<TimeOnly>(type: "time", nullable: false),
                    Price = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ItinerariesLocations",
                columns: table => new
                {
                    LocationsId = table.Column<int>(type: "int", nullable: false),
                    itinerariesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItinerariesLocations", x => new { x.LocationsId, x.itinerariesId });
                    table.ForeignKey(
                        name: "FK_ItinerariesLocations_Itineraries_itinerariesId",
                        column: x => x.itinerariesId,
                        principalTable: "Itineraries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItinerariesLocations_Locations_LocationsId",
                        column: x => x.LocationsId,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Itineraries_UserId",
                table: "Itineraries",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ItinerariesLocations_itinerariesId",
                table: "ItinerariesLocations",
                column: "itinerariesId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserHousing_Housing_HousingId",
                table: "UserHousing",
                column: "HousingId",
                principalTable: "Housing",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
