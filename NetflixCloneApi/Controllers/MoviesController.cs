using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NetflixCloneApi.Services;

namespace NetflixCloneApi.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController : ControllerBase
{
    private readonly MongoDbService _mongo;
    private readonly MovieSyncService _syncService;

    public MoviesController(MongoDbService mongo, MovieSyncService syncService)
    {
        _mongo = mongo;
        _syncService = syncService;
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncMovies()
    {
        await _syncService.SyncCategoryAsync("popular");
        await _syncService.SyncCategoryAsync("top_rated");
        return Ok(new { message = "Movies synced successfully" });
    }

    [HttpGet("popular")]
    public async Task<IActionResult> GetPopular()
    {
        var movies = await _mongo.Movies.Find(m => m.Category == "popular").ToListAsync();
        return Ok(movies);
    }

    [HttpGet("toprated")]
    public async Task<IActionResult> GetTopRated()
    {
        var movies = await _mongo.Movies.Find(m => m.Category == "top_rated").ToListAsync();
        return Ok(movies);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var movie = await _mongo.Movies.Find(m => m.Id == id).FirstOrDefaultAsync();
        if (movie == null) return NotFound();
        return Ok(movie);
    }
}