namespace mainApp.Server.Data.DTO
{
    public class ReservationRequestDto
    {
        public FlightResponseDTO FlightDetails { get; set; }
        public Accommodation HotelDetails { get; set; }
        public ItineraryResponseDto Itinerary { get; set; }
        public TripDatesDto TripDates { get; set; }
        public string TripName { get; set; }
    }

}
