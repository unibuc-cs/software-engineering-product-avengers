using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Location
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public TimeOnly OpeningHours { get; set; }
        public string Address { get; set; }
        public string LocationLat { get; set; }
        public string LocationLng { get; set; }
        public ICollection<Itinerary>? itineraries { get; set; }

    }
}
