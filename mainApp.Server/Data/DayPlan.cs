using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace mainApp.Server.Data
{
    public class DayPlan
    {
        [Key]
        public int DayPlanId { get; set; }
        public int ItineraryId { get; set; }
        public DateTime Date { get; set; }

        public Itinerary Itinerary { get; set; } // Legătură inversă
        public List<Activity> Activities { get; set; } = new();
    }

}
