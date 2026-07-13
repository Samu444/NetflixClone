using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NetflixCloneApi.Models;

[BsonIgnoreExtraElements]
public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsVerified { get; set; } = false;
    public string? VerificationCode { get; set; }
    public DateTime? VerificationCodeExpires { get; set; }
}