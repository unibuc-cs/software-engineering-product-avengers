using Microsoft.Build.Framework;

namespace mainApp.Server.Data.DTO
{
    public class ReservationTicketRequestDTO
    {
        public FlightResponseDTO Flight { get; set; }
        public List<PassengerDto> Passengers { get; set; }
    }

    public class PassengerDto
    {
        public string FullName { get; set; }
        public bool BagajMana { get; set; }
        public bool BagajCala { get; set; }
    }

}
