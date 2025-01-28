using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }
        public int TotalPrice {  get; set; }
        public virtual ApplicationUser? User { get; set; }
        public virtual Flight Flights { get; set; }
        public virtual ICollection<Seat>? Seats { get; set; }
    }
}
