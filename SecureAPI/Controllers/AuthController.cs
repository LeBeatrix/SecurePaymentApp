using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SecureAPI.Models;
using System.Text.RegularExpressions;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private static List<User> users = new List<User>();

    [HttpPost("register")]
    public IActionResult Register(User user)
    {
        if (!Regex.IsMatch(user.Name, @"^[A-Za-z\s]{2,50}$"))
            return BadRequest("Invalid name");

        if (!Regex.IsMatch(user.AccountNumber, @"^[0-9]{10,12}$"))
            return BadRequest("Invalid account");

        if (string.IsNullOrEmpty(user.Password) || user.Password.Length < 8)
            return BadRequest("Weak password");

        var hasher = new PasswordHasher<User>();

        // 🔐 HASH THE ACTUAL PASSWORD
        user.PasswordHash = hasher.HashPassword(user, user.Password);

        // ❗ Remove plain password before saving
        user.Password = null;

        users.Add(user);

        return Ok("User registered");
    }

    [HttpPost("login")]
    public IActionResult Login(LoginModel model)
    {
        var user = users.FirstOrDefault(u => u.AccountNumber == model.Account);
        if (user == null) return Unauthorized();

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, model.Password);

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized();

        return Ok("Login successful");
    }
}