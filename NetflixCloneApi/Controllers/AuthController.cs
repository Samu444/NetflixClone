using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NetflixCloneApi.DTOs;
using NetflixCloneApi.Models;
using NetflixCloneApi.Services;

namespace NetflixCloneApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly MongoDbService _mongo;
    private readonly TokenService _tokenService;
    private readonly EmailService _emailService;

    public AuthController(MongoDbService mongo, TokenService tokenService, EmailService emailService)
    {
        _mongo = mongo;
        _tokenService = tokenService;
        _emailService = emailService;
    }

    [HttpPost("register")]
public async Task<ActionResult<RegisterResponseDto>> Register(RegisterDto dto)
{
    var exists = await _mongo.Users
        .Find(u => u.Email == dto.Email)
        .AnyAsync();

    if (exists) return BadRequest("Email already exists.");

    var code = new Random().Next(100000, 999999).ToString();

    var user = new User
    {
        Name = dto.Name,
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        IsVerified = false,
        VerificationCode = code,
        VerificationCodeExpires = DateTime.UtcNow.AddMinutes(10)
    };

    await _mongo.Users.InsertOneAsync(user);

    try
    {
        await _emailService.SendVerificationEmailAsync(user.Email, user.Name, code);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Email failed to send: {ex.Message}");
        // Still log the code so testing isn't blocked if email fails
        Console.WriteLine($"[FALLBACK] Verification code for {user.Email}: {code}");
    }

    return Ok(new RegisterResponseDto
    {
        Message = "Account created. Please check your email for the verification code.",
        Email = user.Email
    });
}

    [HttpPost("verify-email")]
public async Task<ActionResult> VerifyEmail(VerifyEmailDto dto)
{
    var user = await _mongo.Users
        .Find(u => u.Email == dto.Email)
        .FirstOrDefaultAsync();

    if (user == null) return NotFound("User not found.");
    if (user.IsVerified) return BadRequest("Account already verified.");

    if (user.VerificationCode != dto.Code)
        return BadRequest("Invalid verification code.");

    if (user.VerificationCodeExpires < DateTime.UtcNow)
        return BadRequest("Verification code expired. Please register again.");

    var update = Builders<User>.Update
        .Set(u => u.IsVerified, true)
        .Set(u => u.VerificationCode, (string?)null)
        .Set(u => u.VerificationCodeExpires, (DateTime?)null);

    await _mongo.Users.UpdateOneAsync(u => u.Id == user.Id, update);

    return Ok(new { message = "Email verified successfully." });
}

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _mongo.Users
            .Find(u => u.Email == dto.Email)
            .FirstOrDefaultAsync();

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid email or password.");

        if (!user.IsVerified)
            return Unauthorized("Please verify your email before logging in.");

        return Ok(new AuthResponseDto
        {
            Token = _tokenService.CreateToken(user),
            Name = user.Name,
            Email = user.Email
        });
    }

    [HttpPost("forgot-password")]
public async Task<ActionResult> ForgotPassword(ForgotPasswordDto dto)
{
    var user = await _mongo.Users
        .Find(u => u.Email == dto.Email)
        .FirstOrDefaultAsync();

    // Always return success even if user not found - prevents email enumeration
    if (user == null)
        return Ok(new { message = "If that email exists, a reset code has been sent." });

    var code = new Random().Next(100000, 999999).ToString();

    var update = Builders<User>.Update
        .Set(u => u.ResetPasswordCode, code)
        .Set(u => u.ResetPasswordCodeExpires, DateTime.UtcNow.AddMinutes(10));

    await _mongo.Users.UpdateOneAsync(u => u.Id == user.Id, update);

    try
    {
        await _emailService.SendPasswordResetEmailAsync(user.Email, user.Name, code);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Password reset email failed: {ex.Message}");
        Console.WriteLine($"[FALLBACK] Reset code for {user.Email}: {code}");
    }

    return Ok(new { message = "If that email exists, a reset code has been sent." });
}

[HttpPost("reset-password")]
public async Task<ActionResult> ResetPassword(ResetPasswordDto dto)
{
    var user = await _mongo.Users
        .Find(u => u.Email == dto.Email)
        .FirstOrDefaultAsync();

    if (user == null) return NotFound("User not found.");

    if (user.ResetPasswordCode != dto.Code)
        return BadRequest("Invalid reset code.");

    if (user.ResetPasswordCodeExpires < DateTime.UtcNow)
        return BadRequest("Reset code expired. Please request a new one.");

    var update = Builders<User>.Update
        .Set(u => u.PasswordHash, BCrypt.Net.BCrypt.HashPassword(dto.NewPassword))
        .Set(u => u.ResetPasswordCode, (string?)null)
        .Set(u => u.ResetPasswordCodeExpires, (DateTime?)null);

    await _mongo.Users.UpdateOneAsync(u => u.Id == user.Id, update);

    return Ok(new { message = "Password reset successfully. You can now log in." });
}
}