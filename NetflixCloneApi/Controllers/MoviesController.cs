using Microsoft.AspNetCore.Mvc;

namespace NetflixCloneApi.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;

    public MoviesController(IHttpClientFactory httpClientFactory, IConfiguration config)
    {
        _httpClientFactory = httpClientFactory;
        _config = config;
    }

    [HttpGet("popular")]
    public async Task<IActionResult> GetPopularMovies()
    {
        var apiKey = _config["Tmdb:ApiKey"];
        var client = _httpClientFactory.CreateClient();

        var url = $"https://api.themoviedb.org/3/movie/popular?api_key={apiKey}&language=en-US&page=1";
        var response = await client.GetAsync(url);

        if (!response.IsSuccessStatusCode)
            return StatusCode((int)response.StatusCode, "Failed to fetch from TMDB");

        var json = await response.Content.ReadAsStringAsync();
        return Content(json, "application/json");
    }
}