using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SecureAPI.Data;
using SecureAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // =========================
    // REGISTER (DB + HASHING)
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

        // Validate password
        if (string.IsNullOrEmpty(user.Password) || user.Password.Length < 8)
            return BadRequest("Weak password");

        // 🔍 Check if user already exists
        if (_context.Users.Any(u => u.AccountNumber == user.AccountNumber))
            return BadRequest("Account already exists");

        // 🔐 Hash password
        var hasher = new PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, user.Password);

        // ❌ Do NOT store plain password
        user.Password = null;

        // 💾 Save to database
        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(new { message = "User registered successfully" });
    }

    // =========================
    // LOGIN (DB + JWT)
    // =========================
    [HttpPost("login")]
    public IActionResult Login(LoginModel model)
    {
        if (string.IsNullOrEmpty(model?.Account) || string.IsNullOrEmpty(model?.Password))
            return BadRequest("Invalid login data");

        // 🔍 Find user in DB
        var user = _context.Users
            .FirstOrDefault(u => u.AccountNumber == model.Account);

        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            return Unauthorized("Invalid credentials");

        // 🔐 Verify password
        var hasher = new PasswordHasher<User>();

        var result = hasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            model.Password
        );

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid credentials");

        // =========================
        // JWT TOKEN
        // =========================
        var jwtKey = _configuration["Jwt:Key"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        var key = Encoding.UTF8.GetBytes(jwtKey);

        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
        new Claim(ClaimTypes.Name, user.Name ?? ""),
        new Claim(ClaimTypes.NameIdentifier, user.AccountNumber ?? "")
    }),

            Expires = DateTime.UtcNow.AddHours(1),

            Issuer = issuer,
            Audience = audience,

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
    // PROTECTED TEST ENDPOINT
    // =========================
    [Authorize]
    [HttpGet("secure")]
    public IActionResult SecureEndpoint()
    {
        return Ok("You are authorized");
    }
}