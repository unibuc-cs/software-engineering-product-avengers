using mainApp.Server.Data.DTO;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

public class EmailService
{

    private const string _apiKey = "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";
    private const string senderEmail = "travelmonster42@gmail.com";
   
    public virtual async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        
        var client = new SendGridClient(_apiKey);
        var from = new EmailAddress(senderEmail, "TravelMonster");
        var to = new EmailAddress(toEmail);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, body, "");

        var response = await client.SendEmailAsync(msg);

      
        if (response.StatusCode.ToString() != "Accepted" )
        {
            Exception ex = new Exception(response.StatusCode.ToString());
            
            throw ex;
        }
    }

    public async Task SendEmailReservationAsync(string toEmail, ReservationDto reservationDto)
    {

        var client = new SendGridClient(_apiKey);
        var from = new EmailAddress(senderEmail, "TravelMonster");
        var to = new EmailAddress(toEmail);
        var msg = new SendGridMessage
        {
            From = from,
            TemplateId = "d-2686d8c112b843df8ecbd9b86287136e"
        };

        msg.AddTo(to);
        msg.SetTemplateData(new
        {
            name = reservationDto.name,
            hotel = reservationDto.hotel,
            address = reservationDto.address,
            checkin = reservationDto.checkin,
            checkout = reservationDto.checkout,
            link = reservationDto.link,
        });

        var response = await client.SendEmailAsync(msg);


        if (response.StatusCode.ToString() != "Accepted")
        {
            Exception ex = new Exception(response.StatusCode.ToString());

            throw ex;
        }
    }
}
