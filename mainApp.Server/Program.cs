using mainApp.Server.Controllers;
using mainApp.Server.Data;
using mainApp.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Read connection string from configuration
var connectionString = builder.Configuration.GetConnectionString("ApplicationDbContextConnection") 
                        ?? throw new InvalidOperationException("Connection string 'ApplicationDbContextConnection' not found.");

// Add DbContext with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

// Add services to the container
builder.Services.AddAuthentication();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>().AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllers();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add singleton EmailService
builder.Services.AddSingleton<EmailService>();

// Configure Identity Options
builder.Services.Configure<IdentityOptions>(options =>
{
    options.User.RequireUniqueEmail = true;
});

// Configure Amadeus settings
builder.Services.Configure<AmadeusSettings>(builder.Configuration.GetSection("AmadeusSettings"));

// Configure AmadeusClient with HTTP Client
builder.Services.AddHttpClient<AmadeusClient>(client =>
{
    client.BaseAddress = new Uri("https://test.api.amadeus.com/");
});

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", builder =>
    {
        // Adding localhost with ports dynamically between 3000 and 3999
        for (int i = 3000; i < 4000; i++)
        {
            builder.WithOrigins($"http://localhost:{i}");
        }
        builder.WithOrigins($"http://localhost:8080");
        builder.AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();  // Allows credentials (cookies, HTTP authentication)
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowSpecificOrigins",
        policy =>
        {
            // Replace with the domain(s) of your front-end
            policy.WithOrigins("https://travelmonster-hfbzhpg0dxf9dwan.germanywestcentral-01.azurewebsites.net")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
});


var app = builder.Build();

// Enable CORS middleware to allow requests from specified origins
app.UseCors("AllowLocalhost");

// Serve static files (SPA fallback for frontend)
app.UseDefaultFiles();
app.UseStaticFiles();

// Swagger for dev environment (Swagger UI & docs)
//if (app.Environment.IsDevelopment())
//{

//}
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection(); // Enforce HTTPS for secure communication

// Enable authorization middleware
app.UseAuthorization();

// Map controllers to API endpoints
app.MapControllers();

// Ensure fallback to your frontend for SPA (Single Page Application)
app.MapFallbackToFile("/index.html");

app.Run();
