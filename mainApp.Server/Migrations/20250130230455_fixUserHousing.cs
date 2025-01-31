using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace mainApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class fixUserHousing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserHousing_AspNetUsers_UserId",
                table: "UserHousing");

            migrationBuilder.DropForeignKey(
                name: "FK_UserHousing_Hotels_HousingId",
                table: "UserHousing");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserHousing",
                table: "UserHousing");

            migrationBuilder.RenameTable(
                name: "UserHousing",
                newName: "UserHousings");

            migrationBuilder.RenameIndex(
                name: "IX_UserHousing_UserId",
                table: "UserHousings",
                newName: "IX_UserHousings_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserHousing_HousingId",
                table: "UserHousings",
                newName: "IX_UserHousings_HousingId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserHousings",
                table: "UserHousings",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserHousings_AspNetUsers_UserId",
                table: "UserHousings",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserHousings_Hotels_HousingId",
                table: "UserHousings",
                column: "HousingId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserHousings_AspNetUsers_UserId",
                table: "UserHousings");

            migrationBuilder.DropForeignKey(
                name: "FK_UserHousings_Hotels_HousingId",
                table: "UserHousings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserHousings",
                table: "UserHousings");

            migrationBuilder.RenameTable(
                name: "UserHousings",
                newName: "UserHousing");

            migrationBuilder.RenameIndex(
                name: "IX_UserHousings_UserId",
                table: "UserHousing",
                newName: "IX_UserHousing_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_UserHousings_HousingId",
                table: "UserHousing",
                newName: "IX_UserHousing_HousingId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserHousing",
                table: "UserHousing",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserHousing_AspNetUsers_UserId",
                table: "UserHousing",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserHousing_Hotels_HousingId",
                table: "UserHousing",
                column: "HousingId",
                principalTable: "Hotels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
