using Sentry.Core.Service.Models.RequestDTO;

namespace Sentry_Core_Service.Models.RequestDTO;

public class CreateCredentialRequest
{
    public IList<Credential> Credential { get; set; }
}