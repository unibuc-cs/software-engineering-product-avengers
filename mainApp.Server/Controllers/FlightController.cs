using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class FlightsController : ControllerBase
{
    private readonly AmadeusClient _amadeusClient;

    public FlightsController(AmadeusClient amadeusClient)
    {
        _amadeusClient = amadeusClient;
    }

    [HttpGet("offers")]
    public async Task<IActionResult> GetFlightOffers([FromQuery] string origin, [FromQuery] string destination, [FromQuery] string departureDate, [FromQuery] string returnDate, [FromQuery] int numberofadults)
    {
        try
        {
            await _amadeusClient.AuthenticateAsync();
            var flightOffers = await _amadeusClient.GetFlightOffersAsync(origin, destination, departureDate, returnDate, numberofadults);
            var flightOffersElement = JsonSerializer.Deserialize<JsonElement>(flightOffers);
            return Ok(flightOffersElement);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(500, new { Message = ex.Message });
        }
    }
}