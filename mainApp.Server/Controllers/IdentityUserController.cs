using mainApp.Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using NuGet.Common;

namespace mainApp.Server.Controllers
{

    public class userRegistrationModel
    {
        public string Email { get; set; }
        public string password { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
    }
    public class userLoginModel
    {
        public string mailOrUserName { get; set; }
        public string password { get; set; }

    }

    [ApiController]
    [Route("api/[controller]")]
    public class IdentityUserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
 

        public IdentityUserController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, EmailService email)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Register([FromBody] userRegistrationModel userRegistration)
        {
            var user = new ApplicationUser
            {
                Email = userRegistration.Email,
                UserName = $"{userRegistration.firstName}_{userRegistration.lastName}",
                firstName = userRegistration.firstName,
                lastName = userRegistration.lastName
            };

            var result = await _userManager.CreateAsync(user, userRegistration.password);

            if (result.Succeeded)
                return Ok(result);

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
            var user = await _userManager.FindByEmailAsync(userLogin.mailOrUserName);

            if (user == null)
            {
                user = await _userManager.FindByNameAsync(userLogin.mailOrUserName); // incearca varianta a doua poate este UserName-ul nu email-ul
            }

            if (user == null || !await _userManager.CheckPasswordAsync(user, userLogin.password))
            {
                return Unauthorized(new { message = "Parola sau Username-ul este gresit!" });
            }
            await _signInManager.SignInAsync(user, isPersistent: false);
            return Ok(new { message = "Bine ai revenit! ", user = user.UserName });

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
            var UserProfile = new
            {
                email = user.Email,
                fullName = user.lastName + " " + user.firstName,
                activeHousing = user.userHousings.Where(x => x.CheckIn <= DateTime.Now).ToArray(),
                activeTickets = user.Tickets.Where(x => x.Flights.Arrival <= DateTime.Now).ToArray(),
                itineraries = user.Itineraries.ToArray()
            };
            return Ok(UserProfile);
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
