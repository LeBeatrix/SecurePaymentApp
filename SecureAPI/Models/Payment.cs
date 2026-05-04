namespace SecureAPI.Models
{
    public class Payment
    {

        public decimal Amount { get; set; }
        public required string Currency { get; set; }
        public required string SwiftCode { get; set; }
        public required string BeneficiaryAccount { get; set; }

    }
}