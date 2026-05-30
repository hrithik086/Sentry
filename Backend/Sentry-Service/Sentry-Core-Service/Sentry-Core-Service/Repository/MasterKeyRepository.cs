using Sentry.Core.Service.Repository.Db;
using Sentry.Core.Service.Repository.Db.Models;

namespace Sentry.Core.Service.Repository;

public class MasterKeyRepository(SentrySqlDbContext sentrySqlDbContext) : IMasterKeyRepository
{
    public async Task<bool> AddMasterKeyAsync(Guid userId, string salt, string hash)
    {
        try
        {
            await sentrySqlDbContext.MasterKeys.AddAsync(
                new MasterKeys()
                {
                    UserId = userId, Salt = salt, Hash = hash
                }
            );
            await sentrySqlDbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            return false;
        }
    }

    public async Task<(string salt, string hash)> GetMasterKeyAsync(Guid userId)
    {
        var masterKey = await sentrySqlDbContext.MasterKeys
            .FindAsync(userId);

        if (masterKey is null)
        {
            // todo: replace with custom exception
            throw new Exception("Master key not found for the given user ID.");
        }

        return (masterKey.Salt, masterKey.Hash);
    }
}
