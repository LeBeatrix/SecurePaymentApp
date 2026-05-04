namespace SecureAPI.Models
{
    public class Payment
    {
        public int Id { get; set; }

        public string AccountNumber { get; set; }  // sender (logged-in user)

        public decimal Amount { get; set; }

        public string Currency { get; set; }

        public string SwiftCode { get; set; }

        public string BeneficiaryAccount { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}