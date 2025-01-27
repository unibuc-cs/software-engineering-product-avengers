namespace mainApp.Server.Data.DTO
{
    public class FlightResponseDTO
    {
        public List<ItineraryDto> Itineraries { get; set; }
        public PriceDto Price { get; set; }
    }

    public class ItineraryDto
    {
        public List<SegmentDto> Segments { get; set; }
    }

    public class SegmentDto
    {
        public string DepartureAirport { get; set; }
        public DateTime DepartureTime { get; set; }
        public string ArrivalAirport { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string CarrierCode { get; set; }
        public string FlightNumber { get; set; }
        public string Duration { get; set; }
    }

    public class PriceDto
    {
        public string Currency { get; set; }
        public string Total { get; set; }
        public string Base { get; set; }
    }

}
