using Microsoft.AspNetCore.Identity;

namespace mainApp.Server.Data
{
    public class ApplicationUser : IdentityUser
    {
       public string firstName { get; set; }
       public string lastName { get; set; }
        public virtual ICollection<Itinerary>? Itineraries { get; set; }
        public virtual ICollection<Ticket>? Tickets { get; set; }
        public ICollection<UserHousing>? userHousings { get; set; }
    }
}
