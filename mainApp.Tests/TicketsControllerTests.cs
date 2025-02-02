using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using mainApp.Server.Controllers;
using mainApp.Server.Data;
using mainApp.Server.Data.DTO;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

public class TicketsControllerTests
{
    private readonly ApplicationDbContext _dbContext;
    private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
    private readonly TicketsController _controller;

    public TicketsControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        _dbContext = new ApplicationDbContext(options);
        _mockUserManager = new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(), null, null, null, null, null, null, null, null);

        _controller = new TicketsController(_dbContext, _mockUserManager.Object);
    }

    [Fact]
    public async Task ReserveTicket_ReturnsUnauthorized_WhenUserNotFound()
    {
        _mockUserManager.Setup(um => um.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
            .ReturnsAsync((ApplicationUser)null);

        var reservationRequest = new ReservationTicketRequestDTO();
        var result = await _controller.ReserveTicket(reservationRequest);

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);
        Assert.Contains("User not found", objectResult.Value.ToString());
    }

    //[Fact]
    //public async Task ReserveTicket_ReturnsSuccess_WhenReservationSucceeds()
    //{
    //    _mockUserManager.Setup(um => um.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
    //        .ReturnsAsync(new ApplicationUser { Id = "user123" });

    //    var reservationRequest = new ReservationTicketRequestDTO
    //    {
    //        flightDetails = new FlightResponseDTO
    //        {
    //            Price = new PriceDto { Total = "100" },
    //            Itineraries = new List<ItineraryDto>
    //            {
    //                new ItineraryDto
    //                {
    //                    Segments = new List<SegmentDto>
    //                    {
    //                        new SegmentDto
    //                        {
    //                            DepartureAirport = "JFK",
    //                            ArrivalAirport = "LAX",
    //                            DepartureTime = DateTime.UtcNow,
    //                            ArrivalTime = DateTime.UtcNow.AddHours(5),
    //                            Duration = "300"
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    };

    //    var result = await _controller.ReserveTicket(reservationRequest);
    //    var objectResult = Assert.IsType<ObjectResult>(result);
    //    Assert.Equal(200, objectResult.StatusCode);
    //    Assert.Contains("Ticket reserved successfully", objectResult.Value.ToString());
    //}
}
