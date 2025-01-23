using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Housing
    {
        [Key]
        public int Id { get; set; }
        public int Rating { get; set; }
        public string PriceLevel { get; set; }
        public int Price { get; set; }
        public TimeOnly OpeningHours { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Locationlat { get; set; }
        public string Locationlng { get; set; }
        public ICollection<UserHousing>? userHousings { get; set; }
    }
}
