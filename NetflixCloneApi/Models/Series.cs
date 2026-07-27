using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NetflixCloneApi.Models;

[BsonIgnoreExtraElements]
public class Series
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    public int TmdbId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Overview { get; set; } = string.Empty;
    public string PosterPath { get; set; } = string.Empty;
    public string BackdropPath { get; set; } = string.Empty;
    public string FirstAirDate { get; set; } = string.Empty;
    public double VoteAverage { get; set; }
    public List<string> Genres { get; set; } = new();
    public string TrailerKey { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // "popular" or "top_rated"
}