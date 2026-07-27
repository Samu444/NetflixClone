using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NetflixCloneApi.Models;

[BsonIgnoreExtraElements]
public class Profile
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public string UserId { get; set; } = string.Empty; // owning account
    public string Name { get; set; } = string.Empty;
    public string AvatarSeed { get; set; } = string.Empty; // used to generate avatar image
    public bool IsKids { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}