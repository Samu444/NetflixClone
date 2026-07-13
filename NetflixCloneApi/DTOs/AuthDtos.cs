namespace NetflixCloneApi.DTOs;

public class RegisterDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class VerifyEmailDto
{
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class RegisterResponseDto
{
    public string Message { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    // ⚠️ DEMO ONLY - remove in production, this simulates "sending" the email
    public string DemoVerificationCode { get; set; } = string.Empty;
}