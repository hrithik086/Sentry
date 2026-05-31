namespace Sentry.Core.Service.Repository;

public interface IMasterKeyRepository
{
    Task<bool> AddMasterKeyAsync(Guid userId, string hash);
    Task<string> GetMasterKeyAsync(Guid userId);
}