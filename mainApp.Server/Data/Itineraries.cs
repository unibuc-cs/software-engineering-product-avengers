using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Itineraries
    {
        [Key]
        public int Id { get; set; }
        public DateTime Time { get; set; }
        public int TotalPrice { get; set; }
        public virtual ApplicationUser? User { get; set; }
        public ICollection<Locations> Locations { get; set; }

    }
}
