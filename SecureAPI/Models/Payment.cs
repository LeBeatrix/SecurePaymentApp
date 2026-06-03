namespace SecureAPI.Models
{
    public class Payment
    {
        public int Id { get; set; }

        // Customer account making the payment
        public required string AccountNumber { get; set; }

        // Payment details
        public decimal Amount { get; set; }

        public required string Currency { get; set; }

        // Beneficiary details
        public required string BeneficiaryAccount { get; set; }

        public required string SwiftCode { get; set; }

        // Workflow tracking
        public string Status { get; set; } = "Pending";

        public bool IsVerified { get; set; } = false;

        public string? VerifiedBy { get; set; }

        public DateTime? VerificationDate { get; set; }

        // Audit information
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public DateTime? SubmittedToSwiftDate { get; set; }
    }
}