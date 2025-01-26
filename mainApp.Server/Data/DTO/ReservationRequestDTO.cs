using Microsoft.Build.Framework;

namespace mainApp.Server.Data.DTO
{
    public class ReservationRequestDto
    {
        public PricingDataDto Data { get; set; }
    }

    public class PricingDataDto
    {
        public List<FlightOfferDto> FlightOffers { get; set; }
    }

    public class FlightOfferDto
    {
        public string Id { get; set; }
        public List<ItineraryDto> Itineraries { get; set; }
        public PriceDto Price { get; set; }
    }

    public class ItineraryDto
    {
        public List<SegmentDto> Segments { get; set; }
    }

    public class SegmentDto
    {
        public DepartureArrivalDto Departure { get; set; }
        public DepartureArrivalDto Arrival { get; set; }
        //public string CarrierCode { get; set; }
        //public string Number { get; set; }
        public string Duration { get; set; }
    }

    public class DepartureArrivalDto
    {
        public string IataCode { get; set; }
        public DateTime At { get; set; }
    }

    public class PriceDto
    {
        public string Currency { get; set; }
        public string Total { get; set; }
    }

}
