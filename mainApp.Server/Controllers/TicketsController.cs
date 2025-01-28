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
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public TicketsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        private async Task SaveTicketFromReservationResponse(ReservationRequestDto reservationResponse, string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found.");
            }
            Flight? previousFlight = null;
            Flight? firstFlight = null;
            foreach (var flightOffer in reservationResponse.Flight.Itineraries)
            {
                foreach (var segment in flightOffer.Segments)
                {
                    var flight = new Flight
                    {
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
                    TotalPrice = Convert.ToInt32(reservationResponse.Flight.Price.Total),
                    Flights = firstFlight,
                    User = user,
                };
                Random rnd = new Random();
                foreach (var passanger in reservationResponse.Passengers)
                {
                    string seatNumber;
                    do
                    {
                        seatNumber = rnd.Next(1, 100).ToString();
                    } while (_context.Seats.Any(s => s.SeatNumber == seatNumber));
                    var seat = new Seat
                    {
                        FullName = passanger.FullName,
                        SeatNumber = seatNumber,
                        BagajCala = passanger.BagajCala,
                        BagajMana = passanger.BagajMana,
                        Ticket = ticket
                    };
                    _context.Seats.Add(seat);
                }

                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();
            }
        }

        [HttpPost("reserve")]
        [Authorize]
        public async Task<IActionResult> ReserveTicket([FromBody] ReservationRequestDto reservationResponse, [FromQuery] string userId)
        {
            try
            {
                await SaveTicketFromReservationResponse(reservationResponse, userId);

                return Ok(new { Message = "Ticket reserved successfully."});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred.", Details = ex.Message });
            }
        }


    }

}
