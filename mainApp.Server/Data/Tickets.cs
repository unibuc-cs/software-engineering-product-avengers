using Microsoft.Identity.Client;
using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Tickets
    {
        [Key]
        public int Id { get; set; }
        public int TotalPrice {  get; set; }
        public virtual ApplicationUser? User { get; set; }
        public virtual Flights Flights { get; set; }
        public virtual ICollection<Seats>? Seats { get; set; }
    }
}
