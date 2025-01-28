using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;

public class EmailService
{
    
    public async Task SendEmailAsync(string toEmail, string subject, string body)
    {
        var apiKey = "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";
        var client = new SendGridClient(apiKey);
        var from = new EmailAddress("travelmonster42@gmail.com", "TravelMonster");
        var to = new EmailAddress(toEmail);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, body, "");

        var response = await client.SendEmailAsync(msg);

      
        if (response.StatusCode.ToString() != "Accepted" )
        {
            Exception ex = new Exception(response.StatusCode.ToString());
            
            throw ex;
        }
    }
}
