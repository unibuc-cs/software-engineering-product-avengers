using System.ComponentModel.DataAnnotations;

namespace mainApp.Server.Data
{
    public class Activity
    {
        [Key]
        public int Id { get; set; }
        public int ActivityId { get; set; }
        public int DayPlanId { get; set; }

        public string Name { get; set; }
        public TimeSpan StartTime { get; set; }
        public int Duration { get; set; } // Durata în minute
        public string Type { get; set; } 

        public DayPlan DayPlan { get; set; }
    }

}
