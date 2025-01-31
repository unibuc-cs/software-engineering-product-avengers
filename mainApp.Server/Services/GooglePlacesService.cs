using System.Text.Json;

namespace mainApp.Server.Services
{
    public class GooglePlacesService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GooglePlacesService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _apiKey = "AIzaSyDnGvCerrbXMJKaPZ_roAiZC9xEAkL8KPg";
        }
        public string GeneratePhotoLink(string photoReference)
        {
            string imageUrl = $"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={photoReference}&key={_apiKey}";
            return imageUrl;
        }
        public async Task<string> GetHotelbyPlaceIdAsync(string placeId)
        {
            string url = $"https://maps.googleapis.com/maps/api/place/details/json?placeid={placeId}&key={_apiKey}";
           // Console.WriteLine(url);
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var res = await response.Content.ReadAsStringAsync();
            return res;
        }
        
        public async Task<string> GetHotelsAsync(string location)
        {

       

            string url = $"https://maps.googleapis.com/maps/api/place/textsearch/json?query=hotel+in+{location}&key={_apiKey}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var res = await response.Content.ReadAsStringAsync();
            
            return res;
        }

    }
}
