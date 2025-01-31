using mainApp.Server.Data.DTO;
using mainApp.Server.Data;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize] 
public class ReservationController : ControllerBase
{
    private readonly HttpClient _httpClient;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _dbContext;

    public ReservationController(HttpClient httpClient, UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
    {
        _httpClient = httpClient;
        _userManager = userManager;
        _dbContext = dbContext;
    }

    [HttpPost("reserve")]
    public async Task<IActionResult> Reserve([FromBody] ReservationRequestDto request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized(new { Message = "User not found" });

        string userId = user.Id;

        var flightResponse = await _httpClient.PostAsync(
            "https://yourapi.com/api/flights/book",
            new StringContent(JsonSerializer.Serialize(request.FlightDetails), Encoding.UTF8, "application/json")
        );

        if (!flightResponse.IsSuccessStatusCode)
            return StatusCode((int)flightResponse.StatusCode, "Flight reservation failed");

        var flightData = await flightResponse.Content.ReadAsStringAsync();

        var hotelResponse = await _httpClient.PostAsync(
            "https://yourapi.com/api/hotels/book",
            new StringContent(JsonSerializer.Serialize(request.HotelDetails), Encoding.UTF8, "application/json")
        );

        if (!hotelResponse.IsSuccessStatusCode)
            return StatusCode((int)hotelResponse.StatusCode, "Hotel reservation failed");

        var hotelData = await hotelResponse.Content.ReadAsStringAsync();

        var itinerary = new Itinerary
        {
            Userid = userId,
            StartDate = request.TripDates.StartDate,
            EndDate = request.TripDates.EndDate,
            DayPlans = request.Itinerary.DayPlans
        };

        _dbContext.Itineraries.Add(itinerary);
        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            Message = "Reservation successful",
            Flight = JsonSerializer.Deserialize<object>(flightData),
            Hotel = JsonSerializer.Deserialize<object>(hotelData),
            ItineraryId = itinerary.ItineraryId
        });
    }
}
