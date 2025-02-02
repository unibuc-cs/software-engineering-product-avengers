using System.Reflection.Emit;
using mainApp.Server.Data;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace mainApp.Server.Services
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
       
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
           

            base.OnModelCreating(builder);
        }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<UserHousing> UserHousings { get; set; }
        public DbSet<Housing> Hotels { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Itinerary> Itineraries { get; set; }
        public DbSet<DayPlan> DayPlans { get; set; }
        public DbSet<Activity> Activities { get; set; }
    }
}