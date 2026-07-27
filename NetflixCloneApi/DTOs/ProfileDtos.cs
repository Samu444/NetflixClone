namespace NetflixCloneApi.DTOs;

public class CreateProfileDto
{
    public string Name { get; set; } = string.Empty;
    public string AvatarSeed { get; set; } = string.Empty;
    public bool IsKids { get; set; } = false;
}

public class UpdateProfileDto
{
    public string Name { get; set; } = string.Empty;
    public string AvatarSeed { get; set; } = string.Empty;
}