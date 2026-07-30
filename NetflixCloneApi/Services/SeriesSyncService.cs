using System.Text.Json;
using MongoDB.Driver;
using NetflixCloneApi.Models;

namespace NetflixCloneApi.Services;

public class SeriesSyncService
{
    private readonly MongoDbService _mongo;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    private static readonly HashSet<string> KidsRatings = new() { "TV-Y", "TV-Y7", "TV-G", "TV-PG" };
    private static readonly HashSet<string> KidsGenres = new() { "Animation", "Family", "Kids" };

    private static readonly Dictionary<int, string> GenreMap = new()
    {
        {10759,"Action & Adventure"},{16,"Animation"},{35,"Comedy"},{80,"Crime"},
        {99,"Documentary"},{18,"Drama"},{10751,"Family"},{10762,"Kids"},
        {9648,"Mystery"},{10763,"News"},{10764,"Reality"},{10765,"Sci-Fi & Fantasy"},
        {10766,"Soap"},{10767,"Talk"},{10768,"War & Politics"},{37,"Western"}
    };

    public SeriesSyncService(MongoDbService mongo, IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _mongo = mongo;
        _httpClientFactory = httpClientFactory;
        _config = config;
    }

    public async Task SyncCategoryAsync(string category)
    {
        var apiKey = _config["Tmdb:ApiKey"];
        var client = _httpClientFactory.CreateClient();
        var url = $"https://api.themoviedb.org/3/tv/{category}?api_key={apiKey}&language=en-US&page=1";

        var response = await client.GetAsync(url);
        if (!response.IsSuccessStatusCode) return;

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var results = doc.RootElement.GetProperty("results");

        foreach (var item in results.EnumerateArray())
        {
            var tmdbId = item.GetProperty("id").GetInt32();

            var exists = await _mongo.Series.Find(s => s.TmdbId == tmdbId && s.Category == category).AnyAsync();
            if (exists) continue;

            var genreIds = item.GetProperty("genre_ids").EnumerateArray().Select(g => g.GetInt32()).ToList();
            var genreNames = genreIds.Where(GenreMap.ContainsKey).Select(g => GenreMap[g]).ToList();

            var trailerKey = await GetTrailerKey(tmdbId, apiKey!, client);
            var cast = await GetCast(tmdbId, apiKey!, client);
            var (seasons, rating) = await GetDetails(tmdbId, apiKey!, client);

            var series = new Series
            {
                TmdbId = tmdbId,
                Title = item.GetProperty("name").GetString() ?? "",
                Overview = item.GetProperty("overview").GetString() ?? "",
                PosterPath = item.TryGetProperty("poster_path", out var p) && p.ValueKind != JsonValueKind.Null ? p.GetString() ?? "" : "",
                BackdropPath = item.TryGetProperty("backdrop_path", out var b) && b.ValueKind != JsonValueKind.Null ? b.GetString() ?? "" : "",
                FirstAirDate = item.TryGetProperty("first_air_date", out var r) ? r.GetString() ?? "" : "",
                VoteAverage = item.TryGetProperty("vote_average", out var v) ? v.GetDouble() : 0,
                Genres = genreNames,
                Cast = cast,
                NumberOfSeasons = seasons,
                ContentRating = rating,
                TrailerKey = trailerKey,
                IsKidsContent = DetermineIsKidsContent(genreNames, rating), 
                Category = category
            };


            

            await _mongo.Series.InsertOneAsync(series);
        }
    }

    private bool DetermineIsKidsContent(List<string> genres, string rating)
    {
        bool ratingOk = KidsRatings.Contains(rating);
        bool genreOk = genres.Any(g => KidsGenres.Contains(g));
        return genreOk || (ratingOk && genres.Count > 0);
    }

    private async Task<string> GetTrailerKey(int tmdbId, string apiKey, HttpClient client)
    {
        try
        {
            var url = $"https://api.themoviedb.org/3/tv/{tmdbId}/videos?api_key={apiKey}&language=en-US";
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
            var url = $"https://api.themoviedb.org/3/tv/{tmdbId}/credits?api_key={apiKey}&language=en-US";
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

    private async Task<(int Seasons, string Rating)> GetDetails(int tmdbId, string apiKey, HttpClient client)
    {
        int seasons = 0;
        string rating = "";

        try
        {
            var url = $"https://api.themoviedb.org/3/tv/{tmdbId}?api_key={apiKey}&language=en-US";
            var response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                if (doc.RootElement.TryGetProperty("number_of_seasons", out var s) && s.ValueKind == JsonValueKind.Number)
                    seasons = s.GetInt32();
            }
        }
        catch { }

        try
        {
            var certUrl = $"https://api.themoviedb.org/3/tv/{tmdbId}/content_ratings?api_key={apiKey}";
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
                        rating = country.GetProperty("rating").GetString() ?? "";
                        break;
                    }
                }
            }
        }
        catch { }

        return (seasons, rating);
    }
}