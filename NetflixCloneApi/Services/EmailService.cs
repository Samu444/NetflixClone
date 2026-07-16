using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace NetflixCloneApi.Services;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendVerificationEmailAsync(string toEmail, string toName, string code)
    {
        var senderEmail = _config["Email:SenderEmail"] ?? throw new InvalidOperationException("Email:SenderEmail not configured");
        var senderPassword = _config["Email:SenderPassword"] ?? throw new InvalidOperationException("Email:SenderPassword not configured");
        var senderName = _config["Email:SenderName"] ?? "Netflix Clone";
        
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = "Verify your Netflix Clone account";

        message.Body = new TextPart("html")
        {
            Text = $@"
                <div style='font-family: Arial, sans-serif; padding: 20px; background: #141414; color: white;'>
                    <h1 style='color: #e50914;'>NETFLIX</h1>
                    <h2>Verify your email</h2>
                    <p>Hi {toName},</p>
                    <p>Thanks for signing up! Use the code below to verify your account:</p>
                    <h1 style='letter-spacing: 8px; background: #333; padding: 16px; text-align: center; border-radius: 6px;'>{code}</h1>
                    <p style='color: #b3b3b3;'>This code expires in 10 minutes.</p>
                </div>"
        };

        using var client = new SmtpClient();
        await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(senderEmail, senderPassword);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string toName, string code)
{
    var senderEmail = _config["Email:SenderEmail"] ?? throw new InvalidOperationException("Email:SenderEmail not configured");
    var senderPassword = _config["Email:SenderPassword"] ?? throw new InvalidOperationException("Email:SenderPassword not configured");
    var senderName = _config["Email:SenderName"] ?? "Netflix Clone";

    var message = new MimeMessage();
    message.From.Add(new MailboxAddress(senderName, senderEmail));
    message.To.Add(new MailboxAddress(toName, toEmail));
    message.Subject = "Reset your Netflix Clone password";

    message.Body = new TextPart("html")
    {
        Text = $@"
            <div style='font-family: Arial, sans-serif; padding: 20px; background: #141414; color: white;'>
                <h1 style='color: #e50914;'>NETFLIX</h1>
                <h2>Reset your password</h2>
                <p>Hi {toName},</p>
                <p>We received a request to reset your password. Use the code below:</p>
                <h1 style='letter-spacing: 8px; background: #333; padding: 16px; text-align: center; border-radius: 6px;'>{code}</h1>
                <p style='color: #b3b3b3;'>This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
            </div>"
    };

    using var client = new SmtpClient();
    await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
    await client.AuthenticateAsync(senderEmail, senderPassword);
    await client.SendAsync(message);
    await client.DisconnectAsync(true);
}
}

