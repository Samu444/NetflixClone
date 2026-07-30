using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NetflixCloneApi.DTOs;
using NetflixCloneApi.Models;
using NetflixCloneApi.Services;

namespace NetflixCloneApi.Controllers;

[ApiController]
[Route("api/profiles")]
[Authorize]
public class ProfilesController : ControllerBase
{
    private readonly MongoDbService _mongo;

    public ProfilesController(MongoDbService mongo)
    {
        _mongo = mongo;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";
    }

    [HttpGet]
    public async Task<IActionResult> GetProfiles()
    {
        var userId = GetUserId();
        var profiles = await _mongo.Profiles.Find(p => p.UserId == userId).ToListAsync();

        // Auto-create a default profile if the user has none yet
        if (profiles.Count == 0)
        {
            var defaultProfile = new Profile
            {
                UserId = userId,
                Name = "Profile 1",
                AvatarSeed = userId,
                IsKids = false
            };
            await _mongo.Profiles.InsertOneAsync(defaultProfile);
            profiles.Add(defaultProfile);
        }

        return Ok(profiles);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile(CreateProfileDto dto)
    {
        var userId = GetUserId();

        var count = await _mongo.Profiles.CountDocumentsAsync(p => p.UserId == userId);
        if (count >= 5)
            return BadRequest("Maximum of 5 profiles allowed per account.");

        var profile = new Profile
        {
            UserId = userId,
            Name = dto.Name,
            AvatarSeed = string.IsNullOrEmpty(dto.AvatarSeed) ? Guid.NewGuid().ToString() : dto.AvatarSeed,
            IsKids = dto.IsKids
        };

        await _mongo.Profiles.InsertOneAsync(profile);
        return Ok(profile);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(string id, UpdateProfileDto dto)
    {
        var userId = GetUserId();
        var profile = await _mongo.Profiles.Find(p => p.Id == id && p.UserId == userId).FirstOrDefaultAsync();
        if (profile == null) return NotFound();

        var update = Builders<Profile>.Update
            .Set(p => p.Name, dto.Name)
            .Set(p => p.AvatarSeed, dto.AvatarSeed)
            .Set(p => p.IsKids, dto.IsKids);

        await _mongo.Profiles.UpdateOneAsync(p => p.Id == id, update);
        return Ok(new { message = "Profile updated." });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProfile(string id)
    {
        var userId = GetUserId();
        var count = await _mongo.Profiles.CountDocumentsAsync(p => p.UserId == userId);
        if (count <= 1)
            return BadRequest("You must have at least one profile.");

        var result = await _mongo.Profiles.DeleteOneAsync(p => p.Id == id && p.UserId == userId);
        if (result.DeletedCount == 0) return NotFound();

        return Ok(new { message = "Profile deleted." });
    }
}