using mainApp.Server.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
        public string emailUserName { get; set; }
        public string password { get; set; }
       
    }

    public static class IdentityUserEndpoints
    {
        public static IEndpointRouteBuilder MapIdentityUserEndPoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/api/signup", async (
    UserManager<ApplicationUser> userManager, [FromBody] userRegistrationModel userRegistration
    ) =>
            {
                ApplicationUser user = new ApplicationUser()
                {
                    Email = userRegistration.Email,
                    firstName = userRegistration.firstName,
                    lastName = userRegistration.lastName,
                    UserName = userRegistration.firstName + "_" + userRegistration.lastName,
                };
                var result = await userManager.CreateAsync(user, userRegistration.password);
                if (result.Succeeded)
                {
                    return Results.Ok(result);
                }
                else
                {
                    return Results.BadRequest(result);
                }
            });
         

            return app;
        }
       

    }
}
