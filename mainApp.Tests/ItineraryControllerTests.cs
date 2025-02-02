using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using mainApp.Server.Data;
using mainApp.Server.Data.DTO;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

public class ItineraryControllerTests
{
    private readonly ApplicationDbContext _dbContext;
    private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
    private readonly ItineraryController _controller;

    public ItineraryControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new ApplicationDbContext(options);
        _mockUserManager = new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(), null, null, null, null, null, null, null, null);

        _controller = new ItineraryController(_dbContext, _mockUserManager.Object);
    }

    //[Fact]
    //public async Task CreateItinerary_ReturnsUnauthorized_WhenUserNotFound()
    //{
    //    _mockUserManager.Setup(um => um.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
    //        .ReturnsAsync((ApplicationUser)null);

    //    var result = await _controller.CreateItinerary(new ItineraryResponseDto());

    //    var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
    //    Assert.Equal("User not found", ((dynamic)unauthorizedResult.Value).Message);
    //}

    [Fact]
    public async Task GetItinerary_ReturnsNotFound_WhenItineraryDoesNotExist()
    {
        _mockUserManager.Setup(um => um.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
            .ReturnsAsync(new ApplicationUser { Id = "user123" });

        var result = await _controller.GetItinerary(1);
        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task DeleteItinerary_ReturnsNotFound_WhenItineraryDoesNotExist()
    {
        _mockUserManager.Setup(um => um.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
            .ReturnsAsync(new ApplicationUser { Id = "user123" });

        var result = await _controller.DeleteItinerary(1);
        Assert.IsType<NotFoundObjectResult>(result);
    }
}