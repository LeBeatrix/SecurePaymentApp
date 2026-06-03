using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SecureAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private readonly IConfiguration _configuration;

    private static readonly PasswordHasher<Employee> Hasher = new();

    private static readonly List<Employee> Employees = CreateEmployees();

    public EmployeeController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // =========================
    // PRE-CREATED EMPLOYEES
    // No employee registration endpoint exists.
    // =========================
    private static List<Employee> CreateEmployees()
    {
        var employee1 = new Employee
        {
            Username = "employee1",
            Role = "Employee"
        };

        employee1.PasswordHash = Hasher.HashPassword(employee1, "Employee@123");

        return new List<Employee>
        {
            employee1
        };
    }

    // =========================
    // EMPLOYEE LOGIN ONLY
    // =========================
    [HttpPost("login")]
    public IActionResult Login(EmployeeLoginModel model)
    {
        if (model == null)
            return BadRequest("Login data is required");

        if (string.IsNullOrWhiteSpace(model.Username) ||
            !Regex.IsMatch(model.Username, @"^[A-Za-z0-9]{3,30}$"))
            return BadRequest("Invalid username");

        if (string.IsNullOrWhiteSpace(model.Password))
            return BadRequest("Password required");

        var employee = Employees.FirstOrDefault(e =>
            e.Username.Equals(model.Username, StringComparison.OrdinalIgnoreCase));

        if (employee == null)
            return Unauthorized("Invalid login");

        var result = Hasher.VerifyHashedPassword(
            employee,
            employee.PasswordHash,
            model.Password
        );

        if (result == PasswordVerificationResult.Failed)
            return Unauthorized("Invalid login");

        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new Exception("JWT Key missing in appsettings.json");

        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        var key = Encoding.UTF8.GetBytes(jwtKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, employee.Username),
                new Claim(ClaimTypes.Role, employee.Role)
            }),
            Issuer = issuer,
            Audience = audience,
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return Ok(new
        {
            token = tokenHandler.WriteToken(token),
            username = employee.Username,
            role = employee.Role,
            message = "Employee login successful"
        });
    }
}