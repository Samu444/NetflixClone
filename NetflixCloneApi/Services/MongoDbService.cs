using MongoDB.Driver;
using NetflixCloneApi.Models;

namespace NetflixCloneApi.Services;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService(IConfiguration config)
    {
        var client = new MongoClient(config["MongoDB:ConnectionString"]);
        _database = client.GetDatabase(config["MongoDB:DatabaseName"]);
        SeedUsers();
    }

    public IMongoCollection<User> Users =>
        _database.GetCollection<User>("users");

    private void SeedUsers()
    {
        var exists = Users.Find(_ => true).Any();
        if (!exists)
        {
            Users.InsertMany(new List<User>
            {
                new User
                {
                    Name = "John",
                    Email = "john@gmail.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("john123")
                },
                new User
                {
                    Name = "Sarah",
                    Email = "sarah@gmail.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("sarah123")
                }
            });
        }
    }
}