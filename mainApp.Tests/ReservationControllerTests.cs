using System;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using mainApp.Server.Data;
using mainApp.Server.Data.DTO;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Moq.Protected;
using Xunit;

public class ReservationControllerTests
{
    private readonly Mock<IHttpClientFactory> _mockHttpClientFactory;
    private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
    private readonly ApplicationDbContext _dbContext;
    private readonly ReservationController _controller;

    public ReservationControllerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        _dbContext = new ApplicationDbContext(options);
        _mockHttpClientFactory = new Mock<IHttpClientFactory>();
        _mockUserManager = new Mock<UserManager<ApplicationUser>>(
            Mock.Of<IUserStore<ApplicationUser>>(), null, null, null, null, null, null, null, null);

        _controller = new ReservationController(_mockHttpClientFactory.Object, _mockUserManager.Object, _dbContext);
    }

    [Fact]
    public async Task Reserve_ReturnsUnauthorized_WhenUserNotFound()
    {
        _mockUserManager.Setup(um => um.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
            .ReturnsAsync((ApplicationUser)null);

        var reservationRequest = new ReservationRequestDto();
        var result = await _controller.Reserve(reservationRequest);

        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("User not found", unauthorizedResult.Value.GetType().GetProperty("Message")?.GetValue(unauthorizedResult.Value, null));
    }

    //[Fact]
    //public async Task Reserve_ReturnsError_WhenFlightReservationFails()
    //{
    //    _mockUserManager.Setup(um => um.GetUserAsync(It.IsAny<ClaimsPrincipal>()))
    //        .ReturnsAsync(new ApplicationUser { Id = "user123" });

    //    var reservationRequest = new ReservationRequestDto();
    //    var httpResponseMessage = new HttpResponseMessage(HttpStatusCode.BadRequest)
    //    {
    //        Content = new StringContent("Flight reservation failed")
    //    };

    //    var mockHttpMessageHandler = new Mock<HttpMessageHandler>();
    //    mockHttpMessageHandler
    //        .Protected()
    //        .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
    //        .ReturnsAsync(httpResponseMessage);

    //    var httpClient = new HttpClient(mockHttpMessageHandler.Object);
    //    _mockHttpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

    //    var result = await _controller.Reserve(reservationRequest);
    //    var objectResult = Assert.IsType<ObjectResult>(result);
    //    Assert.Equal(400, objectResult.StatusCode);
    //    Assert.Contains("Flight reservation failed", objectResult.Value?.ToString());
    //}
}
