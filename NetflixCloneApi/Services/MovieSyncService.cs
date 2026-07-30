using System.Text.Json;
using MongoDB.Driver;
using NetflixCloneApi.Models;

namespace NetflixCloneApi.Services;

public class MovieSyncService
{
    private readonly MongoDbService _mongo;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    private static readonly HashSet<string> KidsRatings = new() { "G", "PG" };
    private static readonly HashSet<string> KidsGenres = new() { "Animation", "Family" };

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

            var trailerKey = await GetTrailerKey(tmdbId, apiKey!, client);
            var cast = await GetCast(tmdbId, apiKey!, client);
            var (runtime, rating) = await GetDetails(tmdbId, apiKey!, client);

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
                Cast = cast,
                Runtime = runtime,
                ContentRating = rating,
                IsKidsContent = DetermineIsKidsContent(genreNames, rating), // ← add this line
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

    private async Task<List<string>> GetCast(int tmdbId, string apiKey, HttpClient client)
    {
        var cast = new List<string>();
        try
        {
            var url = $"https://api.themoviedb.org/3/movie/{tmdbId}/credits?api_key={apiKey}&language=en-US";
            var response = await client.GetAsync(url);
            if (!response.IsSuccessStatusCode) return cast;

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var castArray = doc.RootElement.GetProperty("cast");

            foreach (var actor in castArray.EnumerateArray().Take(6))
            {
                var name = actor.GetProperty("name").GetString();
                if (!string.IsNullOrEmpty(name)) cast.Add(name);
            }
        }
        catch { }
        return cast;
    }

    private bool DetermineIsKidsContent(List<string> genres, string rating)
    {
        bool ratingOk = KidsRatings.Contains(rating);
        bool genreOk = genres.Any(g => KidsGenres.Contains(g));
        // Require genre match; rating alone is unreliable (often blank from TMDB)
        return genreOk || (ratingOk && genres.Count > 0);
    }

    private async Task<(int Runtime, string Rating)> GetDetails(int tmdbId, string apiKey, HttpClient client)
    {
        int runtime = 0;
        string rating = "";

        try
        {
            var url = $"https://api.themoviedb.org/3/movie/{tmdbId}?api_key={apiKey}&language=en-US";
            var response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("runtime", out var r) && r.ValueKind == JsonValueKind.Number)
                    runtime = r.GetInt32();
            }
        }
        catch { }

        try
        {
            var certUrl = $"https://api.themoviedb.org/3/movie/{tmdbId}/release_dates?api_key={apiKey}";
            var certResponse = await client.GetAsync(certUrl);
            if (certResponse.IsSuccessStatusCode)
            {
                var certJson = await certResponse.Content.ReadAsStringAsync();
                using var certDoc = JsonDocument.Parse(certJson);
                var results = certDoc.RootElement.GetProperty("results");

                foreach (var country in results.EnumerateArray())
                {
                    if (country.GetProperty("iso_3166_1").GetString() == "US")
                    {
                        foreach (var rd in country.GetProperty("release_dates").EnumerateArray())
                        {
                            var certification = rd.GetProperty("certification").GetString();
                            if (!string.IsNullOrEmpty(certification))
                            {
                                rating = certification;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }
        catch { }

        return (runtime, rating);
    }
}
