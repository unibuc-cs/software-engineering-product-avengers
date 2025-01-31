using mainApp.Server.Data.DTO;
using mainApp.Server.Data;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ItineraryController : ControllerBase
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public ItineraryController(ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> CreateItinerary([FromBody] ItineraryResponseDto dto)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized(new { Message = "User not found" });

        var itinerary = new Itinerary
        {
            Userid = user.Id,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            DayPlans = dto.DayPlans
        };

        _dbContext.Itineraries.Add(itinerary);
        await _dbContext.SaveChangesAsync();

        return Ok(new { Message = "Itinerary created", ItineraryId = itinerary.ItineraryId });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetItinerary(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var itinerary = await _dbContext.Itineraries
            .Include(i => i.DayPlans)
            .ThenInclude(dp => dp.Activities)
            .FirstOrDefaultAsync(i => i.ItineraryId == id && i.Userid == user.Id);

        if (itinerary == null) return NotFound(new { Message = "Itinerary not found" });

        return Ok(itinerary);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItinerary(int id, [FromBody] ItineraryResponseDto dto)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var itinerary = await _dbContext.Itineraries
            .Include(i => i.DayPlans)
            .FirstOrDefaultAsync(i => i.ItineraryId == id && i.Userid == user.Id);

        if (itinerary == null) return NotFound(new { Message = "Itinerary not found" });

        itinerary.StartDate = dto.StartDate;
        itinerary.EndDate = dto.EndDate;
        itinerary.DayPlans = dto.DayPlans;

        _dbContext.Itineraries.Update(itinerary);
        await _dbContext.SaveChangesAsync();

        return Ok(new { Message = "Itinerary updated" });
    }

    // 🔹 4️⃣ Șterge un itinerariu
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteItinerary(int id)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var itinerary = await _dbContext.Itineraries
            .FirstOrDefaultAsync(i => i.ItineraryId == id && i.Userid == user.Id);

        if (itinerary == null) return NotFound(new { Message = "Itinerary not found" });

        _dbContext.Itineraries.Remove(itinerary);
        await _dbContext.SaveChangesAsync();

        return Ok(new { Message = "Itinerary deleted" });
    }
}
