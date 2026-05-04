using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecureAPI.Data;
using SecureAPI.Models;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly AppDbContext _context;

    public PaymentController(AppDbContext context)
    {
        _context = context;
    }

    // =========================
    // SEND PAYMENT (SECURED)
    // =========================
    [Authorize]
    [HttpPost("send")]
    public IActionResult SendPayment([FromBody] Payment model)
    {
        if (model.Amount <= 0)
            return BadRequest("Invalid amount");

        if (string.IsNullOrEmpty(model.BeneficiaryAccount))
            return BadRequest("Invalid beneficiary");

        // Get logged-in user (from JWT)
        var account = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (account == null)
            return Unauthorized();

        var payment = new Payment
        {
            AccountNumber = account,
            Amount = model.Amount,
            Currency = model.Currency,
            SwiftCode = model.SwiftCode,
            BeneficiaryAccount = model.BeneficiaryAccount,
            Timestamp = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        _context.SaveChanges();

        return Ok(new
        {
            message = "Payment processed successfully",
            paymentId = payment.Id
        });
    }
}