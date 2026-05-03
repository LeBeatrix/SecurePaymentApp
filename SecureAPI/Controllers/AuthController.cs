using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SecureAPI.Models;
using System.Text.RegularExpressions;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
        //user.Password = "";

        users.Add(user);

        return Ok("User registered");
    }

    [HttpPost("login")]
    public IActionResult Login(LoginModel model)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes("SUPER_SECRET_KEY_123");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Ok(new
        {
            token = tokenHandler.WriteToken(token)
        });
    }

    [Authorize]
    [HttpGet("secure")]
    public IActionResult SecureEndpoint()
    {
        return Ok("You are authorized");
    }
}