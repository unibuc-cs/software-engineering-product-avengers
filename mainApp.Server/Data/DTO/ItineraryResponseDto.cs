namespace mainApp.Server.Data.DTO
{
    public class ActivityDto
    {
     
    
        public string Name { get; set; }
        public string StartTime { get; set; }
        public int Duration { get; set; }
        public string Type { get; set; }
    }

   

    public class ItineraryResponseDto
    {
        // Dacă dorești să afișezi doar un nume personalizat (ex: "City Break in New York")
      //  public string Name { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public List<DayPlanDTO> DayPlans { get; set; }
    }

    public class DayPlanDTO
    {

        public string Date { get; set; }
        public List<ActivityDto> activities { get; set; }

    }
}
