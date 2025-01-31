namespace mainApp.Server.Data.DTO
{
    public class ItineraryResponseDto
    {
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<DayPlan> DayPlans { get; set; }
    }
}
