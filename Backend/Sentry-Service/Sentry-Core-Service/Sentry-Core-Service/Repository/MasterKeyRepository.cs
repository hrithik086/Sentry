using Sentry.Core.Service.Helper.Context;
using Sentry.Core.Service.Repository.Db;
using Sentry.Core.Service.Repository.Db.Models;

namespace Sentry.Core.Service.Repository;

public class MasterKeyRepository(SentrySqlDbContext sentrySqlDbContext, IContextAccessor contextAccessor) : IMasterKeyRepository
{
    public async Task<bool> AddMasterKeyAsync(Guid userId, string hash)
    {
        try
        {
            await sentrySqlDbContext.MasterKeys.AddAsync(
                new MasterKeys()
                {
                    UserId = userId, Hash = hash,
                    CreatedAt = DateTimeOffset.UtcNow,
                    ModifiedAt = DateTimeOffset.UtcNow,
                    CreatedBy = contextAccessor.UserDetails.Email,
                    ModifiedBy = contextAccessor.UserDetails.Email
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

    public async Task<string> GetMasterKeyAsync(Guid userId)
    {
        var masterKey = await sentrySqlDbContext.MasterKeys
            .FindAsync(userId);

        if (masterKey is null)
        {
            // todo: replace with custom exception
            throw new Exception("Master key not found for the given user ID.");
        }

        return masterKey.Hash;
    }
}
