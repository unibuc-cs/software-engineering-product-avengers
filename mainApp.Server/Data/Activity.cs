using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Activity
    {
        [Key]
        public int Id { get; set; }


        public int DayPlanId { get; set; }

        public string Name { get; set; }

        // Dacă StartTime reprezintă un interval de timp, poți păstra string-ul (ex: "hh:mm:ss")
        public string StartTime { get; set; }

        public int Duration { get; set; } // Durata în minute

        public string Type { get; set; }

        // Proprietatea de navigare către DayPlan
        public virtual DayPlan DayPlan { get; set; }
    }

}
