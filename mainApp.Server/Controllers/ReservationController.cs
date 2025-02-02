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
using System.Net;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservationController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _dbContext;

    public ReservationController(IHttpClientFactory httpClientFactory, UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
    {
        _httpClientFactory = httpClientFactory;
        _userManager = userManager;
        _dbContext = dbContext;
    }

    [HttpPost("reserve")]
    public async Task<IActionResult> Reserve([FromBody] ReservationRequestDto request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized(new { Message = "User not found" });

        // Get the authorization header
        var authHeader = Request.Headers["Authorization"].ToString();
        if (string.IsNullOrEmpty(authHeader))
            return Unauthorized(new { Message = "No authorization token provided" });

        string userId = user.Id;

        var handler = new HttpClientHandler
        {
            UseCookies = true,
            CookieContainer = new CookieContainer(),
            ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true
        };
        if (HttpContext.Request.Cookies.TryGetValue(".AspNetCore.Identity.Application", out var authCookie))
        {
            // Adaugă cookie-ul pentru domeniul API-ului extern
            handler.CookieContainer.Add(new Uri("https://localhost:5193"),
                new Cookie(".AspNetCore.Identity.Application", authCookie));
        }

        // Creează HttpClient-ul folosind handler-ul configurat
        using var client = new HttpClient(handler)
        {
            Timeout = TimeSpan.FromMinutes(10)
        };

        // Add authorization header to the client
        client.DefaultRequestHeaders.Add("Authorization", authHeader);

        var flightResponse = await client.PostAsync(
            "https://localhost:5193/api/Tickets/reserve",
            new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json")
        );

        if (!flightResponse.IsSuccessStatusCode)
            return StatusCode((int)flightResponse.StatusCode, "Flight reservation failed");

        var flightData = await flightResponse.Content.ReadAsStringAsync();

        var hotelResponse = await client.PostAsync(
            "https://localhost:5193/api/Accommodations/reserve",
            new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json")
        );


        if (!hotelResponse.IsSuccessStatusCode)
            return StatusCode((int)hotelResponse.StatusCode, "Hotel reservation failed");

        var hotelData = await hotelResponse.Content.ReadAsStringAsync();

        var itineraryResponse = await client.PostAsync(
           "https://localhost:5193/api/Itinerary/create",
           new StringContent(JsonSerializer.Serialize(request.Itinerary), Encoding.UTF8, "application/json")
       );

        if (!itineraryResponse.IsSuccessStatusCode)
            return StatusCode((int)itineraryResponse.StatusCode, "Itinerary reservation failed");
        var itineraryData = await itineraryResponse.Content.ReadAsStringAsync();

        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            Message = "Reservation successful",
         
        });
    }
}
