using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;


public class AmadeusClient
{
    private readonly HttpClient _httpClient;
    private readonly AmadeusSettings _settings;
    private string _accessToken;

    public AmadeusClient(HttpClient httpClient, IOptions<AmadeusSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
    }
    public async Task AuthenticateAsync()
    {
        //var credentials = new Dictionary<string, string>
        //{   
        //    { "grant_type", "client_credentials" },
        //    { "client_id", _settings.ClientId },
        //    { "client_secret", _settings.ClientSecret }
        //};

        //using var requestBody = new FormUrlEncodedContent(credentials);
        //var response = await _httpClient.PostAsync("v1/security/oauth2/token", requestBody);
        //var responseContent = await response.Content.ReadAsStringAsync();
        //using var document = JsonDocument.Parse(responseContent);

        //if (document.RootElement.TryGetProperty("access_token", out var accessTokenElement))
        //{
        //    var accessToken = accessTokenElement.GetString();
        //    _accessToken = accessToken;
        //}
        _accessToken = "ctFq7GLdickk1LyRsJGr6QNdISCP";
        Console.WriteLine(_accessToken);
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
    }
    private async Task<string> PostFlightPricingAsync(string flightOffersJson)
    {
        // Parsează răspunsul JSON pentru a extrage `data` (lista flight offers)
        var jsonDocument = JsonDocument.Parse(flightOffersJson);
        if (!jsonDocument.RootElement.TryGetProperty("data", out var flightOffersArray))
        {
            throw new InvalidOperationException("Invalid JSON: Missing 'data' property.");
        }

        // Construim corpul cererii pentru `pricing`
        var pricingRequest = new
        {
            data = new
            {
                type = "flight-offers-pricing",
                flightOffers = JsonSerializer.Deserialize<object[]>(flightOffersArray.GetRawText())
            }
        };

        // Serializăm corpul cererii în JSON
        var pricingRequestJson = JsonSerializer.Serialize(pricingRequest);

        // Endpoint-ul pentru pricing
        var pricingEndpoint = "v1/shopping/flight-offers/pricing";

        // Creează cererea POST
        var request = new HttpRequestMessage(HttpMethod.Post, pricingEndpoint)
        {
            Content = new StringContent(pricingRequestJson, Encoding.UTF8, "application/json")
        };

        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

        // Trimitem cererea
        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Failed to price flight offers. Status: {response.StatusCode}, Content: {content}");
        }

        // Returnăm răspunsul ca string JSON
        return await response.Content.ReadAsStringAsync();
    }



    public async Task<string> GetFlightOffersAsync(string origin, string destination, string departureDate, string returnDate, int numberofadults)
    {
        if (string.IsNullOrEmpty(_accessToken))
        {
            await AuthenticateAsync();
        }

        var endpoint = $"v2/shopping/flight-offers?originLocationCode={origin}&destinationLocationCode={destination}&departureDate={departureDate}&returnDate={returnDate}&adults={numberofadults}&max=5";
        var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Failed to fetch flight offers. Status: {response.StatusCode}, Content: {content}");
        }
        var jsonString = await response.Content.ReadAsStringAsync();
        var pricingResult = await PostFlightPricingAsync(jsonString);

        return pricingResult;
    }

    private class AuthResponse
    {
        public string? AccessToken { get; set; }
    }
}