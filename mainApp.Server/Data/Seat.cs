using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Seat
    {
        [Key]
        public int Id { get; set; }
        public string FullName { get; set; }
        public string SeatNumber {  get; set; }
        public bool BagajMana { get; set; }
        public bool BagajCala { get; set; }
        public Ticket Ticket { get; set; }

    }
}
