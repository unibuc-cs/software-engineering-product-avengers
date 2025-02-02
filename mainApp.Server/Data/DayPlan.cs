using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace mainApp.Server.Data
{
    public class DayPlan
    {
        [Key]
        public int DayPlanId { get; set; }

        public int ItineraryId { get; set; }

        public string Date { get; set; }

        // Proprietatea de navigare către Itinerary (nu e inclusă în DTO-uri)
        public virtual Itinerary ?Itinerary { get; set; }

        // Folosim ICollection pentru flexibilitate și lazy loading
        public virtual ICollection<Activity>? Activities { get; set; }
    }

}
