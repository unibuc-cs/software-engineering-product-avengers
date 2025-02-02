using mainApp.Server.Data;
using mainApp.Server.Data.DTO;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Text.Json;

namespace mainApp.Server.Controllers
{
    public class accommodationSeach
    {
        public int minPrice { get; set; }
        public int maxPrice { get; set; }
        public int rating { get; set; }
        public string location { get; set; }
    }
    /// <summary>
    /// string userId, DateTime CheckIn, DateTime CheckOut
    /// </summary>
    public class userCheck
    {
        public string userId { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AccommodationsController : ControllerBase
    {
        private readonly GooglePlacesService _placeService;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly EmailService _emailService;

        public AccommodationsController(EmailService emailService,GooglePlacesService googlePlacesService,
            ApplicationDbContext applicationDbContext, UserManager<ApplicationUser> userManager)
        {
            _placeService = googlePlacesService;
            _context = applicationDbContext;
            _userManager = userManager;
            _emailService = emailService;
        }

        private async Task SaveHotelReservationResponse(Accommodation reservationResponse, userCheck userCheck)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            string priceLevel;
            if (reservationResponse.price <= 100)
            {
                priceLevel = "Low";
            }
            else if (reservationResponse.price <= 250)
            {
                priceLevel = "Mid";
            }
            else
            {
                priceLevel = "High";
            }

           
            Housing housing = new Housing
            {
                Rating = (int)reservationResponse.rating,
                PriceLevel = priceLevel,
                Price = reservationResponse.price,
                OpeningHours = TimeOnly.MinValue,  
                Name = reservationResponse.name,
                Address = reservationResponse.address,
                Locationlat = reservationResponse.location.latitude.ToString(), 
                Locationlng = reservationResponse.location.longitude.ToString(), 
            };

            UserHousing userHousing = new UserHousing
            {
                Housing = housing,
                User = user,
                CheckIn = userCheck.CheckIn,
                CheckOut = userCheck.CheckOut,
            };
           
            try
            {
                _context.Hotels.Add(housing); 
                await _context.SaveChangesAsync();
                userHousing.HousingId = housing.Id;
                userHousing.UserId = user.Id;
                _context.UserHousings.Add(userHousing);
                await _context.SaveChangesAsync();
                
                var reservation = new ReservationDto
                {
                    name = user.firstName + " " + user.lastName,
                    hotel = housing.Name,
                    address = housing.Address,
                    checkin = userHousing.CheckIn.ToShortDateString(),
                    checkout = userHousing.CheckOut.ToShortDateString(),
                    link = "https://travelmonster-hfbzhpg0dxf9dwan.germanywestcentral-01.azurewebsites.net/profile"

                };
                await _emailService.SendEmailReservationAsync(user.Email,reservation);
            }
            catch (Exception ex)
            {
          
             //   Console.WriteLine($"Error saving ticket: {ex.Message}");
                throw new Exception($"An error occurred while saving the ticket.{ex.Message}");
            }
        }



        private Accommodation AccommodationRet(string pricingResponseJson)
        {
            var response = JsonSerializer.Deserialize<JsonElement>(pricingResponseJson);

            if (!response.TryGetProperty("result", out var data))
            {
                throw new InvalidOperationException("Invalid response format: 'result'  key is missing.");
            }
            Random random = new Random();
            var ur = data.GetProperty("user_ratings_total").GetInt32();
            var r = data.GetProperty("rating").GetDouble();
            List<string> photoList = new List<string>();
            if(data.TryGetProperty("photos", out var photosArray))
            {
                foreach(var photo in photosArray.EnumerateArray())
                {
                    var photoReference = photo.GetProperty("photo_reference").ToString();
                    photoList.Add(_placeService.GeneratePhotoLink(photoReference));
                }
            }
            return new Accommodation
            {
                placeId = data.GetProperty("place_id").ToString(),
                address = data.GetProperty("formatted_address").ToString(),
                name = data.GetProperty("name").ToString(),
                rating = r,
                location = new location
                {
                    latitude = data.GetProperty("geometry").GetProperty("location").GetProperty("lat").GetDouble(),
                    longitude = data.GetProperty("geometry").GetProperty("location").GetProperty("lng").GetDouble(),
                },
                totalUserRating = ur,
                price = random.Next(100, 500),
                photos = photoList
                
            };
        }

       
        private List<Accommodation> SimplifyResponse(string pricingResponseJson)
        {
            var response = JsonSerializer.Deserialize<JsonElement>(pricingResponseJson);

            if (!response.TryGetProperty("results", out var data))
            {
                throw new InvalidOperationException("Invalid response format: 'response'  key is missing.");
            }
            Random random = new Random();
            var hotels = data.EnumerateArray().Select(h =>
            {
                var ur = h.GetProperty("user_ratings_total").GetInt32();
                var r = h.GetProperty("rating").GetDouble();
          
                
                return new Accommodation
                {
                    placeId = h.GetProperty("place_id").ToString(),
                    address = h.GetProperty("formatted_address").ToString(),
                    name = h.GetProperty("name").ToString(),
                    rating = r,
                    location = new location
                    {
                        latitude = h.GetProperty("geometry").GetProperty("location").GetProperty("lat").GetDouble(),
                        longitude = h.GetProperty("geometry").GetProperty("location").GetProperty("lng").GetDouble(),
                    },
                    totalUserRating = ur,
                    price=random.Next(100,500)
                    

                };

            }).ToList();

            return hotels;
        }

        [HttpGet("getHotel")]
        public async Task<IActionResult> GetHotelbyPlaceId([FromQuery] string placeId)
        {
            var result = await _placeService.GetHotelbyPlaceIdAsync(placeId);
            if(result != null)
            {
                var simplu = AccommodationRet(result);
                return Ok(simplu);
            }
            return BadRequest();
        }
        

        [HttpGet("showHotels")]
        public async Task<IActionResult> GetHotels([FromQuery] accommodationSeach accommodationSeach)
        {
            var resultate = await _placeService.GetHotelsAsync(accommodationSeach.location);
            if(resultate != null)
            {
               var simplu =  SimplifyResponse(resultate);
                var filterHotels = simplu.FindAll(u => u.price >= accommodationSeach.minPrice 
                && u.price <= accommodationSeach.maxPrice 
                && u.rating >= accommodationSeach.rating);

                return Ok(filterHotels);
            }
            return BadRequest();
        }


        [HttpPost("reserve")]
        
        public async Task<IActionResult> ReserveAccommodation([FromBody] AccommodationAndFlight reservationResponse)
        {
            var user =await _userManager.GetUserAsync(User);

            userCheck userCheck = new userCheck
            {
                userId = user.Id.ToString(),
                CheckIn = reservationResponse.flightDetails.Itineraries[0].Segments[0].ArrivalTime,
                CheckOut = reservationResponse.flightDetails.Itineraries[0].Segments.Last().DepartureTime,


            };
            try
            {
                await SaveHotelReservationResponse(reservationResponse.hotelDetails, userCheck);

                return StatusCode(200,new { Message = "Accommodation reserved successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(401, new { Message = "An error occurred.", Details = ex.Message });
            }
        }
    }
}
