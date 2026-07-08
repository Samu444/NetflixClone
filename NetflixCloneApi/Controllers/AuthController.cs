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

    public AuthController(MongoDbService mongo, TokenService tokenService)
    {
        _mongo = mongo;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        var exists = await _mongo.Users
            .Find(u => u.Email == dto.Email)
            .AnyAsync();

        if (exists) return BadRequest("Email already exists.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        await _mongo.Users.InsertOneAsync(user);

        return Ok(new AuthResponseDto
        {
            Token = _tokenService.CreateToken(user),
            Name = user.Name,
            Email = user.Email
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _mongo.Users
            .Find(u => u.Email == dto.Email)
            .FirstOrDefaultAsync();

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid email or password.");

        return Ok(new AuthResponseDto
        {
            Token = _tokenService.CreateToken(user),
            Name = user.Name,
            Email = user.Email
        });
    }
}