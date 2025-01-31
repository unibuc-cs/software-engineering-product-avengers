using mainApp.Server.Data.DTO;
using mainApp.Server.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mono.TextTemplating;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FlightsController : ControllerBase
{
    private readonly AmadeusClient _amadeusClient;

    public FlightsController(AmadeusClient amadeusClient)
    {
        _amadeusClient = amadeusClient;
    }

    private List<FlightResponseDTO> SimplifyPricingResponse(string pricingResponseJson)
    {
        var pricingResponse = JsonSerializer.Deserialize<JsonElement>(pricingResponseJson);

        if (!pricingResponse.TryGetProperty("data", out var data) ||
            !data.TryGetProperty("flightOffers", out var flightOffers))
        {
            throw new InvalidOperationException("Invalid response format: 'data' or 'flightOffers' key is missing.");
        }

        var flights = flightOffers.EnumerateArray().Select(flightOffer =>
        {
            var itineraries = flightOffer.GetProperty("itineraries").EnumerateArray().Select(itinerary => new ItineraryDto
            {
                Segments = itinerary.GetProperty("segments").EnumerateArray().Select(segment => new SegmentDto
                {
                    DepartureAirport = segment.GetProperty("departure").GetProperty("iataCode").GetString(),
                    DepartureTime = DateTime.Parse(segment.GetProperty("departure").GetProperty("at").GetString()),
                    ArrivalAirport = segment.GetProperty("arrival").GetProperty("iataCode").GetString(),
                    ArrivalTime = DateTime.Parse(segment.GetProperty("arrival").GetProperty("at").GetString()),
                    CarrierCode = segment.GetProperty("carrierCode").GetString(),
                    FlightNumber = segment.GetProperty("number").GetString(),
                    Duration = Utilities.ParseDuration(segment.GetProperty("duration").GetString()).ToString()
                }).ToList()
            }).ToList();

            var price = flightOffer.GetProperty("price");
            var priceDto = new PriceDto
            {
                Currency = price.GetProperty("currency").GetString(),
                Total = price.GetProperty("total").GetString(),
                Base = price.GetProperty("base").GetString()
            };

            return new FlightResponseDTO
            {
                Itineraries = itineraries,
                Price = priceDto
            };
        }).ToList();

        return flights;
    }

    [HttpGet("offers")]
    public async Task<IActionResult> GetFlightOffers([FromQuery] string origin, [FromQuery] string destination, [FromQuery] string departureDate, [FromQuery] string returnDate, [FromQuery] int numberofAdults)
    {
        try
        {
            var flightOffersJson = await _amadeusClient.GetFlightOffersAsync(origin, destination, departureDate, returnDate, numberofAdults);

            var simplifiedResponse = SimplifyPricingResponse(flightOffersJson);
            Console.WriteLine(simplifiedResponse);
            return Ok(simplifiedResponse);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while fetching flight offers.", Details = ex.Message });
        }
    }
}