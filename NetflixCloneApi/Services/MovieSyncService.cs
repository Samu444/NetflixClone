using System.Text.Json;
using MongoDB.Driver;
using NetflixCloneApi.Models;

namespace NetflixCloneApi.Services;

public class MovieSyncService
{
    private readonly MongoDbService _mongo;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    // TMDB genre id -> name map (common ones)
    private static readonly Dictionary<int, string> GenreMap = new()
    {
        {28,"Action"},{12,"Adventure"},{16,"Animation"},{35,"Comedy"},{80,"Crime"},
        {99,"Documentary"},{18,"Drama"},{10751,"Family"},{14,"Fantasy"},{36,"History"},
        {27,"Horror"},{10402,"Music"},{9648,"Mystery"},{10749,"Romance"},{878,"Science Fiction"},
        {10770,"TV Movie"},{53,"Thriller"},{10752,"War"},{37,"Western"}
    };

    public MovieSyncService(MongoDbService mongo, IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _mongo = mongo;
        _httpClientFactory = httpClientFactory;
        _config = config;
    }

    public async Task SyncCategoryAsync(string category)
    {
        var apiKey = _config["Tmdb:ApiKey"];
        var client = _httpClientFactory.CreateClient();
        var url = $"https://api.themoviedb.org/3/movie/{category}?api_key={apiKey}&language=en-US&page=1";

        var response = await client.GetAsync(url);
        if (!response.IsSuccessStatusCode) return;

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var results = doc.RootElement.GetProperty("results");

        foreach (var item in results.EnumerateArray())
        {
            var tmdbId = item.GetProperty("id").GetInt32();

            var exists = await _mongo.Movies.Find(m => m.TmdbId == tmdbId && m.Category == category).AnyAsync();
            if (exists) continue;

            var genreIds = item.GetProperty("genre_ids").EnumerateArray().Select(g => g.GetInt32()).ToList();
            var genreNames = genreIds.Where(GenreMap.ContainsKey).Select(g => GenreMap[g]).ToList();

            // Fetch trailer key
            var trailerKey = await GetTrailerKey(tmdbId, apiKey!, client);

            var movie = new Movie
            {
                TmdbId = tmdbId,
                Title = item.GetProperty("title").GetString() ?? "",
                Overview = item.GetProperty("overview").GetString() ?? "",
                PosterPath = item.TryGetProperty("poster_path", out var p) && p.ValueKind != JsonValueKind.Null ? p.GetString() ?? "" : "",
                BackdropPath = item.TryGetProperty("backdrop_path", out var b) && b.ValueKind != JsonValueKind.Null ? b.GetString() ?? "" : "",
                ReleaseDate = item.TryGetProperty("release_date", out var r) ? r.GetString() ?? "" : "",
                VoteAverage = item.TryGetProperty("vote_average", out var v) ? v.GetDouble() : 0,
                Genres = genreNames,
                TrailerKey = trailerKey,
                Category = category
            };

            await _mongo.Movies.InsertOneAsync(movie);
        }
    }

    private async Task<string> GetTrailerKey(int tmdbId, string apiKey, HttpClient client)
    {
        try
        {
            var url = $"https://api.themoviedb.org/3/movie/{tmdbId}/videos?api_key={apiKey}&language=en-US";
            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode) return "";

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var results = doc.RootElement.GetProperty("results");

            foreach (var v in results.EnumerateArray())
            {
                var type = v.GetProperty("type").GetString();
                var site = v.GetProperty("site").GetString();
                if (type == "Trailer" && site == "YouTube")
                    return v.GetProperty("key").GetString() ?? "";
            }
        }
        catch { }
        return "";
    }
}