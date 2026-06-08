namespace SecureAPI.Models;

public class RegisterModel
{
    public required string Name { get; set; }
    public required string AccountNumber { get; set; }
    public required string Password { get; set; }
}