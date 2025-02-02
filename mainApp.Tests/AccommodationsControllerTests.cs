//using Xunit;
//using Moq;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using mainApp.Server.Controllers;
//using mainApp.Server.Data;
//using mainApp.Server.Data.DTO;
//using mainApp.Server.Services;
//using System.Threading.Tasks;
//using Microsoft.EntityFrameworkCore;
//using System.Collections.Generic;
//using System.Net.Http;
//using System.Threading;

//public class AccommodationsControllerTests
//{
//    private readonly AccommodationsController _controller;
//    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
//    private readonly Mock<EmailService> _emailServiceMock;
//    private readonly Mock<ApplicationDbContext> _dbContextMock;
//    private readonly GooglePlacesService _googlePlacesService;

//    public AccommodationsControllerTests()
//    {
//        var mockResponse = new HttpResponseMessage
//        {
//            StatusCode = System.Net.HttpStatusCode.OK,
//            Content = new StringContent("{\"results\": [{\"name\": \"Test Hotel\", \"formatted_address\": \"123 Test Street\", \"rating\": 4.5, \"user_ratings_total\": 100, \"geometry\": {\"location\": {\"lat\": 40.7128, \"lng\": -74.0060}}}]}")
//        };

//        var httpMessageHandler = new FakeHttpMessageHandler(mockResponse);
//        var httpClient = new HttpClient(httpMessageHandler);

//        _googlePlacesService = new GooglePlacesService(httpClient);

//        _emailServiceMock = new Mock<EmailService>();
//        _dbContextMock = new Mock<ApplicationDbContext>(new DbContextOptions<ApplicationDbContext>());
//        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
//        _userManagerMock = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null, null, null, null, null, null, null, null);

//        _controller = new AccommodationsController(
//            _emailServiceMock.Object,
//            _googlePlacesService,
//            _dbContextMock.Object,
//            _userManagerMock.Object
//        );
//    }

//    [Fact]
//    public async Task GetHotelbyPlaceId_ShouldReturnOk_WhenHotelIsFound()
//    {
//        // Arrange
//        var placeId = "testPlaceId";
//        var mockResponse = "{\"result\": {\"name\": \"Test Hotel\", \"formatted_address\": \"123 Test Street\", \"rating\": 4.5, \"user_ratings_total\": 100, \"geometry\": {\"location\": {\"lat\": 40.7128, \"lng\": -74.0060}}}}";

//        var httpMessageHandler = new FakeHttpMessageHandler(new HttpResponseMessage
//        {
//            StatusCode = System.Net.HttpStatusCode.OK,
//            Content = new StringContent(mockResponse)
//        });

//        var httpClient = new HttpClient(httpMessageHandler);
//        var googlePlacesService = new GooglePlacesService(httpClient);

//        var controller = new AccommodationsController(
//            _emailServiceMock.Object,
//            googlePlacesService,
//            _dbContextMock.Object,
//            _userManagerMock.Object
//        );

//        // Act
//        var result = await controller.GetHotelbyPlaceId(placeId);

//        // Assert
//        var okResult = Assert.IsType<OkObjectResult>(result);
//        Assert.NotNull(okResult.Value);
//    }

//}

//public class FakeHttpMessageHandler : HttpMessageHandler
//{
//    private readonly HttpResponseMessage _response;

//    public FakeHttpMessageHandler(HttpResponseMessage response)
//    {
//        _response = response;
//    }

//    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
//    {
//        return Task.FromResult(_response);
//    }
//}
