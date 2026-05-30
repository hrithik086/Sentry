namespace Sentry.Core.Service.Repository;

public interface IMasterKeyRepository
{
    Task<bool> AddMasterKeyAsync(Guid userId, string salt, string hash);
    Task<(string salt, string hash)> GetMasterKeyAsync(Guid userId);
}