namespace Sentry_Core_Service.Models;

public class CredentialIdentfier
{
    public string Username { get; }
    public string Email { get; }
    public string DomainName { get; }
    
    public CredentialIdentfier(string username, string email, string domainName)
    {
        Username = username;
        Email = email;
        DomainName = domainName;
    }
}