namespace SecureAPI.Models
{
	public class Employee
	{
		public string Username { get; set; } = "";
		public string PasswordHash { get; set; } = "";
		public string Role { get; set; } = "Employee";
	}
}