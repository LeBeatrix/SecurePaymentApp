namespace SecureAPI.Models
{
    public class User
    {
        public string Name { get; set; }
        public string AccountNumber { get; set; }
        public string Password { get; set; } //Plain password for registration, will be hashed before storage
        public string PasswordHash { get; set; } //Stored hashed password
    }
}
