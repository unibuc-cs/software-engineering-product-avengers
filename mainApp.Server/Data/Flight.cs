using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Flight
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Destination { get; set; }
        public int Duration { get; set; }
        public DateTime Arrival { get; set; }
        public DateTime Departure { get; set; }
        public int Price { get; set; }

        public Flight? NextFlight { get; set; }
        public virtual ICollection<Ticket>? Tickets { get; set; }

    }
}
