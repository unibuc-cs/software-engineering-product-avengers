using Xunit;
using Moq;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using mainApp.Server.Controllers;
using mainApp.Server.Data;
using mainApp.Server.Data.DTO;
using mainApp.Server.Services;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;

public class IdentityUserControllerTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
    private readonly Mock<SignInManager<ApplicationUser>> _signInManagerMock;
    private readonly Mock<ApplicationDbContext> _dbContextMock;
    private readonly Mock<EmailService> _emailServiceMock;
    private readonly IdentityUserController _controller;

    public IdentityUserControllerTests()
    {
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(userStoreMock.Object, null, null, null, null, null, null, null, null);
        _signInManagerMock = new Mock<SignInManager<ApplicationUser>>(
            _userManagerMock.Object,
            new Mock<IHttpContextAccessor>().Object,
            new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>().Object,
            null, null, null, null);

        _dbContextMock = new Mock<ApplicationDbContext>(new DbContextOptions<ApplicationDbContext>());
        _emailServiceMock = new Mock<EmailService>();

        _controller = new IdentityUserController(
            _dbContextMock.Object,
            _userManagerMock.Object,
            _signInManagerMock.Object,
            _emailServiceMock.Object
        );
    }

    //[Fact]
    //public async Task Register_ShouldReturnOk_WhenUserIsCreated()
    //{
    //    // Arrange
    //    var userModel = new userRegistrationModel
    //    {
    //        email = "test@example.com",
    //        password = "Test123!",
    //        firstName = "John",
    //        lastName = "Doe"
    //    };

    //    _userManagerMock.Setup(um => um.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
    //                    .ReturnsAsync(IdentityResult.Success);

    //    _dbContextMock.Setup(db => db.Users.Any(It.IsAny<System.Linq.Expressions.Expression<System.Func<ApplicationUser, bool>>>()))
    //                  .Returns(false);

    //    // Act
    //    var result = await _controller.Register(userModel);

    //    // Assert
    //    var okResult = Assert.IsType<OkObjectResult>(result);
    //    Assert.NotNull(okResult.Value);
    //}

    [Fact]
    public async Task Login_ShouldReturnUnauthorized_WhenUserNotFound()
    {
        // Arrange
        var loginModel = new userLoginModel
        {
            email = "notfound@example.com",
            password = "WrongPassword!"
        };

        _userManagerMock.Setup(um => um.FindByEmailAsync(loginModel.email))
                        .ReturnsAsync((ApplicationUser)null);

        // Act
        var result = await _controller.Login(loginModel);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
    }

    [Fact]
    public async Task Login_ShouldReturnOk_WhenUserLogsInSuccessfully()
    {
        // Arrange
        var user = new ApplicationUser { UserName = "john_doe", Email = "john@example.com" };
        var loginModel = new userLoginModel { email = "john@example.com", password = "Password123!" };

        _userManagerMock.Setup(um => um.FindByEmailAsync(loginModel.email))
                        .ReturnsAsync(user);
        _userManagerMock.Setup(um => um.CheckPasswordAsync(user, loginModel.password))
                        .ReturnsAsync(true);
        _signInManagerMock.Setup(sm => sm.SignInAsync(user, false, null))
                          .Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Login(loginModel);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Contains("Bine ai revenit!", okResult.Value.ToString());
    }

    [Fact]
    public async Task Logout_ShouldReturnOk_WhenUserLogsOut()
    {
        // Arrange
        _signInManagerMock.Setup(sm => sm.SignOutAsync()).Returns(Task.CompletedTask);

        // Act
        var result = await _controller.Logout();

        // Assert
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task GetUserProfile_ShouldReturnNotFound_WhenUserNotExists()
    {
        // Arrange
        _userManagerMock.Setup(um => um.GetUserAsync(It.IsAny<System.Security.Claims.ClaimsPrincipal>()))
                        .ReturnsAsync((ApplicationUser)null);

        // Act
        var result = await _controller.GetUserProfile();

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    //[Fact]
    //public async Task activateMail_ShouldReturnOk_WhenEmailIsSent()
    //{
    //    // Arrange
    //    var email = "test@example.com";
    //    var user = new ApplicationUser { Email = email };
    //    _userManagerMock.Setup(um => um.FindByEmailAsync(email)).ReturnsAsync(user);
    //    _userManagerMock.Setup(um => um.GenerateEmailConfirmationTokenAsync(user))
    //                    .ReturnsAsync("fake_token");

    //    _emailServiceMock.Setup(em => em.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
    //                     .Returns(Task.CompletedTask);

    //    // Act
    //    var result = await _controller.activateMail(email);

    //    // Assert
    //    var okResult = Assert.IsType<OkObjectResult>(result);
    //    Assert.Contains("Activare cont", okResult.Value.ToString());
    //}

    [Fact]
    public async Task ForgotPassword_ShouldReturnNotFound_WhenUserNotExists()
    {
        // Arrange
        var email = "notfound@example.com";
        _userManagerMock.Setup(um => um.FindByEmailAsync(email)).ReturnsAsync((ApplicationUser)null);

        // Act
        var result = await _controller.ForgotPassword(email);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
    }

    //[Fact]
    //public async Task ForgotPassword_ShouldReturnOk_WhenResetLinkIsSent()
    //{
    //    // Arrange
    //    var email = "test@example.com";
    //    var user = new ApplicationUser { Email = email };
    //    _userManagerMock.Setup(um => um.FindByEmailAsync(email)).ReturnsAsync(user);
    //    _userManagerMock.Setup(um => um.GeneratePasswordResetTokenAsync(user))
    //                    .ReturnsAsync("fake_reset_token");

    //    _emailServiceMock.Setup(em => em.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
    //                     .Returns(Task.CompletedTask);

    //    // Act
    //    var result = await _controller.ForgotPassword(email);

    //    // Assert
    //    var okResult = Assert.IsType<OkObjectResult>(result);
    //    Assert.Contains("Te rugam sa-ti verifici email-ul", okResult.Value.ToString());
    //}
}
