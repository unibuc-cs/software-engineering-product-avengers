using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Seats
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Seat {  get; set; }
        public bool BagajMana { get; set; }
        public bool BagajCala { get; set; }
        public Tickets Ticket { get; set; }

    }
}
