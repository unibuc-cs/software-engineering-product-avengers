using mainApp.Server.Data;
using mainApp.Server.Data.DTO;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using NuGet.Common;
using NuGet.Protocol;
using System.Text;
using System.Text.Json;

namespace mainApp.Server.Controllers
{

    public class userRegistrationModel
    {
        public string email { get; set; }
        public string password { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
    }
    public class userLoginModel
    {
        public string email { get; set; }
        public string password { get; set; }

    }

    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class IdentityUserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtService _jwtService;

        public IdentityUserController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, EmailService email, JwtService jwtService)
        {
            _userManager = userManager;
            _context = context;
            _signInManager = signInManager;
            _jwtService = jwtService;
        }

        [HttpPost("signup")]

        public async Task<IActionResult> Register([FromBody] userRegistrationModel userRegistration)
        {
            string userN;
            Random rnd = new Random();
            do
            {
                int random = rnd.Next(1, 100);
                userN = $"{userRegistration.firstName}_{userRegistration.lastName}{random}";
            } while (_context.Users.Any(us =>us.UserName == userN));
            var user = new ApplicationUser
            {
                Email = userRegistration.email,
                UserName = userN,
                firstName = userRegistration.firstName,
                lastName = userRegistration.lastName
            };


            var result = await _userManager.CreateAsync(user, userRegistration.password);

            if (result.Succeeded)
            {
                EmailService _emailManager = new EmailService();
                try
                {
                    _emailManager.SendEmailAsync(user.Email, "Bine ai venit!", $"Bine ai venit pe aplicatia TravelMonser, abea asteptam sa te ajutam in calatoria ta!").Wait();
                    return Ok(result);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = ex.Message });
                }
               

            }

            return BadRequest(result.Errors);
        }
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [HttpPost("signin")]
        public async Task<IActionResult> Login([FromBody] userLoginModel userLogin)
        {
            var user = await _userManager.FindByEmailAsync(userLogin.email);

            if(user == null)
            {
                user = await _userManager.FindByNameAsync(userLogin.email);
            }

            if (user == null || !await _userManager.CheckPasswordAsync(user, userLogin.password))
            {
                return Unauthorized(new { message = "Parola sau Username-ul este gresit!" });
            }

            await _signInManager.SignInAsync(user, isPersistent: false);
            
            // Generate JWT token
            var token = _jwtService.GenerateToken(user);
            
            return Ok(new { 
                message = "Bine ai revenit! ", 
                user = user.UserName,
                token = token
            });
        }
        [HttpGet("myProfile")]
        [Authorize]
        public async Task<IActionResult> GetUserProfile()
        {
            
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }
            var userData = await _context.Users
          .Where(u => u.Id == user.Id)
          .Include(u => u.Itineraries).ThenInclude(u=>u.DayPlans).ThenInclude(u=>u.Activities)
          .Include(i => i.Tickets)
          .ThenInclude(t => t.Flights)
          .Include(u => u.userHousings)
          .ThenInclude(h => h.Housing)
          .FirstOrDefaultAsync();
            var userProfile = new UserProfile
            {
                FullName = user.UserName,
                Email = user.Email,
                Itineraries = user.Itineraries.Select(i => new ItineraryResponseDto
                {
                  
                    StartDate = i.startDate,
                    EndDate = i.EndDate,
                    DayPlans = i.DayPlans?
                   .Select(dp => new DayPlanDTO
                    {
                       
                        Date = dp.Date,
                        activities = dp.Activities?
                            .Distinct()
                            .Select(a => new ActivityDto
                            {
                               
                                
                                Name = a.Name,
                                StartTime = a.StartTime,
                                Duration = a.Duration,
                                Type = a.Type
                            }).ToList() ?? new List<ActivityDto>()
                    }).ToList() ?? new List<DayPlanDTO>()
                }).ToList(),

                UserHousings = user.userHousings.Select(h => new HousingDto
                {
                    Rating = h.Housing.Rating,
                    Name = h.Housing.Name,
                    Address = h.Housing.Address,
                    OpeningHours = h.Housing.OpeningHours,
                    Price = h.Housing.Price
                }).ToList(),
                Tickets = user.Tickets.Select(t => new TicketDto
                {
                    TotalPrice = t.TotalPrice,
                    flights = t.Flights != null ? new List<FlightDTO>
                {
                    new FlightDTO
                    {
                        DepartureAirport = t.Flights.DepartureAirport,
                        Destination = t.Flights.Destination
                    }
                } : new List<FlightDTO>()
                }).ToList()
            };
            return Ok(JsonSerializer.Serialize(userProfile, new JsonSerializerOptions { WriteIndented = true }));
        }

        [HttpPost("activateemail")]
        public async Task<IActionResult> activateMail([FromBody] string mail)
        {
            var user = await _userManager.FindByEmailAsync(mail);
            if (user == null)
            {
                return NotFound(new { message = "Contul nu a fost gasit" });
            }
            var token  = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var activationlink = Url.Action("ActivateAccount", "IdentityUserController", new { token, email = mail }, Request.Scheme);
            EmailService _emailManager = new EmailService();
            try
            {
                _emailManager.SendEmailAsync(user.Email, "Activare cont", $"Click pe acest link pentru a-ți activa contul: {activationlink}").Wait();
                return Ok(new { message = activationlink });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { message = "Utilizatorul nu a fost gasit" });
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var resetlink = Url.Action("ResetPassword", "Account", new { token, email = email }, Request.Scheme);
            EmailService _emailManager = new EmailService();
            
           
            try
            {
                _emailManager.SendEmailAsync(user.Email, "Resetare parolă", $"Click pe acest link pentru a-ți reseta parola: {resetlink}").Wait();
                return Ok(new { message = "Te rugăm verifică-ți email-ul pentru linkul de resetare a parolei." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


    }
}
