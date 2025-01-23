using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Locations
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public TimeOnly OpeningHours { get; set; }
        public string Address { get; set; }
        public string LocationLat { get; set; }
        public string LocationLng { get; set; }
        public ICollection<Itineraries>? itineraries { get; set; }

    }
}
