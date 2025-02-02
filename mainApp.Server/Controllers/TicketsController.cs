using mainApp.Server.Data.DTO;
using mainApp.Server.Data;
using System;
using Microsoft.AspNetCore.Mvc;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace mainApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TicketsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        private async Task SaveTicketFromReservationResponse(ReservationTicketRequestDTO reservationResponse)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new Exception("User not found.");
            }
            Flight? previousFlight = null;
            Flight? firstFlight = null;
            foreach (var flightOffer in reservationResponse.flightDetails.Itineraries)
            {
                foreach (var segment in flightOffer.Segments)
                {
                    var flight = new Flight
                    {
                        DepartureAirport = segment.DepartureAirport,
                        Destination = segment.ArrivalAirport,
                        Departure = segment.DepartureTime,
                        Arrival = segment.ArrivalTime,
                        Duration = Int32.Parse(segment.Duration),
                    };

                    if (firstFlight == null)
                    {
                        firstFlight = flight;
                    }

                    if (previousFlight != null)
                    {
                        previousFlight.NextFlight = flight;
                        _context.Update(previousFlight);
                    }

                    _context.Flights.Add(flight);
                    await _context.SaveChangesAsync();

                    previousFlight = flight;
                }
            }
            if (firstFlight != null)
            {
                var ticket = new Ticket
                {
                    TotalPrice = Convert.ToInt32(Convert.ToDouble(reservationResponse.flightDetails.Price.Total)),
                   FlightsId = firstFlight.Id,
                    User = user
                };
               

                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();
            }
        }

        [HttpPost("reserve")]
        [Authorize]
        public async Task<IActionResult> ReserveTicket([FromBody] ReservationTicketRequestDTO reservationResponse)
        {
            try
            {
                await SaveTicketFromReservationResponse(reservationResponse);

                return StatusCode(200,new { Message = "Ticket reserved successfully."});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred.", Details = ex.Message });
            }
        }


    }

}
