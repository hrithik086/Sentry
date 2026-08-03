using Sentry_Core_Service.Models;
using Sentry.Core.Service.Repository.NoSqlDb.Models;
using Entities = Sentry.Core.Service.Repository.NoSqlDb.Models;

namespace Sentry.Core.Service.Repository;

public interface ICredentialsRepository
{
    Task<UserCredential?> GetUserCredentialByUserIdNoTrackingAsync(Guid userId);
    Task<Entities.UserCredential?> GetUserCredentialByUserIdTrackedAsync(Guid userId);

    Task<IList<Entities.Credential>> GetAllMatchingCredentialsAsync(IList<CredentialIdentfier> identifiers, Guid userId);
    Task<bool> UpdateUserCredentialsAsnc(Guid userId, IList<Credential> credentials);
    Task<int> CreateNewUserCredentialsAsync(IList<Credential> credentials, Guid userId);

    Task<IList<Entities.Credential>> DeleteUserCredentialsAsnc(Guid userId,
        IList<CredentialIdentfier> credentialIdentfiers);
}