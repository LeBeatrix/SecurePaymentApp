namespace SecureAPI.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public required string AccountNumber { get; set; }
        public decimal Amount { get; set; }
        public required string Currency { get; set; }
        public required string SwiftCode { get; set; }
        public required string BeneficiaryAccount { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    }
}