using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SecureAPI.Models;
using System.Text.RegularExpressions;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private static List<User> users = new List<User>();

    // =========================
    // REGISTER
    // =========================
    [HttpPost("register")]
    public IActionResult Register(User user)
    {
        // Validate name
        if (string.IsNullOrEmpty(user.Name) ||
            !Regex.IsMatch(user.Name, @"^[A-Za-z\s]{2,50}$"))
            return BadRequest("Invalid name");

        // Validate account number
        if (string.IsNullOrEmpty(user.AccountNumber) ||
            !Regex.IsMatch(user.AccountNumber, @"^[0-9]{10,12}$"))
            return BadRequest("Invalid account");

        // Validate password strength
        if (string.IsNullOrEmpty(user.Password) || user.Password.Length < 8)
            return BadRequest("Weak password");

        // Hash password (secure storage)
        var hasher = new PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, user.Password);

        // Remove plain password for security
        user.Password = null;

        users.Add(user);

        return Ok("User registered successfully");
    }

    // =========================
    // LOGIN (SECURE)
    // =========================
    [HttpPost("login")]
    public IActionResult Login(LoginModel model)
    {
        // Basic null validation
        if (string.IsNullOrEmpty(model?.Account) || string.IsNullOrEmpty(model?.Password))
            return BadRequest("Invalid login data");

        // Find user
        var user = users.FirstOrDefault(u => u.AccountNumber == model.Account);

        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            return Unauthorized("Invalid credentials");

        // Verify hashed password
        var hasher = new PasswordHasher<User>();

        var result = hasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            model.Password
        );

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid credentials");

        // =========================
        // JWT TOKEN GENERATION
        // =========================
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes("SUPER_SECRET_KEY_123");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.Name, user.Name ?? ""),
            new Claim(ClaimTypes.NameIdentifier, user.AccountNumber ?? "")
        }),

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

    // =========================
    // PROTECTED ENDPOINT
    // =========================
    [Authorize]
    [HttpGet("secure")]
    public IActionResult SecureEndpoint()
    {
        return Ok("You are authorized");
    }
}