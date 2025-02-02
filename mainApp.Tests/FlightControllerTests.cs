using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using mainApp.Server.Controllers;
using Microsoft.AspNetCore.Mvc;
using mainApp.Server.Data.DTO;
using mainApp.Server.Services;
using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Text.Json;

public class FlightControllerTests
{
    private readonly FlightsController _controller;
    private readonly Mock<AmadeusClient> _mockAmadeusClient;

    public FlightControllerTests()
    {
        var httpClientMock = new Mock<HttpClient>();
        var settingsMock = new Mock<IOptions<AmadeusSettings>>();

        _mockAmadeusClient = new Mock<AmadeusClient>(httpClientMock.Object, settingsMock.Object);
        _controller = new FlightsController(_mockAmadeusClient.Object);
    }

    [Fact]
    public async Task GetFlightsAsync_WhenCalled_ReturnsOkResult()
    {
        // Arrange
        string jsonResponse = @"{
        ""data"": {
            ""flightOffers"": [
                {
                    ""itineraries"": [
                        {
                            ""segments"": [
                                {
                                    ""departure"": { ""iataCode"": ""OTP"", ""at"": ""2025-02-01T12:00:00"" },
                                    ""arrival"": { ""iataCode"": ""CDG"", ""at"": ""2025-02-01T18:00:00"" },
                                    ""carrierCode"": ""AA"",
                                    ""number"": ""123"",
                                    ""duration"": ""PT3H""
                                }
                            ]
                        }
                    ],
                    ""price"": { ""currency"": ""EUR"", ""total"": ""430.00"", ""base"": ""90.00"" }
                }
            ]
        }
    }";

        _mockAmadeusClient
            .Setup(client => client.GetFlightOffersAsync("OTP", "CDG", "2025-02-01", "2025-02-10", 1))
            .ReturnsAsync(jsonResponse);

        // Act
        var result = await _controller.GetFlightOffers("OTP", "CDG", "2025-02-01", "2025-02-10", 1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
        Assert.IsType<List<FlightResponseDTO>>(okResult.Value);

        var flightOffers = (List<FlightResponseDTO>)okResult.Value;
        Assert.NotEmpty(flightOffers);
        Assert.Equal("OTP", flightOffers[0].Itineraries[0].Segments[0].DepartureAirport);
    }


    [Fact]
    public async Task GetFlightsAsync_WhenAmadeusClientThrowsException_ReturnsInternalServerError()
    {
        // Arrange
        _mockAmadeusClient
            .Setup(client => client.GetFlightOffersAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>()))
            .ThrowsAsync(new Exception("Test exception"));

        // Act
        var result = await _controller.GetFlightOffers("OTP", "CDG", "2025-02-01", "2025-02-10", 1);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);


        var json = JsonSerializer.Serialize(objectResult.Value);
        using var doc = JsonDocument.Parse(json);

        var message = doc.RootElement.GetProperty("Message").GetString();
        var details = doc.RootElement.GetProperty("Details").GetString();

        Assert.Equal("An error occurred while fetching flight offers.", message);
        Assert.Equal("Test exception", details);
    }

}