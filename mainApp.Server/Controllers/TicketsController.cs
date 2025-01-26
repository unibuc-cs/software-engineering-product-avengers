using mainApp.Server.Data.DTO;
using mainApp.Server.Data;
using System;
using Microsoft.AspNetCore.Mvc;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace mainApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private async Task SaveTicketFromReservationResponse(ReservationRequestDto reservationResponse, int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            foreach (var flightOffer in reservationResponse.Data.FlightOffers)
            {
                Flight? previousFlight = null;
                Flight? firstFlight = null;

                foreach (var itinerary in flightOffer.Itineraries)
                {
                    foreach (var segment in itinerary.Segments)
                    {
                        var flight = new Flight
                        {
                            Destination = segment.Arrival.IataCode,
                            Departure = segment.Departure.At,
                            Arrival = segment.Arrival.At,
                            Duration = Utilities.Utilities.ParseDuration(segment.Duration),
                            Price = Convert.ToInt32(flightOffer.Price.Total),
                            //Number = segment.CarrierCode + segment.number idee,
                        };

                        if (firstFlight == null)
                        {
                            firstFlight = flight;
                        }

                        if (previousFlight != null)
                        {
                            previousFlight.NextFlight = flight;
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
                        TotalPrice = Convert.ToInt32(flightOffer.Price.Total),
                        Flights = firstFlight,
                        User = user,
                    };

                    _context.Tickets.Add(ticket);
                    await _context.SaveChangesAsync();
                }
            }
        }

        [HttpPost("reserve")]
        [Authorize]
        public async Task<IActionResult> ReserveTicket([FromBody] ReservationRequestDto reservationResponse, [FromQuery] int userId)
        {
            try
            {
                await SaveTicketFromReservationResponse(reservationResponse, userId);
                return Ok(new { Message = "Ticket reserved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred.", Details = ex.Message });
            }
        }


    }

}
