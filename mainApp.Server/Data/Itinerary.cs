using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Itinerary
    {
        [Key]
        public int ItineraryId { get; set; }
        public string Userid { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public List<DayPlan> DayPlans { get; set; }
    }

}
