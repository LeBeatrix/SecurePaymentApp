using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecureAPI.Data;
using SecureAPI.Models;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace SecureAPI.Controllers;    

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
    // CUSTOMER: SEND PAYMENT
    // =========================
    [Authorize]
    [HttpPost("send")]
    public IActionResult SendPayment([FromBody] Payment model)
    {
        if (model.Amount <= 0)
            return BadRequest("Invalid amount");

        if (string.IsNullOrWhiteSpace(model.Currency) ||
            !Regex.IsMatch(model.Currency, @"^[A-Z]{3}$"))
            return BadRequest("Invalid currency");

        if (string.IsNullOrWhiteSpace(model.SwiftCode) ||
            !Regex.IsMatch(model.SwiftCode, @"^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$"))
            return BadRequest("Invalid SWIFT code");

        if (string.IsNullOrWhiteSpace(model.BeneficiaryAccount) ||
            !Regex.IsMatch(model.BeneficiaryAccount, @"^[0-9]{8,20}$"))
            return BadRequest("Invalid beneficiary account");

        var account = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? User.FindFirst(ClaimTypes.Name)?.Value;

        if (string.IsNullOrWhiteSpace(account))
            return Unauthorized("Account not found in token");

        var payment = new Payment
        {
            AccountNumber = account,
            Amount = model.Amount,
            Currency = model.Currency.ToUpper(),
            SwiftCode = model.SwiftCode.ToUpper(),
            BeneficiaryAccount = model.BeneficiaryAccount,
            Status = "Pending",
            IsVerified = false,
            Timestamp = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        _context.SaveChanges();

        return Ok(new
        {
            message = "Payment submitted successfully and is awaiting employee verification.",
            paymentId = payment.Id,
            status = payment.Status
        });
    }

    // =========================
    // EMPLOYEE: VIEW PAYMENTS
    // =========================
    [Authorize]
    [HttpGet("pending")]
    public IActionResult GetPendingPayments()
    {
        var payments = _context.Payments
            .Where(p => p.Status == "Pending" || p.Status == "Verified")
            .OrderByDescending(p => p.Timestamp)
            .ToList();

        return Ok(payments);
    }

    // =========================
    // EMPLOYEE: VERIFY PAYMENT
    // =========================
    [Authorize]
    [HttpPatch("{id}/verify")]
    public IActionResult VerifyPayment(int id)
    {
        var payment = _context.Payments.FirstOrDefault(p => p.Id == id);

        if (payment == null)
            return NotFound("Payment not found");

        if (payment.Status == "Submitted to SWIFT")
            return BadRequest("Payment has already been submitted to SWIFT");

        if (!Regex.IsMatch(payment.SwiftCode, @"^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$"))
            return BadRequest("Stored SWIFT code is invalid");

        if (!Regex.IsMatch(payment.BeneficiaryAccount, @"^[0-9]{8,20}$"))
            return BadRequest("Stored beneficiary account is invalid");

        var employeeName = User.FindFirst(ClaimTypes.Name)?.Value ?? "Employee";

        payment.Status = "Verified";
        payment.IsVerified = true;
        payment.VerifiedBy = employeeName;
        payment.VerificationDate = DateTime.UtcNow;

        _context.SaveChanges();

        return Ok(new
        {
            message = "Payment verified successfully",
            paymentId = payment.Id,
            status = payment.Status,
            verifiedBy = payment.VerifiedBy
        });
    }

    // =========================
    // EMPLOYEE: SUBMIT TO SWIFT
    // =========================
    [Authorize]
    [HttpPost("{id}/submit-swift")]
    public IActionResult SubmitToSwift(int id)
    {
        var payment = _context.Payments.FirstOrDefault(p => p.Id == id);

        if (payment == null)
            return NotFound("Payment not found");

        if (!payment.IsVerified || payment.Status != "Verified")
            return BadRequest("Payment must be verified before submitting to SWIFT");

        payment.Status = "Submitted to SWIFT";
        payment.SubmittedToSwiftDate = DateTime.UtcNow;

        _context.SaveChanges();

        return Ok(new
        {
            message = "Payment submitted to SWIFT successfully",
            paymentId = payment.Id,
            status = payment.Status,
            submittedAt = payment.SubmittedToSwiftDate
        });
    }
}