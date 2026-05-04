namespace SecureAPI.Models
{
    public class User
    {
        public int Id { get; set; } // ✅ PRIMARY KEY (required)

        public string? Name { get; set; }
        public string? AccountNumber { get; set; }
        //public string? Password { get; set; }
        public string? PasswordHash { get; set; }
    }
}