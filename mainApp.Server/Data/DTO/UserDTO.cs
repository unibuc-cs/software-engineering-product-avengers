namespace mainApp.Server.Data.DTO
{
    public class UserProfile
    {
       
        public string FullName { get; set; }
        public string Email { get; set; }
        public List<ItineraryResponseDto> Itineraries { get; set; }
       public List<HousingDto> UserHousings { get; set; }
       public List<TicketDto> Tickets { get; set; }
    }

   
    public class HousingDto
    {
        public int Rating { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public TimeOnly OpeningHours { get; set; }
        public int Price { get; set; }
    }
    public class TicketDto
    {
        public int TotalPrice { get; set; }
        public List<FlightDTO> flights { get; set; }
    }
    public class FlightDTO
    {
        public string DepartureAirport { get; set; }
        public string Destination { get; set; }
    }
}
