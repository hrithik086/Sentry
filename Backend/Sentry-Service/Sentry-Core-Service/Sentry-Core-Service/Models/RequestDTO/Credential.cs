namespace Sentry.Core.Service.Models.RequestDTO;

public class Credential
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string DomainName { get; set; }
    public string Password { get; set; }
    public string? Pin { get; set; }
    public string? SecurityKeys { get; set; }
    public Dictionary<string, string>? AdditionalInfo { get; set; }
}