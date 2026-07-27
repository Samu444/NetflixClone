using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using NetflixCloneApi.Services;

namespace NetflixCloneApi.Controllers;

[ApiController]
[Route("api/series")]
public class SeriesController : ControllerBase
{
    private readonly MongoDbService _mongo;
    private readonly SeriesSyncService _syncService;

    public SeriesController(MongoDbService mongo, SeriesSyncService syncService)
    {
        _mongo = mongo;
        _syncService = syncService;
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncSeries()
    {
        await _syncService.SyncCategoryAsync("popular");
        await _syncService.SyncCategoryAsync("top_rated");
        return Ok(new { message = "Series synced successfully" });
    }

    [HttpGet("popular")]
    public async Task<IActionResult> GetPopular()
    {
        var series = await _mongo.Series.Find(s => s.Category == "popular").ToListAsync();
        return Ok(series);
    }

    [HttpGet("toprated")]
    public async Task<IActionResult> GetTopRated()
    {
        var series = await _mongo.Series.Find(s => s.Category == "top_rated").ToListAsync();
        return Ok(series);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (!MongoDB.Bson.ObjectId.TryParse(id, out _))
            return BadRequest("Invalid series ID format.");

        var series = await _mongo.Series.Find(s => s.Id == id).FirstOrDefaultAsync();
        if (series == null) return NotFound();
        return Ok(series);
    }
}