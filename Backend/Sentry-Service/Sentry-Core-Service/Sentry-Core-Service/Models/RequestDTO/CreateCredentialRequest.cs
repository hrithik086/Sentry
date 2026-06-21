using Sentry.Core.Service.Models.RequestDTO;

namespace Sentry_Core_Service.Models.RequestDTO;

public class CreateCredentialRequest
{
    public Guid UserId { get; set; }
    public Credential Credential { get; set; }
}