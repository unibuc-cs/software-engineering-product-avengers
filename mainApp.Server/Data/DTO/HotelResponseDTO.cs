namespace mainApp.Server.Data.DTO
{
   
    public class AccommodationAndFlight{
    public Accommodation hotelDetails { get; set; }
        public FlightResponseDTO flightDetails { get; set; }

}
    public class Accommodation
    {
        
        public string placeId { get; set; }
       public string address {  get; set; }
       public string name { get; set; }
        public double rating { get; set;}
        public int totalUserRating { get; set;}
        public location location { get; set; }
        public int price { get; set;}
        public List<string> photos { get; set; }

        
        
    }

    public class location
    {
        public double latitude { get; set; }
        public double longitude { get; set; }
    }

}
