using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Itinerary
    {
        [Key]
        public int ItineraryId { get; set; }

        // Chiar dacă userid nu vine din payload, se poate seta în controller
        public string UserId { get; set; }

        public DateTime startDate { get; set; }

        public DateTime EndDate { get; set; }

        // Folosim ICollection pentru colecția de DayPlan
        public virtual ApplicationUser ?User { get; set; }
        public virtual ICollection<DayPlan>? DayPlans { get; set; }
    }

}
